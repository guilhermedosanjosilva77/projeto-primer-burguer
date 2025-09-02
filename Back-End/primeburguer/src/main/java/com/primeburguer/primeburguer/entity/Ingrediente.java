package com.primeburguer.primeburguer.entity;


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
    @Column(name = "id_ingrediente")
    private Long id;

    private String nome;

    // Cada ingrediente possui um estoque vinculado
    @OneToOne(mappedBy = "ingrediente", cascade = CascadeType.ALL)
    private Estoque estoque;
}
