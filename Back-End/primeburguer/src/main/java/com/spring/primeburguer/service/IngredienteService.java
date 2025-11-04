package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.IngredienteRequestDTO;
import com.spring.primeburguer.dto.IngredienteResponseDTO;
// Os imports abaixo não são usados, mas foram mantidos para contexto:
import com.spring.primeburguer.dto.UserRequestDTO;
import com.spring.primeburguer.dto.UserResponseDTO;
import com.spring.primeburguer.entity.User;
// Fim dos imports não usados.

import com.spring.primeburguer.entity.Ingrediente;
import com.spring.primeburguer.repository.IngredienteRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class IngredienteService {
    private final IngredienteRepository ingredienteRepository;

    public IngredienteService(IngredienteRepository ingredienteRepository) {
        this.ingredienteRepository = ingredienteRepository;
    }

    // Criar ingrediente
    public IngredienteResponseDTO criarIngrediente(IngredienteRequestDTO requestDTO) {
        Ingrediente ingrediente = new Ingrediente();
        ingrediente.setNome(requestDTO.nome());
        ingrediente.setUnidadeMedida(requestDTO.unidadeMedida());
        ingrediente.setEstoqueAtual(requestDTO.estoqueAtual());

        Ingrediente salvarIngrediente = ingredienteRepository.save(ingrediente);
        return new IngredienteResponseDTO(salvarIngrediente.getId(), salvarIngrediente.getNome(), ingrediente.getUnidadeMedida(), ingrediente.getEstoqueAtual());
    }

    // LISTAR TODOS (CORRIGIDO)
    public List<IngredienteResponseDTO> getAllIngredientes() {
        return ingredienteRepository.findAll().stream()
                .map(ingrediente -> new IngredienteResponseDTO(
                        ingrediente.getId(),
                        ingrediente.getNome(),
                        ingrediente.getUnidadeMedida(),
                        ingrediente.getEstoqueAtual())
                ) // <-- O parêntese do map() e do stream() foi fechado corretamente aqui
                .collect(Collectors.toList());
    }


    public Ingrediente buscarEntidadePorId(Long id) {
        return ingredienteRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Ingrediente não encontrado com ID: " + id));
    }

    // ** Lógica principal do Estoque **
    @Transactional
    public void atualizarEstoque(Long ingredienteId, Double quantidadeVariacao) {
        Ingrediente ingrediente = buscarEntidadePorId(ingredienteId);

        double novoEstoque = ingrediente.getEstoqueAtual() + quantidadeVariacao;

        if (novoEstoque < 0) {
            // Se for tentar dar baixa e não tiver estoque, lança erro para desfazer a transação.
            throw new IllegalArgumentException("Estoque insuficiente de " + ingrediente.getNome() +
                    ". Necessário: " + (-quantidadeVariacao) + ". Disponível: " + ingrediente.getEstoqueAtual());
        }

        ingrediente.setEstoqueAtual(novoEstoque);
        ingredienteRepository.save(ingrediente);
    }
}