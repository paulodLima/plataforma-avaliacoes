package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.Dificuldade;
import br.com.plataformaavaliacoes.backend.domain.model.Questao;
import jakarta.persistence.criteria.Predicate;
import java.util.ArrayList;
import java.util.List;
import org.springframework.data.jpa.domain.Specification;

public class QuestaoSpecification {

    public static Specification<Questao> comFiltros(Long disciplinaId, Long serieId, Long assuntoId, Dificuldade dificuldade) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (disciplinaId != null) {
                predicates.add(criteriaBuilder.equal(root.get("disciplina").get("id"), disciplinaId));
            }
            if (serieId != null) {
                predicates.add(criteriaBuilder.equal(root.get("serie").get("id"), serieId));
            }
            if (assuntoId != null) {
                predicates.add(criteriaBuilder.equal(root.get("assunto").get("id"), assuntoId));
            }
            if (dificuldade != null) {
                predicates.add(criteriaBuilder.equal(root.get("dificuldade"), dificuldade));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
