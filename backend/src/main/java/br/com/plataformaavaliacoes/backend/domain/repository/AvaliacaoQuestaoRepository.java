package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoQuestao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvaliacaoQuestaoRepository extends JpaRepository<AvaliacaoQuestao, Long> {
    List<AvaliacaoQuestao> findByAvaliacaoIdOrderByOrdemAsc(Long avaliacaoId);
    void deleteByAvaliacaoIdAndQuestaoId(Long avaliacaoId, Long questaoId);
    Integer countByAvaliacaoId(Long avaliacaoId);
}
