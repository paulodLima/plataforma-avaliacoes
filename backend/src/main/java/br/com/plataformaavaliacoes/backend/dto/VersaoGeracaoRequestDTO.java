package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VersaoGeracaoRequestDTO {

    @NotNull(message = "A quantidade de versões é obrigatória")
    @Min(value = 1, message = "A quantidade de versões deve ser pelo menos 1")
    private Integer quantidadeVersoes;

    private Boolean embaralharQuestoes = false;

    private Boolean embaralharAlternativas = false;
}
