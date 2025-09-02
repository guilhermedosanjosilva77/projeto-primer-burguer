package com.primeburguer.primeburguer.repository;

import com.primeburguer.primeburguer.entity.Estoque;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EstoqueRepository extends JpaRepository<Estoque, Long> {
}
