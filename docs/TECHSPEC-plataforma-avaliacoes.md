# Tech Spec - Plataforma de Avaliacoes

## 1. Objetivo Tecnico

Esta Tech Spec define a arquitetura e as decisoes tecnicas iniciais para implementar a Plataforma de Avaliacoes descrita no PRD.

O objetivo e criar uma base modular, simples de executar localmente e preparada para evoluir para geracao de provas, versoes com gabarito rastreavel e correcao automatizada por imagem.

## 2. Arquitetura Geral

O sistema sera composto por tres projetos independentes:

- `frontend`: aplicacao Angular standalone.
- `backend`: API principal em Spring Boot com Java 21.
- `gabarito`: servico Python com FastAPI para visao computacional.

Fluxo de comunicacao:

```text
Usuario
  -> Frontend Angular
  -> Backend Spring Boot
  -> PostgreSQL
  -> Servico Python de Gabarito
```

Regras de arquitetura:

- O frontend consome somente o backend.
- O backend centraliza regras de negocio, persistencia e integracoes.
- O servico Python nao acessa diretamente o banco principal.
- O servico Python retorna dados estruturados para o backend.
- A documentacao da API do backend deve ser exposta via Swagger/OpenAPI.

## 3. Stack Tecnica

### Frontend

- Angular standalone.
- TypeScript.
- Angular Router.
- HttpClient.
- Estrutura por `core`, `shared` e `features`.
- CSS/SCSS conforme padrao do projeto.

### Backend

- Java 21.
- Spring Boot.
- Maven.
- Spring Web.
- Spring Validation.
- Spring Data JPA.
- PostgreSQL Driver.
- Lombok.
- Springdoc OpenAPI/Swagger UI.

### Servico Python

- Python 3.11+.
- FastAPI.
- Uvicorn.
- OpenCV.
- pyzbar.
- qrcode.
- Pillow.
- python-multipart.
- Pydantic.

### Banco de Dados

- PostgreSQL.

## 4. Estrutura de Pastas

### Raiz

```text
plataforma-avaliacoes/
  backend/
  frontend/
  gabarito/
  docs/
  prompts/
  README.md
```

### Backend

```text
backend/
  src/main/java/br/com/plataformaavaliacoes/backend/
    client/
    config/
    controller/
    domain/
      model/
      repository/
    dto/
    exception/
    service/
    BackendApplication.java
  src/main/resources/
    application.yml
  src/test/
  pom.xml
```

Responsabilidades:

- `client`: clientes HTTP para integracoes internas/futuras, como servico Python.
- `config`: CORS, Swagger/OpenAPI e configuracoes gerais.
- `controller`: endpoints REST.
- `domain/model`: entidades JPA e enums.
- `domain/repository`: repositories Spring Data.
- `dto`: requests e responses.
- `exception`: tratamento centralizado de erros.
- `service`: regras de negocio.

### Frontend

```text
frontend/
  src/app/
    core/
      guards/
      interceptors/
      services/
      layout/
    shared/
      components/
      models/
      pipes/
    features/
      dashboard/
      banco-questoes/
      avaliacoes/
      correcao/
      relatorios/
    app.config.ts
    app.routes.ts
  src/environments/
```

Responsabilidades:

- `core`: servicos singleton, configuracoes globais e infraestrutura da aplicacao.
- `shared`: componentes reutilizaveis e modelos compartilhados.
- `features`: telas e fluxos de negocio.

### Servico Python

```text
gabarito/
  app/
    api/
      routes/
    core/
    schemas/
    services/
    main.py
  tests/
  requirements.txt
```

Responsabilidades:

- `api`: rotas HTTP.
- `core`: configuracoes da aplicacao.
- `schemas`: modelos Pydantic.
- `services`: processamento de imagem, QR Code e deteccao futura de respostas.
- `tests`: testes automatizados.

## 5. Modelo de Dados Inicial

### Entidades Principais

#### Disciplina

Campos sugeridos:

- `id`
- `nome`
- `ativo`
- `createdAt`
- `updatedAt`

#### Serie

Campos sugeridos:

- `id`
- `nome`
- `descricao`
- `ativo`
- `createdAt`
- `updatedAt`

#### Assunto

Campos sugeridos:

- `id`
- `nome`
- `descricao`
- `disciplinaId`
- `serieId`
- `ativo`
- `createdAt`
- `updatedAt`

#### BlocoQuestao

Campos sugeridos:

- `id`
- `titulo`
- `textoBase`
- `anexoUrl`
- `fonte`
- `disciplinaId`
- `serieId`
- `assuntoId`
- `createdAt`
- `updatedAt`

Observacao:

- Deve representar conteudo-base compartilhado por multiplas questoes.
- Pode existir sem imagem, apenas com texto-base.

#### Questao

Campos sugeridos:

- `id`
- `blocoQuestaoId`
- `disciplinaId`
- `serieId`
- `assuntoId`
- `enunciado`
- `tipo`
- `dificuldade`
- `valorPadrao`
- `explicacao`
- `ativo`
- `createdAt`
- `updatedAt`

Enums sugeridos:

- `TipoQuestao`: `OBJETIVA`, `VERDADEIRO_FALSO`, `DISCURSIVA`.
- `Dificuldade`: `FACIL`, `MEDIA`, `DIFICIL`.

Observacao:

- No escopo inicial, implementar apenas fluxo objetivo.
- `blocoQuestaoId` deve ser opcional para permitir questao individual.

#### Alternativa

Campos sugeridos:

- `id`
- `questaoId`
- `texto`
- `correta`
- `ordem`
- `createdAt`
- `updatedAt`

Regra:

- Uma questao objetiva deve possuir exatamente uma alternativa correta.

#### Avaliacao

Campos sugeridos:

- `id`
- `titulo`
- `descricao`
- `disciplinaId`
- `serieId`
- `turma`
- `periodo`
- `status`
- `createdAt`
- `updatedAt`

Enum sugerido:

- `StatusAvaliacao`: `RASCUNHO`, `GERADA`, `ARQUIVADA`.

#### AvaliacaoQuestao

Tabela de composicao da avaliacao.

Campos sugeridos:

- `id`
- `avaliacaoId`
- `questaoId`
- `ordem`
- `peso`
- `createdAt`

Observacao:

- Deve preservar a composicao planejada da avaliacao antes de gerar versoes.

#### AvaliacaoVersao

Campos sugeridos:

- `id`
- `avaliacaoId`
- `codigo`
- `nome`
- `status`
- `createdAt`

Regras:

- `codigo` deve ser unico.
- O codigo deve ser alfanumerico e facil de ler.
- Sugestao inicial: 6 caracteres removendo caracteres ambiguos como `0`, `O`, `1` e `I`.

#### GabaritoItem

Campos sugeridos:

- `id`
- `avaliacaoVersaoId`
- `questaoId`
- `numeroQuestao`
- `alternativaCorretaOriginalId`
- `letraCorreta`
- `ordemAlternativasJson`
- `createdAt`

Observacao:

- Guarda o estado da questao na versao gerada.
- Deve permitir corrigir uma prova mesmo que a questao original seja alterada depois.

#### Correcao

Campos sugeridos para fase futura:

- `id`
- `avaliacaoVersaoId`
- `alunoNome`
- `imagemUrl`
- `totalQuestoes`
- `totalAcertos`
- `totalErros`
- `nota`
- `status`
- `createdAt`

#### CorrecaoResposta

Campos sugeridos para fase futura:

- `id`
- `correcaoId`
- `questaoId`
- `numeroQuestao`
- `respostaDetectada`
- `respostaCorreta`
- `correta`
- `confianca`

## 6. Contratos de API - Backend

Base path sugerido:

```text
/api
```

### Health

```http
GET /api/health
```

Resposta:

```json
{
  "status": "UP",
  "service": "backend"
}
```

### Disciplinas

```http
GET /api/disciplinas
POST /api/disciplinas
GET /api/disciplinas/{id}
PUT /api/disciplinas/{id}
DELETE /api/disciplinas/{id}
```

Request `POST /api/disciplinas`:

```json
{
  "nome": "Portugues"
}
```

### Series

```http
GET /api/series
POST /api/series
GET /api/series/{id}
PUT /api/series/{id}
DELETE /api/series/{id}
```

### Assuntos

```http
GET /api/assuntos
POST /api/assuntos
GET /api/assuntos/{id}
PUT /api/assuntos/{id}
DELETE /api/assuntos/{id}
```

Request `POST /api/assuntos`:

```json
{
  "nome": "Interpretacao de Texto",
  "disciplinaId": 1,
  "serieId": 1
}
```

### Blocos de Questoes

```http
GET /api/blocos-questoes
POST /api/blocos-questoes
GET /api/blocos-questoes/{id}
PUT /api/blocos-questoes/{id}
DELETE /api/blocos-questoes/{id}
```

Request `POST /api/blocos-questoes`:

```json
{
  "titulo": "Tirinha sobre interpretacao textual",
  "textoBase": "Leia a tirinha e responda as questoes.",
  "anexoUrl": "https://exemplo.com/tirinha.png",
  "fonte": "Material da professora",
  "disciplinaId": 1,
  "serieId": 1,
  "assuntoId": 1
}
```

### Questoes

```http
GET /api/questoes
POST /api/questoes
GET /api/questoes/{id}
PUT /api/questoes/{id}
DELETE /api/questoes/{id}
```

Filtros sugeridos:

```text
GET /api/questoes?disciplinaId=1&serieId=1&assuntoId=1&dificuldade=MEDIA
```

Request `POST /api/questoes`:

```json
{
  "blocoQuestaoId": 1,
  "disciplinaId": 1,
  "serieId": 1,
  "assuntoId": 1,
  "enunciado": "Qual e o efeito de humor da tirinha?",
  "tipo": "OBJETIVA",
  "dificuldade": "MEDIA",
  "valorPadrao": 1.0,
  "alternativas": [
    { "texto": "Uso de ambiguidade", "correta": true },
    { "texto": "Narrador em primeira pessoa", "correta": false },
    { "texto": "Descricao objetiva", "correta": false },
    { "texto": "Ausencia de dialogo", "correta": false }
  ]
}
```

### Avaliacoes

```http
GET /api/avaliacoes
POST /api/avaliacoes
GET /api/avaliacoes/{id}
PUT /api/avaliacoes/{id}
DELETE /api/avaliacoes/{id}
POST /api/avaliacoes/{id}/questoes
DELETE /api/avaliacoes/{id}/questoes/{questaoId}
POST /api/avaliacoes/{id}/versoes
GET /api/avaliacoes/{id}/versoes
GET /api/avaliacoes/versoes/{codigo}
```

Request `POST /api/avaliacoes`:

```json
{
  "titulo": "Avaliacao de Portugues - Interpretacao",
  "descricao": "Avaliacao bimestral",
  "disciplinaId": 1,
  "serieId": 1,
  "turma": "8A",
  "periodo": "2o bimestre"
}
```

Request `POST /api/avaliacoes/{id}/questoes`:

```json
{
  "questaoIds": [1, 2, 3],
  "blocoQuestaoIds": [1]
}
```

Request `POST /api/avaliacoes/{id}/versoes`:

```json
{
  "quantidade": 2,
  "embaralharQuestoes": true,
  "embaralharAlternativas": true
}
```

Resposta:

```json
[
  {
    "id": 1,
    "codigo": "K7D29P",
    "avaliacaoId": 10,
    "nome": "Versao A"
  },
  {
    "id": 2,
    "codigo": "X4P8A2",
    "avaliacaoId": 10,
    "nome": "Versao B"
  }
]
```

### Correcoes

Escopo inicial deve preparar o contrato, mesmo que a implementacao ainda seja simples.

```http
POST /api/correcoes/imagem
GET /api/correcoes/{id}
```

Request futuro `POST /api/correcoes/imagem`:

```text
multipart/form-data
- arquivo: imagem da prova
- alunoNome: opcional
```

Resposta inicial sugerida:

```json
{
  "status": "RECEBIDO",
  "message": "Imagem recebida para processamento futuro."
}
```

## 7. Contratos de API - Servico Python

Base URL local sugerida:

```text
http://localhost:8001
```

### Health

```http
GET /health
```

Resposta:

```json
{
  "status": "UP",
  "service": "gabarito"
}
```

### Deteccao Futura

```http
POST /correcoes/detectar
```

Request:

```text
multipart/form-data
- arquivo: imagem da prova
```

Resposta futura:

```json
{
  "codigoAvaliacao": "K7D29P",
  "respostas": [
    {
      "numeroQuestao": 1,
      "respostaDetectada": "C",
      "confianca": 0.98
    }
  ]
}
```

## 8. Swagger/OpenAPI

O backend deve usar Springdoc OpenAPI.

Dependencia Maven sugerida:

```xml
<dependency>
  <groupId>org.springdoc</groupId>
  <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
  <version>3.1.0</version>
</dependency>
```

Classe de configuracao sugerida:

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI plataformaAvaliacoesOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("Plataforma de Avaliacoes API")
                .description("API principal para banco de questoes, avaliacoes, versoes e correcoes.")
                .version("v1"));
    }
}
```

URLs esperadas:

- `http://localhost:8080/swagger-ui.html`
- `http://localhost:8080/swagger-ui/index.html`
- `http://localhost:8080/v3/api-docs`

## 9. Configuracao Local

### Portas

- Frontend Angular: `4200`
- Backend Spring Boot: `8080`
- Servico Python FastAPI: `8001`
- PostgreSQL: `5432`

### Variaveis de Ambiente

Backend:

```text
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/plataforma_avaliacoes
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=postgres
GABARITO_SERVICE_URL=http://localhost:8001
```

Frontend:

```text
API_URL=http://localhost:8080/api
```

Servico Python:

```text
APP_NAME=gabarito
APP_ENV=local
```

### Docker Compose Sugerido

```yaml
services:
  postgres:
    image: postgres:16
    container_name: plataforma-avaliacoes-postgres
    environment:
      POSTGRES_DB: plataforma_avaliacoes
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

## 10. Frontend - Rotas e Telas

Rotas iniciais:

```text
/dashboard
/banco-questoes
/blocos-questoes
/avaliacoes
/avaliacoes/:id
/avaliacoes/:id/versoes
/correcao
/relatorios
```

Componentes iniciais:

- `AppLayoutComponent`
- `DashboardPage`
- `BancoQuestoesPage`
- `BlocosQuestoesPage`
- `AvaliacoesPage`
- `AvaliacaoDetalhePage`
- `CorrecaoPage`

Servicos Angular iniciais:

- `HealthService`
- `DisciplinaService`
- `SerieService`
- `AssuntoService`
- `QuestaoService`
- `BlocoQuestaoService`
- `AvaliacaoService`
- `CorrecaoService`

Estados de tela obrigatorios:

- carregando;
- erro;
- vazio;
- sucesso;
- formulario invalido.

## 11. Backend - Camadas

Padrao de fluxo:

```text
Controller -> Service -> Repository -> Database
```

Para integracoes futuras:

```text
Controller -> Service -> Client -> Servico externo/interno
```

Regras:

- Controllers nao devem conter regra de negocio.
- Services devem validar regras de dominio.
- Repositories devem conter apenas acesso a dados.
- DTOs devem ser usados nas bordas da API.
- Exceptions de negocio devem ser traduzidas por um handler global.

Handler global sugerido:

- `ResourceNotFoundException` -> 404
- `BusinessException` -> 400 ou 409
- `MethodArgumentNotValidException` -> 400
- erro de integracao -> 502
- erro inesperado -> 500

## 12. Backend - Regras de Implementacao

### Geracao de Codigo da Versao

Requisitos:

- Codigo alfanumerico.
- Tamanho inicial: 6 caracteres.
- Deve ser unico no banco.
- Deve evitar caracteres ambiguos.

Alfabeto sugerido:

```text
ABCDEFGHJKLMNPQRSTUVWXYZ23456789
```

Processo:

1. Gerar codigo aleatorio.
2. Verificar existencia em `AvaliacaoVersaoRepository`.
3. Repetir em caso de colisao.
4. Persistir codigo junto da versao.

### Preservacao do Gabarito

Ao gerar uma versao:

1. Buscar questoes da avaliacao.
2. Agrupar questoes por bloco quando houver.
3. Embaralhar unidades de prova, preservando blocos.
4. Embaralhar alternativas se solicitado.
5. Calcular letra correta apos embaralhamento.
6. Salvar `AvaliacaoVersao`.
7. Salvar `GabaritoItem` para cada questao.

### Blocos de Questoes

Regras:

- Uma questao pode estar vinculada a no maximo um bloco.
- Um bloco pode ter varias questoes.
- Questoes de um mesmo bloco devem manter ordem interna.
- Embaralhamento pode mover o bloco como unidade, mas nao separar suas questoes.

## 13. Servico Python - Design Inicial

Rotas:

- `GET /health`
- `POST /correcoes/detectar`

Services:

- `QrCodeService`: leitura futura de QR Code/codigo.
- `ImagePreprocessingService`: normalizacao, tons de cinza, threshold, alinhamento futuro.
- `AnswerDetectionService`: deteccao futura de marcacoes.

No escopo inicial, `POST /correcoes/detectar` pode retornar uma resposta mockada/controlada ou `501 Not Implemented`, desde que documentado.

Sugestao:

- Para o primeiro esqueleto, implementar apenas `/health`.
- Criar services com metodos ainda simples e testes basicos depois.

## 14. Banco de Dados

### Estrategia Inicial

- Usar JPA/Hibernate.
- Usar migrations com Flyway em uma fase seguinte.
- Enquanto o modelo estiver instavel, pode-se usar `ddl-auto=update` apenas em desenvolvimento local.

Configuracao local sugerida:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL:jdbc:postgresql://localhost:5432/plataforma_avaliacoes}
    username: ${SPRING_DATASOURCE_USERNAME:postgres}
    password: ${SPRING_DATASOURCE_PASSWORD:postgres}
  jpa:
    hibernate:
      ddl-auto: update
    properties:
      hibernate:
        format_sql: true
    open-in-view: false
```

Observacao:

- Antes de ambiente real, trocar para Flyway e migrations versionadas.

## 15. Observabilidade e Logs

Backend:

- Logar inicializacao da aplicacao.
- Logar erros de integracao com servico Python.
- Nao logar imagens, arquivos ou dados sensiveis.

Servico Python:

- Logar chamadas recebidas.
- Logar erros de processamento.
- Nao logar conteudo bruto de imagem.

Frontend:

- Exibir mensagens amigaveis ao usuario.
- Evitar expor detalhes tecnicos de erro na interface.

## 16. Seguranca

Escopo inicial:

- Sem login completo.
- Preparar estrutura para seguranca futura.
- Validar todos os payloads do backend.
- Configurar CORS apenas para frontend local durante desenvolvimento.
- Nao permitir upload irrestrito sem validacao de tipo/tamanho em fases futuras.

Futuro:

- Autenticacao JWT.
- Perfis de professor, coordenador e administrador.
- Controle de acesso por escola/turma.
- Auditoria de geracao de provas e correcoes.

## 17. Testes

### Backend

Testes iniciais:

- contexto Spring inicializa;
- `/api/health` retorna 200;
- validacao de payload invalido retorna 400;
- geracao de codigo cria codigo no formato esperado;
- geracao de versao preserva blocos de questoes.

Ferramentas:

- JUnit.
- Spring Boot Test.
- MockMvc.

### Frontend

Testes iniciais:

- aplicacao compila;
- rotas principais carregam;
- services montam chamadas para a URL correta;
- componentes mostram estados de loading, erro e vazio.

### Servico Python

Testes iniciais:

- `/health` retorna 200;
- configuracao da aplicacao carrega;
- endpoint futuro de deteccao rejeita payload invalido.

Ferramentas:

- pytest.
- FastAPI TestClient.

## 18. Criterios Tecnicos de Aceite

- O backend compila com Java 21.
- O backend sobe na porta `8080`.
- O Swagger abre corretamente.
- `/v3/api-docs` retorna especificacao OpenAPI.
- `/api/health` retorna status da API.
- O frontend sobe na porta `4200`.
- O frontend consegue chamar o health do backend.
- O servico Python sobe na porta `8001`.
- `/health` do servico Python retorna status.
- PostgreSQL roda localmente e o backend esta configurado para usa-lo.
- A estrutura de pastas segue a separacao definida nesta Tech Spec.

## 19. Plano de Implementacao

### Etapa 1 - Fundacao

- Revisar os tres projetos ja criados.
- Ajustar README raiz.
- Configurar PostgreSQL local.
- Configurar Swagger no backend.
- Criar health checks.
- Criar rotas iniciais no frontend.
- Criar health do servico Python.

### Etapa 2 - Cadastros Base

- Implementar disciplinas.
- Implementar series.
- Implementar assuntos.
- Implementar questoes objetivas.
- Implementar alternativas.
- Implementar blocos de questoes.

### Etapa 3 - Avaliacoes

- Implementar criacao de avaliacao.
- Implementar composicao de avaliacao com questoes e blocos.
- Implementar geracao de versoes.
- Implementar persistencia de gabarito.

### Etapa 4 - Integracao com Gabarito

- Criar client HTTP no backend.
- Criar contrato de upload de imagem.
- Criar endpoint Python de deteccao.
- Retornar resposta estruturada ainda sem algoritmo final.

### Etapa 5 - Geracao e Correcao Real

- Integrar JasperReports.
- Definir layout de prova e folha de respostas.
- Implementar marcadores visuais para leitura.
- Evoluir OpenCV/pyzbar.
- Implementar comparacao com gabarito.

## 20. Decisoes Pendentes

- Definir se o codigo da prova sera texto, QR Code ou ambos.
- Definir se a correcao sera na propria prova ou em folha de respostas separada.
- Definir modelo visual da escola para JasperReports.
- Definir estrategia de armazenamento de imagens/anexos.
- Definir se havera cadastro de alunos na primeira versao.
- Definir quando autenticar usuarios e separar perfis.
- Definir se `Serie` e `Turma` serao entidades separadas.

