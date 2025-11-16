package com.spring.primeburguer.dto;

public record ProdutoRequestDTO(
        String nome,
        Double preco,
        String descricao,
        String categoria,
        String img
) {
}