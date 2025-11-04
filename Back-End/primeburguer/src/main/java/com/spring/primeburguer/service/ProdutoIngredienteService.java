package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ProdutoIngredienteRequestDTO;
import com.spring.primeburguer.dto.ProdutoIngredienteResponseDTO;
import com.spring.primeburguer.entity.Ingrediente;
import com.spring.primeburguer.entity.Produto;
import com.spring.primeburguer.entity.ProdutoIngrediente;
import com.spring.primeburguer.repository.IngredienteRepository;
import com.spring.primeburguer.repository.ProdutoIngredienteRepository;
import com.spring.primeburguer.repository.ProdutoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class ProdutoIngredienteService {

    private final ProdutoIngredienteRepository produtoIngredienteRepository;
    // INJEÇÕES NECESSÁRIAS para buscar as entidades Produto e Ingrediente
    private final ProdutoRepository produtoRepository;
    private final IngredienteRepository ingredienteRepository;

    // Opcional: Adicionar IngredienteService se quiser reutilizar buscarEntidadePorId,
    // mas vamos injetar os Repositories para manter a clareza neste serviço de composição.

    public ProdutoIngredienteService(
            ProdutoIngredienteRepository produtoIngredienteRepository,
            ProdutoRepository produtoRepository,
            IngredienteRepository ingredienteRepository
    ) {
        this.produtoIngredienteRepository = produtoIngredienteRepository;
        this.produtoRepository = produtoRepository;
        this.ingredienteRepository = ingredienteRepository;
    }

    private ProdutoIngredienteResponseDTO toResponseDto(ProdutoIngrediente pi) {
        return new ProdutoIngredienteResponseDTO(
                pi.getId(),
                pi.getProduto().getId(),
                pi.getProduto().getNome(),
                pi.getIngrediente().getId(),
                pi.getIngrediente().getNome(),
                pi.getQuantidadeNecessaria(), // Tipo Double (da entidade)
                pi.getIngrediente().getUnidadeMedida() // Assumindo que este getter existe em Ingrediente
        );
    }
    // --- MÉTODOS CRUD DE RECEITA ---

    /**
     * POST: Cria ou atualiza uma linha de composição do produto (receita).
     */
    @Transactional
    public ProdutoIngredienteResponseDTO criarComposicao(ProdutoIngredienteRequestDTO requestDTO) {

        // 1. Busca as entidades relacionadas (Produto e Ingrediente)
        Produto produto = produtoRepository.findById(requestDTO.produtoId())
                .orElseThrow(() -> new NoSuchElementException("Produto não encontrado com ID: " + requestDTO.produtoId()));

        Ingrediente ingrediente = ingredienteRepository.findById(requestDTO.ingredienteId())
                .orElseThrow(() -> new NoSuchElementException("Ingrediente não encontrado com ID: " + requestDTO.ingredienteId()));

        if (requestDTO.quantidadeNecessaria() <= 0) {
            throw new IllegalArgumentException("A quantidade necessária deve ser positiva.");
        }

        // 2. Cria a nova Composição (ProdutoIngrediente)
        ProdutoIngrediente composicao = new ProdutoIngrediente();
        composicao.setProduto(produto);
        composicao.setIngrediente(ingrediente);

        // A conversão de Float para float ou double depende da sua Entity
        composicao.setQuantidadeNecessaria(requestDTO.quantidadeNecessaria());

        // 3. Salva e Mapeia
        ProdutoIngrediente saved = produtoIngredienteRepository.save(composicao);
        return toResponseDto(saved);
    }

    /**
     * GET: Busca a "receita" de um produto.
     * Necessário ter o método findByProduto no ProdutoIngredienteRepository.
     */
    public List<ProdutoIngrediente> buscarComposicaoPorProduto(Produto produto) {
        // Se este método estiver dando erro de inferência no JPA,
        // mude para produtoIngredienteRepository.findByProdutoId(produto.getId())
        return produtoIngredienteRepository.findByProduto(produto);
    }

    /**
     * GET: Busca a "receita" de um produto pelo ID do produto (útil para Controller).
     */
    public List<ProdutoIngredienteResponseDTO> buscarComposicaoPorProdutoId(Long produtoId) {
        // Assume-se que o repositório suporta findByProduto_Id ou findByProdutoId
        List<ProdutoIngrediente> composicoes = produtoIngredienteRepository.findByProdutoId(produtoId);

        if (composicoes.isEmpty()) {
            // Pode ser útil checar se o produto existe, mas retornamos lista vazia se não houver receita.
            return List.of();
        }

        return composicoes.stream()
                .map(this::toResponseDto)
                .collect(Collectors.toList());
    }

    /**
     * DELETE: Deleta uma linha de composição.
     */
    @Transactional
    public void deletarComposicao(Long id) {
        if (!produtoIngredienteRepository.existsById(id)) {
            throw new NoSuchElementException("Composição de Produto/Ingrediente não encontrada com ID: " + id);
        }
        produtoIngredienteRepository.deleteById(id);
    }
}