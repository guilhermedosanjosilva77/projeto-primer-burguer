package com.primeburguer.primeburguer.entity;

import jakarta.persistence.Embeddable;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Embeddable
public class Endereco {
    private String cep;
    private String rua;
    private String numero;
    private String cidade;
    private String estado;
}
