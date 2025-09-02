package com.primeburguer.primeburguer.entity;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "movimentacao_caixa")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MovimentacaoCaixa {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_movimentacaoCaixa")
    private Long id;

    @Enumerated(EnumType.STRING)
    private TipoMovimentacao tipo;

    private double valor;
    private String descricao;
    private LocalDateTime data;

    @ManyToOne
    @JoinColumn(name = "caixa_id")
    private Caixa caixa;
}
