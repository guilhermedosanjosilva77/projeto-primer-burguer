package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ProdutoRequestDTO;
import com.spring.primeburguer.dto.ProdutoResponseDTO;
import com.spring.primeburguer.entity.Estoque;
import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;
    private final EstoqueService estoqueService; // Injeção adicionada

    // Construtor atualizado para incluir EstoqueService
    public ProdutoService(ProdutoRepository produtoRepository, EstoqueService estoqueService) {
        this.produtoRepository = produtoRepository;
        this.estoqueService = estoqueService;
    }

    // --- Mapeador ---
    private ProdutoResponseDTO toResponseDto(Produto produto) {
        // Assume-se que ProdutoResponseDTO não precisa do Estoque
        return new ProdutoResponseDTO(
                produto.getId(),
                produto.getNome(),
                produto.getPreco(),
                produto.getDescricao()
        );
    }
    // ------------------

    // POST: Criar produto (CORRIGIDO: Busca e associa Estoque)
    @Transactional
    public ProdutoResponseDTO createProduto(ProdutoRequestDTO requestDTO) {
        // 1. Validar e buscar Estoque
        if (requestDTO.estoqueId() == null) {
            throw new IllegalArgumentException("O ID do Estoque é obrigatório.");
        }
        // É necessário que EstoqueService tenha um método para buscar a entidade Estoque
        Estoque estoque = estoqueService.buscarEntidadePorId(requestDTO.estoqueId());

        // 2. Criar Produto
        Produto produto = new Produto();
        produto.setNome(requestDTO.nome());
        produto.setPreco(requestDTO.preco());
        produto.setDescricao(requestDTO.descricao());

        // 3. Associar Estoque
        produto.setEstoque(estoque);

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
    public Optional<ProdutoResponseDTO> getProdutoById(Long id) {
        return produtoRepository.findById(id).map(this::toResponseDto);
    }

    // PUT: Atualizar (CORRIGIDO: Permite atualizar o Estoque, se fornecido)
    @Transactional
    public Optional<ProdutoResponseDTO> updateProduto(Long id, ProdutoRequestDTO requestDTO) {
        return produtoRepository.findById(id).map(produto -> {

            produto.setNome(requestDTO.nome());
            produto.setPreco(requestDTO.preco());
            produto.setDescricao(requestDTO.descricao());

            // Lógica para atualizar o Estoque apenas se um novo estoqueId for fornecido
            if (requestDTO.estoqueId() != null) {
                // Evita buscar o estoque se for o mesmo
                if (!requestDTO.estoqueId().equals(produto.getEstoque().getId())) {
                    Estoque novoEstoque = estoqueService.buscarEntidadePorId(requestDTO.estoqueId());
                    produto.setEstoque(novoEstoque);
                }
            }

            Produto updatedProduto = produtoRepository.save(produto);
            return toResponseDto(updatedProduto);
        });
    }

    // DELETE: Deletar
    @Transactional
    public boolean deleteProduto(Long id) {
        // Usamos existsById para uma verificação mais simples antes de deletar,
        // mas findById e delete é mais comum em serviços pequenos.
        if (!produtoRepository.existsById(id)) {
            return false;
        }
        produtoRepository.deleteById(id);
        return true;
    }
}