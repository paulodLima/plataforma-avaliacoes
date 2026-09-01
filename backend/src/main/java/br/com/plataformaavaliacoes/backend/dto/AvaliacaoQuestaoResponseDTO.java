package br.com.plataformaavaliacoes.backend.dto;

import java.math.BigDecimal;
import java.time.OffsetDateTime;
import lombok.Data;

@Data
public class AvaliacaoQuestaoResponseDTO {

    private Long id;
    private Long avaliacaoId;
    private QuestaoResponseDTO questao;
    private Integer ordem;
    private BigDecimal peso;
    private OffsetDateTime createdAt;

}
