package br.com.plataformaavaliacoes.backend.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record ErrorResponse(
        String message,
        int status,
        String path,
        OffsetDateTime timestamp,
        List<FieldErrorResponse> fields
) {
}
