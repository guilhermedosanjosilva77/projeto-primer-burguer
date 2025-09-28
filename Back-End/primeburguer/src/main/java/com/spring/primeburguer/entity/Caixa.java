package com.spring.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "caixa")
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
public class Caixa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_caixa")
    private Long id;
    private double saldoAtual;

    @OneToMany(mappedBy = "caixa", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<MovimentacaoCaixa> movimentacoes = new ArrayList<>();

    public Caixa() {}

    public Caixa(Long id, double saldoAtual, List<MovimentacaoCaixa> movimentacoes) {
        this.id = id;
        this.saldoAtual = saldoAtual;
        this.movimentacoes = movimentacoes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getSaldoAtual() {
        return saldoAtual;
    }

    public void setSaldoAtual(double saldoAtual) {
        this.saldoAtual = saldoAtual;
    }

    public List<MovimentacaoCaixa> getMovimentacoes() {
        return movimentacoes;
    }

    public void setMovimentacoes(List<MovimentacaoCaixa> movimentacoes) {
        this.movimentacoes = movimentacoes;
    }
}
