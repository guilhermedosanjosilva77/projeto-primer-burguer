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
    private final EstoqueService estoqueService;

    public ItemPedidoService(
            ItemPedidoRepository itemPedidoRepository,
            PedidoRepository pedidoRepository,
            ProdutoRepository produtoRepository,
            EstoqueService estoqueService
    ) {
        this.itemPedidoRepository = itemPedidoRepository;
        this.pedidoRepository = pedidoRepository;
        this.produtoRepository = produtoRepository;
        this.estoqueService = estoqueService;
    }

    // --- Mapeador ---
    private ItemPedidoResponseDTO toResponseDto(ItemPedido item) {
        return new ItemPedidoResponseDTO(
                item.getId(),
                item.getPedido().getId(),
                item.getProduto().getId(),
                item.getQuantidade()
        );
    }
    // ------------------

    // POST: Adiciona um item ao pedido (Lógica de Estoque e Valor)
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

        // 2. LÓGICA CRÍTICA: Baixa no Estoque
        // Assumimos que o Produto tem um método getEstoqueId() ou que o ID do Produto = ID do Estoque
        // Se a sua entidade Produto não tem este método, esta linha falhará.
        // **Alternativa:** Usaremos o ID do Produto como ID do Estoque para seguir a regra de negócio.
        Long estoqueId = produto.getId();

        estoqueService.darBaixa(estoqueId, dto.quantidade());

        // 3. Cria o ItemPedido
        ItemPedido item = new ItemPedido();
        item.setPedido(pedido);
        item.setProduto(produto);
        item.setQuantidade(dto.quantidade());
        item = itemPedidoRepository.save(item);

        // 4. ATUALIZA O PEDIDO MÃE
        // Usando produto.getPreco() para o cálculo
        double subtotal = produto.getPreco() * dto.quantidade();

        // Atualiza Valor Total e Quantidade Total de Itens no Pedido
        pedido.setValorTotal(pedido.getValorTotal() + subtotal);
        pedido.setQuantidade(pedido.getQuantidade() + dto.quantidade());
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

    // DELETE: Remove ItemPedido (Reverte Estoque e Valor)
    @Transactional
    public void removerItem(Long id) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ItemPedido não encontrado com ID: " + id));

        Pedido pedido = item.getPedido();
        Produto produto = item.getProduto();

        // 1. Reverte o Estoque
        Long estoqueId = produto.getId(); // Usando o ID do Produto como ID do Estoque
        estoqueService.darBaixa(estoqueId, -item.getQuantidade()); // Chamada negativa para devolver ao estoque

        // 2. ATUALIZA O PEDIDO MÃE (diminui o total)
        // Usando produto.getPreco() para o cálculo
        double subtotalRemovido = produto.getPreco() * item.getQuantidade();

        pedido.setValorTotal(pedido.getValorTotal() - subtotalRemovido);
        pedido.setQuantidade(pedido.getQuantidade() - item.getQuantidade());
        pedidoRepository.save(pedido);

        // 3. Deleta o item
        itemPedidoRepository.delete(item);
    }

    // GET: Busca um ItemPedido por ID (simples)
    public ItemPedidoResponseDTO buscarItemPorId(Long id) {
        ItemPedido item = itemPedidoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("ItemPedido não encontrado com ID: " + id));
        return toResponseDto(item);
    }
}