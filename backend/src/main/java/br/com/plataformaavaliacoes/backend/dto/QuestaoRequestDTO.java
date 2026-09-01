package br.com.plataformaavaliacoes.backend.dto;

import br.com.plataformaavaliacoes.backend.domain.model.Dificuldade;
import br.com.plataformaavaliacoes.backend.domain.model.TipoQuestao;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.util.List;
import lombok.Data;

@Data
public class QuestaoRequestDTO {

    private Long blocoQuestaoId;

    @NotNull(message = "Disciplina é obrigatória")
    private Long disciplinaId;

    @NotNull(message = "Série é obrigatória")
    private Long serieId;

    private Long assuntoId;

    @NotBlank(message = "Enunciado é obrigatório")
    private String enunciado;

    @NotNull(message = "Tipo da questão é obrigatório")
    private TipoQuestao tipo;

    @NotNull(message = "Dificuldade é obrigatória")
    private Dificuldade dificuldade;

    private BigDecimal valorPadrao;

    private String explicacao;

    @NotNull(message = "Lista de alternativas é obrigatória")
    @Size(min = 2, message = "A questão deve possuir no mínimo duas alternativas")
    @Valid
    private List<AlternativaRequestDTO> alternativas;
}
