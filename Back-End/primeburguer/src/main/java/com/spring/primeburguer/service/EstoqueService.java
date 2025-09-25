package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.EstoqueRequestDTO;
import com.spring.primeburguer.dto.EstoqueResponseDTO;
import com.spring.primeburguer.entity.Estoque;
import com.spring.primeburguer.repository.EstoqueRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.NoSuchElementException;

@Service
public class EstoqueService {

    private final EstoqueRepository estoqueRepository;

    public EstoqueService(EstoqueRepository estoqueRepository) {
        this.estoqueRepository = estoqueRepository;
    }

    // --- Mapeador ---
    private EstoqueResponseDTO toResponseDto(Estoque estoque) {
        return new EstoqueResponseDTO(
                estoque.getId(),
                estoque.getQuantidade(),
                estoque.getUnidadeMedida()
        );
    }
    // ------------------

    // Método CRÍTICO: Realiza a baixa no estoque ao fazer um Pedido
    @Transactional
    public void darBaixa(Long estoqueId, double quantidade) {
        Estoque item = estoqueRepository.findById(estoqueId)
                .orElseThrow(() -> new NoSuchElementException("Item de Estoque não encontrado com ID: " + estoqueId));

        if (item.getQuantidade() < quantidade) {
            throw new IllegalArgumentException("Estoque insuficiente para o item ID: " + estoqueId);
        }

        item.setQuantidade(item.getQuantidade() - quantidade);
        estoqueRepository.save(item);
    }

    // POST: Cria novo item no Estoque
    @Transactional
    public EstoqueResponseDTO criarItem(EstoqueRequestDTO dto) {
        Estoque item = new Estoque();
        item.setQuantidade(dto.quantidade());
        item.setUnidadeMedida(dto.unidadeMedida());

        return toResponseDto(estoqueRepository.save(item));
    }

    // GET: Busca todos os itens de Estoque
    public List<EstoqueResponseDTO> buscarTodos() {
        return estoqueRepository.findAll().stream().map(this::toResponseDto).toList();
    }

    // GET: Busca item por ID
    public EstoqueResponseDTO buscarPorId(Long id) {
        Estoque item = estoqueRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Item de Estoque não encontrado com ID: " + id));
        return toResponseDto(item);
    }

    // PUT: Atualiza item (ex: reposição de estoque)
    @Transactional
    public EstoqueResponseDTO atualizarItem(Long id, EstoqueRequestDTO dto) {
        Estoque item = estoqueRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Item de Estoque não encontrado com ID: " + id));

        item.setQuantidade(dto.quantidade());
        item.setUnidadeMedida(dto.unidadeMedida());

        return toResponseDto(estoqueRepository.save(item));
    }

    // DELETE: Deleta item
    @Transactional
    public void deletarItem(Long id) {
        if (!estoqueRepository.existsById(id)) {
            throw new NoSuchElementException("Item de Estoque não encontrado com ID: " + id);
        }
        estoqueRepository.deleteById(id);
    }
}