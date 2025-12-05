package com.spring.primeburguer.dto;

public record IngredienteResponseDTO(Long id, String nome, String unidadeMedida, Double estoqueAtual, Double precoCusto) {
}
