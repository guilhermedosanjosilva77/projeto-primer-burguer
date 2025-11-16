package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ProdutoRequestDTO;
import com.spring.primeburguer.dto.ProdutoResponseDTO;
import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    // EstoqueService foi removido daqui

    // Construtor atualizado (apenas ProdutoRepository)
    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    // --- Mapeador ---
    private ProdutoResponseDTO toResponseDto(Produto produto) {
        // Assume-se que ProdutoResponseDTO tem os campos essenciais do Produto
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getDescricao(),
                produto.getCategoria(),
                produto.getImg()
        );
    }
    // ------------------

    // POST: Criar produto (Limpo de lógica de Estoque)
    @Transactional
    public ProdutoResponseDTO createProduto(ProdutoRequestDTO requestDTO) {
        // 1. Criar Produto
        Produto produto = new Produto();
        produto.setNome(requestDTO.nome());
        produto.setPreco(requestDTO.preco());
        produto.setDescricao(requestDTO.descricao());
        produto.setCategoria(requestDTO.categoria());
        produto.setImg(requestDTO.img());

        Produto savedProduto = produtoRepository.save(produto);
        return toResponseDto(savedProduto);
    }

    // GET: Listar todos
    public List<ProdutoResponseDTO> getAllProdutos() {
        return produtoRepository.findAll().stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    // GET: Buscar por id
    public ProdutoResponseDTO getProdutoById(Long id) {
        return produtoRepository.findById(id)
                .map(this::toResponseDto)
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com ID: " + id));
    }

    // PUT: Atualizar (Limpo de lógica de Estoque)
    @Transactional
    public ProdutoResponseDTO updateProduto(Long id, ProdutoRequestDTO requestDTO) {
        Produto produto = produtoRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com ID: " + id));

        produto.setNome(requestDTO.nome());
        produto.setPreco(requestDTO.preco());
        produto.setDescricao(requestDTO.descricao());
        produto.setCategoria(requestDTO.categoria());
        produto.setImg(requestDTO.img());

        // Lógica de atualização do Estoque FOI REMOVIDA

        Produto updatedProduto = produtoRepository.save(produto);
        return toResponseDto(updatedProduto);
    }

    // DELETE: Deletar
    @Transactional
    public void deleteProduto(Long id) {
        // Melhoria: Antes de deletar, idealmente verificar se há pedidos ativos
        // ou se deve deletar as receitas associadas (ProdutoIngrediente).
        if (!produtoRepository.existsById(id)) {
            throw new NoSuchElementException("Produto não encontrado com ID: " + id);
        }
        produtoRepository.deleteById(id);
    }
}