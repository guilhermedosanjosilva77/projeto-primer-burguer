package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.dto.PedidoStatusUpdateDto;
import com.spring.primeburguer.entity.enums.StatusPedido;
import com.spring.primeburguer.service.PedidoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/pedidos")
@CrossOrigin(origins = "http://localhost:3000")
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
// 🎯 Agora recebe o DTO de status
    public ResponseEntity<PedidoResponseDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestBody PedidoStatusUpdateDto dto) {

        try {
            String statusString = dto.status().trim().toUpperCase();

            StatusPedido novoStatus = StatusPedido.valueOf(statusString);

            PedidoResponseDTO response = pedidoService.atualizarStatus(id, novoStatus);
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        } catch (IllegalArgumentException e) {
            System.err.println("Status inválido recebido: " + dto.status());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<PedidoResponseDTO>> getPedidosByClienteId(@PathVariable Long clienteId) {
        try {
            List<PedidoResponseDTO> pedidos = pedidoService.buscarPedidosPorClienteId(clienteId);
            
            if (pedidos.isEmpty()) {
                return ResponseEntity.noContent().build(); 
            }
            return ResponseEntity.ok(pedidos);
            
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build(); 
        }
    }

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