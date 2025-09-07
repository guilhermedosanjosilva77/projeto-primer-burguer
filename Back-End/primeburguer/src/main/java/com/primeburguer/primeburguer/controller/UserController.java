package com.primeburguer.primeburguer.controller;

import com.primeburguer.primeburguer.dto.UserRequestDTO;
import com.primeburguer.primeburguer.dto.UserResponseDTO;
import com.primeburguer.primeburguer.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/cadastro/admin")
    public ResponseEntity<UserResponseDTO> registerAdmin(@RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO newUser = userService.createUser(userRequestDTO, true);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }

    @PostMapping("/cadastro/cliente")
    public ResponseEntity<UserResponseDTO> registerCliente(@RequestBody UserRequestDTO userRequestDTO) {
        UserResponseDTO newUser = userService.createUser(userRequestDTO, false);
        return ResponseEntity.status(HttpStatus.CREATED).body(newUser);
    }
}