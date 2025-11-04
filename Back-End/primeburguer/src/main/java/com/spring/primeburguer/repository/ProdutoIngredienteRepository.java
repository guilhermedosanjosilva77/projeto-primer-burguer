package com.spring.primeburguer.repository;

import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.entity.ProdutoIngrediente;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProdutoIngredienteRepository extends JpaRepository<ProdutoIngrediente, Long> {

    List<ProdutoIngrediente> findByProduto(Produto produto);

    List<ProdutoIngrediente> findByProdutoId(Long produtoId);
}
