package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.EstoqueRequestDTO;
import com.spring.primeburguer.dto.EstoqueResponseDTO;
import com.spring.primeburguer.service.EstoqueService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/estoque")
public class EstoqueController {

    private final EstoqueService estoqueService;

    public EstoqueController(EstoqueService estoqueService) {
        this.estoqueService = estoqueService;
    }

    // Cria um novo item no estoque
    @PostMapping
    public ResponseEntity<EstoqueResponseDTO> criarItem(@RequestBody EstoqueRequestDTO dto) {
        EstoqueResponseDTO novoItem = estoqueService.criarItem(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoItem);
    }

    // Busca todos os itens de estoque
    @GetMapping
    public ResponseEntity<List<EstoqueResponseDTO>> buscarTodos() {
        return ResponseEntity.ok(estoqueService.buscarTodos());
    }

    // Busca item por ID
    @GetMapping("/{id}")
    public ResponseEntity<EstoqueResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(estoqueService.buscarPorId(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Atualiza item
    @PutMapping("/{id}")
    public ResponseEntity<EstoqueResponseDTO> atualizarItem(@PathVariable Long id, @RequestBody EstoqueRequestDTO dto) {
        try {
            return ResponseEntity.ok(estoqueService.atualizarItem(id, dto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Deleta item
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarItem(@PathVariable Long id) {
        try {
            estoqueService.deletarItem(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}