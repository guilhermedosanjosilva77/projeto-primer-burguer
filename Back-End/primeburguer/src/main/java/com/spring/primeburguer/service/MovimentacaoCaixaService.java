package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.MovimentacaoCaixaRequestDTO;
import com.spring.primeburguer.dto.MovimentacaoCaixaResponseDTO;
import com.spring.primeburguer.entity.Caixa;
import com.spring.primeburguer.entity.MovimentacaoCaixa;
import com.spring.primeburguer.repository.CaixaRepository;
import com.spring.primeburguer.repository.MovimentacaoCaixaRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class MovimentacaoCaixaService {

    private final MovimentacaoCaixaRepository movimentacaoCaixaRepository;
    private final CaixaRepository caixaRepository;

    public MovimentacaoCaixaService(MovimentacaoCaixaRepository movimentacaoCaixaRepository,
                                    CaixaRepository caixaRepository) {
        this.movimentacaoCaixaRepository = movimentacaoCaixaRepository;
        this.caixaRepository = caixaRepository;
    }

    // Criar
    public MovimentacaoCaixaResponseDTO createMovimentacao(MovimentacaoCaixaRequestDTO requestDTO) {
        Caixa caixa = caixaRepository.findById(requestDTO.caixaId())
                .orElseThrow(() -> new RuntimeException("Caixa não encontrado"));

        MovimentacaoCaixa mov = new MovimentacaoCaixa();
        mov.setTipo(requestDTO.tipo());
        mov.setValor(requestDTO.valor());
        mov.setDescricao(requestDTO.descricao());
        mov.setData(requestDTO.data());
        mov.setCaixa(caixa);

        MovimentacaoCaixa savedMov = movimentacaoCaixaRepository.save(mov);
        return new MovimentacaoCaixaResponseDTO(savedMov.getId(), savedMov.getTipo(), savedMov.getValor(),
                savedMov.getDescricao(), savedMov.getData(), savedMov.getCaixa().getId());
    }

    // Listar todos
    public List<MovimentacaoCaixaResponseDTO> getAllMovimentacoes() {
        return movimentacaoCaixaRepository.findAll().stream()
                .map(mov -> new MovimentacaoCaixaResponseDTO(mov.getId(), mov.getTipo(), mov.getValor(),
                        mov.getDescricao(), mov.getData(), mov.getCaixa().getId()))
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<MovimentacaoCaixaResponseDTO> getMovimentacaoById(Long id) {
        return movimentacaoCaixaRepository.findById(id)
                .map(mov -> new MovimentacaoCaixaResponseDTO(mov.getId(), mov.getTipo(), mov.getValor(),
                        mov.getDescricao(), mov.getData(), mov.getCaixa().getId()));
    }

    // Atualizar
    public Optional<MovimentacaoCaixaResponseDTO> updateMovimentacao(Long id, MovimentacaoCaixaRequestDTO requestDTO) {
        return movimentacaoCaixaRepository.findById(id).map(mov -> {
            Caixa caixa = caixaRepository.findById(requestDTO.caixaId())
                    .orElseThrow(() -> new RuntimeException("Caixa não encontrado"));
            mov.setTipo(requestDTO.tipo());
            mov.setValor(requestDTO.valor());
            mov.setDescricao(requestDTO.descricao());
            mov.setData(requestDTO.data());
            mov.setCaixa(caixa);
            MovimentacaoCaixa updatedMov = movimentacaoCaixaRepository.save(mov);
            return new MovimentacaoCaixaResponseDTO(updatedMov.getId(), updatedMov.getTipo(), updatedMov.getValor(),
                    updatedMov.getDescricao(), updatedMov.getData(), updatedMov.getCaixa().getId());
        });
    }

    // Deletar
    public boolean deleteMovimentacao(Long id) {
        return movimentacaoCaixaRepository.findById(id).map(mov -> {
            movimentacaoCaixaRepository.delete(mov);
            return true;
        }).orElse(false);
    }
}
