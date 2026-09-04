package br.com.plataformaavaliacoes.backend.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class ProfessorResponseDTO {
    private Long id;
    private String nome;
    private String email;
    private String telefone;
    private Long escolaId;
    private String escolaNome;
    private boolean ativo;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
