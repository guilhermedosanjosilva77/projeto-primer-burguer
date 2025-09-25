package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.entity.Cliente;
import com.spring.primeburguer.entity.Pedido;
import com.spring.primeburguer.entity.enums.StatusPedido;
import com.spring.primeburguer.repository.ClienteRepository;
import com.spring.primeburguer.repository.PedidoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;
    private final EstoqueService estoqueService; // Dependência para a regra de negócio

    // ID FIXO DO ESTOQUE: Assumimos que o produto a ser decrementado
    // tem o ID 1, conforme a regra de que o front-end associará o produto.
    // Em um sistema real, haveria uma lista de itens e IDs.
    private static final Long ITEM_ESTOQUE_ID_PADRAO = 1L;

    public PedidoService(
            PedidoRepository pedidoRepository,
            ClienteRepository clienteRepository,
            EstoqueService estoqueService
    ) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
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
    // ------------------

    // POST: Cria um novo Pedido (com baixa de estoque)
    @Transactional // Garante que se o estoque falhar, o pedido não é criado
    public PedidoResponseDTO criarPedido(PedidoRequestDTO dto) {
        // 1. Valida e busca o Cliente
        Cliente cliente = clienteRepository.findById(dto.clienteId())
                .orElseThrow(() -> new NoSuchElementException("Cliente não encontrado com ID: " + dto.clienteId()));

        // 2. Tenta dar baixa no Estoque
        // Usamos a quantidade do pedido como a quantidade a ser decrementada
        estoqueService.darBaixa(ITEM_ESTOQUE_ID_PADRAO, dto.quantidade());

        // 3. Cria a entidade Pedido
        Pedido pedido = new Pedido();
        pedido.setCliente(cliente);
        pedido.setQuantidade(dto.quantidade());
        // Aqui você calcularia o valor total com base no produto, mas vamos usar um valor simulado
        pedido.setValorTotal(dto.quantidade() * 15.00);
        pedido.setStatus(StatusPedido.PENDENTE);
        // A data será gerada automaticamente pelo @CreationTimestamp

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

    // PUT: Atualiza o status do Pedido (Não se atualiza quantidade ou valor após a criação)
    @Transactional
    public PedidoResponseDTO atualizarStatus(Long id, StatusPedido novoStatus) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + id));

        pedido.setStatus(novoStatus);

        return toResponseDto(pedidoRepository.save(pedido));
    }

    // DELETE: Deleta Pedido (Em um sistema real, isso exigiria reverter o estoque!)
    @Transactional
    public void deletarPedido(Long id) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + id));

        // REGRA DE NEGÓCIO CRÍTICA: Reverter a baixa de estoque
        // estoqueService.darBaixa(ITEM_ESTOQUE_ID_PADRAO, -pedido.getQuantidade()); // Reverter

        pedidoRepository.delete(pedido);
    }
}