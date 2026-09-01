package br.com.plataformaavaliacoes.backend;

import br.com.plataformaavaliacoes.backend.domain.model.Assunto;
import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.model.Serie;
import br.com.plataformaavaliacoes.backend.domain.repository.AssuntoRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.DisciplinaRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.SerieRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ActiveProfiles("test")
@AutoConfigureMockMvc
@SpringBootTest
class AssuntoControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private AssuntoRepository assuntoRepository;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @Autowired
    private SerieRepository serieRepository;

    private Disciplina portugues;
    private Disciplina matematica;
    private Serie sextoAno;
    private Serie setimoAno;

    @BeforeEach
    void setUp() {
        assuntoRepository.deleteAll();
        disciplinaRepository.deleteAll();
        serieRepository.deleteAll();

        portugues = salvarDisciplina("Portugues");
        matematica = salvarDisciplina("Matematica");
        sextoAno = salvarSerie("6o ano");
        setimoAno = salvarSerie("7o ano");
    }

    @Test
    void deveCriarAssunto() throws Exception {
        mockMvc.perform(post("/api/assuntos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Interpretacao de texto",
                                  "disciplinaId": %d,
                                  "serieId": %d
                                }
                                """.formatted(portugues.getId(), sextoAno.getId())))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome").value("Interpretacao de texto"))
                .andExpect(jsonPath("$.disciplina.nome").value("Portugues"))
                .andExpect(jsonPath("$.serie.nome").value("6o ano"))
                .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void deveListarAssuntosComFiltroPorDisciplinaESerie() throws Exception {
        salvarAssunto("Interpretacao", portugues, sextoAno);
        salvarAssunto("Literatura", portugues, setimoAno);
        salvarAssunto("Fracoes", matematica, sextoAno);

        mockMvc.perform(get("/api/assuntos")
                        .param("disciplinaId", portugues.getId().toString())
                        .param("serieId", sextoAno.getId().toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].nome").value("Interpretacao"));
    }

    @Test
    void deveAtualizarAssunto() throws Exception {
        Assunto assunto = salvarAssunto("Texto narrativo", portugues, sextoAno);

        mockMvc.perform(put("/api/assuntos/{id}", assunto.getId())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Genero narrativo",
                                  "disciplinaId": %d,
                                  "serieId": %d,
                                  "ativo": true
                                }
                                """.formatted(portugues.getId(), setimoAno.getId())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.nome").value("Genero narrativo"))
                .andExpect(jsonPath("$.serie.nome").value("7o ano"));
    }

    @Test
    void deveRetornar400QuandoDisciplinaNaoForInformada() throws Exception {
        mockMvc.perform(post("/api/assuntos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Interpretacao",
                                  "serieId": %d
                                }
                                """.formatted(sextoAno.getId())))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Dados invalidos"))
                .andExpect(jsonPath("$.fields[0].field").value("disciplinaId"));
    }

    @Test
    void deveRetornar409QuandoAssuntoJaExistirNaMesmaDisciplinaESerie() throws Exception {
        salvarAssunto("Interpretacao", portugues, sextoAno);

        mockMvc.perform(post("/api/assuntos")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "interpretacao",
                                  "disciplinaId": %d,
                                  "serieId": %d
                                }
                                """.formatted(portugues.getId(), sextoAno.getId())))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Ja existe um assunto com este nome para esta disciplina e serie"));
    }

    @Test
    void deveRetornar404QuandoAssuntoNaoExistir() throws Exception {
        mockMvc.perform(get("/api/assuntos/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Assunto nao encontrado"));
    }

    @Test
    void deveInativarAssunto() throws Exception {
        Assunto assunto = salvarAssunto("Fracoes", matematica, sextoAno);

        mockMvc.perform(delete("/api/assuntos/{id}", assunto.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/assuntos/{id}", assunto.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
    }

    private Assunto salvarAssunto(String nome, Disciplina disciplina, Serie serie) {
        Assunto assunto = new Assunto();
        assunto.setNome(nome);
        assunto.setDisciplina(disciplina);
        assunto.setSerie(serie);
        assunto.setAtivo(true);
        return assuntoRepository.save(assunto);
    }

    private Disciplina salvarDisciplina(String nome) {
        Disciplina disciplina = new Disciplina();
        disciplina.setNome(nome);
        disciplina.setAtivo(true);
        return disciplinaRepository.save(disciplina);
    }

    private Serie salvarSerie(String nome) {
        Serie serie = new Serie();
        serie.setNome(nome);
        serie.setAtivo(true);
        return serieRepository.save(serie);
    }
}
