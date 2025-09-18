package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.ClienteRequestDTO;
import com.spring.primeburguer.dto.ClienteResponseDTO;
import com.spring.primeburguer.entity.Cliente;
import com.spring.primeburguer.repository.ClienteRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    // Criar cliente
    public ClienteResponseDTO createCliente(ClienteRequestDTO requestDTO) {
        Cliente cliente = new Cliente();
        cliente.setNome(requestDTO.nome());
        cliente.setTelefone(requestDTO.telefone());
        cliente.setRua(requestDTO.rua());
        cliente.setBairro(requestDTO.bairro());
        cliente.setNumeroCasa(requestDTO.numeroCasa());
        cliente.setCidade(requestDTO.cidade());

        Cliente savedCliente = clienteRepository.save(cliente);

        return new ClienteResponseDTO(
                savedCliente.getId(),
                savedCliente.getNome(),
                savedCliente.getTelefone(),
                savedCliente.getRua(),
                savedCliente.getBairro(),
                savedCliente.getNumeroCasa(),
                savedCliente.getCidade()
        );
    }

    // Listar todos
    public List<ClienteResponseDTO> getAllClientes() {
        return clienteRepository.findAll().stream()
                .map(cliente -> new ClienteResponseDTO(
                        cliente.getId(),
                        cliente.getNome(),
                        cliente.getTelefone(),
                        cliente.getRua(),
                        cliente.getBairro(),
                        cliente.getNumeroCasa(),
                        cliente.getCidade()
                ))
                .collect(Collectors.toList());
    }

    // Buscar por id
    public Optional<ClienteResponseDTO> getClienteById(Long id) {
        return clienteRepository.findById(id)
                .map(cliente -> new ClienteResponseDTO(
                        cliente.getId(),
                        cliente.getNome(),
                        cliente.getTelefone(),
                        cliente.getRua(),
                        cliente.getBairro(),
                        cliente.getNumeroCasa(),
                        cliente.getCidade()
                ));
    }

    // Atualizar
    public Optional<ClienteResponseDTO> updateCliente(Long id, ClienteRequestDTO requestDTO) {
        return clienteRepository.findById(id).map(cliente -> {
            cliente.setNome(requestDTO.nome());
            cliente.setTelefone(requestDTO.telefone());
            cliente.setRua(requestDTO.rua());
            cliente.setBairro(requestDTO.bairro());
            cliente.setNumeroCasa(requestDTO.numeroCasa());
            cliente.setCidade(requestDTO.cidade());

            Cliente updatedCliente = clienteRepository.save(cliente);

            return new ClienteResponseDTO(
                    updatedCliente.getId(),
                    updatedCliente.getNome(),
                    updatedCliente.getTelefone(),
                    updatedCliente.getRua(),
                    updatedCliente.getBairro(),
                    updatedCliente.getNumeroCasa(),
                    updatedCliente.getCidade()
            );
        });
    }

    // Deletar
    public boolean deleteCliente(Long id) {
        return clienteRepository.findById(id).map(cliente -> {
            clienteRepository.delete(cliente);
            return true;
        }).orElse(false);
    }
}
