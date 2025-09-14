package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.PedidoRequestDTO;
import com.spring.primeburguer.dto.PedidoResponseDTO;
import com.spring.primeburguer.entity.Cliente;
import com.spring.primeburguer.entity.Pedido;
import com.spring.primeburguer.repository.ClienteRepository;
import com.spring.primeburguer.repository.PedidoRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PedidoService {

    private final PedidoRepository pedidoRepository;
    private final ClienteRepository clienteRepository;

    public PedidoService(PedidoRepository pedidoRepository, ClienteRepository clienteRepository) {
        this.pedidoRepository = pedidoRepository;
        this.clienteRepository = clienteRepository;
    }

    // Criar pedido
    public PedidoResponseDTO createPedido(PedidoRequestDTO requestDTO) {
        Cliente cliente = clienteRepository.findById(requestDTO.clienteId())
                .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));

        Pedido pedido = new Pedido();
        pedido.setValorTotal(requestDTO.valorTotal());
        pedido.setQuantidade(requestDTO.quantidade());
        pedido.setCliente(cliente);
        pedido.setStatus(requestDTO.status());

        Pedido savedPedido = pedidoRepository.save(pedido);
        return new PedidoResponseDTO(savedPedido.getId(), savedPedido.getValorTotal(), savedPedido.getQuantidade(),
                savedPedido.getCliente().getId(), savedPedido.getData(), savedPedido.getStatus());
    }

    // Listar todos
    public List<PedidoResponseDTO> getAllPedidos() {
        return pedidoRepository.findAll().stream()
                .map(pedido -> new PedidoResponseDTO(
                        pedido.getId(), pedido.getValorTotal(), pedido.getQuantidade(),
                        pedido.getCliente().getId(), pedido.getData(), pedido.getStatus()))
                .collect(Collectors.toList());
    }

    // Buscar por ID
    public Optional<PedidoResponseDTO> getPedidoById(Long id) {
        return pedidoRepository.findById(id)
                .map(pedido -> new PedidoResponseDTO(
                        pedido.getId(), pedido.getValorTotal(), pedido.getQuantidade(),
                        pedido.getCliente().getId(), pedido.getData(), pedido.getStatus()));
    }

    // Atualizar
    public Optional<PedidoResponseDTO> updatePedido(Long id, PedidoRequestDTO requestDTO) {
        return pedidoRepository.findById(id).map(pedido -> {
            Cliente cliente = clienteRepository.findById(requestDTO.clienteId())
                    .orElseThrow(() -> new RuntimeException("Cliente não encontrado"));
            pedido.setValorTotal(requestDTO.valorTotal());
            pedido.setQuantidade(requestDTO.quantidade());
            pedido.setCliente(cliente);
            pedido.setStatus(requestDTO.status());
            Pedido updatedPedido = pedidoRepository.save(pedido);
            return new PedidoResponseDTO(updatedPedido.getId(), updatedPedido.getValorTotal(),
                    updatedPedido.getQuantidade(), updatedPedido.getCliente().getId(),
                    updatedPedido.getData(), updatedPedido.getStatus());
        });
    }

    // Deletar
    public boolean deletePedido(Long id) {
        return pedidoRepository.findById(id).map(pedido -> {
            pedidoRepository.delete(pedido);
            return true;
        }).orElse(false);
    }
}
