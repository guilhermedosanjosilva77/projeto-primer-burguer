package com.spring.primeburguer.service;

import com.spring.primeburguer.dto.UserRequestDTO;
import com.spring.primeburguer.dto.UserResponseDTO;
import com.spring.primeburguer.entity.User;
import com.spring.primeburguer.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // Criar usuário
    public UserResponseDTO createUser(UserRequestDTO requestDTO) {
        User user = new User();
        user.setEmail(requestDTO.email());
        user.setSenha(requestDTO.senha());

        User savedUser = userRepository.save(user);
        return new UserResponseDTO(savedUser.getId(), savedUser.getEmail());
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserResponseDTO(user.getId(), user.getEmail()))
                .collect(Collectors.toList());
    }

    // Buscar por id
    public Optional<UserResponseDTO> getUserById(Long id) {
        return userRepository.findById(id)
                .map(user -> new UserResponseDTO(user.getId(), user.getEmail()));
    }

    // Atualizar
    public Optional<UserResponseDTO> updateUser(Long id, UserRequestDTO requestDTO) {
        return userRepository.findById(id).map(user -> {
            user.setEmail(requestDTO.email());
            user.setSenha(requestDTO.senha());
            User updatedUser = userRepository.save(user);
            return new UserResponseDTO(updatedUser.getId(), updatedUser.getEmail());
        });
    }

    // Deletar
    public boolean deleteUser(Long id) {
        return userRepository.findById(id).map(user -> {
            userRepository.delete(user);
            return true;
        }).orElse(false);
    }
}
