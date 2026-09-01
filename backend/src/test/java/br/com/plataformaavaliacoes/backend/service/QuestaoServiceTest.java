package br.com.plataformaavaliacoes.backend.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import br.com.plataformaavaliacoes.backend.domain.model.Dificuldade;
import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.model.Questao;
import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.model.TipoQuestao;
import br.com.plataformaavaliacoes.backend.domain.repository.QuestaoRepository;
import br.com.plataformaavaliacoes.backend.dto.AlternativaRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.exception.BusinessException;
import br.com.plataformaavaliacoes.backend.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class QuestaoServiceTest {

    @Mock
    private QuestaoRepository questaoRepository;

    @Mock
    private EntityManager entityManager;

    @InjectMocks
    private QuestaoService questaoService;

    private QuestaoRequestDTO createValidRequest() {
        QuestaoRequestDTO dto = new QuestaoRequestDTO();
        dto.setDisciplinaId(1L);
        dto.setSerieId(1L);
        dto.setEnunciado("Teste enunciado");
        dto.setTipo(TipoQuestao.OBJETIVA);
        dto.setDificuldade(Dificuldade.MEDIA);
        dto.setValorPadrao(BigDecimal.ONE);

        AlternativaRequestDTO alt1 = new AlternativaRequestDTO();
        alt1.setTexto("A");
        alt1.setCorreta(true);

        AlternativaRequestDTO alt2 = new AlternativaRequestDTO();
        alt2.setTexto("B");
        alt2.setCorreta(false);

        dto.setAlternativas(Arrays.asList(alt1, alt2));
        return dto;
    }

    private Questao createValidQuestao(Long id) {
        Questao questao = new Questao();
        questao.setId(id);
        Disciplina disciplina = new Disciplina();
        disciplina.setId(1L);
        Serie serie = new Serie();
        serie.setId(1L);
        questao.setDisciplina(disciplina);
        questao.setSerie(serie);
        questao.setEnunciado("Enunciado Original");
        questao.setTipo(TipoQuestao.OBJETIVA);
        questao.setDificuldade(Dificuldade.MEDIA);
        return questao;
    }

    @BeforeEach
    void setUp() {
    }

    @Test
    void create_ShouldSaveQuestao_WhenValid() {
        QuestaoRequestDTO request = createValidRequest();

        Disciplina disciplina = new Disciplina();
        disciplina.setId(1L);
        Serie serie = new Serie();
        serie.setId(1L);

        when(entityManager.find(Disciplina.class, 1L)).thenReturn(disciplina);
        when(entityManager.find(Serie.class, 1L)).thenReturn(serie);

        when(questaoRepository.save(any(Questao.class))).thenAnswer(invocation -> {
            Questao q = invocation.getArgument(0);
            q.setId(10L);
            return q;
        });

        QuestaoResponseDTO response = questaoService.create(request);

        assertNotNull(response);
        assertEquals(10L, response.getId());
        assertEquals("Teste enunciado", response.getEnunciado());
        assertEquals(2, response.getAlternativas().size());
    }

    @Test
    void create_ShouldThrowException_WhenLessThanTwoAlternativas() {
        QuestaoRequestDTO request = createValidRequest();
        request.setAlternativas(List.of(request.getAlternativas().get(0))); // apenas 1

        BusinessException ex = assertThrows(BusinessException.class, () -> questaoService.create(request));
        assertEquals("A questão deve possuir no mínimo duas alternativas.", ex.getMessage());
    }

    @Test
    void create_ShouldThrowException_WhenNoCorreta() {
        QuestaoRequestDTO request = createValidRequest();
        request.getAlternativas().get(0).setCorreta(false);

        BusinessException ex = assertThrows(BusinessException.class, () -> questaoService.create(request));
        assertEquals("A questão objetiva exige exatamente uma alternativa correta.", ex.getMessage());
    }

    @Test
    void findById_ShouldReturnQuestao_WhenExists() {
        Questao questao = createValidQuestao(1L);
        when(questaoRepository.findById(1L)).thenReturn(Optional.of(questao));

        QuestaoResponseDTO response = questaoService.findById(1L);

        assertNotNull(response);
        assertEquals(1L, response.getId());
    }

    @Test
    void findById_ShouldThrowException_WhenNotFound() {
        when(questaoRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> questaoService.findById(1L));
    }

    @Test
    void update_ShouldUpdateQuestao_WhenValid() {
        Questao questao = createValidQuestao(1L);
        QuestaoRequestDTO request = createValidRequest();

        Disciplina disciplina = new Disciplina();
        disciplina.setId(1L);
        Serie serie = new Serie();
        serie.setId(1L);

        when(questaoRepository.findById(1L)).thenReturn(Optional.of(questao));
        when(entityManager.find(Disciplina.class, 1L)).thenReturn(disciplina);
        when(entityManager.find(Serie.class, 1L)).thenReturn(serie);
        when(questaoRepository.save(any(Questao.class))).thenAnswer(invocation -> invocation.getArgument(0));

        QuestaoResponseDTO response = questaoService.update(1L, request);

        assertNotNull(response);
        assertEquals(1L, response.getId());
        assertEquals("Teste enunciado", response.getEnunciado());
        assertEquals(2, response.getAlternativas().size());
    }

    @Test
    void delete_ShouldCallRepositoryDelete_WhenExists() {
        Questao questao = createValidQuestao(1L);
        when(questaoRepository.findById(1L)).thenReturn(Optional.of(questao));

        questaoService.delete(1L);

        verify(questaoRepository, times(1)).delete(questao);
    }
}
