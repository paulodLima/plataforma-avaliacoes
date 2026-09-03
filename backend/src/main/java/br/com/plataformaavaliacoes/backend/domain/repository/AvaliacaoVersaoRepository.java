package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoVersao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface AvaliacaoVersaoRepository extends JpaRepository<AvaliacaoVersao, Long> {
    boolean existsByCodigo(String codigo);
    Optional<AvaliacaoVersao> findByCodigo(String codigo);
    List<AvaliacaoVersao> findByAvaliacaoId(Long avaliacaoId);
    List<AvaliacaoVersao> findByAvaliacaoIdOrderByCreatedAtDesc(Long avaliacaoId);
}
