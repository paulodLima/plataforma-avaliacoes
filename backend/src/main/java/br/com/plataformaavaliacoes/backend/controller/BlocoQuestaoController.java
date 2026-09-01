package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.BlocoQuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.BlocoQuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.service.BlocoQuestaoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/blocos-questoes")
@RequiredArgsConstructor
@Tag(name = "Blocos de Questões", description = "Endpoints para gerenciamento de blocos de questões")
public class BlocoQuestaoController {

    private final BlocoQuestaoService blocoQuestaoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar um novo bloco de questões")
    public BlocoQuestaoResponseDTO create(@Valid @RequestBody BlocoQuestaoRequestDTO dto) {
        return blocoQuestaoService.create(dto);
    }

    @GetMapping
    @Operation(summary = "Listar blocos de questões paginados")
    public Page<BlocoQuestaoResponseDTO> findAll(Pageable pageable) {
        return blocoQuestaoService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar um bloco de questões pelo ID")
    public BlocoQuestaoResponseDTO findById(@PathVariable Long id) {
        return blocoQuestaoService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar um bloco de questões existente")
    public BlocoQuestaoResponseDTO update(@PathVariable Long id, @Valid @RequestBody BlocoQuestaoRequestDTO dto) {
        return blocoQuestaoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remover um bloco de questões")
    public void delete(@PathVariable Long id) {
        blocoQuestaoService.delete(id);
    }
}
