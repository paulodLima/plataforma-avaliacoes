package br.com.plataformaavaliacoes.backend.service;

import br.com.plataformaavaliacoes.backend.domain.model.Alternativa;
import br.com.plataformaavaliacoes.backend.domain.model.Avaliacao;
import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.AvaliacaoVersao;
import br.com.plataformaavaliacoes.backend.domain.model.BlocoQuestao;
import br.com.plataformaavaliacoes.backend.domain.model.GabaritoItem;
import br.com.plataformaavaliacoes.backend.domain.model.Questao;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoQuestaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.AvaliacaoVersaoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.GabaritoItemRepository;
import br.com.plataformaavaliacoes.backend.dto.AvaliacaoVersaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.VersaoGeracaoRequestDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyList;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AvaliacaoVersaoServiceTest {

    @Mock
    private AvaliacaoRepository avaliacaoRepository;

    @Mock
    private AvaliacaoQuestaoRepository avaliacaoQuestaoRepository;

    @Mock
    private AvaliacaoVersaoRepository avaliacaoVersaoRepository;

    @Mock
    private GabaritoItemRepository gabaritoItemRepository;

    @Mock
    private GeradorCodigoService geradorCodigoService;

    @Mock
    private ObjectMapper objectMapper;

    @InjectMocks
    private AvaliacaoVersaoService avaliacaoVersaoService;

    private Avaliacao avaliacao;
    private Questao q1, q2;
    private AvaliacaoQuestao aq1, aq2;

    @BeforeEach
    void setUp() {
        avaliacao = new Avaliacao();
        avaliacao.setId(1L);

        q1 = new Questao();
        q1.setId(10L);
        Alternativa a1 = new Alternativa();
        a1.setId(100L);
        a1.setCorreta(true);
        q1.addAlternativa(a1);

        q2 = new Questao();
        q2.setId(20L);
        Alternativa a2 = new Alternativa();
        a2.setId(200L);
        a2.setCorreta(true);
        q2.addAlternativa(a2);

        aq1 = new AvaliacaoQuestao();
        aq1.setAvaliacao(avaliacao);
        aq1.setQuestao(q1);

        aq2 = new AvaliacaoQuestao();
        aq2.setAvaliacao(avaliacao);
        aq2.setQuestao(q2);
    }

    @Test
    void testGerarVersoesSemEmbaralhamento() throws JsonProcessingException {
        VersaoGeracaoRequestDTO req = new VersaoGeracaoRequestDTO();
        req.setQuantidadeVersoes(1);
        req.setEmbaralharQuestoes(false);
        req.setEmbaralharAlternativas(false);

        when(avaliacaoRepository.findById(1L)).thenReturn(Optional.of(avaliacao));
        when(avaliacaoQuestaoRepository.findByAvaliacaoIdOrderByOrdemAsc(1L)).thenReturn(Arrays.asList(aq1, aq2));
        when(geradorCodigoService.gerarCodigoUnico()).thenReturn("ABCDEF");

        when(avaliacaoVersaoRepository.save(any(AvaliacaoVersao.class))).thenAnswer(i -> {
            AvaliacaoVersao v = i.getArgument(0);
            v.setId(99L);
            return v;
        });

        when(objectMapper.writeValueAsString(anyList())).thenReturn("[100]");
        when(gabaritoItemRepository.save(any(GabaritoItem.class))).thenAnswer(i -> i.getArgument(0));

        List<AvaliacaoVersaoResponseDTO> res = avaliacaoVersaoService.gerarVersoes(1L, req);

        assertNotNull(res);
        assertEquals(1, res.size());
        assertEquals("ABCDEF", res.get(0).getCodigo());
        assertEquals(2, res.get(0).getGabarito().size());

        verify(avaliacaoVersaoRepository, times(1)).save(any());
        verify(gabaritoItemRepository, times(2)).save(any());
    }

    @Test
    void testGerarVersoesComEmbaralhamento() throws JsonProcessingException {
        VersaoGeracaoRequestDTO req = new VersaoGeracaoRequestDTO();
        req.setQuantidadeVersoes(1);
        req.setEmbaralharQuestoes(true);
        req.setEmbaralharAlternativas(true);

        BlocoQuestao bloco = new BlocoQuestao();
        bloco.setId(1000L);
        q1.setBlocoQuestao(bloco);
        q2.setBlocoQuestao(bloco);

        when(avaliacaoRepository.findById(1L)).thenReturn(Optional.of(avaliacao));
        when(avaliacaoQuestaoRepository.findByAvaliacaoIdOrderByOrdemAsc(1L)).thenReturn(Arrays.asList(aq1, aq2));
        when(geradorCodigoService.gerarCodigoUnico()).thenReturn("XYZ123");

        when(avaliacaoVersaoRepository.save(any(AvaliacaoVersao.class))).thenAnswer(i -> {
            AvaliacaoVersao v = i.getArgument(0);
            v.setId(99L);
            return v;
        });

        when(objectMapper.writeValueAsString(anyList())).thenReturn("[100]");
        when(gabaritoItemRepository.save(any(GabaritoItem.class))).thenAnswer(i -> i.getArgument(0));

        List<AvaliacaoVersaoResponseDTO> res = avaliacaoVersaoService.gerarVersoes(1L, req);

        assertNotNull(res);
        assertEquals(1, res.size());
    }

    @Test
    void testFindByCodigo() {
        AvaliacaoVersao v = new AvaliacaoVersao();
        v.setId(99L);
        v.setCodigo("ABCDEF");

        GabaritoItem g1 = new GabaritoItem();
        g1.setNumeroQuestao(1);
        g1.setQuestao(q1);
        g1.setLetraCorreta("A");

        when(avaliacaoVersaoRepository.findByCodigo("ABCDEF")).thenReturn(Optional.of(v));
        when(gabaritoItemRepository.findByAvaliacaoVersaoIdOrderByNumeroQuestaoAsc(99L)).thenReturn(List.of(g1));

        AvaliacaoVersaoResponseDTO res = avaliacaoVersaoService.findByCodigo("ABCDEF");

        assertNotNull(res);
        assertEquals(99L, res.getId());
        assertEquals("ABCDEF", res.getCodigo());
        assertEquals(1, res.getGabarito().size());
        assertEquals("A", res.getGabarito().get(0).getLetraCorreta());
    }

    @Test
    void testFindByCodigoNotFound() {
        when(avaliacaoVersaoRepository.findByCodigo("NOTFND")).thenReturn(Optional.empty());

        assertThrows(ResponseStatusException.class, () -> avaliacaoVersaoService.findByCodigo("NOTFND"));
    }

    @Test
    void testGerarVersoesSemAlternativaCorretaThrowsException() {
        VersaoGeracaoRequestDTO req = new VersaoGeracaoRequestDTO();
        req.setQuantidadeVersoes(1);

        q1.getAlternativas().get(0).setCorreta(false); // Remove a correta

        when(avaliacaoRepository.findById(1L)).thenReturn(Optional.of(avaliacao));
        when(avaliacaoQuestaoRepository.findByAvaliacaoIdOrderByOrdemAsc(1L)).thenReturn(Arrays.asList(aq1));
        when(geradorCodigoService.gerarCodigoUnico()).thenReturn("ABCDEF");

        when(avaliacaoVersaoRepository.save(any(AvaliacaoVersao.class))).thenAnswer(i -> {
            AvaliacaoVersao v = i.getArgument(0);
            v.setId(99L);
            return v;
        });

        ResponseStatusException ex = assertThrows(ResponseStatusException.class, () -> avaliacaoVersaoService.gerarVersoes(1L, req));
        assertTrue(ex.getReason().contains("não possui uma alternativa correta definida"));
    }
}
