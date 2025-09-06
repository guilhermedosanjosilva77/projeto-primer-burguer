package com.primeburguer.primeburguer.repository;

import com.primeburguer.primeburguer.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProdutoRepository extends JpaRepository<Produto, Long> {
}
