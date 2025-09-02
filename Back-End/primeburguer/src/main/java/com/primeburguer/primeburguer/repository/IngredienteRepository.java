package com.primeburguer.primeburguer.repository;

import com.primeburguer.primeburguer.entity.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
}
