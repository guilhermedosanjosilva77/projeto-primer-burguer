package com.spring.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "ingredientes")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private String unidadeMedida;
    private Double estoqueAtual;
}
