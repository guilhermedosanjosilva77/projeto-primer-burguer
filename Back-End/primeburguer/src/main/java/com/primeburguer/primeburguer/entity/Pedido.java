package com.primeburguer.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serializable;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(name = "pedidos")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido")
    private Long id;

    // muitos pedidos podem ser feitos por um cliente
    @ManyToOne
    @JoinColumn(name = "cliente_id", nullable = false)
    private Cliente cliente;

    // O Hibernate cria a data automaticamente
    @CreationTimestamp
    @Column(updatable = false)
    private Instant data;

    @Enumerated(EnumType.STRING)
    private StatusPedido status;

    private double valorTotal;
    private Integer quantidade;

}