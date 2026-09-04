package br.com.plataformaavaliacoes.backend.config;

import br.com.plataformaavaliacoes.backend.domain.model.Escola;
import br.com.plataformaavaliacoes.backend.domain.model.Professor;
import br.com.plataformaavaliacoes.backend.domain.repository.EscolaRepository;
import br.com.plataformaavaliacoes.backend.domain.repository.ProfessorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Component
@Profile("!test") // Não roda nos testes para não poluir o banco h2 em memória
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final EscolaRepository escolaRepository;
    private final ProfessorRepository professorRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Verificando necessidade de inserção de dados iniciais...");

        if (escolaRepository.count() == 0) {
            log.info("Criando escola de teste...");
            Escola escola = new Escola();
            escola.setNome("Escola Municipal Teste");
            escola.setSigla("EMT");
            escola.setCidade("São Paulo");
            escola.setEstado("SP");
            escola = escolaRepository.save(escola);

            if (professorRepository.count() == 0) {
                log.info("Criando professor de teste (login: professor@teste.com, senha: senha123)...");
                Professor professor = new Professor();
                professor.setNome("Professor Teste");
                professor.setEmail("professor@teste.com");
                professor.setSenha(passwordEncoder.encode("senha123"));
                professor.setEscola(escola);
                professorRepository.save(professor);
            }
        }
    }
}
