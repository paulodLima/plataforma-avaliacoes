package br.com.plataformaavaliacoes.backend;

import br.com.plataformaavaliacoes.backend.domain.model.Disciplina;
import br.com.plataformaavaliacoes.backend.domain.repository.DisciplinaRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
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
@org.springframework.security.test.context.support.WithMockUser
class DisciplinaControllerTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private DisciplinaRepository disciplinaRepository;

    @BeforeEach
    void setUp() {
        disciplinaRepository.deleteAll();
    }

    @Test
    void deveCriarDisciplina() throws Exception {
        mockMvc.perform(post("/api/disciplinas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "Portugues"
                                }
                                """))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.id").exists())
                .andExpect(jsonPath("$.nome").value("Portugues"))
                .andExpect(jsonPath("$.ativo").value(true));
    }

    @Test
    void deveListarDisciplinasOrdenadasPorNome() throws Exception {
        salvarDisciplina("Matematica");
        salvarDisciplina("Artes");

        mockMvc.perform(get("/api/disciplinas"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].nome").value("Artes"))
                .andExpect(jsonPath("$[1].nome").value("Matematica"));
    }

    @Test
    void deveRetornar400QuandoNomeForVazio() throws Exception {
        mockMvc.perform(post("/api/disciplinas")
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
        salvarDisciplina("Portugues");

        mockMvc.perform(post("/api/disciplinas")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "nome": "portugues"
                                }
                                """))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message").value("Ja existe uma disciplina com este nome"));
    }

    @Test
    void deveRetornar404QuandoDisciplinaNaoExistir() throws Exception {
        mockMvc.perform(get("/api/disciplinas/999"))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Disciplina nao encontrada"));
    }

    @Test
    void deveInativarDisciplina() throws Exception {
        Disciplina disciplina = salvarDisciplina("Historia");

        mockMvc.perform(delete("/api/disciplinas/{id}", disciplina.getId()))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/disciplinas/{id}", disciplina.getId()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.ativo").value(false));
    }

    private Disciplina salvarDisciplina(String nome) {
        Disciplina disciplina = new Disciplina();
        disciplina.setNome(nome);
        disciplina.setAtivo(true);
        return disciplinaRepository.save(disciplina);
    }
}
