package br.com.plataformaavaliacoes.backend.controller;

import br.com.plataformaavaliacoes.backend.dto.AvaliacaoVersaoResponseDTO;
import br.com.plataformaavaliacoes.backend.dto.VersaoGeracaoRequestDTO;
import br.com.plataformaavaliacoes.backend.service.AvaliacaoVersaoService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import br.com.plataformaavaliacoes.backend.security.JwtAuthenticationFilter;
import org.springframework.boot.autoconfigure.security.servlet.SecurityFilterAutoConfiguration;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.FilterType;
import org.springframework.security.test.context.support.WithMockUser;
import br.com.plataformaavaliacoes.backend.config.SecurityConfig;

@WebMvcTest(
    controllers = AvaliacaoVersaoController.class,
    excludeAutoConfiguration = {SecurityAutoConfiguration.class, SecurityFilterAutoConfiguration.class},
    excludeFilters = @ComponentScan.Filter(
        type = FilterType.ASSIGNABLE_TYPE,
        classes = {SecurityConfig.class, JwtAuthenticationFilter.class}
    )
)
@WithMockUser
class AvaliacaoVersaoControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AvaliacaoVersaoService avaliacaoVersaoService;

    @Test
    void testGerarVersoes() throws Exception {
        VersaoGeracaoRequestDTO req = new VersaoGeracaoRequestDTO();
        req.setQuantidadeVersoes(2);

        AvaliacaoVersaoResponseDTO res = new AvaliacaoVersaoResponseDTO();
        res.setCodigo("ABCDEF");

        when(avaliacaoVersaoService.gerarVersoes(eq(1L), any())).thenReturn(List.of(res));

        mockMvc.perform(post("/api/avaliacoes/1/versoes")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$[0].codigo").value("ABCDEF"));
    }

    @Test
    void testFindByCodigo() throws Exception {
        AvaliacaoVersaoResponseDTO res = new AvaliacaoVersaoResponseDTO();
        res.setCodigo("ABCDEF");

        when(avaliacaoVersaoService.findByCodigo("ABCDEF")).thenReturn(res);

        mockMvc.perform(get("/api/avaliacoes/versoes/ABCDEF"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.codigo").value("ABCDEF"));
    }

    @Test
    void testListarVersoes() throws Exception {
        AvaliacaoVersaoResponseDTO res = new AvaliacaoVersaoResponseDTO();
        res.setCodigo("ZXCVBN");

        when(avaliacaoVersaoService.listarVersoes(1L)).thenReturn(List.of(res));

        mockMvc.perform(get("/api/avaliacoes/1/versoes"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigo").value("ZXCVBN"));
    }
}
