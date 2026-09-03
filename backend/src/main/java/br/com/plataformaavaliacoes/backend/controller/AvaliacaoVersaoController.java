package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.AvaliacaoVersaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.VersaoGeracaoRequestDTO;
import br.com.plataformaavaliacoes.backend.service.AvaliacaoVersaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@Tag(name = "Avaliações Versões", description = "Endpoints para gerenciamento de versões de avaliações")
public class AvaliacaoVersaoController {

    private final AvaliacaoVersaoService avaliacaoVersaoService;

    @PostMapping("/{id}/versoes")
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Gerar versões para uma avaliação")
    public List<AvaliacaoVersaoResponseDTO> gerarVersoes(
            @PathVariable Long id,
            @Valid @RequestBody VersaoGeracaoRequestDTO request) {
        return avaliacaoVersaoService.gerarVersoes(id, request);
    }

    @GetMapping("/{id}/versoes")
    @Operation(summary = "Listar versões de uma avaliação")
    public List<AvaliacaoVersaoResponseDTO> listarVersoes(@PathVariable Long id) {
        return avaliacaoVersaoService.listarVersoes(id);
    }

    @GetMapping("/versoes/{codigo}")
    @Operation(summary = "Consultar versão de avaliação por código")
    public AvaliacaoVersaoResponseDTO findByCodigo(@PathVariable String codigo) {
        return avaliacaoVersaoService.findByCodigo(codigo);
    }
}
