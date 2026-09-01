package br.com.plataformaavaliacoes.backend.dto;

import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import java.time.OffsetDateTime;

public record DisciplinaResponse(
        Long id,
        String nome,
        boolean ativo,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static DisciplinaResponse fromEntity(Disciplina disciplina) {
        return new DisciplinaResponse(
                disciplina.getId(),
                disciplina.getNome(),
                disciplina.isAtivo(),
                disciplina.getCreatedAt(),
                disciplina.getUpdatedAt()
        );
    }
}
