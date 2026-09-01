# Plataforma de Avaliacoes

Sistema para ajudar professores a montar banco de questoes, criar avaliacoes, gerar versoes com gabarito rastreavel e preparar a correcao automatizada por imagem.

## Projetos

- `frontend/plataformaavaliacoes-frontend`: aplicacao Angular 19 standalone.
- `backend`: API Spring Boot com Java 21, Maven, PostgreSQL e Swagger/OpenAPI.
- `gabarito`: servico Python com FastAPI para visao computacional e leitura futura de provas.

## Portas Locais

- Frontend: `http://localhost:4200`
- Backend: `http://localhost:8080`
- Swagger: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`
- Gabarito: `http://localhost:8001`
- PostgreSQL: `localhost:5432`

## Banco de Dados

Subir PostgreSQL:

```bash
docker compose up -d postgres
```

Banco padrao:

```text
database: plataforma_avaliacoes
user: postgres
password: postgres
```

## Backend

Requisito: Java 21.

```bash
cd backend
./mvnw spring-boot:run
```

Health:

```bash
curl http://localhost:8080/api/health
```

## Frontend

```bash
cd frontend/plataformaavaliacoes-frontend
npm install
npm start
```

## Servico Python

```bash
cd gabarito
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

Health:

```bash
curl http://localhost:8001/health
```

## Documentacao

- `docs/PRD-plataforma-avaliacoes.md`
- `docs/TECHSPEC-plataforma-avaliacoes.md`
- `docs/TASKS-plataforma-avaliacoes.md`
- `prompts/implementacao-plataforma-avaliacoes.md`
