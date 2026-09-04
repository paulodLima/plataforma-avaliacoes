import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';
import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { SerieService } from '../../core/services/serie.service';
import { Avaliacao } from '../../shared/models/avaliacao.model';
import { Disciplina } from '../../shared/models/disciplina.model';
import { Serie } from '../../shared/models/serie.model';

@Component({
  selector: 'app-avaliacoes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="avaliacoes-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Montagem de provas</span>
          <h1>Avaliações</h1>
          <p>Crie avaliações, acompanhe a composição e prepare versões a partir do banco de questões.</p>
        </div>

        <div class="summary-strip" aria-label="Resumo das avaliações">
          <article>
            <span>Total</span>
            <strong>{{ avaliacoes.length }}</strong>
          </article>
          <article>
            <span>Questões</span>
            <strong>{{ totalQuestoes }}</strong>
          </article>
        </div>
      </header>

      @if (mensagemErro || mensagemSucesso) {
        <div class="feedback" [class.error]="mensagemErro" [class.success]="mensagemSucesso">
          {{ mensagemErro || mensagemSucesso }}
        </div>
      }

      <div class="workspace-grid">
        <section class="panel list-panel">
          <div class="panel-heading">
            <div>
              <span>Listagem</span>
              <h2>Avaliações cadastradas</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarAvaliacoes()" [disabled]="carregando" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregando) {
            <div class="state">Carregando avaliações...</div>
          } @else if (!avaliacoes.length) {
            <div class="state empty-state">
              <strong>Nenhuma avaliação cadastrada.</strong>
              <p>Preencha o formulário ao lado para iniciar a primeira prova.</p>
            </div>
          } @else {
            <div class="avaliacoes-list">
              @for (avaliacao of avaliacoes; track avaliacao.id) {
                <article class="avaliacao-row">
                  <a class="row-main" [routerLink]="['/avaliacoes', avaliacao.id]">
                    <span class="row-badge">{{ initials(avaliacao.titulo) }}</span>
                    <span>
                      <strong>{{ avaliacao.titulo }}</strong>
                      <small>
                        {{ getDisciplinaNome(avaliacao.disciplinaId) }} | {{ getSerieNome(avaliacao.serieId) }}
                        @if (avaliacao.periodo) {
                          | {{ avaliacao.periodo }}
                        }
                      </small>
                    </span>
                  </a>

                  <div class="row-meta">
                    <span>{{ avaliacao.status }}</span>
                    <strong>{{ avaliacao.questoes.length }}</strong>
                    <small>questões</small>
                  </div>
                </article>
              }
            </div>
          }
        </section>

        <section class="panel form-panel">
          <div class="panel-heading">
            <div>
              <span>Novo cadastro</span>
              <h2>Criar avaliação</h2>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()">
            <label for="titulo">Nome da avaliação</label>
            <input id="titulo" type="text" formControlName="titulo" placeholder="Ex.: Prova bimestral de matemática">
            @if (form.controls.titulo.invalid && form.controls.titulo.touched) {
              <small class="field-error">Informe um nome para a avaliação.</small>
            }

            <label for="disciplinaId">Disciplina</label>
            <select id="disciplinaId" formControlName="disciplinaId">
              <option [ngValue]="null">Selecione uma disciplina</option>
              @for (disciplina of disciplinas; track disciplina.id) {
                <option [ngValue]="disciplina.id">{{ disciplina.nome }}</option>
              }
            </select>
            @if (form.controls.disciplinaId.invalid && form.controls.disciplinaId.touched) {
              <small class="field-error">Selecione a disciplina.</small>
            }

            <label for="serieId">Série</label>
            <select id="serieId" formControlName="serieId">
              <option [ngValue]="null">Selecione uma série</option>
              @for (serie of series; track serie.id) {
                <option [ngValue]="serie.id">{{ serie.nome }}</option>
              }
            </select>
            @if (form.controls.serieId.invalid && form.controls.serieId.touched) {
              <small class="field-error">Selecione a série.</small>
            }

            <label for="periodo">Período</label>
            <input id="periodo" type="text" formControlName="periodo" placeholder="Ex.: 2º bimestre">

            <button type="submit" class="primary-button" [disabled]="salvando">
              {{ salvando ? 'Salvando...' : 'Criar avaliação' }}
            </button>
          </form>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .avaliacoes-page { display: grid; gap: 18px; }
    .summary-strip {
      display: grid;
      grid-template-columns: repeat(2, minmax(96px, 1fr));
      gap: 8px;
      min-width: 240px;
    }
    .summary-strip article {
      display: grid;
      gap: 4px;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .summary-strip span,
    .panel-heading span {
      color: var(--pa-muted);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .summary-strip strong { font-size: 1.2rem; }
    .workspace-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
      gap: 10px;
      align-items: start;
    }
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
    .feedback {
      padding: 12px 14px;
      font-weight: 800;
    }
    .feedback.error { color: #7a271a; background: #ffebe6; }
    .feedback.success { color: #075e45; background: #dcfae6; }
    .state {
      display: grid;
      gap: 6px;
      padding: 18px;
      color: var(--pa-muted);
      background: var(--pa-panel-soft);
    }
    .empty-state strong { color: var(--pa-ink); }
    .avaliacoes-list { display: grid; gap: 10px; }
    .avaliacao-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .row-main {
      display: flex;
      align-items: center;
      gap: 12px;
      min-width: 0;
      color: inherit;
      text-decoration: none;
    }
    .row-badge {
      display: grid;
      flex: 0 0 auto;
      width: 42px;
      height: 42px;
      place-items: center;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-accent);
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
    .row-main small,
    .row-meta small {
      margin-top: 4px;
      color: var(--pa-muted);
      font-weight: 700;
    }
    .row-meta {
      display: grid;
      justify-items: end;
      gap: 2px;
      min-width: 86px;
    }
    .row-meta span {
      color: var(--pa-accent);
      font-size: 0.72rem;
      font-weight: 900;
    }
    .row-meta strong { font-size: 1.2rem; }
    form { display: grid; gap: 12px; }
    label { color: var(--pa-muted-strong); font-weight: 800; }
    input,
    select {
      width: 100%;
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
    }
    input:focus,
    select:focus {
      border-color: var(--pa-accent);
      outline: 3px solid rgba(79, 163, 138, 0.16);
    }
    .field-error { color: var(--pa-danger); font-weight: 700; }
    .primary-button {
      min-height: 40px;
      margin-top: 4px;
      padding: 0 14px;
      border: 0;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-accent);
      font-weight: 800;
    }

    @media (max-width: 980px) {
      .summary-strip { width: 100%; }
      .workspace-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .summary-strip { grid-template-columns: 1fr 1fr; min-width: 0; }
      .avaliacao-row { grid-template-columns: 1fr; }
      .row-meta { justify-items: start; }
    }
  `]
})
export class AvaliacoesPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  avaliacoes: Avaliacao[] = [];
  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  form = this.formBuilder.group({
    titulo: ['', Validators.required],
    disciplinaId: [null as number | null, Validators.required],
    serieId: [null as number | null, Validators.required],
    periodo: ['']
  });

  constructor(
    private readonly avaliacaoService: AvaliacaoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly serieService: SerieService,
    private readonly authService: AuthService
  ) {}

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregarAvaliacoes();
  }

  get totalQuestoes(): number {
    return this.avaliacoes.reduce((total, avaliacao) => total + avaliacao.questoes.length, 0);
  }

  carregarAvaliacoes(): void {
    this.carregando = true;
    this.limparMensagens();

    this.avaliacaoService.listar()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (avaliacoes) => this.avaliacoes = this.normalizarAvaliacoes(avaliacoes),
        error: () => this.mensagemErro = 'Não foi possível carregar as avaliações.'
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    this.salvando = true;
    this.limparMensagens();

    const user = this.authService.currentUser();

    this.avaliacaoService.criar({
      titulo: value.titulo?.trim() || '',
      disciplinaId: Number(value.disciplinaId),
      serieId: Number(value.serieId),
      escolaId: user?.escolaId,
      professorId: user?.id,
      periodo: value.periodo?.trim() || undefined
    })
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Avaliação criada com sucesso.';
          this.form.reset();
          this.carregarAvaliacoes();
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Não foi possível criar a avaliação.';
        }
      });
  }

  getDisciplinaNome(id: number): string {
    return this.disciplinas.find((disciplina) => disciplina.id === id)?.nome || `Disciplina ${id}`;
  }

  getSerieNome(id: number): string {
    return this.series.find((serie) => serie.id === id)?.nome || `Série ${id}`;
  }

  initials(titulo: string): string {
    return titulo
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((parte) => parte[0])
      .join('')
      .toUpperCase();
  }

  private carregarReferencias(): void {
    this.disciplinaService.listar().subscribe({
      next: (disciplinas) => this.disciplinas = disciplinas,
      error: () => this.mensagemErro = 'Não foi possível carregar as disciplinas.'
    });

    this.serieService.listar().subscribe({
      next: (series) => this.series = series,
      error: () => this.mensagemErro = 'Não foi possível carregar as séries.'
    });
  }

  private normalizarAvaliacoes(avaliacoes: Avaliacao[]): Avaliacao[] {
    return (avaliacoes || []).map((avaliacao) => ({
      ...avaliacao,
      status: avaliacao.status || 'RASCUNHO',
      questoes: avaliacao.questoes || []
    }));
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
