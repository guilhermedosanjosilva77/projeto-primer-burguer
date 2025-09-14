package com.spring.primeburguer.dto;

public record ClienteRequestDTO( String nome,
    String telefone,
    String rua,
    String bairro,
    String numeroCasa,
    String cidade) {
}
