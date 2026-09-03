package br.com.plataformaavaliacoes.backend.domain.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

import java.time.OffsetDateTime;

@Entity
@Table(name = "gabarito_itens")
@Getter
@Setter
public class GabaritoItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "avaliacao_versao_id", nullable = false)
    private AvaliacaoVersao avaliacaoVersao;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "questao_id", nullable = false)
    private Questao questao;

    @Column(name = "numero_questao", nullable = false)
    private Integer numeroQuestao;

    @Column(name = "alternativa_correta_original_id")
    private Long alternativaCorretaOriginalId;

    @Column(name = "letra_correta", nullable = false, length = 1)
    private String letraCorreta;

    @Column(name = "ordem_alternativas_json", columnDefinition = "TEXT")
    private String ordemAlternativasJson;

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @PrePersist
    void prePersist() {
        createdAt = OffsetDateTime.now();
    }
}
