package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.AssuntoRequest;
import br.com.plataformaavaliacoes.backend.dto.AssuntoResponse;
import br.com.plataformaavaliacoes.backend.service.AssuntoService;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

@Tag(name = "Assuntos", description = "Cadastro de assuntos por disciplina e serie")
@RestController
@RequestMapping("/api/assuntos")
public class AssuntoController {

    private final AssuntoService assuntoService;

    public AssuntoController(AssuntoService assuntoService) {
        this.assuntoService = assuntoService;
    }

    @Operation(summary = "Lista assuntos com filtros opcionais")
    @GetMapping
    public List<AssuntoResponse> listar(
            @RequestParam(required = false) Long disciplinaId,
            @RequestParam(required = false) Long serieId
    ) {
        return assuntoService.listar(disciplinaId, serieId);
    }

    @Operation(summary = "Busca assunto por ID")
    @GetMapping("/{id}")
    public AssuntoResponse buscarPorId(@PathVariable Long id) {
        return assuntoService.buscarPorId(id);
    }

    @Operation(summary = "Cria um assunto")
    @PostMapping
    public ResponseEntity<AssuntoResponse> criar(@Valid @RequestBody AssuntoRequest request) {
        AssuntoResponse response = assuntoService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @Operation(summary = "Atualiza um assunto")
    @PutMapping("/{id}")
    public AssuntoResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody AssuntoRequest request
    ) {
        return assuntoService.atualizar(id, request);
    }

    @Operation(summary = "Inativa um assunto")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        assuntoService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
