# Tasks - Plataforma de Avaliacoes

## Como Usar Este Backlog

Cada task possui:

- `ID`: identificador da tarefa.
- `Area`: projeto ou parte afetada.
- `Prioridade`: ordem sugerida de implementacao.
- `Depende de`: tarefas que devem vir antes.
- `Aceite`: criterios objetivos para considerar a tarefa pronta.

Prioridades:

- `P0`: fundacao obrigatoria.
- `P1`: primeira versao funcional.
- `P2`: evolucao importante.
- `P3`: futuro.

## Fase 1 - Fundacao

### TASK-001 - Revisar estrutura dos projetos

- Area: raiz, frontend, backend, gabarito
- Prioridade: P0
- Depende de: nenhuma

Descricao:

Validar se os tres projetos existem nas pastas corretas e seguem a organizacao definida na Tech Spec.

Aceite:

- Existe pasta `frontend`.
- Existe pasta `backend`.
- Existe pasta `gabarito`.
- Existe pasta `docs`.
- Existe pasta `prompts`.
- Cada projeto possui README ou instrucoes basicas de execucao.

### TASK-002 - Criar README raiz do projeto

- Area: raiz
- Prioridade: P0
- Depende de: TASK-001

Descricao:

Criar README principal explicando arquitetura, projetos, portas e comandos basicos.

Aceite:

- README explica a funcao de `frontend`, `backend` e `gabarito`.
- README lista requisitos locais.
- README lista comandos para subir cada projeto.
- README referencia PRD, Tech Spec e Tasks.

### TASK-003 - Configurar PostgreSQL local

- Area: infraestrutura, backend
- Prioridade: P0
- Depende de: TASK-001

Descricao:

Preparar configuracao local do PostgreSQL para desenvolvimento.

Aceite:

- Existe configuracao documentada para banco `plataforma_avaliacoes`.
- Existe `docker-compose.yml` ou instrucao equivalente.
- Backend aponta para PostgreSQL via variaveis de ambiente ou valores padrao locais.

### TASK-004 - Configurar application.yml do backend

- Area: backend
- Prioridade: P0
- Depende de: TASK-003

Descricao:

Configurar datasource, JPA, porta da aplicacao e URL do servico Python.

Aceite:

- Backend roda na porta `8080`.
- Datasource usa PostgreSQL.
- Configuracao aceita variaveis de ambiente.
- `GABARITO_SERVICE_URL` possui valor padrao local.

### TASK-005 - Implementar Swagger/OpenAPI no backend

- Area: backend
- Prioridade: P0
- Depende de: TASK-001

Descricao:

Adicionar Springdoc OpenAPI e configurar documentacao interativa da API.

Aceite:

- Dependencia `springdoc-openapi-starter-webmvc-ui` esta no Maven.
- Existe configuracao com titulo, descricao e versao da API.
- `/swagger-ui.html` ou `/swagger-ui/index.html` abre corretamente.
- `/v3/api-docs` retorna JSON OpenAPI.

### TASK-006 - Criar health check do backend

- Area: backend
- Prioridade: P0
- Depende de: TASK-004

Descricao:

Criar endpoint simples para verificar se a API esta online.

Aceite:

- `GET /api/health` retorna `200`.
- Resposta possui `status` e `service`.
- Endpoint aparece no Swagger.

### TASK-007 - Criar health check do servico Python

- Area: gabarito
- Prioridade: P0
- Depende de: TASK-001

Descricao:

Criar endpoint de saude no servico FastAPI.

Aceite:

- `GET /health` retorna `200`.
- Resposta possui `status` e `service`.
- Servico roda localmente na porta `8001`.

### TASK-008 - Configurar requirements do servico Python

- Area: gabarito
- Prioridade: P0
- Depende de: TASK-001

Descricao:

Definir dependencias iniciais do servico de gabarito.

Aceite:

- Existe `requirements.txt` ou `pyproject.toml`.
- Dependencias incluem FastAPI, Uvicorn, OpenCV, pyzbar, qrcode, Pillow, python-multipart e Pydantic.
- README do servico explica como instalar e executar.

### TASK-009 - Criar rotas iniciais do frontend

- Area: frontend
- Prioridade: P0
- Depende de: TASK-001

Descricao:

Configurar navegacao inicial da aplicacao Angular.

Aceite:

- Existem rotas para dashboard, banco de questoes, blocos de questoes, avaliacoes, correcao e relatorios.
- Aplicacao redireciona rota vazia para dashboard.
- Rotas carregam paginas ou componentes iniciais.

### TASK-010 - Criar layout base do frontend

- Area: frontend
- Prioridade: P0
- Depende de: TASK-009

Descricao:

Criar layout com navegacao simples entre as areas principais.

Aceite:

- Existe menu ou sidebar com areas principais.
- Layout funciona em desktop e mobile.
- Conteudo da rota aparece corretamente.
- Interface nao parece landing page.

### TASK-011 - Criar HealthService no frontend

- Area: frontend
- Prioridade: P0
- Depende de: TASK-006

Descricao:

Criar servico Angular para consultar o health check do backend.

Aceite:

- Service chama `GET /api/health`.
- URL base vem de environment/configuracao.
- Dashboard exibe status simples do backend.

## Fase 2 - Cadastros Base

### TASK-012 - Implementar entidade e CRUD de Disciplina

- Area: backend
- Prioridade: P1
- Depende de: TASK-004, TASK-006

Descricao:

Criar entidade, repository, service, DTOs e controller para disciplinas.

Aceite:

- `GET /api/disciplinas` lista disciplinas.
- `POST /api/disciplinas` cria disciplina.
- `GET /api/disciplinas/{id}` consulta por ID.
- `PUT /api/disciplinas/{id}` atualiza disciplina.
- `DELETE /api/disciplinas/{id}` inativa ou remove conforme decisao tecnica.
- Payload invalido retorna `400`.
- Recurso inexistente retorna `404`.

### TASK-013 - Criar tela de Disciplinas

- Area: frontend
- Prioridade: P1
- Depende de: TASK-012

Descricao:

Criar interface para listar e cadastrar disciplinas.

Aceite:

- Tela lista disciplinas vindas do backend.
- Permite cadastrar nova disciplina.
- Exibe loading, erro e vazio.
- Formulario valida nome obrigatorio.

### TASK-014 - Implementar entidade e CRUD de Serie

- Area: backend
- Prioridade: P1
- Depende de: TASK-004, TASK-006

Descricao:

Criar entidade, repository, service, DTOs e controller para series/turmas base.

Aceite:

- Endpoints CRUD de `/api/series` funcionam.
- Nome e obrigatorio.
- Payload invalido retorna `400`.
- Recurso inexistente retorna `404`.

### TASK-015 - Criar tela de Series

- Area: frontend
- Prioridade: P1
- Depende de: TASK-014

Descricao:

Criar interface para listar e cadastrar series.

Aceite:

- Tela lista series vindas do backend.
- Permite cadastrar nova serie.
- Exibe loading, erro e vazio.
- Formulario valida nome obrigatorio.

### TASK-016 - Implementar entidade e CRUD de Assunto

- Area: backend
- Prioridade: P1
- Depende de: TASK-012, TASK-014

Descricao:

Criar entidade, repository, service, DTOs e controller para assuntos vinculados a disciplina e serie.

Aceite:

- Endpoints CRUD de `/api/assuntos` funcionam.
- Assunto exige disciplina.
- Assunto pode exigir serie conforme decisao do modelo.
- Listagem permite filtros por disciplina e serie.
- Payload invalido retorna `400`.

### TASK-017 - Criar tela de Assuntos

- Area: frontend
- Prioridade: P1
- Depende de: TASK-016

Descricao:

Criar interface para listar e cadastrar assuntos.

Aceite:

- Tela lista assuntos.
- Permite filtrar por disciplina e serie.
- Permite cadastrar assunto.
- Formulario carrega disciplinas e series para selecao.

### TASK-018 - Implementar enums de questao

- Area: backend
- Prioridade: P1
- Depende de: TASK-004

Descricao:

Criar enums iniciais para tipo de questao e dificuldade.

Aceite:

- Existe enum `TipoQuestao`.
- Existe enum `Dificuldade`.
- Valores iniciais seguem Tech Spec.

### TASK-019 - Implementar entidade Alternativa

- Area: backend
- Prioridade: P1
- Depende de: TASK-018

Descricao:

Criar entidade de alternativa vinculada a questao.

Aceite:

- Alternativa possui texto, ordem e flag `correta`.
- Relacionamento com questao esta configurado.
- Modelo permite identificar alternativa correta.

### TASK-020 - Implementar entidade e CRUD de Questao

- Area: backend
- Prioridade: P1
- Depende de: TASK-012, TASK-014, TASK-016, TASK-018, TASK-019

Descricao:

Criar cadastro de questoes objetivas individuais.

Aceite:

- `GET /api/questoes` lista questoes.
- `POST /api/questoes` cria questao com alternativas.
- Questao objetiva exige ao menos duas alternativas.
- Questao objetiva exige exatamente uma alternativa correta.
- Listagem permite filtros por disciplina, serie, assunto e dificuldade.
- Swagger documenta request e response.

### TASK-021 - Criar tela de Banco de Questoes

- Area: frontend
- Prioridade: P1
- Depende de: TASK-020

Descricao:

Criar tela inicial para listar, filtrar e cadastrar questoes.

Aceite:

- Tela lista questoes do backend.
- Permite filtrar por disciplina, serie, assunto e dificuldade.
- Permite abrir formulario de nova questao.
- Formulario permite adicionar alternativas.
- Formulario exige uma alternativa correta.

### TASK-022 - Implementar entidade e CRUD de BlocoQuestao

- Area: backend
- Prioridade: P1
- Depende de: TASK-012, TASK-014, TASK-016

Descricao:

Criar cadastro de blocos de questoes com texto-base e/ou anexo.

Aceite:

- `GET /api/blocos-questoes` lista blocos.
- `POST /api/blocos-questoes` cria bloco.
- Bloco aceita texto-base.
- Bloco aceita URL de anexo.
- Bloco pode ser vinculado a disciplina, serie e assunto.

### TASK-023 - Permitir vincular questoes a bloco

- Area: backend
- Prioridade: P1
- Depende de: TASK-020, TASK-022

Descricao:

Permitir que questoes sejam cadastradas ou atualizadas com `blocoQuestaoId`.

Aceite:

- Questao pode possuir bloco.
- Questao pode continuar sem bloco.
- Ao consultar bloco, e possivel visualizar questoes vinculadas.

### TASK-024 - Criar tela de Blocos de Questoes

- Area: frontend
- Prioridade: P1
- Depende de: TASK-022, TASK-023

Descricao:

Criar tela para listar e cadastrar blocos com perguntas vinculadas.

Aceite:

- Tela lista blocos.
- Permite cadastrar bloco com texto-base e anexo URL.
- Permite visualizar questoes do bloco.
- Permite adicionar questao ao bloco.

## Fase 3 - Avaliacoes e Gabaritos

### TASK-025 - Implementar entidade Avaliacao

- Area: backend
- Prioridade: P1
- Depende de: TASK-012, TASK-014

Descricao:

Criar entidade, repository, service, DTOs e controller para avaliacoes.

Aceite:

- `GET /api/avaliacoes` lista avaliacoes.
- `POST /api/avaliacoes` cria avaliacao.
- `GET /api/avaliacoes/{id}` consulta detalhes.
- `PUT /api/avaliacoes/{id}` atualiza dados basicos.
- `DELETE /api/avaliacoes/{id}` arquiva ou remove conforme decisao tecnica.

### TASK-026 - Implementar composicao da avaliacao

- Area: backend
- Prioridade: P1
- Depende de: TASK-020, TASK-023, TASK-025

Descricao:

Permitir adicionar e remover questoes de uma avaliacao.

Aceite:

- `POST /api/avaliacoes/{id}/questoes` adiciona questoes.
- `DELETE /api/avaliacoes/{id}/questoes/{questaoId}` remove questao.
- Composicao preserva ordem.
- Adicionar bloco inclui suas questoes vinculadas.

### TASK-027 - Criar tela de Avaliacoes

- Area: frontend
- Prioridade: P1
- Depende de: TASK-025

Descricao:

Criar tela para listar e cadastrar avaliacoes.

Aceite:

- Tela lista avaliacoes.
- Permite criar avaliacao.
- Formulario seleciona disciplina e serie.
- Estados de loading, erro e vazio estao presentes.

### TASK-028 - Criar tela de detalhe da avaliacao

- Area: frontend
- Prioridade: P1
- Depende de: TASK-026, TASK-027

Descricao:

Criar tela para visualizar avaliacao, adicionar questoes e revisar composicao.

Aceite:

- Tela mostra dados da avaliacao.
- Tela mostra questoes adicionadas.
- Permite buscar e adicionar questoes.
- Permite adicionar bloco inteiro.
- Indica visualmente questoes pertencentes ao mesmo bloco.

### TASK-029 - Implementar gerador de codigo da versao

- Area: backend
- Prioridade: P1
- Depende de: TASK-025

Descricao:

Criar service para gerar codigo alfanumerico unico da versao.

Aceite:

- Codigo possui 6 caracteres.
- Usa alfabeto sem caracteres ambiguos.
- Verifica colisao no banco.
- Possui teste unitario.

### TASK-030 - Implementar entidade AvaliacaoVersao

- Area: backend
- Prioridade: P1
- Depende de: TASK-025, TASK-029

Descricao:

Criar entidade para versoes geradas de uma avaliacao.

Aceite:

- Versao possui codigo unico.
- Versao pertence a uma avaliacao.
- Versao possui data de criacao.
- Repository permite buscar por codigo.

### TASK-031 - Implementar GabaritoItem

- Area: backend
- Prioridade: P1
- Depende de: TASK-020, TASK-030

Descricao:

Criar persistencia dos itens de gabarito de uma versao.

Aceite:

- Cada item possui numero da questao.
- Cada item guarda questao original.
- Cada item guarda letra correta.
- Cada item guarda ordem das alternativas usada na versao.

### TASK-032 - Implementar geracao de versoes da avaliacao

- Area: backend
- Prioridade: P1
- Depende de: TASK-026, TASK-029, TASK-030, TASK-031

Descricao:

Gerar uma ou mais versoes de uma avaliacao, salvando codigo e gabarito.

Aceite:

- `POST /api/avaliacoes/{id}/versoes` cria versoes.
- Quantidade de versoes e parametrizavel.
- Embaralhamento de questoes e opcional.
- Embaralhamento de alternativas e opcional.
- Questoes de um mesmo bloco permanecem juntas.
- Gabarito salvo reflete a ordem final da versao.

### TASK-033 - Consultar versao por codigo

- Area: backend
- Prioridade: P1
- Depende de: TASK-032

Descricao:

Criar endpoint para consultar versao gerada pelo codigo unico.

Aceite:

- `GET /api/avaliacoes/versoes/{codigo}` retorna versao.
- Inclui gabarito da versao.
- Codigo inexistente retorna `404`.

### TASK-034 - Criar tela de versoes da avaliacao

- Area: frontend
- Prioridade: P1
- Depende de: TASK-032, TASK-033

Descricao:

Criar interface para gerar e visualizar versoes de uma avaliacao.

Aceite:

- Tela lista versoes existentes.
- Permite gerar novas versoes.
- Mostra codigo de cada versao.
- Permite consultar detalhes do gabarito.

## Fase 4 - Integracao com Servico de Gabarito

### TASK-035 - Criar client HTTP para servico Python

- Area: backend
- Prioridade: P2
- Depende de: TASK-007

Descricao:

Criar cliente no backend para chamar o servico `gabarito`.

Aceite:

- URL base vem de configuracao.
- Client chama health do servico Python.
- Erros de comunicacao sao tratados.
- Falha de integracao retorna erro adequado ao controller.

### TASK-036 - Preparar endpoint de upload de imagem no backend

- Area: backend
- Prioridade: P2
- Depende de: TASK-035

Descricao:

Criar endpoint para receber imagem de prova e preparar envio ao servico Python.

Aceite:

- `POST /api/correcoes/imagem` aceita multipart.
- Valida arquivo obrigatorio.
- Valida tipo de arquivo basico.
- Retorna resposta inicial controlada.

### TASK-037 - Preparar endpoint de deteccao no servico Python

- Area: gabarito
- Prioridade: P2
- Depende de: TASK-007, TASK-008

Descricao:

Criar contrato inicial para receber imagem e retornar resposta estruturada.

Aceite:

- `POST /correcoes/detectar` aceita multipart.
- Payload sem arquivo retorna erro.
- Resposta segue schema Pydantic.
- Algoritmo real pode ficar como placeholder documentado.

### TASK-038 - Criar tela inicial de Correcao

- Area: frontend
- Prioridade: P2
- Depende de: TASK-036

Descricao:

Criar tela para upload futuro de imagem da prova.

Aceite:

- Tela possui seletor de arquivo.
- Tela possui botao de envio.
- Exibe retorno do backend.
- Trata loading e erro.

## Fase 5 - Geracao de Provas

### TASK-039 - Definir template de prova

- Area: docs, backend
- Prioridade: P2
- Depende de: TASK-032

Descricao:

Documentar e definir o layout inicial da prova no padrao da escola.

Aceite:

- Documento descreve cabecalho da prova.
- Documento define onde aparece o codigo da versao.
- Documento define como blocos de questoes aparecem.
- Documento define estrutura de alternativas.

### TASK-040 - Preparar integracao com JasperReports

- Area: backend
- Prioridade: P2
- Depende de: TASK-039

Descricao:

Adicionar base tecnica para gerar PDF futuramente com JasperReports.

Aceite:

- Dependencias necessarias estao avaliadas ou adicionadas.
- Existe service dedicado para geracao de prova.
- Existe pasta para templates `.jrxml`.
- Endpoint futuro esta planejado/documentado.

### TASK-041 - Gerar PDF inicial de prova

- Area: backend
- Prioridade: P3
- Depende de: TASK-040

Descricao:

Gerar PDF inicial de uma versao de avaliacao.

Aceite:

- Endpoint gera PDF para uma versao.
- PDF exibe codigo da versao.
- PDF exibe questoes na ordem da versao.
- PDF preserva blocos de questoes.
- PDF exibe alternativas na ordem da versao.

## Fase 6 - Relatorios

### TASK-042 - Criar estrutura inicial de relatorios

- Area: backend, frontend
- Prioridade: P3
- Depende de: TASK-032

Descricao:

Preparar endpoints e tela inicial para relatorios futuros.

Aceite:

- Existe rota `/relatorios` no frontend.
- Existe endpoint base de relatorios no backend ou planejamento documentado.
- Tela comunica que relatorios serao baseados em avaliacoes corrigidas.

### TASK-043 - Relatorio por avaliacao

- Area: backend, frontend
- Prioridade: P3
- Depende de: TASK-036, TASK-042

Descricao:

Exibir resumo de desempenho de uma avaliacao corrigida.

Aceite:

- Mostra quantidade de provas corrigidas.
- Mostra media de acertos.
- Mostra questoes com mais erro.
- Mostra assuntos com maior dificuldade.

## Fase 7 - Qualidade e Fechamento da Primeira Versao

### TASK-044 - Criar tratamento global de erros no backend

- Area: backend
- Prioridade: P1
- Depende de: TASK-006

Descricao:

Padronizar respostas de erro da API.

Aceite:

- Erros de validacao retornam `400`.
- Recurso nao encontrado retorna `404`.
- Erros de regra retornam `400` ou `409`.
- Erros inesperados retornam `500`.
- Response de erro possui formato consistente.

### TASK-045 - Criar testes minimos do backend

- Area: backend
- Prioridade: P1
- Depende de: TASK-006, TASK-012, TASK-029, TASK-032

Descricao:

Criar testes automatizados para pontos centrais da API.

Aceite:

- Teste do contexto Spring passa.
- Teste de `/api/health` passa.
- Teste de validacao de payload invalido passa.
- Teste do gerador de codigo passa.
- Teste de preservacao de blocos na geracao de versao passa.

### TASK-046 - Criar testes minimos do frontend

- Area: frontend
- Prioridade: P2
- Depende de: TASK-010, TASK-011

Descricao:

Criar testes basicos para rotas e componentes principais.

Aceite:

- Aplicacao compila.
- Testes das rotas principais passam.
- Teste do HealthService passa.
- Componentes principais renderizam sem erro.

### TASK-047 - Criar testes minimos do servico Python

- Area: gabarito
- Prioridade: P2
- Depende de: TASK-007, TASK-037

Descricao:

Criar testes basicos do FastAPI.

Aceite:

- Teste de `/health` passa.
- Teste de upload sem arquivo retorna erro.
- Testes rodam com `pytest`.

### TASK-048 - Atualizar documentacao de execucao local

- Area: docs, raiz
- Prioridade: P1
- Depende de: TASK-003, TASK-006, TASK-007, TASK-009

Descricao:

Consolidar comandos locais depois que os projetos estiverem executando.

Aceite:

- README possui comando para frontend.
- README possui comando para backend.
- README possui comando para gabarito.
- README possui comando para PostgreSQL.
- README possui links para Swagger e health checks.

### TASK-049 - Validar fluxo local completo

- Area: todos
- Prioridade: P1
- Depende de: TASK-011, TASK-032, TASK-037, TASK-048

Descricao:

Executar validacao manual da primeira versao local.

Aceite:

- PostgreSQL sobe.
- Backend sobe.
- Swagger abre.
- Servico Python sobe.
- Frontend sobe.
- Frontend chama backend.
- Backend possui dados principais funcionando.
- Geracao de versao salva gabarito.

## Ordem Recomendada para Comecar

1. TASK-001 - Revisar estrutura dos projetos
2. TASK-002 - Criar README raiz do projeto
3. TASK-003 - Configurar PostgreSQL local
4. TASK-004 - Configurar application.yml do backend
5. TASK-005 - Implementar Swagger/OpenAPI no backend
6. TASK-006 - Criar health check do backend
7. TASK-007 - Criar health check do servico Python
8. TASK-008 - Configurar requirements do servico Python
9. TASK-009 - Criar rotas iniciais do frontend
10. TASK-010 - Criar layout base do frontend
11. TASK-011 - Criar HealthService no frontend

