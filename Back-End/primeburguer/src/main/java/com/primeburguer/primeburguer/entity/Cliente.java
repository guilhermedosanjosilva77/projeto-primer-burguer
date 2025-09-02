package com.primeburguer.primeburguer.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cliente")
public class Cliente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_cliente")
    private Long id;
    private String nome;
    private String telefone;

    @Embedded
    private Endereco endereco;
}
