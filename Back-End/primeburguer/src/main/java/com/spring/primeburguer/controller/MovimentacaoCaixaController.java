package com.spring.primeburguer.controller;

import com.spring.primeburguer.dto.MovimentacaoCaixaRequestDTO;
import com.spring.primeburguer.dto.MovimentacaoCaixaResponseDTO;
import com.spring.primeburguer.service.MovimentacaoCaixaService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/movimentacoes")
public class MovimentacaoCaixaController {

    private final MovimentacaoCaixaService movimentacaoService;

    public MovimentacaoCaixaController(MovimentacaoCaixaService movimentacaoService) {
        this.movimentacaoService = movimentacaoService;
    }

    // POST: Cria uma nova Movimentação
    @PostMapping
    public ResponseEntity<MovimentacaoCaixaResponseDTO> criarMovimentacao(@RequestBody MovimentacaoCaixaRequestDTO dto) {
        try {
            MovimentacaoCaixaResponseDTO novaMovimentacao = movimentacaoService.criarMovimentacao(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novaMovimentacao);
        } catch (NoSuchElementException e) {
            // Caixa não encontrado
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build(); // 400 Bad Request
        }
    }

    // GET: Busca uma Movimentação por ID
    @GetMapping("/{id}")
    public ResponseEntity<MovimentacaoCaixaResponseDTO> buscarMovimentacao(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(movimentacaoService.buscarMovimentacaoPorId(id));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET: Busca todas as Movimentações
    @GetMapping
    public ResponseEntity<List<MovimentacaoCaixaResponseDTO>> buscarTodasMovimentacoes() {
        return ResponseEntity.ok(movimentacaoService.buscarTodasMovimentacoes());
    }

    // GET: Busca Movimentações por ID do Caixa (Endpoint aninhado, bom para relatórios)
    @GetMapping("/caixa/{caixaId}")
    public ResponseEntity<List<MovimentacaoCaixaResponseDTO>> buscarPorCaixa(@PathVariable Long caixaId) {
        try {
            return ResponseEntity.ok(movimentacaoService.buscarMovimentacoesPorCaixa(caixaId));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // PUT: Atualiza uma Movimentação
    @PutMapping("/{id}")
    public ResponseEntity<MovimentacaoCaixaResponseDTO> atualizarMovimentacao(@PathVariable Long id, @RequestBody MovimentacaoCaixaRequestDTO dto) {
        try {
            // Nota: O caixaId na requisição PUT é ignorado, pois o relacionamento não deve mudar.
            return ResponseEntity.ok(movimentacaoService.atualizarMovimentacao(id, dto));
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // DELETE: Deleta uma Movimentação
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletarMovimentacao(@PathVariable Long id) {
        try {
            movimentacaoService.deletarMovimentacao(id);
            return ResponseEntity.noContent().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.notFound().build();
        }
    }
}