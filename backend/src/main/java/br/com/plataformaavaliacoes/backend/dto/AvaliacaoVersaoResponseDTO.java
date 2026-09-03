package br.com.plataformaavaliacoes.backend.dto;

import java.time.LocalDateTime;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AvaliacaoVersaoResponseDTO {
    private Long id;
    private String codigo;
    private LocalDateTime createdAt;
    private List<GabaritoItemResponseDTO> gabarito;
}
