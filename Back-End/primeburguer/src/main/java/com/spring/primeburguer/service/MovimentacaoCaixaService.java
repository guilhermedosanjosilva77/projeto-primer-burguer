package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.MovimentacaoCaixaRequestDTO;
import com.spring.primeburguer.dto.MovimentacaoCaixaResponseDTO;
import com.spring.primeburguer.entity.Caixa;
import com.spring.primeburguer.entity.MovimentacaoCaixa;
import com.spring.primeburguer.entity.enums.TipoMovimentacao;
import com.spring.primeburguer.repository.CaixaRepository;
import com.spring.primeburguer.repository.MovimentacaoCaixaRepository;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class MovimentacaoCaixaService {

    private final MovimentacaoCaixaRepository movimentacaoRepository;
    private final CaixaRepository caixaRepository;

    public MovimentacaoCaixaService(
            MovimentacaoCaixaRepository movimentacaoRepository,
            CaixaRepository caixaRepository
    ) {
        this.movimentacaoRepository = movimentacaoRepository;
        this.caixaRepository = caixaRepository;
    }

    private MovimentacaoCaixaResponseDTO toResponseDto(MovimentacaoCaixa mov) {
        return new MovimentacaoCaixaResponseDTO(
                mov.getId(), mov.getTipo(), mov.getValor(), mov.getDescricao(), mov.getData()
        );
    }

    // Função auxiliar para atualizar o saldo do Caixa
    private void atualizarSaldo(Caixa caixa, TipoMovimentacao tipo, double valor, boolean reverter) {
        double multiplicador = (tipo == TipoMovimentacao.ENTRADA) ? 1 : -1;
        if (reverter) {
            multiplicador *= -1;
        }
        caixa.setSaldoAtual(caixa.getSaldoAtual() + (valor * multiplicador));
        caixaRepository.save(caixa);
    }

    // POST: Cria uma nova Movimentação (e atualiza o saldo)
    @Transactional
    public MovimentacaoCaixaResponseDTO criarMovimentacao(MovimentacaoCaixaRequestDTO dto) {
        Caixa caixa = caixaRepository.findById(dto.caixaId())
                .orElseThrow(() -> new NoSuchElementException("Caixa não encontrado com ID: " + dto.caixaId()));

        MovimentacaoCaixa movimentacao = new MovimentacaoCaixa();
        movimentacao.setTipo(dto.tipo());
        movimentacao.setValor(dto.valor());
        movimentacao.setDescricao(dto.descricao());
        movimentacao.setData(LocalDateTime.now());
        movimentacao.setCaixa(caixa);

        movimentacao = movimentacaoRepository.save(movimentacao);

        // Atualiza o saldo do Caixa (reverter = false)
        atualizarSaldo(caixa, dto.tipo(), dto.valor(), false);

        return toResponseDto(movimentacao);
    }

    // GET: Busca uma Movimentação por ID
    public MovimentacaoCaixaResponseDTO buscarMovimentacaoPorId(Long id) {
        MovimentacaoCaixa mov = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Movimentação não encontrada com ID: " + id));

        return toResponseDto(mov);
    }

    // GET: Busca todas as Movimentações
    public List<MovimentacaoCaixaResponseDTO> buscarTodasMovimentacoes() {
        return movimentacaoRepository.findAll().stream()
                .map(this::toResponseDto)
                .toList();
    }

    // GET: Busca Movimentações por ID do Caixa
    public List<MovimentacaoCaixaResponseDTO> buscarMovimentacoesPorCaixa(Long caixaId) {
        // Validação se o caixa existe (opcional, mas recomendado)
        caixaRepository.findById(caixaId)
                .orElseThrow(() -> new NoSuchElementException("Caixa não encontrado com ID: " + caixaId));

        return movimentacaoRepository.findByCaixaId(caixaId).stream()
                .map(this::toResponseDto)
                .toList();
    }

    // PUT: Atualiza uma Movimentação (e corrige o saldo)
    @Transactional
    public MovimentacaoCaixaResponseDTO atualizarMovimentacao(Long id, MovimentacaoCaixaRequestDTO dto) {
        MovimentacaoCaixa movExistente = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Movimentação não encontrada com ID: " + id));

        Caixa caixa = movExistente.getCaixa();

        // 1. Reverte o impacto da movimentação antiga no saldo
        atualizarSaldo(caixa, movExistente.getTipo(), movExistente.getValor(), true);

        // 2. Atualiza os dados da movimentação
        movExistente.setTipo(dto.tipo());
        movExistente.setValor(dto.valor());
        movExistente.setDescricao(dto.descricao());
        // A data pode ou não ser atualizada, dependendo da regra de negócio

        MovimentacaoCaixa movimentacaoAtualizada = movimentacaoRepository.save(movExistente);

        // 3. Aplica o impacto da nova movimentação no saldo
        atualizarSaldo(caixa, dto.tipo(), dto.valor(), false);

        return toResponseDto(movimentacaoAtualizada);
    }

    // DELETE: Deleta uma Movimentação (e ajusta o saldo)
    @Transactional
    public void deletarMovimentacao(Long id) {
        MovimentacaoCaixa mov = movimentacaoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Movimentação não encontrada com ID: " + id));

        Caixa caixa = mov.getCaixa();

        // Reverte o impacto no saldo antes de deletar
        atualizarSaldo(caixa, mov.getTipo(), mov.getValor(), true);

        movimentacaoRepository.delete(mov);
    }
}