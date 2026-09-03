package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoVersaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.HashSet;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class GeradorCodigoServiceTest {

    @Mock
    private AvaliacaoVersaoRepository repository;

    @InjectMocks
    private GeradorCodigoService service;

    @Test
    void testGerarCodigoUnico_LengthAndCharacters() {
        when(repository.existsByCodigo(anyString())).thenReturn(false);

        String codigo = service.gerarCodigoUnico();

        assertNotNull(codigo);
        assertEquals(6, codigo.length());

        // Verifica se nao possui caracteres ambiguos
        assertFalse(codigo.contains("0"));
        assertFalse(codigo.contains("O"));
        assertFalse(codigo.contains("1"));
        assertFalse(codigo.contains("I"));

        // Verifica se so possui os caracteres permitidos
        assertTrue(codigo.matches("[23456789ABCDEFGHJKLMNPQRSTUVWXYZ]+"));

        verify(repository, times(1)).existsByCodigo(codigo);
    }

    @Test
    void testGerarCodigoUnico_ComColisao() {
        // Simula que a primeira tentativa falha (ja existe) e a segunda passa
        when(repository.existsByCodigo(anyString()))
            .thenReturn(true)
            .thenReturn(false);

        String codigo = service.gerarCodigoUnico();

        assertNotNull(codigo);
        assertEquals(6, codigo.length());

        // Deve ter chamado existsByCodigo duas vezes
        verify(repository, times(2)).existsByCodigo(anyString());
    }

    @Test
    void testGerarCodigoUnico_Aleatoriedade() {
        when(repository.existsByCodigo(anyString())).thenReturn(false);

        Set<String> codigosGerados = new HashSet<>();
        for (int i = 0; i < 100; i++) {
            codigosGerados.add(service.gerarCodigoUnico());
        }

        // Deve ter gerado 100 codigos unicos (altamente provavel sem colisao no HashSet)
        assertEquals(100, codigosGerados.size());
    }
}
