package com.spring.primeburguer.repository;

import com.spring.primeburguer.entity.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;

public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
}
