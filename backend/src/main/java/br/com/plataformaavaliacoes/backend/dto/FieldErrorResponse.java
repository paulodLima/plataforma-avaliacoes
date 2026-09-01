package br.com.plataformaavaliacoes.backend.dto;

public record FieldErrorResponse(
        String field,
        String message
) {
}
