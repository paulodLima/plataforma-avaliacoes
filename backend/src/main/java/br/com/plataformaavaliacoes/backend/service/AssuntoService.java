package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Assunto;
import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.repository.AssuntoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.DisciplinaRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.SerieRepository;
import br.com.plataformaavaliacoes.backend.dto.AssuntoRequest;
import br.com.plataformaavaliacoes.backend.dto.AssuntoResponse;
import br.com.plataformaavaliacoes.backend.exception.BusinessException;
import br.com.plataformaavaliacoes.backend.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AssuntoService {

    private final AssuntoRepository assuntoRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final SerieRepository serieRepository;

    public AssuntoService(
            AssuntoRepository assuntoRepository,
            DisciplinaRepository disciplinaRepository,
            SerieRepository serieRepository
    ) {
        this.assuntoRepository = assuntoRepository;
        this.disciplinaRepository = disciplinaRepository;
        this.serieRepository = serieRepository;
    }

    @Transactional(readOnly = true)
    public List<AssuntoResponse> listar(Long disciplinaId, Long serieId) {
        return buscarPorFiltros(disciplinaId, serieId)
                .stream()
                .map(AssuntoResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public AssuntoResponse buscarPorId(Long id) {
        return AssuntoResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public AssuntoResponse criar(AssuntoRequest request) {
        Disciplina disciplina = buscarDisciplina(request.disciplinaId());
        Serie serie = buscarSerie(request.serieId());

        validarNomeUnico(request.nome(), disciplina.getId(), serie.getId(), null);

        Assunto assunto = new Assunto();
        assunto.setNome(normalizarNome(request.nome()));
        assunto.setDisciplina(disciplina);
        assunto.setSerie(serie);
        assunto.setAtivo(request.ativo() == null || request.ativo());

        return AssuntoResponse.fromEntity(assuntoRepository.save(assunto));
    }

    @Transactional
    public AssuntoResponse atualizar(Long id, AssuntoRequest request) {
        Assunto assunto = buscarEntidadePorId(id);
        Disciplina disciplina = buscarDisciplina(request.disciplinaId());
        Serie serie = buscarSerie(request.serieId());

        validarNomeUnico(request.nome(), disciplina.getId(), serie.getId(), id);

        assunto.setNome(normalizarNome(request.nome()));
        assunto.setDisciplina(disciplina);
        assunto.setSerie(serie);

        if (request.ativo() != null) {
            assunto.setAtivo(request.ativo());
        }

        return AssuntoResponse.fromEntity(assunto);
    }

    @Transactional
    public void inativar(Long id) {
        Assunto assunto = buscarEntidadePorId(id);
        assunto.setAtivo(false);
    }

    private List<Assunto> buscarPorFiltros(Long disciplinaId, Long serieId) {
        if (disciplinaId != null && serieId != null) {
            return assuntoRepository.findAllByDisciplinaIdAndSerieIdOrderByNomeAsc(disciplinaId, serieId);
        }

        if (disciplinaId != null) {
            return assuntoRepository.findAllByDisciplinaIdOrderByNomeAsc(disciplinaId);
        }

        if (serieId != null) {
            return assuntoRepository.findAllBySerieIdOrderByNomeAsc(serieId);
        }

        return assuntoRepository.findAllByOrderByNomeAsc();
    }

    private Assunto buscarEntidadePorId(Long id) {
        return assuntoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Assunto nao encontrado"));
    }

    private Disciplina buscarDisciplina(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina nao encontrada"));
    }

    private Serie buscarSerie(Long id) {
        return serieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serie nao encontrada"));
    }

    private void validarNomeUnico(String nome, Long disciplinaId, Long serieId, Long idAtual) {
        String nomeNormalizado = normalizarNome(nome);
        boolean existe = idAtual == null
                ? assuntoRepository.existsByNomeIgnoreCaseAndDisciplinaIdAndSerieId(nomeNormalizado, disciplinaId, serieId)
                : assuntoRepository.existsByNomeIgnoreCaseAndDisciplinaIdAndSerieIdAndIdNot(
                        nomeNormalizado,
                        disciplinaId,
                        serieId,
                        idAtual
                );

        if (existe) {
            throw new BusinessException("Ja existe um assunto com este nome para esta disciplina e serie");
        }
    }

    private String normalizarNome(String nome) {
        return nome == null ? null : nome.trim();
    }
}
