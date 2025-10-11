package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.entity.enums.StatusPedido;
import com.spring.primeburguer.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/pedidos")
public class PedidoController {

    private final PedidoService pedidoService;

    public PedidoController(PedidoService pedidoService) {
        this.pedidoService = pedidoService;
    }

    // Cria um novo Pedido (gatilha a baixa de estoque)
    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody PedidoRequestDTO dto) {
        try {
            PedidoResponseDTO novoPedido = pedidoService.criarPedido(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoPedido);
        } catch (NoSuchElementException e) {
            // Cliente ou Item de Estoque não encontrado
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        } catch (IllegalArgumentException e) {
            // Estoque insuficiente
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    // Busca todos os pedidos
    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> buscarTodos() {
        return ResponseEntity.ok(pedidoService.buscarTodos());
    }

    // Busca pedido por ID
    @GetMapping("/{id}")
    public ResponseEntity<PedidoResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(pedidoService.buscarPorId(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Atualiza apenas o status do pedido
    @PutMapping("/{id}/status")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(@PathVariable Long id, @RequestParam StatusPedido status) {
        try {
            return ResponseEntity.ok(pedidoService.atualizarStatus(id, status));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Deleta pedido (com a regra de negócio de reverter o estoque)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarPedido(@PathVariable Long id) {
        try {
            pedidoService.deletarPedido(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }

    }
}