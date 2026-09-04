package br.com.plataformaavaliacoes.backend.dto;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class EscolaResponseDTO {
    private Long id;
    private String nome;
    private String sigla;
    private String logoUrl;
    private String endereco;
    private String bairro;
    private String cidade;
    private String estado;
    private String cep;
    private String telefone;
    private String email;
    private String site;
    private String observacoesCabecalho;
    private boolean ativo;
    private OffsetDateTime createdAt;
    private OffsetDateTime updatedAt;
}
