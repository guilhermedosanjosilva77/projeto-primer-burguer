package com.spring.primeburguer.dto;

public record ItemPedidoRequestDTO(
        Long pedidoId,
        Long produtoId,
        Integer quantidade
) {}