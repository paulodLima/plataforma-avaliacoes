package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.GabaritoItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GabaritoItemRepository extends JpaRepository<GabaritoItem, Long> {
    List<GabaritoItem> findByAvaliacaoVersaoIdOrderByNumeroQuestaoAsc(Long avaliacaoVersaoId);
}
