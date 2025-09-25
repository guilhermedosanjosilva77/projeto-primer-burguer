package com.spring.primeburguer.dto;

public record ItemPedidoResponseDTO(
        Long id,
        Long pedidoId,
        Long produtoId,
        Integer quantidade
) {}