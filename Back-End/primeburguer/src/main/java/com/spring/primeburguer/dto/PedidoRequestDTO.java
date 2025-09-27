package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.enums.StatusPedido;

import java.util.List;

public record PedidoRequestDTO(
        Long clienteId,
        List<ItemPedidoRequestDTO> itens
) {}
