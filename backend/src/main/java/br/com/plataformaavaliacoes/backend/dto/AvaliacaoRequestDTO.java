package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AvaliacaoRequestDTO {

    @NotBlank(message = "Título é obrigatório")
    private String titulo;

    private String descricao;

    @NotNull(message = "Disciplina é obrigatória")
    private Long disciplinaId;

    @NotNull(message = "Série é obrigatória")
    private Long serieId;

    private String turma;

    private String periodo;
}
