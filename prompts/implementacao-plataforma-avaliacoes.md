<task>Implementação da Plataforma de Avaliações com Correção Automatizada</task>

<role>
    Você é um desenvolvedor full stack senior especializado em Angular standalone, Spring Boot com Java 21, Maven, PostgreSQL e serviços Python com FastAPI para visão computacional. Está fazendo a <task> em uma arquitetura com três projetos separados: frontend Angular, backend Spring Boot e serviço Python de gabarito/correção de provas.
</role>

<requirements>
    ### Business

    - Permitir que professores cadastrem e gerenciem um banco de questões
    - Organizar questões por:
        - Disciplina
        - Série/turma
        - Assunto
        - Subassunto
        - Dificuldade
        - Tipo de questão
        - Habilidades/competências, quando aplicável
    - Permitir questões individuais e blocos de questões
    - Um bloco de questões pode conter:
        - Texto de apoio
        - Imagem, tirinha, charge, gráfico, mapa ou outro anexo
        - Duas ou mais perguntas vinculadas ao mesmo material-base
    - Evitar duplicação de imagens/anexos quando várias perguntas usam o mesmo conteúdo-base
    - Permitir montagem de avaliações a partir do banco de questões
    - Permitir geração de múltiplas versões da mesma avaliação
    - Cada versão da avaliação deve possuir um código único alfanumérico, por exemplo com 6 caracteres
    - O sistema deve salvar o gabarito exato de cada versão gerada
    - Futuramente, permitir geração da prova no padrão da escola usando JasperReports
    - Futuramente, permitir correção automática a partir de foto ou scan da prova respondida
    - Exibir resultado da correção com quantidade de acertos, erros e nota
    - Preparar base para relatórios por aluno, turma, avaliação, questão e assunto

    ### Technical

    - Implemente nos projetos existentes:
        - ./frontend
        - ./backend
        - ./gabarito
    - O frontend deve consumir exclusivamente a API do backend
    - O frontend NÃO deve acessar diretamente o serviço Python
    - O backend deve ser o orquestrador da aplicação
    - O backend deve:
        - Expor APIs REST para o frontend
        - Persistir dados em PostgreSQL
        - Validar payloads de entrada
        - Documentar endpoints com Swagger/OpenAPI
        - Preparar integração futura com JasperReports
        - Preparar integração futura com o serviço Python de correção
    - O serviço Python deve:
        - Expor API HTTP com FastAPI
        - Possuir endpoint inicial /health
        - Preparar estrutura para leitura de QR Code/código da prova
        - Preparar estrutura para processamento de imagem com OpenCV
        - Preparar estrutura para identificação de respostas marcadas
    - Não implementar ainda regras complexas de correção, OCR, leitura real de bolhas ou geração final de prova
    - Manter o código limpo, modular e preparado para evolução

    ### Backend

    - Usar Spring Boot com Java 21 e Maven
    - Usar as dependências:
        - Spring Web
        - Spring Validation
        - Spring Data JPA
        - PostgreSQL Driver
        - Lombok
        - Springdoc OpenAPI/Swagger UI
    - Criar estrutura base de packages:
        - config
        - controller
        - domain/model
        - domain/repository
        - dto
        - service
        - exception
        - client
    - Configurar application.yml para desenvolvimento local
    - Preparar CORS para o frontend local
    - Implementar configuração mínima de Swagger/OpenAPI
    - Expor documentação interativa em /swagger-ui.html ou /swagger-ui/index.html
    - Expor especificação OpenAPI em /v3/api-docs
    - Documentar título, descrição e versão da API
    - Agrupar/documentar endpoints por domínio quando fizer sentido
    - Criar endpoint /health ou /api/health para validação inicial
    - Criar entidades iniciais quando fizer sentido, sem excesso de regra:
        - Disciplina
        - Serie
        - Assunto
        - BlocoQuestao
        - Questao
        - Alternativa
        - Avaliacao
        - AvaliacaoVersao
        - Gabarito
    - Usar DTOs para entrada e saída de dados
    - Não expor entidades diretamente quando houver endpoint de negócio

    ### Frontend

    - Usar Angular standalone
    - Organizar o projeto por:
        - core
        - shared
        - features
    - Criar estrutura inicial de features:
        - dashboard
        - banco-questoes
        - avaliacoes
        - correcao
    - Criar serviços Angular para comunicação com o backend
    - Configurar environments para URL da API
    - Criar layout simples, responsivo e profissional
    - Criar telas iniciais ou placeholders úteis para:
        - Dashboard
        - Banco de questões
        - Avaliações
        - Correção
    - Não consumir APIs externas diretamente no frontend
    - Garantir feedback visual básico para carregamento, erro e vazio

    ### Serviço Python

    - Usar Python com FastAPI
    - Usar dependências:
        - fastapi
        - uvicorn
        - opencv-python
        - pyzbar
        - qrcode
        - pillow
        - python-multipart
        - pydantic
    - Criar estrutura:
        - app/main.py
        - app/api
        - app/core
        - app/services
        - tests
    - Criar endpoint GET /health retornando status do serviço
    - Preparar endpoint futuro para upload de imagem de prova
    - Preparar serviço futuro para:
        - detectar código da prova
        - recortar área de respostas
        - identificar marcações
        - retornar respostas detectadas
    - Não implementar ainda algoritmo final de correção

    ### UI/UX

    - Design responsivo
    - Interface simples, clara e organizada
    - Navegação por áreas principais do sistema
    - Priorizar uso real por professora em rotina escolar
    - Evitar aparência de landing page
    - Usar linguagem amigável e objetiva
    - Criar telas de trabalho, não páginas apenas explicativas
    - Garantir que botões, inputs e cards sejam legíveis em desktop e mobile
    - Separar claramente:
        - cadastro de questões
        - montagem de avaliações
        - geração de versões
        - correção
        - relatórios
</requirements>

<architecture>
    ### Visão Geral

    - frontend:
        - Aplicação Angular usada pela professora
        - Responsável por telas, formulários e experiência de uso
        - Comunica-se apenas com o backend

    - backend:
        - API principal da plataforma
        - Responsável por regras de negócio, persistência e orquestração
        - Comunica-se com PostgreSQL
        - Futuramente aciona JasperReports para gerar provas
        - Futuramente aciona o serviço Python para processar imagens

    - gabarito:
        - Serviço Python especializado em visão computacional
        - Responsável por leitura de imagem, QR Code/código e marcações
        - Deve retornar dados estruturados para o backend

    ### Comunicação

    - Frontend -> Backend
    - Backend -> PostgreSQL
    - Backend -> Serviço Python
    - Backend -> JasperReports, futuramente

    ### Regra importante

    - O frontend nunca deve chamar diretamente o serviço Python
    - O serviço Python não deve acessar diretamente o banco principal
    - O backend deve centralizar autorização, persistência e rastreabilidade
</architecture>

<endpoints>
    ### Backend inicial

    GET /swagger-ui.html 200

    - Abre a documentação interativa da API via Swagger UI

    GET /v3/api-docs 200

    - Retorna a especificação OpenAPI da API

    GET /api/health 200

    - Verifica se o backend está online

    GET /api/disciplinas 200

    - Lista disciplinas

    POST /api/disciplinas 201

    - Cria disciplina

    GET /api/questoes 200

    - Lista questões

    POST /api/questoes 201

    - Cria questão individual ou vinculada a bloco

    GET /api/blocos-questoes 200

    - Lista blocos de questões

    POST /api/blocos-questoes 201

    - Cria bloco de questões com texto-base e/ou anexo

    GET /api/avaliacoes 200

    - Lista avaliações

    POST /api/avaliacoes 201

    - Cria avaliação

    POST /api/avaliacoes/{id}/versoes 201

    - Gera versão da avaliação com código único e gabarito salvo

    GET /api/avaliacoes/{id}/versoes/{codigo} 200

    - Consulta versão gerada pelo código

    POST /api/correcoes/imagem 202

    - Futuramente recebe imagem da prova e inicia/processa correção

    ### Serviço Python inicial

    GET /health 200

    - Verifica se o serviço de visão computacional está online

    POST /correcoes/detectar 200

    - Endpoint futuro para receber imagem e retornar marcações detectadas

    ### Status Code

    - 200: Sucesso
    - 201: Criado
    - 202: Aceito para processamento
    - 400: Dados inválidos
    - 404: Recurso não encontrado
    - 409: Conflito de regra ou código duplicado
    - 422: Imagem ou payload não processável
    - 500: Erro interno
    - 502: Erro ao comunicar com serviço externo/interno

    ### Payload exemplo - questão com bloco

    {
        "bloco": {
            "titulo": "Tirinha sobre interpretação textual",
            "textoBase": "Leia a tirinha e responda às questões.",
            "anexoUrl": "https://exemplo.com/tirinha.png"
        },
        "questoes": [
            {
                "enunciado": "Qual é o efeito de humor da tirinha?",
                "dificuldade": "MEDIA",
                "alternativas": [
                    { "texto": "Uso de ambiguidade", "correta": true },
                    { "texto": "Narrador em primeira pessoa", "correta": false },
                    { "texto": "Descrição objetiva", "correta": false },
                    { "texto": "Ausência de diálogo", "correta": false }
                ]
            }
        ]
    }

    ### Payload exemplo - versão da avaliação

    {
        "codigo": "K7D29P",
        "avaliacaoId": 1,
        "questoes": [
            {
                "numero": 1,
                "questaoId": 37,
                "alternativaCorreta": "C"
            },
            {
                "numero": 2,
                "questaoId": 82,
                "alternativaCorreta": "A"
            }
        ]
    }
</endpoints>

<tests>
    ### Validação mínima

    - Rodar testes do backend com Maven
    - Garantir que o backend inicialize com Java 21
    - Fazer curl para /api/health
    - Acessar /swagger-ui.html ou /swagger-ui/index.html no navegador
    - Fazer curl para /v3/api-docs
    - Garantir que os endpoints principais apareçam no Swagger UI
    - Garantir que a configuração de PostgreSQL esteja documentada
    - Rodar aplicação Angular
    - Garantir que o frontend compile sem erros
    - Verificar navegação inicial entre as features
    - Rodar serviço Python com Uvicorn
    - Fazer curl para /health do serviço Python
    - Garantir que requirements.txt ou pyproject esteja correto

    ### Validação futura

    - Criar testes unitários para serviços de questão e avaliação
    - Criar testes de integração para endpoints principais
    - Criar testes de contrato entre backend e serviço Python
    - Criar testes para geração de códigos únicos de versão
    - Criar testes para preservação da ordem interna de blocos de questões
</tests>

<critical>
    ### Skills obrigatórias

    - angular-best-practices — arquitetura standalone, rotas, services, interceptors e organização por features
    - java-springboot — APIs robustas, validação, JPA, Maven e estrutura limpa
    - python-fastapi — serviço HTTP simples, modular e testável
    - computer-vision-opencv — preparação para leitura de imagem e marcações de prova
    - ui-ux-pro-max — experiência responsiva e útil para rotina escolar
    - clean-code — código limpo, consistente e de fácil manutenção
    - swagger-openapi — documentação clara e navegável dos endpoints do backend

    ### Fora do Escopo Inicial

    - *NÃO* implementar OCR completo neste momento
    - *NÃO* implementar algoritmo final de correção de bolhas neste momento
    - *NÃO* implementar geração final com JasperReports neste momento
    - *NÃO* implementar login completo com banco de usuários neste momento
    - *NÃO* utilizar serviços pagos
    - *NÃO* consumir o serviço Python diretamente no frontend
    - *NÃO* duplicar imagens/anexos em questões que pertencem ao mesmo bloco
    - *NÃO* espalhar perguntas de um mesmo bloco pela prova quando houver embaralhamento
    - *NÃO* criar comentários desnecessários no código
</critical>
