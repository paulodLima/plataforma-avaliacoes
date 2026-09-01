package br.com.plataformaavaliacoes.backend.dto;

import java.util.List;
import lombok.Data;

@Data
public class AvaliacaoQuestaoRequestDTO {

    private List<Long> questaoIds;
    private List<Long> blocoQuestaoIds;

}
