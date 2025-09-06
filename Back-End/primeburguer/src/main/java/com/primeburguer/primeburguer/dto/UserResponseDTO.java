package com.primeburguer.primeburguer.dto;

import com.primeburguer.primeburguer.entity.Role;

import java.util.Set;

public record UserResponseDTO(Long id,String nome, String senha, Set<Role> roles) {
}
