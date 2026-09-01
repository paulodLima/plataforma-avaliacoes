package br.com.plataformaavaliacoes.backend.exception;

import br.com.plataformaavaliacoes.backend.dto.ErrorResponse;
import br.com.plataformaavaliacoes.backend.dto.FieldErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import java.time.OffsetDateTime;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleResourceNotFound(
            ResourceNotFoundException exception,
            HttpServletRequest request
    ) {
        return buildError(exception.getMessage(), HttpStatus.NOT_FOUND, request, List.of());
    }

    @ExceptionHandler(BusinessException.class)
    public ResponseEntity<ErrorResponse> handleBusinessException(
            BusinessException exception,
            HttpServletRequest request
    ) {
        return buildError(exception.getMessage(), HttpStatus.CONFLICT, request, List.of());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException exception,
            HttpServletRequest request
    ) {
        List<FieldErrorResponse> fields = exception.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new FieldErrorResponse(error.getField(), error.getDefaultMessage()))
                .toList();

        return buildError("Dados invalidos", HttpStatus.BAD_REQUEST, request, fields);
    }

    private ResponseEntity<ErrorResponse> buildError(
            String message,
            HttpStatus status,
            HttpServletRequest request,
            List<FieldErrorResponse> fields
    ) {
        ErrorResponse response = new ErrorResponse(
                message,
                status.value(),
                request.getRequestURI(),
                OffsetDateTime.now(),
                fields
        );

        return ResponseEntity.status(status).body(response);
    }
}
