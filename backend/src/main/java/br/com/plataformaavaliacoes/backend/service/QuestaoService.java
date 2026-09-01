package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Alternativa;
import br.com.plataformaavaliacoes.backend.domain.model.Assunto;
import br.com.plataformaavaliacoes.backend.domain.model.Dificuldade;
import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.model.Questao;
import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.model.TipoQuestao;
import br.com.plataformaavaliacoes.backend.domain.repository.QuestaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.QuestaoSpecification;
import br.com.plataformaavaliacoes.backend.dto.AlternativaRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.AlternativaResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.exception.BusinessException;
import br.com.plataformaavaliacoes.backend.exception.ResourceNotFoundException;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

@Service
@RequiredArgsConstructor
public class QuestaoService {

    private final QuestaoRepository questaoRepository;
    private final EntityManager entityManager;

    @Transactional
    public QuestaoResponseDTO create(QuestaoRequestDTO dto) {
        validateAlternativas(dto.getAlternativas());

        Questao questao = new Questao();
        updateEntityFromDto(questao, dto);
        questao.setAtivo(true);

        questao = questaoRepository.save(questao);
        return mapToResponse(questao);
    }

    @Transactional(readOnly = true)
    public Page<QuestaoResponseDTO> findAll(Long disciplinaId, Long serieId, Long assuntoId, Dificuldade dificuldade, Pageable pageable) {
        Specification<Questao> spec = QuestaoSpecification.comFiltros(disciplinaId, serieId, assuntoId, dificuldade);
        return questaoRepository.findAll(spec, pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public QuestaoResponseDTO findById(Long id) {
        Questao questao = questaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Questão não encontrada"));
        return mapToResponse(questao);
    }

    @Transactional
    public QuestaoResponseDTO update(Long id, QuestaoRequestDTO dto) {
        validateAlternativas(dto.getAlternativas());

        Questao questao = questaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Questão não encontrada"));

        updateEntityFromDto(questao, dto);

        questao = questaoRepository.save(questao);
        return mapToResponse(questao);
    }

    @Transactional
    public void delete(Long id) {
        Questao questao = questaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Questão não encontrada"));
        questaoRepository.delete(questao);
    }

    private void validateAlternativas(List<AlternativaRequestDTO> alternativas) {
        if (alternativas == null || alternativas.size() < 2) {
            throw new BusinessException("A questão deve possuir no mínimo duas alternativas.");
        }

        long corretas = alternativas.stream().filter(AlternativaRequestDTO::getCorreta).count();
        if (corretas != 1) {
            throw new BusinessException("A questão objetiva exige exatamente uma alternativa correta.");
        }
    }

    private void updateEntityFromDto(Questao questao, QuestaoRequestDTO dto) {
        questao.setBlocoQuestaoId(dto.getBlocoQuestaoId());

        Disciplina disciplina = entityManager.find(Disciplina.class, dto.getDisciplinaId());
        if (disciplina == null) throw new BusinessException("Disciplina não encontrada");
        questao.setDisciplina(disciplina);

        Serie serie = entityManager.find(Serie.class, dto.getSerieId());
        if (serie == null) throw new BusinessException("Série não encontrada");
        questao.setSerie(serie);

        if (dto.getAssuntoId() != null) {
            Assunto assunto = entityManager.find(Assunto.class, dto.getAssuntoId());
            if (assunto == null) throw new BusinessException("Assunto não encontrado");
            questao.setAssunto(assunto);
        } else {
            questao.setAssunto(null);
        }

        questao.setEnunciado(dto.getEnunciado());
        questao.setTipo(dto.getTipo() != null ? dto.getTipo() : TipoQuestao.OBJETIVA);
        questao.setDificuldade(dto.getDificuldade() != null ? dto.getDificuldade() : Dificuldade.MEDIA);
        questao.setValorPadrao(dto.getValorPadrao());
        questao.setExplicacao(dto.getExplicacao());

        questao.getAlternativas().clear();
        int ordem = 1;
        for (AlternativaRequestDTO altDto : dto.getAlternativas()) {
            Alternativa alternativa = new Alternativa();
            alternativa.setTexto(altDto.getTexto());
            alternativa.setCorreta(altDto.getCorreta());
            alternativa.setOrdem(ordem++);
            questao.addAlternativa(alternativa);
        }
    }

    private QuestaoResponseDTO mapToResponse(Questao questao) {
        QuestaoResponseDTO response = new QuestaoResponseDTO();
        response.setId(questao.getId());
        response.setBlocoQuestaoId(questao.getBlocoQuestaoId());
        response.setDisciplinaId(questao.getDisciplina().getId());
        response.setSerieId(questao.getSerie().getId());
        if (questao.getAssunto() != null) {
            response.setAssuntoId(questao.getAssunto().getId());
        }
        response.setEnunciado(questao.getEnunciado());
        response.setTipo(questao.getTipo());
        response.setDificuldade(questao.getDificuldade());
        response.setValorPadrao(questao.getValorPadrao());
        response.setExplicacao(questao.getExplicacao());
        response.setAtivo(questao.isAtivo());
        response.setCreatedAt(questao.getCreatedAt());
        response.setUpdatedAt(questao.getUpdatedAt());

        if (questao.getAlternativas() != null) {
            List<AlternativaResponseDTO> alts = questao.getAlternativas().stream().map(alt -> {
                AlternativaResponseDTO altResp = new AlternativaResponseDTO();
                altResp.setId(alt.getId());
                altResp.setTexto(alt.getTexto());
                altResp.setCorreta(alt.isCorreta());
                altResp.setOrdem(alt.getOrdem());
                altResp.setCreatedAt(alt.getCreatedAt());
                altResp.setUpdatedAt(alt.getUpdatedAt());
                return altResp;
            }).collect(Collectors.toList());
            response.setAlternativas(alts);
        }
        return response;
    }
}
