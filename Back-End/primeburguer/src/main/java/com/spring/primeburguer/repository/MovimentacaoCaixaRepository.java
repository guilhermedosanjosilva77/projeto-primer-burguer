package com.spring.primeburguer.repository;

import com.spring.primeburguer.entity.MovimentacaoCaixa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoCaixaRepository extends JpaRepository<MovimentacaoCaixa, Long> {
}