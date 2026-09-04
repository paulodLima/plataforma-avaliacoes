package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.AuthResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.LoginRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.MeResponseDTO;
import br.com.plataformaavaliacoes.backend.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticação", description = "Endpoints para login e sessão")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Realizar login")
    public AuthResponseDTO login(@Valid @RequestBody LoginRequestDTO dto) {
        return authService.login(dto);
    }

    @GetMapping("/me")
    @Operation(summary = "Obter dados do usuário logado")
    public MeResponseDTO getMe(Authentication authentication) {
        Long professorId = (Long) authentication.getPrincipal();
        return authService.getMe(professorId);
    }
}
