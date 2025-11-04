package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ItemPedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.entity.*; // Importa Produto, Pedido, Cliente, ItemPedido, ProdutoIngrediente
import com.spring.primeburguer.entity.enums.StatusPedido;
import com.spring.primeburguer.repository.ClienteRepository;
import com.spring.primeburguer.repository.PedidoRepository;
import com.spring.primeburguer.repository.ProdutoRepository;
// Imports de Repository do novo modelo não são mais necessários no Service,
// pois usamos ProdutoIngredienteService e IngredienteService.
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;

    // INJEÇÕES ATUALIZADAS para o novo fluxo de estoque
    private final ProdutoIngredienteService produtoIngredienteService;
    private final IngredienteService ingredienteService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository,
            ProdutoIngredienteService produtoIngredienteService, // NOVO
            IngredienteService ingredienteService // NOVO
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
        this.produtoIngredienteService = produtoIngredienteService;
        this.ingredienteService = ingredienteService;
    }

    // --- Mapeador (Assumindo que está correto) ---
    private PedidoResponseDTO toResponseDto(Pedido pedido) {
        return new PedidoResponseDTO(
                pedido.getId(),
                pedido.getValorTotal(),
                pedido.getQuantidade(),
                pedido.getCliente().getId(),
                pedido.getData(),
                pedido.getStatus()
        );
    }

    // POST: Cria um novo Pedido (com baixa de estoque de INGREDIENTES)
    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {

        // 1. Busca Cliente e Inicializa Pedido
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new NoSuchElementException("Cliente não encontrado com ID: " + dto.clienteId()));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus(StatusPedido.PENDENTE); // Status inicial

        double valorTotal = 0.0;
        int quantidadeTotalItens = 0;

        for (ItemPedidoRequestDTO itemDto : dto.itens()) {

            // 2. Busca Produto e Quantidade
            Produto produto = produtoRepository.findById(itemDto.produtoId())
                    .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com ID: " + itemDto.produtoId()));

            int quantidadeProdutoNoPedido = itemDto.quantidade();

            // --- NOVO FLUXO DE ESTOQUE (BAIXA POR INGREDIENTE) ---

            // 3. Busca a "receita"
            List<ProdutoIngrediente> composicao = produtoIngredienteService.buscarComposicaoPorProduto(produto);

            // 4. Itera sobre a receita e tenta dar baixa em cada ingrediente
            for (ProdutoIngrediente prodIng : composicao) {
                Long ingredienteId = prodIng.getIngrediente().getId();
                double quantidadeNecessariaPorUnidade = prodIng.getQuantidadeNecessaria();

                // Cálculo do gasto total
                double gastoTotal = quantidadeNecessariaPorUnidade * quantidadeProdutoNoPedido;

                // Chama o IngredienteService para dar baixa (valor negativo = saída)
                // Se o estoque for insuficiente, o IngredienteService lança uma exceção,
                // e a anotação @Transactional desfaz TODAS as operações anteriores deste método.
                ingredienteService.atualizarEstoque(ingredienteId, -gastoTotal);
            }

            // --- FIM DO NOVO FLUXO DE ESTOQUE ---

            // 5. Cria ItemPedido e Adiciona ao Pedido
            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(produto);
            itemPedido.setQuantidade(quantidadeProdutoNoPedido);

            // A lista de itens no Pedido deve ser inicializada na entidade Pedido (geralmente new ArrayList<>() )
            if (pedido.getItens() == null) {
                pedido.setItens(new java.util.ArrayList<>());
            }
            pedido.getItens().add(itemPedido);

            // 6. Atualiza Totais
            valorTotal += produto.getPreco() * quantidadeProdutoNoPedido;
            quantidadeTotalItens += quantidadeProdutoNoPedido;
        }

        // 7. Salva o Pedido
        pedido.setQuantidade(quantidadeTotalItens);
        pedido.setValorTotal(valorTotal);

        return toResponseDto(pedidoRepository.save(pedido));
    }

    // GET: Busca Pedido por ID
    public PedidoResponseDTO buscarPorId(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + id));
        return toResponseDto(pedido);
    }

    // GET: Busca todos os Pedidos
    public List<PedidoResponseDTO> buscarTodos() {
        return pedidoRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    // PUT: Atualiza o status do Pedido
    @Transactional
    public PedidoResponseDTO atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + id));

        pedido.setStatus(novoStatus);

        return toResponseDto(pedidoRepository.save(pedido));
    }

    // DELETE: Deleta Pedido (Opcional: implementar lógica de reversão de estoque)
    @Transactional
    public void deletarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + id));

        // TODO: (Melhoria) Se o pedido for cancelado, você deve percorrer os itens e
        // chamar o ingredienteService.atualizarEstoque(ingredienteId, +gastoTotal)
        // para REVERTER o estoque.

        pedidoRepository.delete(pedido);
    }

    private void reverterEstoque(Pedido pedido) {
        if (pedido.getItens() == null || pedido.getItens().isEmpty()) {
            return; // Nada para reverter
        }

        // 1. Itera sobre cada ItemPedido do Pedido
        for (ItemPedido item : pedido.getItens()) {
            Produto produto = item.getProduto();
            int quantidadeProdutoNoPedido = item.getQuantidade();

            // Usamos o Service, garantindo que a entidade Produto seja carregada com seus IDs necessários
            List<ProdutoIngrediente> composicao = produtoIngredienteService.buscarComposicaoPorProduto(produto);

            // 3. Itera sobre a receita e devolve cada ingrediente
            for (ProdutoIngrediente prodIng : composicao) {
                Long ingredienteId = prodIng.getIngrediente().getId();
                double quantidadeNecessariaPorUnidade = prodIng.getQuantidadeNecessaria();

                // Cálculo do valor que deve ser devolvido (gasto total)
                double gastoTotal = quantidadeNecessariaPorUnidade * quantidadeProdutoNoPedido;

                // Chama o IngredienteService para DEVOLVER o estoque (valor positivo = entrada)
                ingredienteService.atualizarEstoque(ingredienteId, gastoTotal);
            }
        }
    }
}