package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.ProdutoRequestDTO;
import com.spring.primeburguer.dto.ProdutoResponseDTO;
import com.spring.primeburguer.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
@CrossOrigin(origins = "*")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // POST: Criar produto
    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> criar(@RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.ok(produtoService.createProduto(dto));
    }

    // GET: Listar todos
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> listarTodos() {
        return ResponseEntity.ok(produtoService.getAllProdutos());
    }

    // GET: Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.getProdutoById(id));
    }

    // PUT: Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody ProdutoRequestDTO dto) {
        return ResponseEntity.ok(produtoService.updateProduto(id, dto));
    }

    // DELETE: Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        produtoService.deleteProduto(id);
        return ResponseEntity.noContent().build();
    }
}