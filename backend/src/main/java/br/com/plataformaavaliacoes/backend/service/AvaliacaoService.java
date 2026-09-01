package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Avaliacao;
import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.BlocoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.model.Questao;
import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.model.StatusAvaliacao;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoQuestaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.BlocoQuestaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.DisciplinaRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.QuestaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.SerieRepository;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoQuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoQuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoResponseDTO;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class AvaliacaoService {

    private final AvaliacaoRepository avaliacaoRepository;
    private final AvaliacaoQuestaoRepository avaliacaoQuestaoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final SerieRepository serieRepository;
    private final QuestaoRepository questaoRepository;
    private final BlocoQuestaoRepository blocoQuestaoRepository;
    private final QuestaoService questaoService;

    @Transactional
    public AvaliacaoResponseDTO create(AvaliacaoRequestDTO dto) {
        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));
        Serie serie = serieRepository.findById(dto.getSerieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Série não encontrada"));

        Avaliacao avaliacao = new Avaliacao();
        avaliacao.setTitulo(dto.getTitulo());
        avaliacao.setDescricao(dto.getDescricao());
        avaliacao.setDisciplina(disciplina);
        avaliacao.setSerie(serie);
        avaliacao.setTurma(dto.getTurma());
        avaliacao.setPeriodo(dto.getPeriodo());

        avaliacao = avaliacaoRepository.save(avaliacao);
        return toDTO(avaliacao);
    }

    public Page<AvaliacaoResponseDTO> findAll(Pageable pageable) {
        return avaliacaoRepository.findAll(pageable).map(this::toDTO);
    }

    public AvaliacaoResponseDTO findById(Long id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));
        return toDTO(avaliacao);
    }

    @Transactional
    public AvaliacaoResponseDTO update(Long id, AvaliacaoRequestDTO dto) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));

        Disciplina disciplina = disciplinaRepository.findById(dto.getDisciplinaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Disciplina não encontrada"));
        Serie serie = serieRepository.findById(dto.getSerieId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Série não encontrada"));

        avaliacao.setTitulo(dto.getTitulo());
        avaliacao.setDescricao(dto.getDescricao());
        avaliacao.setDisciplina(disciplina);
        avaliacao.setSerie(serie);
        avaliacao.setTurma(dto.getTurma());
        avaliacao.setPeriodo(dto.getPeriodo());

        avaliacao = avaliacaoRepository.save(avaliacao);
        return toDTO(avaliacao);
    }

    @Transactional
    public void delete(Long id) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));

        avaliacao.setStatus(StatusAvaliacao.ARQUIVADA);
        avaliacaoRepository.save(avaliacao);
    }

    @Transactional
    public AvaliacaoResponseDTO adicionarQuestoes(Long id, AvaliacaoQuestaoRequestDTO dto) {
        Avaliacao avaliacao = avaliacaoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada"));

        Integer ordemAtual = avaliacaoQuestaoRepository.countByAvaliacaoId(id);
        if (ordemAtual == null) {
            ordemAtual = 0;
        }

        List<Questao> questoesParaAdicionar = new ArrayList<>();

        if (dto.getQuestaoIds() != null) {
            for (Long questaoId : dto.getQuestaoIds()) {
                Questao q = questaoRepository.findById(questaoId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Questão não encontrada: " + questaoId));
                questoesParaAdicionar.add(q);
            }
        }

        if (dto.getBlocoQuestaoIds() != null) {
            for (Long blocoId : dto.getBlocoQuestaoIds()) {
                BlocoQuestao bloco = blocoQuestaoRepository.findById(blocoId)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Bloco não encontrado: " + blocoId));

                // Add all active questions from the block, sorted by ID for consistency
                List<Questao> questoesBloco = bloco.getQuestoes().stream()
                        .filter(Questao::isAtivo)
                        .sorted((q1, q2) -> q1.getId().compareTo(q2.getId()))
                        .collect(Collectors.toList());

                questoesParaAdicionar.addAll(questoesBloco);
            }
        }

        for (Questao questao : questoesParaAdicionar) {
            ordemAtual++;
            AvaliacaoQuestao aq = new AvaliacaoQuestao();
            aq.setAvaliacao(avaliacao);
            aq.setQuestao(questao);
            aq.setOrdem(ordemAtual);
            aq.setPeso(questao.getValorPadrao());
            avaliacaoQuestaoRepository.save(aq);
        }

        return findById(id);
    }

    @Transactional
    public void removerQuestao(Long avaliacaoId, Long questaoId) {
        if (!avaliacaoRepository.existsById(avaliacaoId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Avaliação não encontrada");
        }
        avaliacaoQuestaoRepository.deleteByAvaliacaoIdAndQuestaoId(avaliacaoId, questaoId);
    }

    private AvaliacaoResponseDTO toDTO(Avaliacao avaliacao) {
        AvaliacaoResponseDTO dto = new AvaliacaoResponseDTO();
        dto.setId(avaliacao.getId());
        dto.setTitulo(avaliacao.getTitulo());
        dto.setDescricao(avaliacao.getDescricao());
        dto.setDisciplinaId(avaliacao.getDisciplina().getId());
        dto.setSerieId(avaliacao.getSerie().getId());
        dto.setTurma(avaliacao.getTurma());
        dto.setPeriodo(avaliacao.getPeriodo());
        dto.setStatus(avaliacao.getStatus());
        dto.setCreatedAt(avaliacao.getCreatedAt());
        dto.setUpdatedAt(avaliacao.getUpdatedAt());

        List<AvaliacaoQuestao> avaliacaoQuestoes = avaliacaoQuestaoRepository.findByAvaliacaoIdOrderByOrdemAsc(avaliacao.getId());
        List<AvaliacaoQuestaoResponseDTO> questoesDto = avaliacaoQuestoes.stream().map(aq -> {
            AvaliacaoQuestaoResponseDTO aqDto = new AvaliacaoQuestaoResponseDTO();
            aqDto.setId(aq.getId());
            aqDto.setAvaliacaoId(aq.getAvaliacao().getId());
            // Since questaoService.toDTO is not available/public in this implementation,
            // we will need to fetch it via the public findById method to get the DTO
            aqDto.setQuestao(questaoService.findById(aq.getQuestao().getId()));
            aqDto.setOrdem(aq.getOrdem());
            aqDto.setPeso(aq.getPeso());
            aqDto.setCreatedAt(aq.getCreatedAt());
            return aqDto;
        }).collect(Collectors.toList());

        dto.setQuestoes(questoesDto);
        return dto;
    }
}
