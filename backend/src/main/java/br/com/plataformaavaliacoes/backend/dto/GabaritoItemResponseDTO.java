package br.com.plataformaavaliacoes.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GabaritoItemResponseDTO {
    private Integer numeroQuestao;
    private Long questaoId;
    private String letraCorreta;
    private String ordemAlternativasJson;
}
