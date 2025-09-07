package com.primeburguer.primeburguer.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Permite o acesso aos endpoints de registro sem autenticação
                .requestMatchers("/users/cadastro/**").permitAll()
                // Apenas usuários com a role ADMIN podem acessar as rotas /admin
                .requestMatchers("/admin/**").hasRole("ADMIN")
                // Apenas usuários com a role CLIENTE podem acessar as rotas /cliente
                .requestMatchers("/cliente/**").hasRole("CLIENTE")
                // Todas as outras requisições precisam ser autenticadas
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults())
            .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}