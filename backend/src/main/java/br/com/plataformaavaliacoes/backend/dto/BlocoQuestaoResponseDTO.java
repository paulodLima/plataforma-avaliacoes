package br.com.plataformaavaliacoes.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;
import lombok.Data;

@Data
public class BlocoQuestaoResponseDTO {

    private Long id;
    private String textoBase;
    private String anexoUrl;
    private Long disciplinaId;
    private Long serieId;
    private Long assuntoId;
    private boolean ativo;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<QuestaoResponseDTO> questoes;

}
