package com.spring.primeburguer.entity;

import com.spring.primeburguer.entity.enums.StatusPedido;
import jakarta.persistence.Entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

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
     private double valorTotal;
    private Integer quantidade;

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

}