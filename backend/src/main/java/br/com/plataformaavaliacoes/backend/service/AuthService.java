package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Professor;
import br.com.plataformaavaliacoes.backend.domain.repository.ProfessorRepository;
import br.com.plataformaavaliacoes.backend.dto.AuthResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.LoginRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.MeResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.ProfessorResponseDTO;
import br.com.plataformaavaliacoes.backend.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponseDTO login(LoginRequestDTO dto) {
        Optional<Professor> professorOpt = professorRepository.findByEmail(dto.getLogin());
        if (professorOpt.isEmpty()) {
            professorOpt = professorRepository.findByTelefone(dto.getLogin());
        }

        Professor professor = professorOpt.orElseThrow(() ->
                new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));

        if (!passwordEncoder.matches(dto.getSenha(), professor.getSenha())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        }

        String token = jwtUtil.generateToken(professor.getId(), professor.getEmail());

        AuthResponseDTO response = new AuthResponseDTO();
        response.setToken(token);
        response.setProfessor(toProfessorDTO(professor));
        return response;
    }

    public MeResponseDTO getMe(Long professorId) {
        Professor professor = professorRepository.findById(professorId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Professor não encontrado"));

        MeResponseDTO response = new MeResponseDTO();
        response.setProfessor(toProfessorDTO(professor));
        return response;
    }

    private ProfessorResponseDTO toProfessorDTO(Professor professor) {
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
