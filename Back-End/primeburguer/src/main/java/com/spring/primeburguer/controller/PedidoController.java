package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.entity.enums.StatusPedido;
import com.spring.primeburguer.service.PedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @PostMapping
    public ResponseEntity<PedidoResponseDTO> criarPedido(@RequestBody PedidoRequestDTO requestDTO) {
        try {
            PedidoResponseDTO response = pedidoService.criarPedido(requestDTO);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<PedidoResponseDTO>> listarTodos() {
        List<PedidoResponseDTO> response = pedidoService.buscarTodos();
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(@PathVariable Long id, @RequestParam StatusPedido status) {
        try {
            PedidoResponseDTO response = pedidoService.atualizarStatus(id, status);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Você pode adicionar mais itens ao pedido aqui, se necessário:
    /*
    {
      "produtoId": 2,
      "quantidade": 1
    }
    */
}