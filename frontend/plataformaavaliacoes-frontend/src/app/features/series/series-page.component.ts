import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { SerieService } from '../../core/services/serie.service';
import { Serie } from '../../shared/models/serie.model';

@Component({
  selector: 'app-series-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="series-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Cadastro base</span>
          <h1>Series</h1>
          <p>Defina os anos e segmentos que serao usados em assuntos, questoes e avaliacoes.</p>
        </div>

        <div class="summary-pill">
          <span>{{ series.length }}</span>
          <strong>series cadastradas</strong>
        </div>
      </header>

      @if (mensagemErro || mensagemSucesso) {
        <div class="feedback" [class.error]="mensagemErro" [class.success]="mensagemSucesso">
          {{ mensagemErro || mensagemSucesso }}
        </div>
      }

      <div class="workspace-grid">
        <section class="panel">
          <div class="panel-heading">
            <div>
              <span>Organizacao escolar</span>
              <h2>Lista de series</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarSeries()" [disabled]="carregando" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregando) {
            <div class="state">Carregando series...</div>
          } @else if (!series.length) {
            <div class="state">Nenhuma serie cadastrada ainda.</div>
          } @else {
            <div class="series-list">
              @for (serie of series; track serie.id) {
                <article
                  class="serie-row"
                  [class.selected]="serieSelecionada?.id === serie.id"
                  [class.inactive]="!serie.ativo"
                >
                  <button type="button" class="row-main" (click)="editar(serie)">
                    <span class="row-badge">{{ serie.nome.slice(0, 2).toUpperCase() }}</span>
                    <span>
                      <strong>{{ serie.nome }}</strong>
                      <small>{{ serie.ativo ? 'Ativa para cadastros' : 'Inativa' }}</small>
                    </span>
                  </button>

                  <div class="row-actions">
                    <button type="button" class="text-button" (click)="editar(serie)">Editar</button>
                    <button
                      type="button"
                      class="danger-button"
                      [disabled]="!serie.ativo"
                      (click)="inativar(serie)"
                    >
                      Inativar
                    </button>
                  </div>
                </article>
              }
            </div>
          }
        </section>

        <section class="panel detail-panel">
          <div class="panel-heading">
            <div>
              <span>{{ serieSelecionada ? 'Edicao' : 'Novo cadastro' }}</span>
              <h2>{{ serieSelecionada ? 'Editar serie' : 'Nova serie' }}</h2>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()">
            <label for="nome">Nome da serie</label>
            <input id="nome" type="text" formControlName="nome" placeholder="Ex: 6o ano" />

            @if (form.controls.nome.invalid && form.controls.nome.touched) {
              <small class="field-error">Informe o nome da serie com ate 120 caracteres.</small>
            }

            @if (serieSelecionada) {
              <label class="checkbox">
                <input type="checkbox" formControlName="ativo" />
                Serie ativa
              </label>
            }

            <div class="form-actions">
              @if (serieSelecionada) {
                <button type="button" class="ghost-button" (click)="cancelarEdicao()">Cancelar</button>
              }
              <button type="submit" class="primary-button" [disabled]="salvando">
                {{ salvando ? 'Salvando...' : 'Salvar serie' }}
              </button>
            </div>
          </form>

          <div class="guide-card">
            <span>Proximo passo</span>
            <strong>Assuntos</strong>
            <p>Depois das series, vamos vincular cada assunto a uma disciplina e a uma serie.</p>
          </div>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .series-page { gap: 18px; }
    .eyebrow, .panel-heading span, .guide-card span {
      letter-spacing: 0.04em;
    }
    .summary-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      min-height: 40px;
      padding: 0 13px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .summary-pill span {
      display: grid;
      width: 32px;
      height: 32px;
      place-items: center;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-accent);
      font-weight: 900;
    }
    .summary-pill strong { color: var(--pa-muted-strong); font-size: 0.9rem; }
    .feedback {
      padding: 12px 14px;
      font-weight: 800;
    }
    .feedback.error { color: #7a271a; background: #ffebe6; }
    .feedback.success { color: #075e45; background: #dcfae6; }
    .workspace-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.75fr); gap: 10px; align-items: start; }
    .panel {
      display: grid;
      gap: 14px;
      padding: 16px;
    }
    .panel-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .icon-button {
      width: 42px;
      height: 42px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
      font-size: 0.72rem;
      font-weight: 900;
    }
    .state {
      padding: 18px;
      color: var(--pa-muted);
      background: var(--pa-panel-soft);
    }
    .series-list { display: grid; gap: 10px; }
    .serie-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .serie-row.selected {
      border-color: rgba(79, 163, 138, 0.55);
      background: var(--pa-accent-soft);
    }
    .serie-row.inactive { opacity: 0.66; }
    .row-main {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      padding: 0;
      border: 0;
      color: inherit;
      text-align: left;
      background: transparent;
    }
    .row-badge {
      display: grid;
      flex: 0 0 auto;
      width: 42px;
      height: 42px;
      place-items: center;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-slate);
      font-size: 0.76rem;
      font-weight: 900;
    }
    .row-main strong,
    .row-main small {
      display: block;
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .row-main small {
      margin-top: 4px;
      color: var(--pa-muted);
      font-weight: 700;
    }
    .row-actions { display: flex; gap: 8px; }
    .text-button,
    .danger-button,
    .ghost-button,
    .primary-button {
      min-height: 38px;
      padding: 0 13px;
      border-radius: var(--pa-radius-sm);
      font-weight: 800;
    }
    .text-button,
    .ghost-button {
      border: 1px solid var(--pa-border);
      color: var(--pa-ink);
      background: #ffffff;
    }
    .danger-button {
      border: 0;
      color: #ffffff;
      background: var(--pa-danger);
    }
    button:disabled { opacity: 0.55; }
    form { display: grid; gap: 12px; }
    label { color: var(--pa-muted-strong); font-weight: 800; }
    input[type="text"] {
      width: 100%;
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
    }
    input[type="text"]:focus {
      border-color: var(--pa-accent);
      outline: 3px solid rgba(79, 163, 138, 0.16);
    }
    .field-error { color: var(--pa-danger); font-weight: 700; }
    .checkbox { display: flex; align-items: center; gap: 10px; }
    .checkbox input { width: 18px; height: 18px; accent-color: var(--pa-accent); }
    .form-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 6px; }
    .primary-button { border: 0; color: #ffffff; background: var(--pa-accent); }
    .guide-card {
      display: grid;
      gap: 8px;
      margin-top: 4px;
      padding: 16px;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-ink);
    }
    .guide-card span,
    .guide-card p { color: rgba(255, 255, 255, 0.76); }

    @media (max-width: 980px) {
      .summary-pill { width: 100%; }
      .workspace-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .serie-row { grid-template-columns: 1fr; }
      .row-actions { justify-content: flex-start; flex-wrap: wrap; }
      .form-actions { flex-direction: column-reverse; }
      .form-actions button { width: 100%; }
    }
  `]
})
export class SeriesPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  series: Serie[] = [];
  serieSelecionada?: Serie;
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    ativo: [true]
  });

  constructor(private readonly serieService: SerieService) {}

  ngOnInit(): void {
    this.carregarSeries();
  }

  carregarSeries(exibirCarregamento = true, limparFeedback = true): void {
    this.carregando = exibirCarregamento;

    if (limparFeedback) {
      this.limparMensagens();
    }

    this.serieService.listar()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (series) => this.series = series,
        error: () => this.mensagemErro = 'Nao foi possivel carregar as series.'
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.salvando = true;
    this.limparMensagens();

    const payload = this.form.getRawValue();
    const request$ = this.serieSelecionada
      ? this.serieService.atualizar(this.serieSelecionada.id, payload)
      : this.serieService.criar({ nome: payload.nome });

    request$
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = this.serieSelecionada
            ? 'Serie atualizada com sucesso.'
            : 'Serie cadastrada com sucesso.';
          this.cancelarEdicao();
          this.carregarSeries(false, false);
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Nao foi possivel salvar a serie.';
        }
      });
  }

  editar(serie: Serie): void {
    this.serieSelecionada = serie;
    this.limparMensagens();
    this.form.setValue({
      nome: serie.nome,
      ativo: serie.ativo
    });
  }

  cancelarEdicao(): void {
    this.serieSelecionada = undefined;
    this.form.reset({
      nome: '',
      ativo: true
    });
  }

  inativar(serie: Serie): void {
    this.limparMensagens();

    this.serieService.inativar(serie.id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Serie inativada com sucesso.';
        this.carregarSeries(false, false);
      },
      error: () => this.mensagemErro = 'Nao foi possivel inativar a serie.'
    });
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
