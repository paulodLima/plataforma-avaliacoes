package br.com.plataformaavaliacoes.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI plataformaAvaliacoesOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("Plataforma de Avaliacoes API")
                        .description("API principal para banco de questoes, avaliacoes, versoes e correcoes.")
                        .version("v1"));
    }
}
