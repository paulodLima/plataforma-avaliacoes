# PRD - Plataforma de Avaliacoes

## 1. Visao Geral

A Plataforma de Avaliacoes e um sistema para ajudar professores a criar, organizar, gerar, aplicar e corrigir provas com menos trabalho manual.

O produto nasce com foco em uma professora que precisa manter um banco de questoes, montar avaliacoes por assunto e serie, gerar provas com versoes diferentes e, futuramente, corrigir respostas automaticamente a partir de uma foto ou scan da prova.

O sistema sera dividido em tres aplicacoes:

- `frontend`: interface web em Angular para uso da professora.
- `backend`: API principal em Spring Boot com Java 21, responsavel por regras de negocio, banco de dados e integracoes.
- `gabarito`: servico Python com FastAPI para processamento de imagens e apoio a correcao automatizada.

## 2. Problema

Professores gastam muito tempo em tarefas repetitivas relacionadas a avaliacoes:

- montar provas manualmente;
- reutilizar questoes antigas sem organizacao clara;
- copiar imagens e textos de apoio varias vezes;
- criar versoes diferentes da mesma prova;
- montar e guardar gabaritos;
- corrigir provas uma por uma;
- consolidar resultados por aluno, turma e assunto.

Esse processo e demorado, propenso a erros e dificulta acompanhar quais conteudos precisam de reforco.

## 3. Objetivos

### Objetivos do Produto

- Centralizar o banco de questoes da professora.
- Permitir autenticacao basica para acesso ao sistema.
- Permitir cadastrar a escola e seus dados institucionais para uso nas provas.
- Permitir cadastrar e manter os dados da professora responsavel.
- Permitir cadastro de questoes individuais e blocos de questoes com texto/imagem compartilhados.
- Facilitar a montagem de avaliacoes por disciplina, serie, turma, assunto e dificuldade.
- Gerar versoes diferentes de uma mesma avaliacao.
- Salvar o gabarito exato de cada versao gerada.
- Preparar a base para gerar provas no padrao da escola.
- Preparar a base para correcao automatizada por foto ou scan.
- Gerar resultados de acertos, erros e nota.
- Futuramente, gerar relatorios pedagogicos por turma, aluno, questao e assunto.

### Objetivos Tecnicos

- Manter arquitetura separada entre frontend, backend e servico de visao computacional.
- Garantir que o frontend consuma apenas o backend.
- Usar PostgreSQL como banco principal.
- Documentar APIs do backend com Swagger/OpenAPI.
- Criar um esqueleto evolutivo, limpo e facil de manter.

## 4. Publico-Alvo

### Usuario Principal

Professora do ensino fundamental ou medio que cria e corrige provas com frequencia.

### Usuario Administrador Inicial

Usuario responsavel por cadastrar a escola e criar o acesso inicial da professora.

### Usuarios Futuros

- Outros professores da escola.
- Coordenadores pedagogicos.
- Secretaria escolar, caso haja necessidade de consulta a relatorios.
- Alunos ou responsaveis, em uma fase futura, caso o sistema passe a exibir resultados individualmente.

## 5. Personas

### Professora

Precisa montar avaliacoes rapidamente, reaproveitar questoes confiaveis e reduzir o tempo de correcao.

Dores principais:

- perde tempo procurando questoes antigas;
- precisa adaptar provas para diferentes turmas;
- quer reduzir cola criando versoes diferentes;
- demora muito para corrigir provas objetivas;
- tem dificuldade para enxergar quais assuntos a turma errou mais.

### Escola

Precisa manter uma identidade institucional minima para que as provas geradas saiam com dados corretos de nome, sigla, endereco e elementos visuais.

Dores principais:

- cabecalhos de prova sao montados manualmente;
- logo, nome e sigla da escola ficam inconsistentes entre documentos;
- faltam dados institucionais centralizados para reaproveitar nas provas.

### Coordenador Pedagogico

Precisa acompanhar o desempenho das turmas e entender lacunas de aprendizagem.

Dores principais:

- depende de consolidacao manual dos professores;
- nao tem visao rapida por habilidade, serie ou assunto;
- recebe dados tarde demais para agir.

## 6. Escopo Inicial

O primeiro ciclo do produto deve criar uma base funcional, sem implementar ainda as partes mais complexas de visao computacional e geracao final de prova.

### Dentro do Escopo Inicial

- Login basico com nome, email, telefone e senha.
- Cadastro de escola com dados institucionais basicos.
- Cadastro de professor vinculado ao acesso da aplicacao.
- Cadastro e listagem de disciplinas.
- Cadastro e listagem de series/turmas.
- Cadastro e listagem de assuntos.
- Cadastro de questoes objetivas.
- Cadastro de alternativas com uma resposta correta.
- Cadastro de blocos de questoes com texto-base e/ou imagem/anexo.
- Vinculo de uma ou mais questoes a um mesmo bloco.
- Criacao de avaliacoes.
- Selecao manual de questoes para uma avaliacao.
- Geracao de versao da avaliacao com codigo unico.
- Persistencia do gabarito da versao.
- Endpoint de saude do backend.
- Endpoint de saude do servico Python.
- Swagger/OpenAPI no backend.
- Interface inicial com navegacao entre areas principais.

### Fora do Escopo Inicial

- OCR completo.
- Correcao real de bolhas ou marcacoes.
- Identificacao precisa de respostas em imagens reais.
- Geracao final de PDF com JasperReports.
- Controle avancado de perfis e permissoes.
- Importacao automatica de questoes por IA.
- Portal do aluno.
- Relatorios pedagogicos avancados.
- Integracao com sistemas escolares externos.

## 7. Principios do Produto

- O sistema deve economizar tempo da professora.
- O fluxo deve ser simples o suficiente para uso em rotina escolar.
- Questoes com texto/imagem compartilhados devem ser tratadas como blocos.
- Um bloco de questoes deve permanecer junto na prova.
- O gabarito precisa ser rastreavel por versao da avaliacao.
- O codigo da prova deve permitir identificar exatamente qual gabarito usar.
- O backend deve centralizar regras, persistencia e integracoes.
- O frontend deve ser claro, responsivo e orientado a tarefa.
- O servico Python deve ser especializado em imagem, sem assumir regras de negocio principais.

## 8. Jornada Principal

### Fluxo 0 - Acesso e Identificacao Institucional

1. O usuario acessa a tela de login.
2. Informa email ou telefone e senha.
3. Acessa o sistema com seu cadastro de professor.
4. Mantem os dados da escola e do professor atualizados.
5. Ao gerar a prova, o sistema reutiliza nome, sigla, endereco, logo e identificacao da professora.

### Fluxo 1 - Cadastro do Banco de Questoes

1. A professora acessa o banco de questoes.
2. Escolhe cadastrar uma questao individual ou um bloco de questoes.
3. Informa disciplina, serie, assunto, dificuldade e tipo.
4. Se for bloco, adiciona texto-base e/ou imagem de apoio.
5. Cadastra uma ou mais perguntas vinculadas ao bloco.
6. Define alternativas e resposta correta.
7. Salva a questao ou o bloco.

### Fluxo 2 - Montagem da Avaliacao

1. A professora cria uma nova avaliacao.
2. Informa nome, disciplina, serie/turma e periodo.
3. Seleciona questoes individuais e blocos de questoes.
4. Revisa a composicao da prova.
5. Salva a avaliacao.

### Fluxo 3 - Geracao de Versao

1. A professora abre uma avaliacao.
2. Solicita a geracao de uma ou mais versoes.
3. O sistema gera um codigo unico para cada versao.
4. O sistema define a ordem das questoes e alternativas.
5. O sistema salva o gabarito exato daquela versao.
6. O sistema reutiliza dados da escola e do professor no cabecalho da prova.
7. Futuramente, o sistema gera o PDF da prova no padrao da escola.

### Fluxo 4 - Correcao Futura por Imagem

1. A professora fotografa ou escaneia a prova respondida.
2. O backend recebe a imagem.
3. O backend envia a imagem para o servico Python.
4. O servico Python identifica o codigo da prova.
5. O servico Python detecta as respostas marcadas.
6. O backend compara respostas detectadas com o gabarito salvo.
7. O sistema retorna acertos, erros e nota.

## 9. Requisitos Funcionais

### RF01 - Gerenciar Disciplinas

O sistema deve permitir criar, listar, editar e inativar disciplinas.

### RF00 - Autenticar Usuario

O sistema deve permitir login com credencial identificada por email ou telefone e senha.

### RF00B - Gerenciar Escola

O sistema deve permitir cadastrar e editar os dados institucionais da escola usados nas provas.

Dados minimos esperados:

- nome da escola;
- sigla ou abreviacao, por exemplo `SEDUC`;
- logo;
- endereco;
- estado;
- cidade;
- telefone e outros campos uteis definidos na implementacao.

### RF00C - Gerenciar Professor

O sistema deve permitir cadastrar e editar dados da professora responsavel, incluindo nome, email, telefone e senha.

### RF00D - Reutilizar Dados Institucionais na Prova

Ao gerar uma prova, o sistema deve conseguir recuperar dados da escola e do professor para preencher o cabecalho e a identificacao do documento.

### RF02 - Gerenciar Series/Turmas

O sistema deve permitir criar, listar, editar e inativar series ou turmas.

### RF03 - Gerenciar Assuntos

O sistema deve permitir organizar assuntos por disciplina e serie.

### RF04 - Cadastrar Questao Individual

O sistema deve permitir cadastrar questoes objetivas com enunciado, alternativas, resposta correta, dificuldade e metadados pedagogicos.

### RF05 - Cadastrar Bloco de Questoes

O sistema deve permitir criar um bloco com texto-base, imagem/anexo opcional e multiplas questoes vinculadas.

### RF06 - Preservar Blocos na Avaliacao

Ao montar ou embaralhar uma avaliacao, o sistema deve manter juntas as questoes de um mesmo bloco.

### RF07 - Criar Avaliacao

O sistema deve permitir criar uma avaliacao com nome, disciplina, serie/turma, periodo e lista de questoes.

### RF08 - Gerar Versao da Avaliacao

O sistema deve gerar uma versao da avaliacao com codigo unico alfanumerico.

### RF09 - Salvar Gabarito da Versao

O sistema deve salvar a ordem das questoes, a ordem das alternativas e a resposta correta de cada questao para cada versao gerada.

### RF10 - Consultar Versao por Codigo

O sistema deve permitir consultar uma versao de avaliacao pelo codigo unico.

### RF11 - Preparar Geracao de Prova

O sistema deve deixar preparada a estrutura para futura geracao de PDF com JasperReports.

### RF12 - Preparar Correcao por Imagem

O sistema deve deixar preparada a comunicacao entre backend e servico Python para futura correcao automatizada.

### RF13 - Health Check

O backend e o servico Python devem possuir endpoints de saude.

### RF14 - Documentacao da API

O backend deve expor documentacao interativa via Swagger/OpenAPI.

## 10. Requisitos Nao Funcionais

### RNF01 - Arquitetura

O sistema deve manter frontend, backend e servico Python como projetos separados.

### RNF02 - Manutenibilidade

O codigo deve ser organizado por camadas, com responsabilidades claras.

### RNF03 - Escalabilidade Evolutiva

A arquitetura deve permitir incluir novas disciplinas, tipos de questao, relatorios e formas de correcao sem grandes reescritas.

### RNF04 - Performance

Listagens e consultas principais devem responder rapidamente em ambiente local e escolar.

### RNF05 - Rastreabilidade

Toda versao de avaliacao deve poder ser rastreada pelo codigo unico e pelo gabarito salvo.

### RNF06 - Confiabilidade

O sistema nao deve perder o gabarito de uma prova ja gerada, mesmo que a questao original seja editada posteriormente.

### RNF07 - Usabilidade

A interface deve ser responsiva, simples e adequada para uso frequente.

### RNF08 - Seguranca Basica

Senhas nao devem ser persistidas em texto puro e o backend deve centralizar a autenticacao do acesso.

### RNF08 - Documentacao

O projeto deve possuir README raiz, documentacao de arquitetura e Swagger no backend.

## 11. Modelo Conceitual

### Disciplina

Representa uma materia escolar, como Portugues, Matematica ou Historia.

### Serie/Turma

Representa o publico da avaliacao, como 8o ano, 1a serie EM ou 3o B.

### Assunto

Representa o conteudo pedagogico, como Interpretacao de Texto, Equacoes ou Revolucao Francesa.

### BlocoQuestao

Representa um conjunto de apoio compartilhado por uma ou mais questoes. Pode conter texto, imagem, tirinha, charge, grafico, mapa ou anexo.

### Questao

Representa uma pergunta individual, que pode estar isolada ou vinculada a um bloco.

### Alternativa

Representa uma opcao de resposta de uma questao objetiva.

### Avaliacao

Representa a prova planejada pela professora.

### AvaliacaoVersao

Representa uma versao gerada da avaliacao, com codigo unico, ordem propria de questoes e gabarito salvo.

### Correcao

Representa o resultado da comparacao entre respostas detectadas e gabarito da versao.

## 12. Regras de Negocio

### RN01 - Codigo Unico da Prova

Cada versao de avaliacao deve possuir um codigo unico alfanumerico.

### RN02 - Gabarito Imutavel por Versao

Depois que uma versao for gerada, o gabarito daquela versao nao deve mudar automaticamente se a questao original for editada.

### RN03 - Blocos Permanecem Agrupados

Questoes vinculadas ao mesmo bloco devem permanecer juntas na prova.

### RN04 - Uma Alternativa Correta

No escopo inicial, cada questao objetiva deve possuir exatamente uma alternativa correta.

### RN05 - Frontend Isolado das Integracoes

O frontend deve consumir apenas o backend.

### RN06 - Backend como Orquestrador

O backend deve coordenar acesso ao banco, geracao futura de prova e chamada futura ao servico Python.

## 13. Integracoes

### PostgreSQL

Banco principal para armazenar cadastros, avaliacoes, versoes e gabaritos.

### Swagger/OpenAPI

Documentacao interativa dos endpoints do backend.

URLs esperadas:

- `/swagger-ui.html`
- `/swagger-ui/index.html`
- `/v3/api-docs`

### JasperReports

Integracao futura para gerar PDF da prova no padrao visual da escola.

### Servico Python de Gabarito

Integracao futura para processar imagem da prova, identificar codigo e detectar respostas marcadas.

## 14. Experiencia do Usuario

### Areas Principais

- Dashboard
- Banco de questoes
- Blocos de questoes
- Avaliacoes
- Versoes geradas
- Correcao
- Relatorios futuros

### Diretrizes de Interface

- Layout responsivo.
- Navegacao simples.
- Telas orientadas a tarefas reais.
- Formularios claros.
- Feedback visual para sucesso, erro, carregamento e vazio.
- Nomes de campos proximos da linguagem escolar.
- Evitar excesso de informacao em uma unica tela.

## 15. Metricas de Sucesso

- Tempo para cadastrar uma questao.
- Tempo para montar uma avaliacao.
- Quantidade de questoes reutilizadas.
- Quantidade de avaliacoes geradas.
- Reducao estimada do tempo de correcao.
- Percentual de provas corrigidas automaticamente em fase futura.
- Clareza dos relatorios por turma e assunto.

## 16. Roadmap

### Fase 1 - Fundacao

- Estrutura dos tres projetos.
- Health checks.
- PostgreSQL configurado.
- Swagger no backend.
- Layout inicial do frontend.
- Cadastro inicial de disciplinas, series, assuntos, questoes e blocos.

### Fase 2 - Avaliacoes

- Criacao de avaliacoes.
- Selecao de questoes.
- Geracao de versoes.
- Codigo unico da prova.
- Persistencia do gabarito da versao.

### Fase 3 - Geracao de Prova

- Template JasperReports.
- Geracao de PDF.
- Inclusao de codigo da versao na prova.
- Suporte a blocos com imagem/texto.

### Fase 4 - Correcao Automatizada

- Upload de imagem.
- Deteccao de codigo da prova.
- Processamento inicial com OpenCV.
- Comparacao com gabarito.
- Resultado de acertos, erros e nota.

### Fase 5 - Relatorios

- Resultado por aluno.
- Resultado por turma.
- Resultado por questao.
- Resultado por assunto.
- Indicadores para reforco pedagogico.

## 17. Riscos e Cuidados

- A leitura automatica por imagem pode variar muito conforme iluminacao, angulo e qualidade da foto.
- A prova impressa precisa ter marcadores visuais ou padrao claro para facilitar processamento futuro.
- O codigo da prova precisa ser facil de localizar e ler.
- Alteracoes em questoes antigas nao podem quebrar gabaritos ja gerados.
- Imagens/anexos precisam ser armazenados de forma organizada.
- A interface deve continuar simples mesmo com muitas opcoes pedagogicas.

## 18. Perguntas em Aberto

- O sistema sera usado por apenas uma professora ou por varios professores?
- Havera controle de escola, unidade ou coordenacao?
- As provas terao apenas questoes objetivas no inicio?
- O codigo da prova sera QR Code, texto alfanumerico ou ambos?
- A correcao sera feita por folha de respostas separada ou na propria prova?
- A escola possui um modelo fixo de prova para o JasperReports?
- Sera necessario cadastrar alunos ja na primeira versao?
- As imagens/anexos serao salvos localmente, em banco ou em armazenamento externo?

## 19. Criterios de Aceite da Primeira Entrega

- O frontend possui navegacao inicial entre as areas principais.
- O backend inicializa com Java 21.
- O backend conecta ou esta preparado para conectar ao PostgreSQL.
- O backend expoe Swagger/OpenAPI.
- O backend possui endpoint de health.
- O servico Python inicializa com FastAPI.
- O servico Python possui endpoint de health.
- O projeto possui documentacao minima para executar localmente.
- Existe estrutura inicial para questoes individuais e blocos de questoes.
- Existe estrutura inicial para avaliacoes, versoes e gabaritos.

