package com.spring.primeburguer.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI primeBurguerOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("PrimeBurguer API")
                        .version("1.0.0")
                        .description("API para gerenciamento do sistema PrimeBurguer"));
    }
}