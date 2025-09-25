package com.spring.primeburguer.repository;

import com.spring.primeburguer.entity.MovimentacaoCaixa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovimentacaoCaixaRepository extends JpaRepository<MovimentacaoCaixa, Long> {
    List<MovimentacaoCaixa> findByCaixaId(Long caixaId);
}