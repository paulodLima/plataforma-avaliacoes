package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class ProfessorRequestDTO {

    @NotBlank(message = "O nome é obrigatório")
    private String nome;

    @NotBlank(message = "O e-mail é obrigatório")
    @Email(message = "E-mail inválido")
    private String email;

    private String telefone;

    @NotBlank(message = "A senha é obrigatória para cadastro")
    private String senha;

    @NotNull(message = "O ID da escola é obrigatório")
    private Long escolaId;
}
