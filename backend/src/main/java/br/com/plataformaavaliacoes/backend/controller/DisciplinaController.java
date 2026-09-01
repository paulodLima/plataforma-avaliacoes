package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.DisciplinaRequest;
import br.com.plataformaavaliacoes.backend.dto.DisciplinaResponse;
import br.com.plataformaavaliacoes.backend.service.DisciplinaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.net.URI;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Tag(name = "Disciplinas", description = "Cadastro de disciplinas escolares")
@RestController
@RequestMapping("/api/disciplinas")
public class DisciplinaController {

    private final DisciplinaService disciplinaService;

    public DisciplinaController(DisciplinaService disciplinaService) {
        this.disciplinaService = disciplinaService;
    }

    @Operation(summary = "Lista disciplinas")
    @GetMapping
    public List<DisciplinaResponse> listar() {
        return disciplinaService.listar();
    }

    @Operation(summary = "Busca disciplina por ID")
    @GetMapping("/{id}")
    public DisciplinaResponse buscarPorId(@PathVariable Long id) {
        return disciplinaService.buscarPorId(id);
    }

    @Operation(summary = "Cria uma disciplina")
    @PostMapping
    public ResponseEntity<DisciplinaResponse> criar(@Valid @RequestBody DisciplinaRequest request) {
        DisciplinaResponse response = disciplinaService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @Operation(summary = "Atualiza uma disciplina")
    @PutMapping("/{id}")
    public DisciplinaResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody DisciplinaRequest request
    ) {
        return disciplinaService.atualizar(id, request);
    }

    @Operation(summary = "Inativa uma disciplina")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        disciplinaService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
