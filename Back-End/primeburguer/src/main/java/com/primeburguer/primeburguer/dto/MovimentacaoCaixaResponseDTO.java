package com.primeburguer.primeburguer.dto;

import com.primeburguer.primeburguer.entity.enums.TipoMovimentacao;

public record MovimentacaoCaixaResponseDTO(TipoMovimentacao tipo, double valor, String descricao, Long caixaId) {
}
