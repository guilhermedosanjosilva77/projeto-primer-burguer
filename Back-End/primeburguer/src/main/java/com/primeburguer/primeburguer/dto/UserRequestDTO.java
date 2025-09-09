package com.primeburguer.primeburguer.dto;

import com.primeburguer.primeburguer.entity.Role;

import java.util.Set;

public record UserRequestDTO(String email, String senha, Set<Role> roles) {
}