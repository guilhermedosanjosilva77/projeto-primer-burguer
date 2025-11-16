package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.ProdutoIngredienteRequestDTO;
import com.spring.primeburguer.entity.Ingrediente;
import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.entity.ProdutoIngrediente;
import com.spring.primeburguer.repository.IngredienteRepository;
import com.spring.primeburguer.repository.ProdutoIngredienteRepository;
import com.spring.primeburguer.repository.ProdutoRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/produtoIngredientes")
@CrossOrigin(origins = "*")
public class ProdutoIngredienteController {

    private final ProdutoIngredienteRepository repository;
    private final ProdutoRepository produtoRepository;
    private final IngredienteRepository ingredienteRepository;

    public ProdutoIngredienteController(
            ProdutoIngredienteRepository repository,
            ProdutoRepository produtoRepository,
            IngredienteRepository ingredienteRepository) {
        this.repository = repository;
        this.produtoRepository = produtoRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    // POST: Adicionar ingrediente ao produto (criar receita)
    @PostMapping
    public ResponseEntity<ProdutoIngrediente> adicionar(@RequestBody ProdutoIngredienteRequestDTO dto) {
        Produto produto = produtoRepository.findById(dto.produtoId())
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        Ingrediente ingrediente = ingredienteRepository.findById(dto.ingredienteId())
                .orElseThrow(() -> new RuntimeException("Ingrediente não encontrado"));

        ProdutoIngrediente pi = new ProdutoIngrediente();
        pi.setProduto(produto);
        pi.setIngrediente(ingrediente);
        pi.setQuantidadeNecessaria(dto.quantidadeNecessaria());

        return ResponseEntity.ok(repository.save(pi));
    }

    // GET: Ver receita de um produto
    @GetMapping("/produto/{produtoId}")
    public ResponseEntity<List<ProdutoIngrediente>> verReceita(@PathVariable Long produtoId) {
        Produto produto = produtoRepository.findById(produtoId)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        return ResponseEntity.ok(repository.findByProduto(produto));
    }

    // DELETE: Remover ingrediente do produto
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> remover(@PathVariable Long id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
