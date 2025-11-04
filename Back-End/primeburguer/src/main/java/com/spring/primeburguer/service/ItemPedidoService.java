package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ItemPedidoRequestDTO;
import com.spring.primeburguer.dto.ItemPedidoResponseDTO;
import com.spring.primeburguer.entity.ItemPedido;
import com.spring.primeburguer.entity.Pedido;
import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.repository.ItemPedidoRepository;
import com.spring.primeburguer.repository.PedidoRepository;
import com.spring.primeburguer.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class ItemPedidoService {

    private final ItemPedidoRepository itemPedidoRepository;
    private final PedidoRepository pedidoRepository;
    private final ProdutoRepository produtoRepository;
    // EstoqueService FOI REMOVIDO daqui.

    public ItemPedidoService(
            ItemPedidoRepository itemPedidoRepository,
            PedidoRepository pedidoRepository,
            ProdutoRepository produtoRepository
            // EstoqueService removido do construtor
    ) {
        this.itemPedidoRepository = itemPedidoRepository;
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
    }

    // Mapeador
    private ItemPedidoResponseDTO toResponseDto(ItemPedido item) {
        return new ItemPedidoResponseDTO(
                item.getId(),
                item.getPedido().getId(),
                item.getProduto().getId(),
                item.getQuantidade()
        );
    }

    // Adiciona um item ao pedido (SEM LÓGICA DE ESTOQUE)
    @Transactional
    public ItemPedidoResponseDTO adicionarItem(ItemPedidoRequestDTO dto) {
        // 1. Validação e Busca
        Pedido pedido = pedidoRepository.findById(dto.pedidoId())
                .orElseThrow(() -> new NoSuchElementException("Pedido não encontrado com ID: " + dto.pedidoId()));

        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com ID: " + dto.produtoId()));

        if (dto.quantidade() == null || dto.quantidade() <= 0) {
            throw new IllegalArgumentException("A quantidade deve ser positiva.");
        }

        // LÓGICA CRÍTICA DE ESTOQUE REMOVIDA:
        // A baixa de estoque DEVE ocorrer apenas quando o Pedido for criado/finalizado
        // e é responsabilidade do PedidoService garantir a integridade.

        // 2. Cria o ItemPedido
        ItemPedido item = new ItemPedido();
        item.setPedido(pedido);
        item.setProduto(produto);
        item.setQuantidade(dto.quantidade());
        item = itemPedidoRepository.save(item);

        // 3. ATUALIZA O PEDIDO MÃE
        double subtotal = produto.getPreco() * item.getQuantidade();

        // Atualiza Valor Total e Quantidade Total de Itens no Pedido
        pedido.setValorTotal(pedido.getValorTotal() + subtotal);
        pedido.setQuantidade(pedido.getQuantidade() + item.getQuantidade());
        pedidoRepository.save(pedido);

        return toResponseDto(item);
    }

    // GET: Busca itens de um pedido específico
    public List<ItemPedidoResponseDTO> buscarItensPorPedido(Long pedidoId) {
        // Assume-se que existe um método findByPedidoId no ItemPedidoRepository
        return itemPedidoRepository.findByPedidoId(pedidoId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    // DELETE: Remove ItemPedido (Reverte Valor, SEM REVERTER ESTOQUE)
    @Transactional
    public void removerItem(Long id) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ItemPedido não encontrado com ID: " + id));

        Pedido pedido = item.getPedido();
        Produto produto = item.getProduto();

        // REVERSÃO DE ESTOQUE FOI REMOVIDA DAQUI.
        // Se um item for removido/pedido for cancelado, a lógica de reverter
        // o estoque deve ser explicitamente chamada no PedidoService (ou em outro serviço de Movimentação).

        // 1. ATUALIZA O PEDIDO MÃE (diminui o total)
        double subtotalRemovido = produto.getPreco() * item.getQuantidade();

        pedido.setValorTotal(pedido.getValorTotal() - subtotalRemovido);
        pedido.setQuantidade(pedido.getQuantidade() - item.getQuantidade());
        pedidoRepository.save(pedido);

        // 2. Deleta o item
        itemPedidoRepository.delete(item);
    }

    // GET: Busca um ItemPedido por ID (simples)
    public ItemPedidoResponseDTO buscarItemPorId(Long id) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ItemPedido não encontrado com ID: " + id));
        return toResponseDto(item);
    }
}