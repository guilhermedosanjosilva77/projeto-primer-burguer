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

//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//        return http
//            .csrf(csrf -> csrf.disable())
//            .authorizeHttpRequests(auth -> auth
//                .requestMatchers("/users/cadastro/**").permitAll()
//                // Apenas usuários com a role ADMIN podem acessar as rotas /admin
//                .requestMatchers("/admin/**").hasRole("ADMIN")
//                // Apenas usuários com a role CLIENTE podem acessar as rotas /cliente
//                .requestMatchers("/cliente/**").hasRole("CLIENTE")
//                .anyRequest().authenticated()
//            )
//            .httpBasic(Customizer.withDefaults())
//            .build();
//    }
//    http://localhost:8080/swagger-ui/index.html

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}