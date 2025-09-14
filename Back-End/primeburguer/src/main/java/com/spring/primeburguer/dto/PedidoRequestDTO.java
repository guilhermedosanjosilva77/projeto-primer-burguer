package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.enums.StatusPedido;

public record PedidoRequestDTO(
        double valorTotal,
        Integer quantidade,
        Long clienteId,
        StatusPedido status
) {}
