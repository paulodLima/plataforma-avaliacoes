package br.com.plataformaavaliacoes.backend.dto;

import java.time.OffsetDateTime;

public record ApiStatusResponse(
        String status,
        String service,
        OffsetDateTime timestamp
) {
}
