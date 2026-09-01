import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ApiStatusResponse, HealthService } from '../../core/services/health.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="dashboard-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Visão geral da plataforma</span>
          <h1>Bom dia, professora Helena</h1>
          <p>Acompanhe provas, banco de questões e correções em um único painel.</p>
        </div>

        <div class="header-actions">
          <button type="button" class="ghost-button">Semana</button>
          <a class="primary-button" routerLink="/avaliacoes">Nova avaliação</a>
        </div>
      </header>

      <div class="kpi-grid">
        <article class="kpi-card accent">
          <span>Backend</span>
          <strong [class.ok]="backendStatus?.status === 'UP'">
            {{ loading ? 'Verificando' : backendStatus?.status || 'Indisponivel' }}
          </strong>
          <p>{{ errorMessage || 'API pronta para os cadastros base.' }}</p>
        </article>

        <article class="kpi-card">
          <span>Questões cadastradas</span>
          <strong>0</strong>
          <p>Próxima etapa do banco de questões.</p>
        </article>

        <article class="kpi-card">
          <span>Avaliações</span>
          <strong>0</strong>
          <p>Monte provas com versões e códigos.</p>
        </article>

        <article class="kpi-card">
          <span>Correções</span>
          <strong>0</strong>
          <p>Serviço de visão computacional em preparo.</p>
        </article>
      </div>

      <div class="workbench-grid">
        <section class="workbench-card wide">
          <div class="section-title">
            <span>Fluxo principal</span>
            <strong>Preparar avaliação</strong>
          </div>

          <div class="timeline">
            <article>
              <span>01</span>
              <div>
                <strong>Organizar disciplinas</strong>
                <p>Base para séries, assuntos, questões e blocos.</p>
              </div>
            </article>
            <article>
              <span>02</span>
              <div>
                <strong>Criar banco de questões</strong>
                <p>Questões isoladas ou vinculadas a blocos com imagem/texto.</p>
              </div>
            </article>
            <article>
              <span>03</span>
              <div>
                <strong>Gerar e corrigir provas</strong>
                <p>Versões identificadas por código e gabarito salvo.</p>
              </div>
            </article>
          </div>
        </section>

        <section class="workbench-card compact">
          <div class="section-title">
            <span>Qualidade</span>
            <strong>Banco inicial</strong>
          </div>

          <div class="meter">
            <span></span>
          </div>
          <p>Comece pelos cadastros simples antes de ativar regras de prova e correção.</p>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .dashboard-page { gap: 18px; }
    .eyebrow, .kpi-card span, .section-title span {
      letter-spacing: 0.04em;
    }
    .header-actions { display: flex; gap: 10px; flex: 0 0 auto; }
    button, .primary-button { min-height: 38px; padding: 0 14px; border-radius: var(--pa-radius-sm); font-weight: 800; }
    .primary-button { display: inline-flex; align-items: center; color: #ffffff; text-decoration: none; }
    .ghost-button { border: 1px solid var(--pa-border); color: var(--pa-ink); background: var(--pa-panel-soft); }
    .primary-button { border: 0; color: #ffffff; background: var(--pa-accent); }
    .kpi-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 10px; }
    .kpi-card {
      display: grid;
      gap: 8px;
      min-height: 132px;
      padding: 16px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-lg);
      background: var(--pa-panel-soft);
    }
    .kpi-card.accent { color: #ffffff; border-color: transparent; background: var(--pa-ink); }
    .kpi-card.accent span, .kpi-card.accent p { color: rgba(255, 255, 255, 0.76); }
    .kpi-card strong { font-size: 1.45rem; line-height: 1; }
    .kpi-card .ok { color: var(--pa-accent-bright); }
    .workbench-grid { display: grid; grid-template-columns: minmax(0, 1.6fr) minmax(250px, 0.8fr); gap: 10px; }
    .workbench-card {
      display: grid;
      gap: 14px;
      padding: 16px;
      background: #ffffff;
    }
    .section-title { display: grid; gap: 6px; }
    .timeline { display: grid; gap: 12px; }
    .timeline article { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 12px; align-items: start; padding: 12px; border-radius: var(--pa-radius-md); background: var(--pa-panel-soft); }
    .timeline article > span { display: grid; width: 30px; height: 30px; place-items: center; border-radius: var(--pa-radius-sm); color: #ffffff; background: var(--pa-accent); font-size: 0.8rem; font-weight: 800; }
    .timeline strong { display: block; margin-bottom: 4px; }
    .meter { height: 12px; overflow: hidden; border-radius: 999px; background: var(--pa-accent-soft); }
    .meter span { display: block; width: 36%; height: 100%; border-radius: inherit; background: var(--pa-accent); }

    @media (max-width: 980px) {
      .kpi-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .workbench-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 620px) {
      .header-actions { width: 100%; }
      .header-actions button { flex: 1; }
      .kpi-grid { grid-template-columns: 1fr; }
      .timeline article { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  backendStatus?: ApiStatusResponse;
  loading = true;
  errorMessage = '';

  constructor(private readonly healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.getBackendStatus().subscribe({
      next: (status) => {
        this.backendStatus = status;
        this.loading = false;
      },
      error: () => {
        this.errorMessage = 'Não foi possível consultar o backend.';
        this.loading = false;
      }
    });
  }
}
