package com.primeburguer.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "estoque")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Estoque {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_estoque")
    private Long id;

    private Double quantidade;

    private String unidadeMedida;

    // Relacionamento com a classe ingrediente
    @OneToOne
    @JoinColumn(name = "ingrediente_id")
    private Ingrediente ingrediente;
}
