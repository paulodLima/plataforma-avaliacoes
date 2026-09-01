package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.domain.model.Dificuldade;
import br.com.plataformaavaliacoes.backend.dto.QuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.service.QuestaoService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/questoes")
@RequiredArgsConstructor
@Tag(name = "Questões", description = "Endpoints para gerenciamento de questões")
public class QuestaoController {

    private final QuestaoService questaoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria uma nova questão com alternativas")
    public QuestaoResponseDTO create(@Valid @RequestBody QuestaoRequestDTO requestDTO) {
        return questaoService.create(requestDTO);
    }

    @GetMapping
    @Operation(summary = "Lista questões com filtros")
    public Page<QuestaoResponseDTO> findAll(
            @RequestParam(required = false) Long disciplinaId,
            @RequestParam(required = false) Long serieId,
            @RequestParam(required = false) Long assuntoId,
            @RequestParam(required = false) Dificuldade dificuldade,
            Pageable pageable) {
        return questaoService.findAll(disciplinaId, serieId, assuntoId, dificuldade, pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Busca uma questão pelo ID")
    public QuestaoResponseDTO findById(@PathVariable Long id) {
        return questaoService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualiza uma questão existente")
    public QuestaoResponseDTO update(@PathVariable Long id, @Valid @RequestBody QuestaoRequestDTO requestDTO) {
        return questaoService.update(id, requestDTO);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remove uma questão pelo ID")
    public void delete(@PathVariable Long id) {
        questaoService.delete(id);
    }
}
