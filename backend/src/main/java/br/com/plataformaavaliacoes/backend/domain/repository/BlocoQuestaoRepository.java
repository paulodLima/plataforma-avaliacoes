package br.com.plataformaavaliacoes.backend.domain.repository;

import br.com.plataformaavaliacoes.backend.domain.model.BlocoQuestao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface BlocoQuestaoRepository extends JpaRepository<BlocoQuestao, Long>, JpaSpecificationExecutor<BlocoQuestao> {
}
