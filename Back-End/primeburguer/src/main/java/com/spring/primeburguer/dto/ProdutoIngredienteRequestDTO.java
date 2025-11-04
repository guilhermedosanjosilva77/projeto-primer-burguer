package com.spring.primeburguer.dto;

import com.spring.primeburguer.entity.Ingrediente;
import com.spring.primeburguer.entity.Produto;

public record ProdutoIngredienteRequestDTO(Long produtoId, Long ingredienteId, Double quantidadeNecessaria) {}

