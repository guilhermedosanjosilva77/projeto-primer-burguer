package com.primeburguer.primeburguer.service;

import org.springframework.stereotype.Service;
import com.primeburguer.primeburguer.dto.ProdutoRequestDTO;
import com.primeburguer.primeburguer.dto.ProdutoResponseDTO;
import com.primeburguer.primeburguer.entity.Produto;
import com.primeburguer.primeburguer.repository.ProdutoRepository;

import java.util.List;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public ProdutoResponseDTO create(ProdutoRequestDTO dto) {
        Produto produto = new Produto();
        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setDescricao(dto.descricao());

        Produto saved = produtoRepository.save(produto);

        return new ProdutoResponseDTO(saved.getId(), saved.getNome(), saved.getPreco(), saved.getDescricao());
    }

    public List<ProdutoResponseDTO> findAll() {
        return produtoRepository.findAll()
                .stream()
                .map(p -> new ProdutoResponseDTO(p.getId(), p.getNome(), p.getPreco(), p.getDescricao()))
                .toList();
    }

    public ProdutoResponseDTO update(Long id, ProdutoRequestDTO dto) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));

        produto.setNome(dto.nome());
        produto.setPreco(dto.preco());
        produto.setDescricao(dto.descricao());

        Produto updated = produtoRepository.save(produto);

        return new ProdutoResponseDTO(updated.getId(), updated.getNome(), updated.getPreco(), updated.getDescricao());
    }

    public void delete(Long id) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Produto não encontrado"));
        produtoRepository.delete(produto);
    }
}
