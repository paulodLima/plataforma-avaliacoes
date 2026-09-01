package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class BlocoQuestaoRequestDTO {

    private String textoBase;

    private String anexoUrl;

    @NotNull(message = "Disciplina é obrigatória")
    private Long disciplinaId;

    @NotNull(message = "Série é obrigatória")
    private Long serieId;

    private Long assuntoId;
}
