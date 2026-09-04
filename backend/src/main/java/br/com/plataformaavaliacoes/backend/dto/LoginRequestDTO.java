package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequestDTO {
    @NotBlank(message = "O login é obrigatório")
    private String login; // email or telefone

    @NotBlank(message = "A senha é obrigatória")
    private String senha;
}
