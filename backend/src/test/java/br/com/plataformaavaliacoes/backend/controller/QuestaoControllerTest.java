package br.com.plataformaavaliacoes.backend.controller;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import br.com.plataformaavaliacoes.backend.dto.QuestaoRequestDTO;
import br.com.plataformaavaliacoes.backend.dto.QuestaoResponseDTO;
import br.com.plataformaavaliacoes.backend.service.QuestaoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import br.com.plataformaavaliacoes.backend.security.JwtAuthenticationFilter;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.test.context.support.WithMockUser;
import br.com.plataformaavaliacoes.backend.config.SecurityConfig;

@WebMvcTest(
    controllers = QuestaoController.class,
    excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class},
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = {SecurityConfig.class, JwtAuthenticationFilter.class}
    )
)
@WithMockUser
class QuestaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private QuestaoService questaoService;

    private String getValidJsonPayload() {
        return """
                {
                  "disciplinaId": 1,
                  "serieId": 1,
                  "enunciado": "Teste API",
                  "tipo": "OBJETIVA",
                  "dificuldade": "MEDIA",
                  "alternativas": [
                    { "texto": "A", "correta": true },
                    { "texto": "B", "correta": false }
                  ]
                }
                """;
    }

    @Test
    void create_ShouldReturnCreatedQuestao() throws Exception {
        QuestaoResponseDTO response = new QuestaoResponseDTO();
        response.setId(1L);
        response.setEnunciado("Teste API");

        when(questaoService.create(any())).thenReturn(response);

        mockMvc.perform(post("/api/questoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(getValidJsonPayload()))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.enunciado").value("Teste API"));
    }

    @Test
    void findAll_ShouldReturnPageOfQuestoes() throws Exception {
        QuestaoResponseDTO response = new QuestaoResponseDTO();
        response.setId(1L);
        response.setEnunciado("Teste API");

        PageImpl<QuestaoResponseDTO> page = new PageImpl<>(Collections.singletonList(response));

        when(questaoService.findAll(any(), any(), any(), any(), any(Pageable.class))).thenReturn(page);

        mockMvc.perform(get("/api/questoes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[0].id").value(1L));
    }

    @Test
    void findById_ShouldReturnQuestao() throws Exception {
        QuestaoResponseDTO response = new QuestaoResponseDTO();
        response.setId(1L);
        response.setEnunciado("Teste API GET ID");

        when(questaoService.findById(1L)).thenReturn(response);

        mockMvc.perform(get("/api/questoes/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.enunciado").value("Teste API GET ID"));
    }

    @Test
    void update_ShouldReturnUpdatedQuestao() throws Exception {
        QuestaoResponseDTO response = new QuestaoResponseDTO();
        response.setId(1L);
        response.setEnunciado("Teste API Updated");

        when(questaoService.update(eq(1L), any())).thenReturn(response);

        mockMvc.perform(put("/api/questoes/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(getValidJsonPayload()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1L))
                .andExpect(jsonPath("$.enunciado").value("Teste API Updated"));
    }

    @Test
    void delete_ShouldReturnNoContent() throws Exception {
        doNothing().when(questaoService).delete(1L);

        mockMvc.perform(delete("/api/questoes/1"))
                .andExpect(status().isNoContent());
    }
}
