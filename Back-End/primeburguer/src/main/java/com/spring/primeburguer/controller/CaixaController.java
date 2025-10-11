package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.CaixaRequestDTO;
import com.spring.primeburguer.dto.CaixaResponseDTO;
import com.spring.primeburguer.service.CaixaService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/caixa")
public class CaixaController {

    private final CaixaService caixaService;

    public CaixaController(CaixaService caixaService) {
        this.caixaService = caixaService;
    }

    //  Cria um novo Caixa
    @PostMapping
    public ResponseEntity<CaixaResponseDTO> criarCaixa(@RequestBody CaixaRequestDTO dto) {
        CaixaResponseDTO novoCaixa = caixaService.criarCaixa(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(novoCaixa);
    }

    // Busca um Caixa por ID
    @GetMapping("/{id}")
    public ResponseEntity<CaixaResponseDTO> buscarCaixa(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(caixaService.buscarCaixaPorId(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Busca todos os Caixas
    @GetMapping
    public ResponseEntity<List<CaixaResponseDTO>> buscarTodosCaixas() {
        return ResponseEntity.ok(caixaService.buscarTodosCaixas());
    }

    // Atualiza um Caixa
    @PutMapping("/{id}")
    public ResponseEntity<CaixaResponseDTO> atualizarCaixa(@PathVariable Long id, @RequestBody CaixaRequestDTO dto) {
        try {
            return ResponseEntity.ok(caixaService.atualizarCaixa(id, dto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Deleta um Caixa
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarCaixa(@PathVariable Long id) {
        try {
            caixaService.deletarCaixa(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}