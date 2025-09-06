package com.primeburguer.primeburguer.dto;

import java.util.List;

public record CaixaResponseDTO(Long id, double saldoAtual, List<MovimentacaoCaixaResponseDTO> movimentacoes) {
}
