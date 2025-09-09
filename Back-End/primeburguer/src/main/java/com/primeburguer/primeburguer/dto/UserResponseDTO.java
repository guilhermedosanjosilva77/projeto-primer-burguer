package com.primeburguer.primeburguer.dto;

import java.util.Set;

import com.primeburguer.primeburguer.entity.Role;

public record UserResponseDTO(Long id, String email, Set<Role> roles) {

}
