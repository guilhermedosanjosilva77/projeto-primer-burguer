package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.ProdutoRequestDTO;
import com.spring.primeburguer.dto.ProdutoResponseDTO;
import com.spring.primeburguer.service.ProdutoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    // Criar
    @PostMapping
    public ResponseEntity<ProdutoResponseDTO> createProduto(@RequestBody ProdutoRequestDTO requestDTO) {
        return ResponseEntity.ok(produtoService.createProduto(requestDTO));
    }

    // Listar todos
    @GetMapping
    public ResponseEntity<List<ProdutoResponseDTO>> getAllProdutos() {
        return ResponseEntity.ok(produtoService.getAllProdutos());
    }

    // Buscar por ID
    @GetMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> getProdutoById(@PathVariable Long id) {
        return produtoService.getProdutoById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Atualizar
    @PutMapping("/{id}")
    public ResponseEntity<ProdutoResponseDTO> updateProduto(@PathVariable Long id,
                                                            @RequestBody ProdutoRequestDTO requestDTO) {
        return produtoService.updateProduto(id, requestDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Deletar
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Long id) {
        boolean deleted = produtoService.deleteProduto(id);
        if (deleted) {
            return ResponseEntity.noContent().build(); // 204
        }
        return ResponseEntity.notFound().build(); // 404
    }
}
