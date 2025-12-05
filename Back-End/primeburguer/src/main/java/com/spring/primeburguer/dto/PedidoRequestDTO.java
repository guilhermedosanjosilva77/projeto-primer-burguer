package com.spring.primeburguer.dto;

import java.util.List;

public record PedidoRequestDTO(
        Long clienteId,
        List<ItemPedidoRequestDTO> itens,
        String metodoPagamento,
        String observacoes
) {}