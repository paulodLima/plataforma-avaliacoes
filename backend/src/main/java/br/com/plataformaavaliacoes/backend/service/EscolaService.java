package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Escola;
import br.com.plataformaavaliacoes.backend.domain.repository.EscolaRepository;
import br.com.plataformaavaliacoes.backend.dto.EscolaRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.EscolaResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class EscolaService {

    private final EscolaRepository escolaRepository;

    @Transactional
    public EscolaResponseDTO create(EscolaRequestDTO dto) {
        Escola escola = new Escola();
        mapDtoToEntity(dto, escola);
        escola = escolaRepository.save(escola);
        return toDTO(escola);
    }

    public Page<EscolaResponseDTO> findAll(Pageable pageable) {
        return escolaRepository.findAll(pageable).map(this::toDTO);
    }

    public EscolaResponseDTO findById(Long id) {
        Escola escola = escolaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escola não encontrada"));
        return toDTO(escola);
    }

    @Transactional
    public EscolaResponseDTO update(Long id, EscolaRequestDTO dto) {
        Escola escola = escolaRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escola não encontrada"));
        mapDtoToEntity(dto, escola);
        escola = escolaRepository.save(escola);
        return toDTO(escola);
    }

    private void mapDtoToEntity(EscolaRequestDTO dto, Escola escola) {
        escola.setNome(dto.getNome());
        escola.setSigla(dto.getSigla());
        escola.setLogoUrl(dto.getLogoUrl());
        escola.setEndereco(dto.getEndereco());
        escola.setBairro(dto.getBairro());
        escola.setCidade(dto.getCidade());
        escola.setEstado(dto.getEstado());
        escola.setCep(dto.getCep());
        escola.setTelefone(dto.getTelefone());
        escola.setEmail(dto.getEmail());
        escola.setSite(dto.getSite());
        escola.setObservacoesCabecalho(dto.getObservacoesCabecalho());
    }

    private EscolaResponseDTO toDTO(Escola escola) {
        EscolaResponseDTO dto = new EscolaResponseDTO();
        dto.setId(escola.getId());
        dto.setNome(escola.getNome());
        dto.setSigla(escola.getSigla());
        dto.setLogoUrl(escola.getLogoUrl());
        dto.setEndereco(escola.getEndereco());
        dto.setBairro(escola.getBairro());
        dto.setCidade(escola.getCidade());
        dto.setEstado(escola.getEstado());
        dto.setCep(escola.getCep());
        dto.setTelefone(escola.getTelefone());
        dto.setEmail(escola.getEmail());
        dto.setSite(escola.getSite());
        dto.setObservacoesCabecalho(escola.getObservacoesCabecalho());
        dto.setAtivo(escola.isAtivo());
        dto.setCreatedAt(escola.getCreatedAt());
        dto.setUpdatedAt(escola.getUpdatedAt());
        return dto;
    }
}
