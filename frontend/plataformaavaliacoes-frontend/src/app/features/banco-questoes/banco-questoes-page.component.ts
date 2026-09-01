import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { DisciplinaService } from '../../core/services/disciplina.service';
import { Disciplina } from '../../shared/models/disciplina.model';

@Component({
  selector: 'app-banco-questoes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="banco-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Gestao e busca de questoes</span>
          <h1>Banco de questoes</h1>
          <p>Organize disciplinas, blocos e itens avaliativos por serie, tema e habilidade.</p>
        </div>

        <div class="search-pill" aria-label="Busca visual">
          <span></span>
          <strong>Buscar por enunciado</strong>
        </div>
      </header>

      <div class="filter-row" aria-label="Filtros iniciais">
        <button type="button">Portugues</button>
        <button type="button">8o ano</button>
        <button type="button">Blocos</button>
        <button type="button">Habilidade BNCC</button>
        <button type="button">Dificuldade media</button>
      </div>

      @if (mensagemErro || mensagemSucesso) {
        <div class="feedback" [class.error]="mensagemErro" [class.success]="mensagemSucesso">
          {{ mensagemErro || mensagemSucesso }}
        </div>
      }

      <div class="workspace-grid">
        <section class="question-list panel">
          <div class="panel-heading">
            <div>
              <span>Cadastro base</span>
              <h2>Disciplinas</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarDisciplinas()" [disabled]="carregando" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregando) {
            <div class="state">Carregando disciplinas...</div>
          } @else if (!disciplinas.length) {
            <div class="state">Nenhuma disciplina cadastrada ainda.</div>
          } @else {
            <div class="disciplinas-list">
              @for (disciplina of disciplinas; track disciplina.id) {
                <article
                  class="disciplina-row"
                  [class.selected]="disciplinaSelecionada?.id === disciplina.id"
                  [class.inactive]="!disciplina.ativo"
                >
                  <button type="button" class="row-main" (click)="editar(disciplina)">
                    <span class="row-badge">{{ disciplina.nome.slice(0, 2).toUpperCase() }}</span>
                    <span>
                      <strong>{{ disciplina.nome }}</strong>
                      <small>{{ disciplina.ativo ? 'Ativa no banco' : 'Inativa' }}</small>
                    </span>
                  </button>

                  <div class="row-actions">
                    <button type="button" class="text-button" (click)="editar(disciplina)">Editar</button>
                    <button
                      type="button"
                      class="danger-button"
                      [disabled]="!disciplina.ativo"
                      (click)="inativar(disciplina)"
                    >
                      Inativar
                    </button>
                  </div>
                </article>
              }
            </div>
          }
        </section>

        <section class="detail-panel panel">
          <div class="panel-heading">
            <div>
              <span>{{ disciplinaSelecionada ? 'Edicao' : 'Novo cadastro' }}</span>
              <h2>{{ disciplinaSelecionada ? 'Editar disciplina' : 'Nova disciplina' }}</h2>
            </div>
            <strong class="counter">{{ disciplinas.length }}</strong>
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()">
            <label for="nome">Nome da disciplina</label>
            <input id="nome" type="text" formControlName="nome" placeholder="Ex: Portugues" />

            @if (form.controls.nome.invalid && form.controls.nome.touched) {
              <small class="field-error">Informe o nome da disciplina com ate 120 caracteres.</small>
            }

            @if (disciplinaSelecionada) {
              <label class="checkbox">
                <input type="checkbox" formControlName="ativo" />
                Disciplina ativa
              </label>
            }

            <div class="form-actions">
              @if (disciplinaSelecionada) {
                <button type="button" class="ghost-button" (click)="cancelarEdicao()">Cancelar</button>
              }
              <button type="submit" class="primary-button" [disabled]="salvando">
                {{ salvando ? 'Salvando...' : 'Salvar disciplina' }}
              </button>
            </div>
          </form>

          <div class="quality-card">
            <span>Qualidade do banco</span>
            <strong>Estrutura inicial</strong>
            <p>Disciplinas sao o primeiro eixo para organizar series, assuntos, blocos e provas.</p>
          </div>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .banco-page { gap: 18px; }
    .eyebrow, .panel-heading span, .quality-card span {
      letter-spacing: 0.04em;
    }
    .search-pill {
      display: flex;
      align-items: center;
      gap: 10px;
      min-width: 250px;
      min-height: 40px;
      padding: 0 13px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-muted);
      background: var(--pa-panel-soft);
    }
    .search-pill span {
      width: 12px;
      height: 12px;
      border: 2px solid var(--pa-accent);
      border-radius: 999px;
      box-shadow: 8px 8px 0 -6px var(--pa-accent);
    }
    .search-pill strong { font-size: 0.9rem; }
    .filter-row { display: flex; flex-wrap: wrap; gap: 10px; }
    .filter-row button {
      min-height: 34px;
      padding: 0 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-muted-strong);
      background: var(--pa-panel-soft);
      font-weight: 800;
    }
    .filter-row button:first-child {
      color: #ffffff;
      border-color: transparent;
      background: var(--pa-ink);
    }
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
    .disciplinas-list { display: grid; gap: 10px; }
    .disciplina-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .disciplina-row.selected {
      border-color: rgba(79, 163, 138, 0.55);
      background: var(--pa-accent-soft);
    }
    .disciplina-row.inactive { opacity: 0.66; }
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
    .counter {
      display: grid;
      width: 42px;
      height: 42px;
      place-items: center;
      border-radius: var(--pa-radius-sm);
      color: var(--pa-accent);
      background: var(--pa-accent-soft);
    }
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
    .quality-card {
      display: grid;
      gap: 8px;
      margin-top: 4px;
      padding: 16px;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-ink);
    }
    .quality-card span,
    .quality-card p { color: rgba(255, 255, 255, 0.76); }

    @media (max-width: 980px) {
      .search-pill { width: 100%; min-width: 0; }
      .workspace-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .disciplina-row { grid-template-columns: 1fr; }
      .row-actions { justify-content: flex-start; flex-wrap: wrap; }
      .form-actions { flex-direction: column-reverse; }
      .form-actions button { width: 100%; }
    }
  `]
})
export class BancoQuestoesPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  disciplinas: Disciplina[] = [];
  disciplinaSelecionada?: Disciplina;
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  form = this.formBuilder.nonNullable.group({
    nome: ['', [Validators.required, Validators.maxLength(120)]],
    ativo: [true]
  });

  constructor(private readonly disciplinaService: DisciplinaService) {}

  ngOnInit(): void {
    this.carregarDisciplinas();
  }

  carregarDisciplinas(exibirCarregamento = true, limparFeedback = true): void {
    this.carregando = exibirCarregamento;

    if (limparFeedback) {
      this.limparMensagens();
    }

    this.disciplinaService.listar()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (disciplinas) => this.disciplinas = disciplinas,
        error: () => this.mensagemErro = 'Nao foi possivel carregar as disciplinas.'
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
    const request$ = this.disciplinaSelecionada
      ? this.disciplinaService.atualizar(this.disciplinaSelecionada.id, payload)
      : this.disciplinaService.criar({ nome: payload.nome });

    request$
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = this.disciplinaSelecionada
            ? 'Disciplina atualizada com sucesso.'
            : 'Disciplina cadastrada com sucesso.';
          this.cancelarEdicao();
          this.carregarDisciplinas(false, false);
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Nao foi possivel salvar a disciplina.';
        }
      });
  }

  editar(disciplina: Disciplina): void {
    this.disciplinaSelecionada = disciplina;
    this.limparMensagens();
    this.form.setValue({
      nome: disciplina.nome,
      ativo: disciplina.ativo
    });
  }

  cancelarEdicao(): void {
    this.disciplinaSelecionada = undefined;
    this.form.reset({
      nome: '',
      ativo: true
    });
  }

  inativar(disciplina: Disciplina): void {
    this.limparMensagens();

    this.disciplinaService.inativar(disciplina.id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Disciplina inativada com sucesso.';
        this.carregarDisciplinas(false, false);
      },
      error: () => this.mensagemErro = 'Nao foi possivel inativar a disciplina.'
    });
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
