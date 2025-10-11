package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.CaixaRequestDTO;
import com.spring.primeburguer.dto.CaixaResponseDTO;
import com.spring.primeburguer.dto.MovimentacaoCaixaResponseDTO; // Importação essencial
import com.spring.primeburguer.entity.Caixa;
import com.spring.primeburguer.repository.CaixaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional; // Usando o import correto do Spring
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class CaixaService {

    private final CaixaRepository caixaRepository;

    public CaixaService(CaixaRepository caixaRepository) {
        this.caixaRepository = caixaRepository;
    }


    private CaixaResponseDTO toResponseDto(Caixa caixa) {
        List<MovimentacaoCaixaResponseDTO> movimentosDto = caixa.getMovimentacoes().stream()
                .map(mov -> new MovimentacaoCaixaResponseDTO(
                        mov.getId(), mov.getTipo(), mov.getValor(), mov.getDescricao(), mov.getData()
                ))
                .toList();

        return new CaixaResponseDTO(caixa.getId(), caixa.getSaldoAtual(), movimentosDto);
    }

    // Cria um novo Caixa
    @Transactional
    public CaixaResponseDTO criarCaixa(CaixaRequestDTO dto) {
        Caixa caixa = new Caixa();
        // Assume-se que 'saldoInicial' vem do DTO de requisição
        caixa.setSaldoAtual(dto.saldoAtual());

        return toResponseDto(caixaRepository.save(caixa));
    }

    // Busca um Caixa por ID
    public CaixaResponseDTO buscarCaixaPorId(Long id) {
        Caixa caixa = caixaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Caixa não encontrado com ID: " + id));

        return toResponseDto(caixa);
    }

    // Busca todos os Caixas
    public List<CaixaResponseDTO> buscarTodosCaixas() {
        return caixaRepository.findAll().stream()
                .map(this::toResponseDto)
                .toList();
    }

    // Atualiza o Caixa
    @Transactional
    public CaixaResponseDTO atualizarCaixa(Long id, CaixaRequestDTO dto) {
        Caixa caixa = caixaRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Caixa não encontrado com ID: " + id));

        caixaRepository.save(caixa);
        return toResponseDto(caixa);
    }

    // Deleta um Caixa
    @Transactional
    public void deletarCaixa(Long id) {
        if (!caixaRepository.existsById(id)) {
            throw new NoSuchElementException("Caixa não encontrado com ID: " + id);
        }
        caixaRepository.deleteById(id);
    }
}