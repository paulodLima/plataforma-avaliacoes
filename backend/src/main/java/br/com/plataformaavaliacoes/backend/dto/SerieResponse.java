package br.com.plataformaavaliacoes.backend.dto;

import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import java.time.OffsetDateTime;

public record SerieResponse(
        Long id,
        String nome,
        boolean ativo,
        OffsetDateTime createdAt,
        OffsetDateTime updatedAt
) {

    public static SerieResponse fromEntity(Serie serie) {
        return new SerieResponse(
                serie.getId(),
                serie.getNome(),
                serie.isAtivo(),
                serie.getCreatedAt(),
                serie.getUpdatedAt()
        );
    }
}
