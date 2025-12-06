package com.spring.primeburguer.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.spring.primeburguer.entity.enums.StatusPedido;
import java.time.Instant;

public record PedidoResponseDTO(
        Long id,
        double valorTotal,
        Integer quantidade,
        Long clienteId,
        @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss.SSSZ", timezone = "America/Sao_Paulo")
        Instant data,
        StatusPedido status
) {}