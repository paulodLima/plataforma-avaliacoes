package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoVersaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
@RequiredArgsConstructor
public class GeradorCodigoService {

    private final AvaliacaoVersaoRepository repository;
    private static final String ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ"; // Sem 0, O, 1, I
    private static final int CODE_LENGTH = 6;
    private final SecureRandom random = new SecureRandom();

    public String gerarCodigoUnico() {
        String codigo;
        do {
            codigo = gerarCodigo();
        } while (repository.existsByCodigo(codigo));
        return codigo;
    }

    private String gerarCodigo() {
        StringBuilder sb = new StringBuilder(CODE_LENGTH);
        for (int i = 0; i < CODE_LENGTH; i++) {
            int index = random.nextInt(ALPHABET.length());
            sb.append(ALPHABET.charAt(index));
        }
        return sb.toString();
    }
}
