package br.com.plataformaavaliacoes.backend;

import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.repository.SerieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class SerieControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private SerieRepository serieRepository;

    @BeforeEach
    void setUp() {
        serieRepository.deleteAll();
    }

    @Test
    void deveCriarSerie() throws Exception {
        mockMvc.perform(post("/api/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "6o ano"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome").value("6o ano"))
                .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void deveListarSeriesOrdenadasPorNome() throws Exception {
        salvarSerie("8o ano");
        salvarSerie("6o ano");

        mockMvc.perform(get("/api/series"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nome").value("6o ano"))
                .andExpect(jsonPath("$[1].nome").value("8o ano"));
    }

    @Test
    void deveRetornar400QuandoNomeForVazio() throws Exception {
        mockMvc.perform(post("/api/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": ""
                                }
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dados invalidos"))
                .andExpect(jsonPath("$.fields[0].field").value("nome"));
    }

    @Test
    void deveRetornar409QuandoNomeJaExistir() throws Exception {
        salvarSerie("6o ano");

        mockMvc.perform(post("/api/series")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "6O ANO"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Ja existe uma serie com este nome"));
    }

    @Test
    void deveRetornar404QuandoSerieNaoExistir() throws Exception {
        mockMvc.perform(get("/api/series/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Serie nao encontrada"));
    }

    @Test
    void deveInativarSerie() throws Exception {
        Serie serie = salvarSerie("7o ano");

        mockMvc.perform(delete("/api/series/{id}", serie.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/series/{id}", serie.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
    }

    private Serie salvarSerie(String nome) {
        Serie serie = new Serie();
        serie.setNome(nome);
        serie.setAtivo(true);
        return serieRepository.save(serie);
    }
}
