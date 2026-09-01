# Servico de Gabarito

Servico Python com FastAPI para preparar a leitura futura de codigos, QR Codes e respostas marcadas em provas.

## Executar Localmente

```bash
py -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8001
```

## Endpoints

- `GET /health`: verifica se o servico esta online.

## Escopo Atual

Esta primeira versao possui apenas a fundacao do servico. A deteccao real de imagem, QR Code e respostas marcadas sera implementada nas proximas fases.
