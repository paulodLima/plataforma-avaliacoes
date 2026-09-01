package br.com.plataformaavaliacoes.backend.dto;

import java.time.OffsetDateTime;
import lombok.Data;

@Data
public class AlternativaResponseDTO {
    private Long id;
    private String texto;
    private boolean correta;
    private Integer ordem;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
