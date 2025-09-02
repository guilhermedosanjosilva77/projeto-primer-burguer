package com.primeburguer.primeburguer.repository;

import com.primeburguer.primeburguer.entity.MovimentacaoCaixa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MovimentacaoCaixaRepository extends JpaRepository<MovimentacaoCaixa, Long> {
}
