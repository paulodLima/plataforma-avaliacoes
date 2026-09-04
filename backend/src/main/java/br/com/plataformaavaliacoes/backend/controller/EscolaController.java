package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.EscolaRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.EscolaResponseDTO;
import br.com.plataformaavaliacoes.backend.service.EscolaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/escolas")
@RequiredArgsConstructor
@Tag(name = "Escolas", description = "Endpoints para gerenciamento de escolas")
public class EscolaController {

    private final EscolaService escolaService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar uma nova escola")
    public EscolaResponseDTO create(@Valid @RequestBody EscolaRequestDTO dto) {
        return escolaService.create(dto);
    }

    @GetMapping
    @Operation(summary = "Listar escolas paginadas")
    public Page<EscolaResponseDTO> findAll(Pageable pageable) {
        return escolaService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar uma escola pelo ID")
    public EscolaResponseDTO findById(@PathVariable Long id) {
        return escolaService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar uma escola existente")
    public EscolaResponseDTO update(@PathVariable Long id, @Valid @RequestBody EscolaRequestDTO dto) {
        return escolaService.update(id, dto);
    }
}
