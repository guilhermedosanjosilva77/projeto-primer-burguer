package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.IngredienteRequestDTO;
import com.spring.primeburguer.dto.IngredienteResponseDTO;
import com.spring.primeburguer.entity.Ingrediente;
import com.spring.primeburguer.service.IngredienteService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/ingredientes")
public class IngredienteController {

    private final IngredienteService ingredienteService;

    public IngredienteController(IngredienteService ingredienteService) {
        this.ingredienteService = ingredienteService;
    }

    // POST: Criar ingrediente (Correto)
    @PostMapping
    public ResponseEntity<IngredienteResponseDTO> criar(@RequestBody IngredienteRequestDTO dto) {
        return ResponseEntity.ok(ingredienteService.criarIngrediente(dto));
    }

    // GET: Listar todos (Correto)
    @GetMapping
    public ResponseEntity<List<IngredienteResponseDTO>> listarTodos() {
        return ResponseEntity.ok(ingredienteService.getAllIngredientes());
    }

    // GET: Buscar por ID (CORRIGIDO: Retorna DTO em vez da Entidade)
    @GetMapping("/{id}")
    public ResponseEntity<IngredienteResponseDTO> buscarPorId(@PathVariable Long id) {
        try {
            // O serviço buscarEntidadePorId retorna a Entidade. Precisamos converter para DTO.
            Ingrediente ingrediente = ingredienteService.buscarEntidadePorId(id);
            IngredienteResponseDTO response = new IngredienteResponseDTO(
                    ingrediente.getId(),
                    ingrediente.getNome(),
                    ingrediente.getUnidadeMedida(),
                    ingrediente.getEstoqueAtual()
            );
            return ResponseEntity.ok(response);
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Atualizar estoque (adicionar ou remover) (Correto)
    @PutMapping("/{id}/estoque")
    public ResponseEntity<String> atualizarEstoque(
            @PathVariable Long id,
            @RequestParam Double quantidade) {
        ingredienteService.atualizarEstoque(id, quantidade);
        return ResponseEntity.ok("Estoque atualizado com sucesso");
    }
}