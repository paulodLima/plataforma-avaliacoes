package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoVersao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AvaliacaoVersaoRepository extends JpaRepository<AvaliacaoVersao, Long> {
    boolean existsByCodigo(String codigo);
}
