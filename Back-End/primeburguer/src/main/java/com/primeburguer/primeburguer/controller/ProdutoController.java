package com.primeburguer.primeburguer.controller;

import com.primeburguer.primeburguer.dto.ProdutoRequestDTO;
import com.primeburguer.primeburguer.dto.ProdutoResponseDTO;
import com.primeburguer.primeburguer.service.ProdutoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> create(@RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(produtoService.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> list() {
        return ResponseEntity.ok(produtoService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> update(@PathVariable Long id, @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.ok(produtoService.update(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        produtoService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
