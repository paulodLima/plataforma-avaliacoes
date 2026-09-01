package br.com.plataformaavaliacoes.backend.dto;

import br.com.plataformaavaliacoes.backend.domain.model.Assunto;
import java.time.OffsetDateTime;

public record AssuntoResponse(
        Long id,
        String nome,
        ReferenciaResponse disciplina,
        ReferenciaResponse serie,
        boolean ativo,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static AssuntoResponse fromEntity(Assunto assunto) {
        return new AssuntoResponse(
                assunto.getId(),
                assunto.getNome(),
                new ReferenciaResponse(assunto.getDisciplina().getId(), assunto.getDisciplina().getNome()),
                new ReferenciaResponse(assunto.getSerie().getId(), assunto.getSerie().getNome()),
                assunto.isAtivo(),
                assunto.getCreatedAt(),
                assunto.getUpdatedAt()
        );
    }
}
