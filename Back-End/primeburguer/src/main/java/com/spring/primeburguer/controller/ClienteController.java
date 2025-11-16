package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.ClienteRequestDTO;
import com.spring.primeburguer.dto.ClienteResponseDTO;
import com.spring.primeburguer.service.ClienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {

        this.clienteService = clienteService;
    }

    // Criar
    @PostMapping
    public ResponseEntity<ClienteResponseDTO> createCliente(@RequestBody ClienteRequestDTO requestDTO) {
        ClienteResponseDTO response = clienteService.createCliente(requestDTO);
        return ResponseEntity.ok(response);
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<List<ClienteResponseDTO>> getAllClientes() {
        return ResponseEntity.ok(clienteService.getAllClientes());
    }

    // Buscar por id
    @GetMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> getClienteById(@PathVariable Long id) {
        return clienteService.getClienteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<ClienteResponseDTO> updateCliente(@PathVariable Long id,
            @RequestBody ClienteRequestDTO requestDTO) {
        return clienteService.updateCliente(id, requestDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        boolean deleted = clienteService.deleteCliente(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204 No Content
        }
        return ResponseEntity.notFound().build(); // 404 Not Found
    }
}