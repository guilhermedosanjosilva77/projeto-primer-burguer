package com.spring.primeburguer.dto;

public record ProdutoResponseDTO(
        Long id,
        String nome,
        Double preco,
        String descricao
) {
}