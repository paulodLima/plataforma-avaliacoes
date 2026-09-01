package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AlternativaRequestDTO {

    @NotBlank(message = "Texto da alternativa é obrigatório")
    private String texto;

    @NotNull(message = "O campo correta é obrigatório")
    private Boolean correta;
}
