package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.enums.TipoMovimentacao;

public record MovimentacaoCaixaResponseDTO(TipoMovimentacao tipo, double valor, String descricao, Long caixaId) {
}
