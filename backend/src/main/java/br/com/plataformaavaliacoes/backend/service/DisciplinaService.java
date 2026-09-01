package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.repository.DisciplinaRepository;
import br.com.plataformaavaliacoes.backend.dto.DisciplinaRequest;
import br.com.plataformaavaliacoes.backend.dto.DisciplinaResponse;
import br.com.plataformaavaliacoes.backend.exception.BusinessException;
import br.com.plataformaavaliacoes.backend.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DisciplinaService {

    private final DisciplinaRepository disciplinaRepository;

    public DisciplinaService(DisciplinaRepository disciplinaRepository) {
        this.disciplinaRepository = disciplinaRepository;
    }

    @Transactional(readOnly = true)
    public List<DisciplinaResponse> listar() {
        return disciplinaRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(DisciplinaResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public DisciplinaResponse buscarPorId(Long id) {
        return DisciplinaResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public DisciplinaResponse criar(DisciplinaRequest request) {
        validarNomeUnico(request.nome(), null);

        Disciplina disciplina = new Disciplina();
        disciplina.setNome(normalizarNome(request.nome()));
        disciplina.setAtivo(request.ativo() == null || request.ativo());

        return DisciplinaResponse.fromEntity(disciplinaRepository.save(disciplina));
    }

    @Transactional
    public DisciplinaResponse atualizar(Long id, DisciplinaRequest request) {
        Disciplina disciplina = buscarEntidadePorId(id);

        validarNomeUnico(request.nome(), id);
        disciplina.setNome(normalizarNome(request.nome()));

        if (request.ativo() != null) {
            disciplina.setAtivo(request.ativo());
        }

        return DisciplinaResponse.fromEntity(disciplina);
    }

    @Transactional
    public void inativar(Long id) {
        Disciplina disciplina = buscarEntidadePorId(id);
        disciplina.setAtivo(false);
    }

    private Disciplina buscarEntidadePorId(Long id) {
        return disciplinaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Disciplina nao encontrada"));
    }

    private void validarNomeUnico(String nome, Long idAtual) {
        String nomeNormalizado = normalizarNome(nome);
        boolean existe = idAtual == null
                ? disciplinaRepository.existsByNomeIgnoreCase(nomeNormalizado)
                : disciplinaRepository.existsByNomeIgnoreCaseAndIdNot(nomeNormalizado, idAtual);

        if (existe) {
            throw new BusinessException("Ja existe uma disciplina com este nome");
        }
    }

    private String normalizarNome(String nome) {
        return nome == null ? null : nome.trim();
    }
}
