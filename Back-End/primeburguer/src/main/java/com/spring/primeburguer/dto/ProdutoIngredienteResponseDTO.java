package com.spring.primeburguer.dto;

public record ProdutoIngredienteResponseDTO(
        Long id,

        // Dados do Produto
        Long produtoId,
        String produtoNome,

        // Dados do Ingrediente
        Long ingredienteId,
        String ingredienteNome,
        Double unidadeMedidaIngrediente, // Adicionado para clareza

        // Dados da Composição
        String quantidadeNecessaria
) {
}