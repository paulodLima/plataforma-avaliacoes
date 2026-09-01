package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record AssuntoRequest(
        @NotBlank(message = "Nome e obrigatorio")
        @Size(max = 160, message = "Nome deve ter no maximo 160 caracteres")
        String nome,

        @NotNull(message = "Disciplina e obrigatoria")
        Long disciplinaId,

        @NotNull(message = "Serie e obrigatoria")
        Long serieId,

        Boolean ativo
) {
}
