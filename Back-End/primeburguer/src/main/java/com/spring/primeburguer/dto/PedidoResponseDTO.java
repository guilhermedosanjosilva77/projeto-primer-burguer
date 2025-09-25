package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.enums.StatusPedido;
import java.time.Instant;

public record PedidoResponseDTO(
        Long id,
        double valorTotal,
        Integer quantidade,
        Long clienteId,
        Instant data,
        StatusPedido status
) {}