package com.primeburguer.primeburguer.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "roles")
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_role")
    private Long id;
    private String nome;

    // Enum com os tipos de usuários do sistema
    public enum Values {
        // Id do cliente é 2
        CLIENTE(2L),
        // Id do Admin é 1
        ADMIN(1L);

        long id;

        Values(long id) {
            this.id = id;
        }

        public long getId() {
            return id;
        }
    }


    public Role(Long id, String nome) {
        this.id = id;
        this.nome = nome;
    }

    public Role() {}

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
}
