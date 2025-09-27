package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ItemPedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.entity.*;
import com.spring.primeburguer.entity.enums.StatusPedido;
import com.spring.primeburguer.repository.ClienteRepository;
import com.spring.primeburguer.repository.PedidoRepository;
import com.spring.primeburguer.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final ProdutoRepository produtoRepository;
    private final EstoqueService estoqueService;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            ProdutoRepository produtoRepository,
            EstoqueService estoqueService
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
        this.produtoRepository = produtoRepository;
        this.estoqueService = estoqueService;
    }

    // --- Mapeador ---
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

    // POST: Cria um novo Pedido (com baixa de estoque)
    @Transactional
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new NoSuchElementException("Cliente não encontrado com ID: " + dto.clienteId()));

        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setStatus(StatusPedido.PENDENTE);

        double valorTotal = 0.0;

        for (ItemPedidoRequestDTO itemDto : dto.itens()) {
            Produto produto = produtoRepository.findById(itemDto.produtoId())
                    .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com ID: " + itemDto.produtoId()));

            ItemPedido itemPedido = new ItemPedido();
            itemPedido.setPedido(pedido);
            itemPedido.setProduto(produto);
            itemPedido.setQuantidade(itemDto.quantidade());
            pedido.getItens().add(itemPedido);

            valorTotal += produto.getPreco() * itemDto.quantidade();

            Long estoqueId = produto.getEstoque().getId();

            // A quantidade a ser dada baixa é a quantidade do produto no pedido
            double quantidadeBaixa = (double) itemDto.quantidade();

            // Chama o método darBaixa do EstoqueService (transacional)
            estoqueService.darBaixa(estoqueId, quantidadeBaixa);
        }

        pedido.setQuantidade(dto.itens().stream()
                .mapToInt(item -> item.quantidade() != null ? item.quantidade() : 0)
                .sum());
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

    // DELETE: Deleta Pedido (pode futuramente reverter estoque)
    @Transactional
    public void deletarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + id));

        pedidoRepository.delete(pedido);
    }
}
