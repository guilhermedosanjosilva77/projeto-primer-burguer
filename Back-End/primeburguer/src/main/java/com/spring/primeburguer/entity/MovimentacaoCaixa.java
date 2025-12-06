package com.spring.primeburguer.entity;


import com.fasterxml.jackson.annotation.JsonFormat;
import com.spring.primeburguer.entity.enums.TipoMovimentacao;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacao_caixa")
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
public class MovimentacaoCaixa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimentacaoCaixa")
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipo;

    private double valor;
    private String descricao;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "caixa_id")
    private Caixa caixa;

    public MovimentacaoCaixa() {}

    public MovimentacaoCaixa(Long id, TipoMovimentacao tipo, double valor, String descricao, LocalDateTime data, Caixa caixa) {
        this.id = id;
        this.tipo = tipo;
        this.valor = valor;
        this.descricao = descricao;
        this.data = data;
        this.caixa = caixa;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public TipoMovimentacao getTipo() {
        return tipo;
    }

    public void setTipo(TipoMovimentacao tipo) {
        this.tipo = tipo;
    }

    public double getValor() {
        return valor;
    }

    public void setValor(double valor) {
        this.valor = valor;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    public LocalDateTime getData() {
        return data;
    }

    public void setData(LocalDateTime data) {
        this.data = data;
    }

    public Caixa getCaixa() {
        return caixa;
    }

    public void setCaixa(Caixa caixa) {
        this.caixa = caixa;
    }
}
