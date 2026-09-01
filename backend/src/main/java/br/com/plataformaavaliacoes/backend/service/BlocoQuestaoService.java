package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Assunto;
import br.com.plataformaavaliacoes.backend.domain.model.BlocoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.repository.BlocoQuestaoRepository;
import br.com.plataformaavaliacoes.backend.dto.BlocoQuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.BlocoQuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.AlternativaResponseDTO;
import br.com.plataformaavaliacoes.backend.exception.BusinessException;
import br.com.plataformaavaliacoes.backend.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class BlocoQuestaoService {

    private final BlocoQuestaoRepository blocoQuestaoRepository;
    private final EntityManager entityManager;

    @Transactional
    public BlocoQuestaoResponseDTO create(BlocoQuestaoRequestDTO dto) {
        BlocoQuestao bloco = new BlocoQuestao();
        updateEntityFromDto(bloco, dto);
        bloco.setAtivo(true);
        bloco = blocoQuestaoRepository.save(bloco);
        return mapToResponse(bloco);
    }

    @Transactional(readOnly = true)
    public Page<BlocoQuestaoResponseDTO> findAll(Pageable pageable) {
        return blocoQuestaoRepository.findAll(pageable).map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public BlocoQuestaoResponseDTO findById(Long id) {
        BlocoQuestao bloco = blocoQuestaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloco de Questão não encontrado"));
        return mapToResponse(bloco);
    }

    @Transactional
    public BlocoQuestaoResponseDTO update(Long id, BlocoQuestaoRequestDTO dto) {
        BlocoQuestao bloco = blocoQuestaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloco de Questão não encontrado"));
        updateEntityFromDto(bloco, dto);
        bloco = blocoQuestaoRepository.save(bloco);
        return mapToResponse(bloco);
    }

    @Transactional
    public void delete(Long id) {
        BlocoQuestao bloco = blocoQuestaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Bloco de Questão não encontrado"));
        blocoQuestaoRepository.delete(bloco);
    }

    private void updateEntityFromDto(BlocoQuestao bloco, BlocoQuestaoRequestDTO dto) {
        bloco.setTextoBase(dto.getTextoBase());
        bloco.setAnexoUrl(dto.getAnexoUrl());

        Disciplina disciplina = entityManager.find(Disciplina.class, dto.getDisciplinaId());
        if (disciplina == null) throw new BusinessException("Disciplina não encontrada");
        bloco.setDisciplina(disciplina);

        Serie serie = entityManager.find(Serie.class, dto.getSerieId());
        if (serie == null) throw new BusinessException("Série não encontrada");
        bloco.setSerie(serie);

        if (dto.getAssuntoId() != null) {
            Assunto assunto = entityManager.find(Assunto.class, dto.getAssuntoId());
            if (assunto == null) throw new BusinessException("Assunto não encontrado");
            bloco.setAssunto(assunto);
        } else {
            bloco.setAssunto(null);
        }
    }

    private BlocoQuestaoResponseDTO mapToResponse(BlocoQuestao bloco) {
        BlocoQuestaoResponseDTO dto = new BlocoQuestaoResponseDTO();
        dto.setId(bloco.getId());
        dto.setTextoBase(bloco.getTextoBase());
        dto.setAnexoUrl(bloco.getAnexoUrl());
        dto.setDisciplinaId(bloco.getDisciplina().getId());
        dto.setSerieId(bloco.getSerie().getId());
        if (bloco.getAssunto() != null) {
            dto.setAssuntoId(bloco.getAssunto().getId());
        }
        dto.setAtivo(bloco.isAtivo());
        dto.setCreatedAt(bloco.getCreatedAt());
        dto.setUpdatedAt(bloco.getUpdatedAt());

        if (bloco.getQuestoes() != null) {
            List<QuestaoResponseDTO> questoes = bloco.getQuestoes().stream().map(questao -> {
                QuestaoResponseDTO qDto = new QuestaoResponseDTO();
                qDto.setId(questao.getId());
                qDto.setBlocoQuestaoId(questao.getBlocoQuestao() != null ? questao.getBlocoQuestao().getId() : null);
                qDto.setDisciplinaId(questao.getDisciplina().getId());
                qDto.setSerieId(questao.getSerie().getId());
                if (questao.getAssunto() != null) {
                    qDto.setAssuntoId(questao.getAssunto().getId());
                }
                qDto.setEnunciado(questao.getEnunciado());
                qDto.setTipo(questao.getTipo());
                qDto.setDificuldade(questao.getDificuldade());
                qDto.setValorPadrao(questao.getValorPadrao());
                qDto.setExplicacao(questao.getExplicacao());
                qDto.setAtivo(questao.isAtivo());
                qDto.setCreatedAt(questao.getCreatedAt());
                qDto.setUpdatedAt(questao.getUpdatedAt());

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
                    qDto.setAlternativas(alts);
                }
                return qDto;
            }).collect(Collectors.toList());
            dto.setQuestoes(questoes);
        }

        return dto;
    }
}
