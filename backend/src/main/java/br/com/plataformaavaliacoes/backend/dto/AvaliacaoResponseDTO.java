package br.com.plataformaavaliacoes.backend.dto;

import br.com.plataformaavaliacoes.backend.domain.model.StatusAvaliacao;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.Data;

@Data
public class AvaliacaoResponseDTO {

    private Long id;
    private String titulo;
    private String descricao;
    private Long disciplinaId;
    private Long serieId;
    private Long escolaId;
    private Long professorId;
    private String turma;
    private String periodo;
    private StatusAvaliacao status;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
    private List<AvaliacaoQuestaoResponseDTO> questoes;
}
