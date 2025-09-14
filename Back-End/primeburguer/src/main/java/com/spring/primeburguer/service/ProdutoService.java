package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ProdutoRequestDTO;
import com.spring.primeburguer.dto.ProdutoResponseDTO;
import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.repository.ProdutoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // Criar produto
    public ProdutoResponseDTO createProduto(ProdutoRequestDTO requestDTO) {
        Produto produto = new Produto();
        produto.setNome(requestDTO.nome());
        produto.setPreco(requestDTO.preco());
        produto.setDescricao(requestDTO.descricao());

        Produto savedProduto = produtoRepository.save(produto);
        return new ProdutoResponseDTO(savedProduto.getId(), savedProduto.getNome(), savedProduto.getPreco(), savedProduto.getDescricao());
    }

    // Buscar todos
    public List<ProdutoResponseDTO> getAllProdutos() {
        return produtoRepository.findAll().stream()
                .map(produto -> new ProdutoResponseDTO(produto.getId(), produto.getNome(), produto.getPreco(), produto.getDescricao()))
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<ProdutoResponseDTO> getProdutoById(Long id) {
        return produtoRepository.findById(id)
                .map(produto -> new ProdutoResponseDTO(produto.getId(), produto.getNome(), produto.getPreco(), produto.getDescricao()));
    }

    // Atualizar
    public Optional<ProdutoResponseDTO> updateProduto(Long id, ProdutoRequestDTO requestDTO) {
        return produtoRepository.findById(id).map(produto -> {
            produto.setNome(requestDTO.nome());
            produto.setPreco(requestDTO.preco());
            produto.setDescricao(requestDTO.descricao());
            Produto updatedProduto = produtoRepository.save(produto);
            return new ProdutoResponseDTO(updatedProduto.getId(), updatedProduto.getNome(), updatedProduto.getPreco(), updatedProduto.getDescricao());
        });
    }

    // Deletar
    public boolean deleteProduto(Long id) {
        return produtoRepository.findById(id).map(produto -> {
            produtoRepository.delete(produto);
            return true;
        }).orElse(false);
    }
}
