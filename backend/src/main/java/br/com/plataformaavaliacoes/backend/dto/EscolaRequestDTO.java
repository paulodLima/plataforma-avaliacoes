package br.com.plataformaavaliacoes.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EscolaRequestDTO {
    @NotBlank(message = "O nome da escola é obrigatório")
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
}
