package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.ApiStatusResponse;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.OffsetDateTime;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "Health", description = "Verificacao de disponibilidade da API")
@RestController
@RequestMapping("/api/health")
public class HealthController {

    @Operation(summary = "Verifica se o backend esta online")
    @GetMapping
    public ApiStatusResponse health() {
        return new ApiStatusResponse("UP", "backend", OffsetDateTime.now());
    }
}
