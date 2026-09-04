package br.com.plataformaavaliacoes.backend.dto;

import lombok.Data;

@Data
public class AuthResponseDTO {
    private String token;
    private ProfessorResponseDTO professor;
}
