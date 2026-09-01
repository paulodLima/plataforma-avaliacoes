package br.com.plataformaavaliacoes.backend.domain.model;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "questoes")
public class Questao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "bloco_questao_id")
    private Long blocoQuestaoId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "disciplina_id", nullable = false)
    private Disciplina disciplina;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "serie_id", nullable = false)
    private Serie serie;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assunto_id")
    private Assunto assunto;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String enunciado;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private TipoQuestao tipo = TipoQuestao.OBJETIVA;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    private Dificuldade dificuldade = Dificuldade.MEDIA;

    @Column(name = "valor_padrao", precision = 5, scale = 2)
    private BigDecimal valorPadrao;

    @Column(columnDefinition = "TEXT")
    private String explicacao;

    @Column(nullable = false)
    private boolean ativo = true;

    @OneToMany(mappedBy = "questao", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Alternativa> alternativas = new ArrayList<>();

    @Column(nullable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }

    public void setAlternativas(List<Alternativa> alternativas) {
        this.alternativas.clear();
        if (alternativas != null) {
            this.alternativas.addAll(alternativas);
            for (Alternativa alt : this.alternativas) {
                alt.setQuestao(this);
            }
        }
    }

    public void addAlternativa(Alternativa alternativa) {
        alternativas.add(alternativa);
        alternativa.setQuestao(this);
    }
}
