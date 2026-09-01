package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.Assunto;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssuntoRepository extends JpaRepository<Assunto, Long> {

    boolean existsByNomeIgnoreCaseAndDisciplinaIdAndSerieId(String nome, Long disciplinaId, Long serieId);

    boolean existsByNomeIgnoreCaseAndDisciplinaIdAndSerieIdAndIdNot(
            String nome,
            Long disciplinaId,
            Long serieId,
            Long id
    );

    List<Assunto> findAllByOrderByNomeAsc();

    List<Assunto> findAllByDisciplinaIdOrderByNomeAsc(Long disciplinaId);

    List<Assunto> findAllBySerieIdOrderByNomeAsc(Long serieId);

    List<Assunto> findAllByDisciplinaIdAndSerieIdOrderByNomeAsc(Long disciplinaId, Long serieId);
}
