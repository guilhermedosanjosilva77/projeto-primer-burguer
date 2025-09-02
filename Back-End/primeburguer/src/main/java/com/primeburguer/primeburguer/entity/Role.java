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
}
