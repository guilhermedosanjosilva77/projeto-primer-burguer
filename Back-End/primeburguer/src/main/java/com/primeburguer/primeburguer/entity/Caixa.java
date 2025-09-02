package com.primeburguer.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "caixa")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Caixa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_caixa")
    private Long id;
    private double saldoAtual;

    @OneToMany(mappedBy = "caixa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovimentacaoCaixa> movimentacoes = new ArrayList<>();
}
