package br.com.plataformaavaliacoes.backend;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

@ActiveProfiles("test")
@SpringBootTest
@org.springframework.security.test.context.support.WithMockUser
class BackendApplicationTests {

	@Test
	void contextLoads() {
	}

}
