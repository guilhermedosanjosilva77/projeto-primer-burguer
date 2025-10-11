package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.ItemPedidoRequestDTO;
import com.spring.primeburguer.dto.ItemPedidoResponseDTO;
import com.spring.primeburguer.service.ItemPedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/itensPedido")
public class ItemPedidoController {

    private final ItemPedidoService itemPedidoService;

    public ItemPedidoController(ItemPedidoService itemPedidoService) {
        this.itemPedidoService = itemPedidoService;
    }

    // Adiciona um item ao pedido
    @PostMapping
    public ResponseEntity<ItemPedidoResponseDTO> adicionarItem(@RequestBody ItemPedidoRequestDTO dto) {
        try {
            ItemPedidoResponseDTO novoItem = itemPedidoService.adicionarItem(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Pedido ou Produto não existe
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // Estoque insuficiente ou quantidade inválida
        }
    }

    // Busca todos os itens de um pedido específico
    @GetMapping("/{pedidoId}")
    public ResponseEntity<List<ItemPedidoResponseDTO>> buscarItensPorPedido(@PathVariable Long pedidoId) {
        try {
            List<ItemPedidoResponseDTO> itens = itemPedidoService.buscarItensPorPedido(pedidoId);
            return ResponseEntity.ok(itens);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Remove um item do pedido
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> removerItem(@PathVariable Long id) {
        try {
            itemPedidoService.removerItem(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}