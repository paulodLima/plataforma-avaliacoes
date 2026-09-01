package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.SerieRequest;
import br.com.plataformaavaliacoes.backend.dto.SerieResponse;
import br.com.plataformaavaliacoes.backend.service.SerieService;
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

@Tag(name = "Series", description = "Cadastro de series escolares")
@RestController
@RequestMapping("/api/series")
public class SerieController {

    private final SerieService serieService;

    public SerieController(SerieService serieService) {
        this.serieService = serieService;
    }

    @Operation(summary = "Lista series")
    @GetMapping
    public List<SerieResponse> listar() {
        return serieService.listar();
    }

    @Operation(summary = "Busca serie por ID")
    @GetMapping("/{id}")
    public SerieResponse buscarPorId(@PathVariable Long id) {
        return serieService.buscarPorId(id);
    }

    @Operation(summary = "Cria uma serie")
    @PostMapping
    public ResponseEntity<SerieResponse> criar(@Valid @RequestBody SerieRequest request) {
        SerieResponse response = serieService.criar(request);
        URI location = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(response.id())
                .toUri();

        return ResponseEntity.created(location).body(response);
    }

    @Operation(summary = "Atualiza uma serie")
    @PutMapping("/{id}")
    public SerieResponse atualizar(
            @PathVariable Long id,
            @Valid @RequestBody SerieRequest request
    ) {
        return serieService.atualizar(id, request);
    }

    @Operation(summary = "Inativa uma serie")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> inativar(@PathVariable Long id) {
        serieService.inativar(id);
        return ResponseEntity.noContent().build();
    }
}
