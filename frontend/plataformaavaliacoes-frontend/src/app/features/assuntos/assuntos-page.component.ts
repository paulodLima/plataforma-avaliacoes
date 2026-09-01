import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { forkJoin, finalize } from 'rxjs';

import { AssuntoService } from '../../core/services/assunto.service';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { SerieService } from '../../core/services/serie.service';
import { Assunto } from '../../shared/models/assunto.model';
import { Disciplina } from '../../shared/models/disciplina.model';
import { Serie } from '../../shared/models/serie.model';

@Component({
  selector: 'app-assuntos-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="assuntos-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Cadastro base</span>
          <h1>Assuntos</h1>
          <p>Conecte cada tema a uma disciplina e serie para organizar o banco de questoes.</p>
        </div>
        <div class="summary-pill"><span>{{ assuntos.length }}</span><strong>assuntos</strong></div>
      </header>

      <form class="filters" [formGroup]="filtrosForm">
        <label>
          Disciplina
          <select formControlName="disciplinaId" (change)="carregarAssuntos()">
            <option [ngValue]="null">Todas</option>
            @for (disciplina of disciplinas; track disciplina.id) {
              <option [ngValue]="disciplina.id">{{ disciplina.nome }}</option>
            }
          </select>
        </label>

        <label>
          Serie
          <select formControlName="serieId" (change)="carregarAssuntos()">
            <option [ngValue]="null">Todas</option>
            @for (serie of series; track serie.id) {
              <option [ngValue]="serie.id">{{ serie.nome }}</option>
            }
          </select>
        </label>
      </form>

      @if (mensagemErro || mensagemSucesso) {
        <div class="feedback" [class.error]="mensagemErro" [class.success]="mensagemSucesso">
          {{ mensagemErro || mensagemSucesso }}
        </div>
      }

      <div class="workspace-grid">
        <section class="panel">
          <div class="panel-heading">
            <div>
              <span>Temas cadastrados</span>
              <h2>Lista de assuntos</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarAssuntos()" [disabled]="carregando">AT</button>
          </div>

          @if (carregando) {
            <div class="state">Carregando assuntos...</div>
          } @else if (!assuntos.length) {
            <div class="state">Nenhum assunto encontrado para os filtros atuais.</div>
          } @else {
            <div class="assuntos-list">
              @for (assunto of assuntos; track assunto.id) {
                <article class="assunto-row" [class.selected]="assuntoSelecionado?.id === assunto.id" [class.inactive]="!assunto.ativo">
                  <button type="button" class="row-main" (click)="editar(assunto)">
                    <span class="row-badge">{{ assunto.nome.slice(0, 2).toUpperCase() }}</span>
                    <span>
                      <strong>{{ assunto.nome }}</strong>
                      <small>{{ assunto.disciplina.nome }} - {{ assunto.serie.nome }} - {{ assunto.ativo ? 'Ativo' : 'Inativo' }}</small>
                    </span>
                  </button>

                  <div class="row-actions">
                    <button type="button" class="text-button" (click)="editar(assunto)">Editar</button>
                    <button type="button" class="danger-button" [disabled]="!assunto.ativo" (click)="inativar(assunto)">Inativar</button>
                  </div>
                </article>
              }
            </div>
          }
        </section>

        <section class="panel detail-panel">
          <div class="panel-heading">
            <div>
              <span>{{ assuntoSelecionado ? 'Edicao' : 'Novo cadastro' }}</span>
              <h2>{{ assuntoSelecionado ? 'Editar assunto' : 'Novo assunto' }}</h2>
            </div>
          </div>

          <form class="editor-form" [formGroup]="form" (ngSubmit)="salvar()">
            <label for="nome">Nome do assunto</label>
            <input id="nome" type="text" formControlName="nome" placeholder="Ex: Interpretacao de texto" />
            @if (form.controls.nome.invalid && form.controls.nome.touched) {
              <small class="field-error">Informe o nome do assunto.</small>
            }

            <label for="disciplina">Disciplina</label>
            <select id="disciplina" formControlName="disciplinaId">
              <option [ngValue]="null">Selecione</option>
              @for (disciplina of disciplinas; track disciplina.id) {
                <option [ngValue]="disciplina.id">{{ disciplina.nome }}</option>
              }
            </select>

            <label for="serie">Serie</label>
            <select id="serie" formControlName="serieId">
              <option [ngValue]="null">Selecione</option>
              @for (serie of series; track serie.id) {
                <option [ngValue]="serie.id">{{ serie.nome }}</option>
              }
            </select>

            @if (assuntoSelecionado) {
              <label class="checkbox">
                <input type="checkbox" formControlName="ativo" />
                Assunto ativo
              </label>
            }

            <div class="form-actions">
              @if (assuntoSelecionado) {
                <button type="button" class="ghost-button" (click)="cancelarEdicao()">Cancelar</button>
              }
              <button type="submit" class="primary-button" [disabled]="salvando">
                {{ salvando ? 'Salvando...' : 'Salvar assunto' }}
              </button>
            </div>
          </form>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .assuntos-page { display: grid; gap: 18px; }
    .page-header, .panel-heading, .summary-pill, .row-actions, .form-actions { display: flex; gap: 12px; }
    .page-header, .panel-heading { align-items: flex-start; justify-content: space-between; }
    .eyebrow, .panel-heading span { color: var(--pa-muted); font-size: .78rem; font-weight: 800; text-transform: uppercase; }
    h1, h2, p { margin: 0; }
    h1 { margin-top: 8px; font-size: clamp(2rem, 4vw, 3rem); line-height: 1.05; }
    h2 { font-size: 1.2rem; }
    p, small { color: var(--pa-muted); }
    .summary-pill { align-items: center; min-height: 50px; padding: 0 16px; border: 1px solid var(--pa-border); border-radius: 999px; background: var(--pa-panel-soft); }
    .summary-pill span { display: grid; width: 32px; height: 32px; place-items: center; border-radius: 12px; color: #fff; background: var(--pa-accent); font-weight: 900; }
    .summary-pill strong { color: var(--pa-muted-strong); font-size: .9rem; }
    .filters { display: grid; grid-template-columns: repeat(2, minmax(220px, 1fr)); gap: 12px; padding: 14px; border: 1px solid var(--pa-border); border-radius: var(--pa-radius-md); background: var(--pa-panel-soft); }
    label { display: grid; gap: 7px; color: var(--pa-muted-strong); font-weight: 800; }
    input, select { width: 100%; min-height: 46px; padding: 0 13px; border: 1px solid var(--pa-border-strong); border-radius: var(--pa-radius-sm); color: var(--pa-ink); background: #fff; }
    input:focus, select:focus { border-color: var(--pa-accent); outline: 3px solid rgba(79, 163, 138, .16); }
    .feedback, .state { padding: 13px 16px; border-radius: var(--pa-radius-sm); font-weight: 800; }
    .feedback.error { color: #7a271a; background: #ffebe6; }
    .feedback.success { color: #075e45; background: #dcfae6; }
    .state { color: var(--pa-muted); background: var(--pa-panel-soft); }
    .workspace-grid { display: grid; grid-template-columns: minmax(0, 1.35fr) minmax(320px, .75fr); gap: 14px; align-items: start; }
    .panel { display: grid; gap: 16px; padding: 18px; border: 1px solid var(--pa-border); border-radius: var(--pa-radius-lg); background: var(--pa-panel); }
    .icon-button { width: 42px; height: 42px; border: 1px solid var(--pa-border); border-radius: 15px; color: var(--pa-ink); background: var(--pa-panel-soft); font-size: .72rem; font-weight: 900; }
    .assuntos-list { display: grid; gap: 10px; }
    .assunto-row { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 12px; align-items: center; padding: 12px; border: 1px solid var(--pa-border); border-radius: var(--pa-radius-md); background: var(--pa-panel-soft); }
    .assunto-row.selected { border-color: rgba(79, 163, 138, .55); background: var(--pa-accent-soft); }
    .assunto-row.inactive { opacity: .66; }
    .row-main { display: flex; align-items: center; gap: 12px; min-width: 0; padding: 0; border: 0; color: inherit; text-align: left; background: transparent; }
    .row-badge { display: grid; flex: 0 0 auto; width: 42px; height: 42px; place-items: center; border-radius: 15px; color: #fff; background: var(--pa-warning); font-size: .76rem; font-weight: 900; }
    .row-main strong, .row-main small { display: block; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .row-main small { margin-top: 4px; font-weight: 700; }
    .text-button, .danger-button, .ghost-button, .primary-button { min-height: 38px; padding: 0 13px; border-radius: 999px; font-weight: 800; }
    .text-button, .ghost-button { border: 1px solid var(--pa-border); color: var(--pa-ink); background: #fff; }
    .danger-button { border: 0; color: #fff; background: var(--pa-danger); }
    .primary-button { border: 0; color: #fff; background: var(--pa-accent); }
    button:disabled { opacity: .55; }
    .editor-form { display: grid; gap: 12px; }
    .field-error { color: var(--pa-danger); font-weight: 700; }
    .checkbox { display: flex; align-items: center; }
    .checkbox input { width: 18px; height: 18px; accent-color: var(--pa-accent); }
    .form-actions { justify-content: flex-end; margin-top: 6px; }
    @media (max-width: 980px) { .page-header { flex-direction: column; } .summary-pill { width: 100%; } .workspace-grid, .filters { grid-template-columns: 1fr; } }
    @media (max-width: 640px) { .assunto-row { grid-template-columns: 1fr; } .row-actions { flex-wrap: wrap; } .form-actions { flex-direction: column-reverse; } .form-actions button { width: 100%; } }
  `]
})
export class AssuntosPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  assuntos: Assunto[] = [];
  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  assuntoSelecionado?: Assunto;
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  filtrosForm = this.formBuilder.group({
    disciplinaId: this.formBuilder.control<number | null>(null),
    serieId: this.formBuilder.control<number | null>(null)
  });

  form = this.formBuilder.group({
    nome: this.formBuilder.nonNullable.control('', [Validators.required, Validators.maxLength(160)]),
    disciplinaId: this.formBuilder.control<number | null>(null, [Validators.required]),
    serieId: this.formBuilder.control<number | null>(null, [Validators.required]),
    ativo: this.formBuilder.nonNullable.control(true)
  });

  constructor(
    private readonly assuntoService: AssuntoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly serieService: SerieService
  ) {}

  ngOnInit(): void {
    forkJoin({
      disciplinas: this.disciplinaService.listar(),
      series: this.serieService.listar()
    }).subscribe({
      next: ({ disciplinas, series }) => {
        this.disciplinas = disciplinas;
        this.series = series;
        this.carregarAssuntos();
      },
      error: () => this.mensagemErro = 'Nao foi possivel carregar disciplinas e series.'
    });
  }

  carregarAssuntos(exibirCarregamento = true, limparFeedback = true): void {
    this.carregando = exibirCarregamento;

    if (limparFeedback) {
      this.limparMensagens();
    }

    const filtros = this.filtrosForm.getRawValue();

    this.assuntoService.listar({
      disciplinaId: filtros.disciplinaId ?? undefined,
      serieId: filtros.serieId ?? undefined
    })
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (assuntos) => this.assuntos = assuntos,
        error: () => this.mensagemErro = 'Nao foi possivel carregar os assuntos.'
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();

    if (!payload.disciplinaId || !payload.serieId) {
      return;
    }

    this.salvando = true;
    this.limparMensagens();

    const requestPayload = {
      nome: payload.nome,
      disciplinaId: payload.disciplinaId,
      serieId: payload.serieId,
      ativo: payload.ativo
    };
    const request$ = this.assuntoSelecionado
      ? this.assuntoService.atualizar(this.assuntoSelecionado.id, requestPayload)
      : this.assuntoService.criar(requestPayload);

    request$
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = this.assuntoSelecionado
            ? 'Assunto atualizado com sucesso.'
            : 'Assunto cadastrado com sucesso.';
          this.cancelarEdicao();
          this.carregarAssuntos(false, false);
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Nao foi possivel salvar o assunto.';
        }
      });
  }

  editar(assunto: Assunto): void {
    this.assuntoSelecionado = assunto;
    this.limparMensagens();
    this.form.setValue({
      nome: assunto.nome,
      disciplinaId: assunto.disciplina.id,
      serieId: assunto.serie.id,
      ativo: assunto.ativo
    });
  }

  cancelarEdicao(): void {
    this.assuntoSelecionado = undefined;
    this.form.reset({
      nome: '',
      disciplinaId: null,
      serieId: null,
      ativo: true
    });
  }

  inativar(assunto: Assunto): void {
    this.limparMensagens();

    this.assuntoService.inativar(assunto.id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Assunto inativado com sucesso.';
        this.carregarAssuntos(false, false);
      },
      error: () => this.mensagemErro = 'Nao foi possivel inativar o assunto.'
    });
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
