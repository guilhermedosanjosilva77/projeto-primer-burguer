package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.enums.TipoMovimentacao;

import java.time.LocalDateTime;

public record MovimentacaoCaixaResponseDTO(
        Long id,
        TipoMovimentacao tipo, // Importar o enum!
        double valor,
        String descricao,
        LocalDateTime data
) {}