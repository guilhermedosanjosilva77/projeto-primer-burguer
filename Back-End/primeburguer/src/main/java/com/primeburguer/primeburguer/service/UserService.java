package com.primeburguer.primeburguer.service;

import java.util.Set;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.primeburguer.primeburguer.dto.UserRequestDTO; // Importe o DTO correto
import com.primeburguer.primeburguer.dto.UserResponseDTO;
import com.primeburguer.primeburguer.entity.Role;
import com.primeburguer.primeburguer.entity.User;
import com.primeburguer.primeburguer.repository.RoleRepository;
import com.primeburguer.primeburguer.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, RoleRepository roleRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public UserResponseDTO createUser(UserRequestDTO dto, boolean isAdmin) { 
        Role role = isAdmin
                // Use o enum para buscar o ID da role de forma segura
                ? roleRepository.findById(Role.Values.ADMIN.getId()).orElseThrow() 
                : roleRepository.findById(Role.Values.CLIENTE.getId()).orElseThrow();

        User user = new User();
        user.setEmail(dto.nome()); 
        user.setSenha(passwordEncoder.encode(dto.senha()));
        user.setRoles(Set.of(role));

        User saved = userRepository.save(user);

        // Retorne um UserResponseDTO, mas sem a senha
        return new UserResponseDTO(
            saved.getId(),
            saved.getEmail(),
            saved.getRoles() 
        );
    }
}