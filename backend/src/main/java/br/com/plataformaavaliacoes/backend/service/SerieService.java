package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.repository.SerieRepository;
import br.com.plataformaavaliacoes.backend.dto.SerieRequest;
import br.com.plataformaavaliacoes.backend.dto.SerieResponse;
import br.com.plataformaavaliacoes.backend.exception.BusinessException;
import br.com.plataformaavaliacoes.backend.exception.ResourceNotFoundException;
import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class SerieService {

    private final SerieRepository serieRepository;

    public SerieService(SerieRepository serieRepository) {
        this.serieRepository = serieRepository;
    }

    @Transactional(readOnly = true)
    public List<SerieResponse> listar() {
        return serieRepository.findAllByOrderByNomeAsc()
                .stream()
                .map(SerieResponse::fromEntity)
                .toList();
    }

    @Transactional(readOnly = true)
    public SerieResponse buscarPorId(Long id) {
        return SerieResponse.fromEntity(buscarEntidadePorId(id));
    }

    @Transactional
    public SerieResponse criar(SerieRequest request) {
        validarNomeUnico(request.nome(), null);

        Serie serie = new Serie();
        serie.setNome(normalizarNome(request.nome()));
        serie.setAtivo(request.ativo() == null || request.ativo());

        return SerieResponse.fromEntity(serieRepository.save(serie));
    }

    @Transactional
    public SerieResponse atualizar(Long id, SerieRequest request) {
        Serie serie = buscarEntidadePorId(id);

        validarNomeUnico(request.nome(), id);
        serie.setNome(normalizarNome(request.nome()));

        if (request.ativo() != null) {
            serie.setAtivo(request.ativo());
        }

        return SerieResponse.fromEntity(serie);
    }

    @Transactional
    public void inativar(Long id) {
        Serie serie = buscarEntidadePorId(id);
        serie.setAtivo(false);
    }

    private Serie buscarEntidadePorId(Long id) {
        return serieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Serie nao encontrada"));
    }

    private void validarNomeUnico(String nome, Long idAtual) {
        String nomeNormalizado = normalizarNome(nome);
        boolean existe = idAtual == null
                ? serieRepository.existsByNomeIgnoreCase(nomeNormalizado)
                : serieRepository.existsByNomeIgnoreCaseAndIdNot(nomeNormalizado, idAtual);

        if (existe) {
            throw new BusinessException("Ja existe uma serie com este nome");
        }
    }

    private String normalizarNome(String nome) {
        return nome == null ? null : nome.trim();
    }
}
