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
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
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


    public Pedido() {}

    public Pedido(Long id, double valorTotal, Integer quantidade, Cliente cliente, Instant data, StatusPedido status) {
        this.id = id;
        this.valorTotal = valorTotal;
        this.quantidade = quantidade;
        this.cliente = cliente;
        this.data = data;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getValorTotal() {
        return valorTotal;
    }

    public void setValorTotal(double valorTotal) {
        this.valorTotal = valorTotal;
    }

    public Integer getQuantidade() {
        return quantidade;
    }

    public void setQuantidade(Integer quantidade) {
        this.quantidade = quantidade;
    }

    public Cliente getCliente() {
        return cliente;
    }

    public void setCliente(Cliente cliente) {
        this.cliente = cliente;
    }

    public Instant getData() {
        return data;
    }

    public void setData(Instant data) {
        this.data = data;
    }

    public StatusPedido getStatus() {
        return status;
    }

    public void setStatus(StatusPedido status) {
        this.status = status;
    }
}