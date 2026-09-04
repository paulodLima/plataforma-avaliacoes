package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.ProfessorRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.ProfessorResponseDTO;
import br.com.plataformaavaliacoes.backend.service.ProfessorService;
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
@RequestMapping("/api/professores")
@RequiredArgsConstructor
@Tag(name = "Professores", description = "Endpoints para gerenciamento de professores")
public class ProfessorController {

    private final ProfessorService professorService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar um novo professor")
    public ProfessorResponseDTO create(@Valid @RequestBody ProfessorRequestDTO dto) {
        return professorService.create(dto);
    }

    @GetMapping
    @Operation(summary = "Listar professores paginados")
    public Page<ProfessorResponseDTO> findAll(Pageable pageable) {
        return professorService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar um professor pelo ID")
    public ProfessorResponseDTO findById(@PathVariable Long id) {
        return professorService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um professor existente")
    public ProfessorResponseDTO update(@PathVariable Long id, @Valid @RequestBody ProfessorRequestDTO dto) {
        return professorService.update(id, dto);
    }
}
