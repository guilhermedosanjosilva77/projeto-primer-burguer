package com.spring.primeburguer.dto;

import java.util.List;

public record CaixaRequestDTO(double saldoAtual, List<MovimentacaoCaixaResponseDTO> movimentacoes) {
}
