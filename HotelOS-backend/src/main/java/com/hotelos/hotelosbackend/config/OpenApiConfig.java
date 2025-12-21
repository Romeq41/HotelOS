package com.hotelos.hotelosbackend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springdoc.core.customizers.OpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Hotelos API")
                        .version("1.0.0")
                        .description("API Documentation for Hotelos Hotel Management System"))
                .components(new Components()
                        .addSecuritySchemes("bearer-jwt",
                                new SecurityScheme()
                                        .type(SecurityScheme.Type.HTTP)
                                        .scheme("bearer")
                                        .bearerFormat("JWT")));
    }

    @Bean
    public OpenApiCustomizer sortSchemasAlphabetically() {
        return openApi -> {
            // Sort schemas to avoid null pointer with complex entities
            var schemas = openApi.getComponents().getSchemas();
            if (schemas != null) {
                openApi.getComponents().setSchemas(
                        schemas.entrySet().stream()
                                .collect(java.util.stream.Collectors.toMap(
                                        java.util.Map.Entry::getKey,
                                        java.util.Map.Entry::getValue,
                                        (e1, e2) -> e1,
                                        java.util.TreeMap::new
                                ))
                );
            }
        };
    }
}