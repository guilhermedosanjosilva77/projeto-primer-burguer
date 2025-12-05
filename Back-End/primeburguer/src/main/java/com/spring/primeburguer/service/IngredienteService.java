package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.IngredienteRequestDTO;
import com.spring.primeburguer.dto.IngredienteResponseDTO;
import com.spring.primeburguer.dto.MovimentacaoCaixaRequestDTO; // Import necessário
import com.spring.primeburguer.entity.Ingrediente;
import com.spring.primeburguer.entity.enums.TipoMovimentacao;
import com.spring.primeburguer.repository.IngredienteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class IngredienteService {

    private final IngredienteRepository ingredienteRepository;
    private final MovimentacaoCaixaService movimentacaoCaixaService;

    private static final Long ID_CAIXA_PRINCIPAL = 1L;

    public IngredienteService(IngredienteRepository ingredienteRepository,
            MovimentacaoCaixaService movimentacaoCaixaService) {
        this.ingredienteRepository = ingredienteRepository;
        this.movimentacaoCaixaService = movimentacaoCaixaService;
    }

    public IngredienteResponseDTO criarIngrediente(IngredienteRequestDTO requestDTO) {
        Ingrediente ingrediente = new Ingrediente();
        ingrediente.setNome(requestDTO.nome());
        ingrediente.setUnidadeMedida(requestDTO.unidadeMedida());
        ingrediente.setEstoqueAtual(requestDTO.estoqueAtual());

        Ingrediente salvarIngrediente = ingredienteRepository.save(ingrediente);
        return new IngredienteResponseDTO(
                salvarIngrediente.getId(),
                salvarIngrediente.getNome(),
                ingrediente.getUnidadeMedida(),
                ingrediente.getEstoqueAtual(),
                ingrediente.getPrecoCusto());
    }

    public List<IngredienteResponseDTO> getAllIngredientes() {
        return ingredienteRepository.findAll().stream()
                .map(ingrediente -> new IngredienteResponseDTO(
                        ingrediente.getId(),
                        ingrediente.getNome(),
                        ingrediente.getUnidadeMedida(),
                        ingrediente.getEstoqueAtual(),
                        ingrediente.getPrecoCusto())) // Incluído o precoCusto
                .collect(Collectors.toList());
    }

    public Ingrediente buscarEntidadePorId(Long id) {
        return ingredienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ingrediente não encontrado com ID: " + id));
    }

    @Transactional
    public void atualizarEstoque(Long ingredienteId, Double quantidadeVariacao) {
        Ingrediente ingrediente = buscarEntidadePorId(ingredienteId);

        double novoEstoque = ingrediente.getEstoqueAtual() + quantidadeVariacao;

        if (novoEstoque < 0) {
            throw new IllegalArgumentException("Estoque insuficiente de " + ingrediente.getNome() +
                    ". Necessário: " + (-quantidadeVariacao) + ". Disponível: " + ingrediente.getEstoqueAtual());
        }

        // 1. Lógica para Entrada de Estoque (Compra)
        if (quantidadeVariacao > 0) {
            if (ingrediente.getPrecoCusto() == null || ingrediente.getPrecoCusto() <= 0) {
                throw new IllegalArgumentException("Não é possível dar entrada no estoque de " + ingrediente.getNome() +
                        ". Preço de Custo (precoCusto) não definido ou inválido.");
            }

            // Saída de caixa (Custo da compra)
            double valorTotalCompra = quantidadeVariacao * ingrediente.getPrecoCusto();

            MovimentacaoCaixaRequestDTO movimentacaoDTO = new MovimentacaoCaixaRequestDTO(
                    TipoMovimentacao.SAIDA, // É uma SAÍDA no CAIXA
                    valorTotalCompra,
                    "Compra de " + quantidadeVariacao + ingrediente.getUnidadeMedida() + " de " + ingrediente.getNome(),
                    LocalDateTime.now(),
                    ID_CAIXA_PRINCIPAL);

            movimentacaoCaixaService.criarMovimentacao(movimentacaoDTO);
        }

        else if (quantidadeVariacao < 0) {

            if (ingrediente.getPrecoCusto() == null || ingrediente.getPrecoCusto() <= 0) {
                throw new IllegalArgumentException("Não é possível dar saída no estoque de " + ingrediente.getNome() +
                        ". Preço de Custo (precoCusto) não definido ou inválido.");
            }

            // O valor variavel (quantidadeVariacao) é negativo, então multiplicamos por -1
            // para obter o valor positivo
            double quantidadeVendida = -quantidadeVariacao;
            double valorCustoVendido = quantidadeVendida * ingrediente.getPrecoCusto();

            MovimentacaoCaixaRequestDTO movimentacaoDTO = new MovimentacaoCaixaRequestDTO(
                    TipoMovimentacao.ENTRADA, // É uma ENTRADA no CAIXA (representa o CMV do item vendido)
                    valorCustoVendido,
                    "Custo de Venda (CMV) de " + quantidadeVendida + ingrediente.getUnidadeMedida() + " de "
                            + ingrediente.getNome(),
                    LocalDateTime.now(),
                    ID_CAIXA_PRINCIPAL);

            movimentacaoCaixaService.criarMovimentacao(movimentacaoDTO);
        }

        // Finalmente, atualiza o estoque
        ingrediente.setEstoqueAtual(novoEstoque);
        ingredienteRepository.save(ingrediente);
    }
}