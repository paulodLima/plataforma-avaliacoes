package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Escola;
import br.com.plataformaavaliacoes.backend.domain.model.Professor;
import br.com.plataformaavaliacoes.backend.domain.repository.EscolaRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.ProfessorRepository;
import br.com.plataformaavaliacoes.backend.dto.ProfessorRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.ProfessorResponseDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfessorService {

    private final ProfessorRepository professorRepository;
    private final EscolaRepository escolaRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public ProfessorResponseDTO create(ProfessorRequestDTO dto) {
        if (professorRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "E-mail já cadastrado");
        }
        if (dto.getTelefone() != null && professorRepository.findByTelefone(dto.getTelefone()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Telefone já cadastrado");
        }

        Escola escola = escolaRepository.findById(dto.getEscolaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escola não encontrada"));

        Professor professor = new Professor();
        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());
        professor.setTelefone(dto.getTelefone());
        professor.setEscola(escola);
        professor.setSenha(passwordEncoder.encode(dto.getSenha()));

        professor = professorRepository.save(professor);
        return toDTO(professor);
    }

    public Page<ProfessorResponseDTO> findAll(Pageable pageable) {
        return professorRepository.findAll(pageable).map(this::toDTO);
    }

    public ProfessorResponseDTO findById(Long id) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));
        return toDTO(professor);
    }

    @Transactional
    public ProfessorResponseDTO update(Long id, ProfessorRequestDTO dto) {
        Professor professor = professorRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));

        if (!professor.getEmail().equals(dto.getEmail()) && professorRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "E-mail já cadastrado");
        }

        if (dto.getTelefone() != null && !dto.getTelefone().equals(professor.getTelefone()) &&
                professorRepository.findByTelefone(dto.getTelefone()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.UNPROCESSABLE_ENTITY, "Telefone já cadastrado");
        }

        Escola escola = escolaRepository.findById(dto.getEscolaId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Escola não encontrada"));

        professor.setNome(dto.getNome());
        professor.setEmail(dto.getEmail());
        professor.setTelefone(dto.getTelefone());
        professor.setEscola(escola);

        if (dto.getSenha() != null && !dto.getSenha().isBlank()) {
            professor.setSenha(passwordEncoder.encode(dto.getSenha()));
        }

        professor = professorRepository.save(professor);
        return toDTO(professor);
    }

    private ProfessorResponseDTO toDTO(Professor professor) {
        ProfessorResponseDTO dto = new ProfessorResponseDTO();
        dto.setId(professor.getId());
        dto.setNome(professor.getNome());
        dto.setEmail(professor.getEmail());
        dto.setTelefone(professor.getTelefone());
        dto.setEscolaId(professor.getEscola().getId());
        dto.setEscolaNome(professor.getEscola().getNome());
        dto.setAtivo(professor.isAtivo());
        dto.setCreatedAt(professor.getCreatedAt());
        dto.setUpdatedAt(professor.getUpdatedAt());
        return dto;
    }
}
