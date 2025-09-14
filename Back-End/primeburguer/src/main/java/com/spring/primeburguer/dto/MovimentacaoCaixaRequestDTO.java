package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.enums.TipoMovimentacao;
import java.time.LocalDateTime;

public record MovimentacaoCaixaRequestDTO(
        TipoMovimentacao tipo,
        double valor,
        String descricao,
        LocalDateTime data,
        Long caixaId
) {}
