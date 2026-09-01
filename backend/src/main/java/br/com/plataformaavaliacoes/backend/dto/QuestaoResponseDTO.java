package br.com.plataformaavaliacoes.backend.dto;

import br.com.plataformaavaliacoes.backend.domain.model.Dificuldade;
import br.com.plataformaavaliacoes.backend.domain.model.TipoQuestao;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.List;
import lombok.Data;

@Data
public class QuestaoResponseDTO {
    private Long id;
    private Long blocoQuestaoId;
    private Long disciplinaId;
    private Long serieId;
    private Long assuntoId;
    private String enunciado;
    private TipoQuestao tipo;
    private Dificuldade dificuldade;
    private BigDecimal valorPadrao;
    private String explicacao;
    private boolean ativo;
    private List<AlternativaResponseDTO> alternativas;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
