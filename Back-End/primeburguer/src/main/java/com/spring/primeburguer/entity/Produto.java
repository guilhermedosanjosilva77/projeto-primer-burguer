package com.spring.primeburguer.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

//@Data // Se estiver usando Lombok, descomente esta e as próximas duas
//@AllArgsConstructor
//@NoArgsConstructor
@Entity
@Table(name = "produtos")
public class Produto {
    @Id
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Long id;
    private String nome;
    private Double preco;
    private String descricao;

    @JsonIgnore
    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProdutoIngrediente> composicao = new ArrayList<>();

    @JsonIgnore
    @OneToMany(mappedBy = "produto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ItemPedido> itens = new ArrayList<>();


    public Produto() {}

    // Construtor atualizado sem a entidade Estoque
    public Produto(Long id, String nome, Double preco, String descricao) {
        this.id = id;
        this.nome = nome;
        this.preco = preco;
        this.descricao = descricao;
    }

    // --- Getters e Setters ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public Double getPreco() {
        return preco;
    }

    public void setPreco(Double preco) {
        this.preco = preco;
    }

    public String getDescricao() {
        return descricao;
    }

    public void setDescricao(String descricao) {
        this.descricao = descricao;
    }

    // Getter e Setter da Lista de Receita (Composição)
    public List<ProdutoIngrediente> getComposicao() {
        return composicao;
    }

    public void setComposicao(List<ProdutoIngrediente> composicao) {
        this.composicao = composicao;
    }

    // Getter e Setter de Itens
    public List<ItemPedido> getItens() {
        return itens;
    }

    public void setItens(List<ItemPedido> itens) {
        this.itens = itens;
    }

    // O Getter e Setter de Estoque foram removidos
}