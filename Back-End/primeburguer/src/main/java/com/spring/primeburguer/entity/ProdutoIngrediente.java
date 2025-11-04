package com.spring.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProdutoIngrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Chave artificial

    @ManyToOne
    @JoinColumn(name = "produto_id")
    private Produto produto;

    @ManyToOne
    @JoinColumn(name = "ingrediente_id")
    private Ingrediente ingrediente;

    private Double quantidadeNecessaria;
}