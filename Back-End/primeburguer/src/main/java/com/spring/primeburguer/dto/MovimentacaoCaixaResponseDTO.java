package com.spring.primeburguer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spring.primeburguer.entity.enums.TipoMovimentacao;

import java.time.LocalDateTime;

public record MovimentacaoCaixaResponseDTO(
        Long id,
        TipoMovimentacao tipo, // Importar o enum!
        double valor,
        String descricao,

        @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
        LocalDateTime data
) {}