package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.AvaliacaoQuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoResponseDTO;
import br.com.plataformaavaliacoes.backend.service.AvaliacaoService;
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
@RequestMapping("/api/avaliacoes")
@RequiredArgsConstructor
@Tag(name = "Avaliações", description = "Endpoints para gerenciamento de avaliações")
public class AvaliacaoController {

    private final AvaliacaoService avaliacaoService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Criar uma nova avaliação")
    public AvaliacaoResponseDTO create(@Valid @RequestBody AvaliacaoRequestDTO dto) {
        return avaliacaoService.create(dto);
    }

    @GetMapping
    @Operation(summary = "Listar avaliações paginadas")
    public Page<AvaliacaoResponseDTO> findAll(Pageable pageable) {
        return avaliacaoService.findAll(pageable);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Consultar uma avaliação pelo ID")
    public AvaliacaoResponseDTO findById(@PathVariable Long id) {
        return avaliacaoService.findById(id);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Atualizar uma avaliação existente")
    public AvaliacaoResponseDTO update(@PathVariable Long id, @Valid @RequestBody AvaliacaoRequestDTO dto) {
        return avaliacaoService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Arquivar/Remover uma avaliação")
    public void delete(@PathVariable Long id) {
        avaliacaoService.delete(id);
    }

    @PostMapping("/{id}/questoes")
    @ResponseStatus(HttpStatus.OK)
    @Operation(summary = "Adicionar questões à avaliação")
    public AvaliacaoResponseDTO adicionarQuestoes(@PathVariable Long id, @RequestBody AvaliacaoQuestaoRequestDTO dto) {
        return avaliacaoService.adicionarQuestoes(id, dto);
    }

    @DeleteMapping("/{id}/questoes/{questaoId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    @Operation(summary = "Remover uma questão da avaliação")
    public void removerQuestao(@PathVariable Long id, @PathVariable Long questaoId) {
        avaliacaoService.removerQuestao(id, questaoId);
    }
}
