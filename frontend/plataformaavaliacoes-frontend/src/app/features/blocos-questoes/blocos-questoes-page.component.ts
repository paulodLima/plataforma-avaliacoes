import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { AssuntoService } from '../../core/services/assunto.service';
import { BlocoQuestao, BlocoQuestaoService } from '../../core/services/bloco-questao.service';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { SerieService } from '../../core/services/serie.service';
import { Assunto } from '../../shared/models/assunto.model';
import { Disciplina } from '../../shared/models/disciplina.model';
import { Serie } from '../../shared/models/serie.model';

@Component({
  selector: 'app-blocos-questoes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="blocos-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Textos-base e questões vinculadas</span>
          <h1>Blocos de questões</h1>
          <p>Organize enunciados compartilhados, anexos e grupos de perguntas que precisam caminhar juntos na avaliação.</p>
        </div>

        <div class="summary-strip" aria-label="Resumo dos blocos">
          <article>
            <span>Blocos</span>
            <strong>{{ blocos.length }}</strong>
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
              <h2>Blocos cadastrados</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarBlocos()" [disabled]="carregandoLista" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregandoLista) {
            <div class="state">Carregando blocos...</div>
          } @else if (!blocos.length) {
            <div class="state empty-state">
              <strong>Nenhum bloco cadastrado.</strong>
              <p>Cadastre um texto-base ou anexo para agrupar questões relacionadas.</p>
            </div>
          } @else {
            <div class="blocos-list">
              @for (bloco of blocos; track bloco.id) {
                <article class="bloco-row" [class.selected]="blocoSelecionado?.id === bloco.id">
                  <div class="bloco-main">
                    <span class="row-badge">BL</span>
                    <div>
                      <div class="tag-row">
                        <span>{{ getDisciplinaNome(bloco.disciplinaId) }}</span>
                        <span>{{ getSerieNome(bloco.serieId) }}</span>
                        @if (getAssuntoNome(bloco.assuntoId)) {
                          <span>{{ getAssuntoNome(bloco.assuntoId) }}</span>
                        }
                      </div>
                      <strong>{{ bloco.textoBase || 'Bloco com anexo' }}</strong>
                      @if (bloco.anexoUrl) {
                        <a [href]="bloco.anexoUrl" target="_blank" rel="noreferrer">Abrir anexo</a>
                      }
                    </div>
                  </div>

                  <div class="row-actions">
                    <div class="counter">
                      <strong>{{ bloco.questoes?.length || 0 }}</strong>
                      <small>questões</small>
                    </div>
                    <button type="button" class="ghost-button" (click)="verDetalhes(bloco)">
                      {{ blocoSelecionado?.id === bloco.id ? 'Ocultar' : 'Ver detalhes' }}
                    </button>
                  </div>

                  @if (blocoSelecionado?.id === bloco.id) {
                    <div class="detail-box">
                      <div>
                        <span>Texto-base</span>
                        <p>{{ blocoSelecionado?.textoBase || 'Este bloco usa somente anexo.' }}</p>
                      </div>

                      @if (blocoSelecionado?.anexoUrl) {
                        <div>
                          <span>Anexo</span>
                          <a [href]="blocoSelecionado?.anexoUrl" target="_blank" rel="noreferrer">
                            {{ blocoSelecionado?.anexoUrl }}
                          </a>
                        </div>
                      }

                      <div>
                        <span>Questões vinculadas</span>
                        @if (blocoSelecionado?.questoes?.length) {
                          <div class="linked-list">
                            @for (questao of blocoSelecionado?.questoes; track questao.id) {
                              <article>
                                <strong>Questão {{ questao.id }}</strong>
                                <p>{{ questao.enunciado }}</p>
                              </article>
                            }
                          </div>
                        } @else {
                          <p>Nenhuma questão vinculada a este bloco.</p>
                        }
                      </div>
                    </div>
                  }
                </article>
              }
            </div>
          }
        </section>

        <section class="panel form-panel">
          <div class="panel-heading">
            <div>
              <span>Novo cadastro</span>
              <h2>Criar bloco</h2>
            </div>
          </div>

          <form [formGroup]="blocoForm" (ngSubmit)="salvar()">
            <label for="textoBase">Texto-base</label>
            <textarea id="textoBase" formControlName="textoBase" rows="5" placeholder="Cole aqui o texto, tirinha transcrita ou contexto usado por várias questões."></textarea>

            <label for="anexoUrl">URL do anexo</label>
            <input id="anexoUrl" type="text" formControlName="anexoUrl" placeholder="https://...">

            <div class="form-note">
              Informe o texto-base ou a URL do anexo. Pelo menos um dos dois é obrigatório.
            </div>

            <label for="disciplinaId">Disciplina</label>
            <select id="disciplinaId" formControlName="disciplinaId">
              <option [ngValue]="null">Selecione uma disciplina</option>
              @for (disciplina of disciplinas; track disciplina.id) {
                <option [ngValue]="disciplina.id">{{ disciplina.nome }}</option>
              }
            </select>
            @if (blocoForm.controls.disciplinaId.invalid && blocoForm.controls.disciplinaId.touched) {
              <small class="field-error">Selecione a disciplina.</small>
            }

            <label for="serieId">Série</label>
            <select id="serieId" formControlName="serieId">
              <option [ngValue]="null">Selecione uma série</option>
              @for (serie of series; track serie.id) {
                <option [ngValue]="serie.id">{{ serie.nome }}</option>
              }
            </select>
            @if (blocoForm.controls.serieId.invalid && blocoForm.controls.serieId.touched) {
              <small class="field-error">Selecione a série.</small>
            }

            <label for="assuntoId">Assunto</label>
            <select id="assuntoId" formControlName="assuntoId">
              <option [ngValue]="null">Sem assunto definido</option>
              @for (assunto of assuntos; track assunto.id) {
                <option [ngValue]="assunto.id">{{ assunto.nome }}</option>
              }
            </select>

            <button type="submit" class="primary-button" [disabled]="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar bloco' }}
            </button>
          </form>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .blocos-page { display: grid; gap: 18px; }
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
    .panel-heading span,
    .detail-box span {
      color: var(--pa-muted);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .summary-strip strong { font-size: 1.2rem; }
    .workspace-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.25fr) minmax(330px, 0.75fr);
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
    .state strong { color: var(--pa-ink); }
    .blocos-list { display: grid; gap: 10px; }
    .bloco-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .bloco-row.selected {
      border-color: rgba(79, 163, 138, 0.55);
      background: var(--pa-accent-soft);
    }
    .bloco-main {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      min-width: 0;
    }
    .bloco-main > div {
      display: grid;
      min-width: 0;
      gap: 6px;
    }
    .bloco-main strong {
      display: block;
      min-width: 0;
      overflow: hidden;
      color: var(--pa-ink);
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .bloco-main a,
    .detail-box a {
      color: var(--pa-accent);
      font-weight: 800;
      overflow-wrap: anywhere;
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
    .tag-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .tag-row span {
      padding: 4px 7px;
      border-radius: var(--pa-radius-sm);
      color: var(--pa-muted-strong);
      background: #ffffff;
      font-size: 0.72rem;
      font-weight: 800;
    }
    .row-actions {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
    .counter {
      display: grid;
      justify-items: end;
      min-width: 64px;
    }
    .counter strong {
      color: var(--pa-ink);
      font-size: 1.1rem;
      line-height: 1;
    }
    .counter small {
      color: var(--pa-muted);
      font-weight: 700;
    }
    .detail-box {
      display: grid;
      grid-column: 1 / -1;
      gap: 12px;
      padding: 14px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: #ffffff;
    }
    .detail-box > div {
      display: grid;
      gap: 6px;
    }
    .linked-list {
      display: grid;
      gap: 8px;
    }
    .linked-list article {
      display: grid;
      gap: 4px;
      padding: 10px;
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    form {
      display: grid;
      gap: 12px;
    }
    label {
      color: var(--pa-muted-strong);
      font-weight: 800;
    }
    input,
    select,
    textarea {
      width: 100%;
      min-height: 42px;
      padding: 8px 14px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
    }
    textarea {
      resize: vertical;
      line-height: 1.45;
    }
    input:focus,
    select:focus,
    textarea:focus {
      border-color: var(--pa-accent);
      outline: 3px solid rgba(79, 163, 138, 0.16);
    }
    .form-note {
      padding: 10px 12px;
      border-radius: var(--pa-radius-sm);
      color: var(--pa-muted-strong);
      background: var(--pa-accent-soft);
      font-size: 0.86rem;
      font-weight: 700;
      line-height: 1.45;
    }
    .field-error {
      color: var(--pa-danger);
      font-weight: 700;
    }
    .icon-button,
    .ghost-button,
    .primary-button {
      min-height: 38px;
      padding: 0 13px;
      border-radius: var(--pa-radius-sm);
      font-weight: 800;
    }
    .icon-button {
      width: 42px;
      padding: 0;
      border: 1px solid var(--pa-border);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
      font-size: 0.72rem;
      font-weight: 900;
    }
    .ghost-button {
      border: 1px solid var(--pa-border);
      color: var(--pa-ink);
      background: #ffffff;
    }
    .primary-button {
      border: 0;
      color: #ffffff;
      background: var(--pa-accent);
    }
    button:disabled { opacity: 0.55; }

    @media (max-width: 980px) {
      .summary-strip { width: 100%; }
      .workspace-grid { grid-template-columns: 1fr; }
    }

    @media (max-width: 640px) {
      .summary-strip { grid-template-columns: 1fr 1fr; min-width: 0; }
      .bloco-row { grid-template-columns: 1fr; }
      .row-actions {
        align-items: stretch;
        flex-direction: column;
      }
      .counter { justify-items: start; }
      .row-actions button,
      .primary-button { width: 100%; }
    }
  `]
})
export class BlocosQuestoesPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  blocos: BlocoQuestao[] = [];
  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  assuntos: Assunto[] = [];
  blocoSelecionado: BlocoQuestao | null = null;
  carregandoLista = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  blocoForm = this.formBuilder.group({
    textoBase: [''],
    anexoUrl: [''],
    disciplinaId: [null as number | null, Validators.required],
    serieId: [null as number | null, Validators.required],
    assuntoId: [null as number | null]
  });

  constructor(
    private readonly blocoService: BlocoQuestaoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly serieService: SerieService,
    private readonly assuntoService: AssuntoService
  ) {}

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregarBlocos();
  }

  get totalQuestoes(): number {
    return this.blocos.reduce((total, bloco) => total + (bloco.questoes?.length || 0), 0);
  }

  carregarBlocos(): void {
    this.carregandoLista = true;
    this.limparMensagens();

    this.blocoService.findAll(0, 50)
      .pipe(finalize(() => this.carregandoLista = false))
      .subscribe({
        next: (resposta) => this.blocos = resposta.content || [],
        error: () => this.mensagemErro = 'Não foi possível carregar os blocos.'
      });
  }

  salvar(): void {
    if (this.blocoForm.invalid) {
      this.blocoForm.markAllAsTouched();
      return;
    }

    const value = this.blocoForm.getRawValue();
    if (!value.textoBase?.trim() && !value.anexoUrl?.trim()) {
      this.mensagemErro = 'Informe o texto-base ou a URL do anexo.';
      return;
    }

    const payload: BlocoQuestao = {
      textoBase: value.textoBase?.trim() || '',
      anexoUrl: value.anexoUrl?.trim() || '',
      disciplinaId: Number(value.disciplinaId),
      serieId: Number(value.serieId),
      assuntoId: value.assuntoId ? Number(value.assuntoId) : undefined
    };

    this.salvando = true;
    this.limparMensagens();

    this.blocoService.create(payload)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = 'Bloco cadastrado com sucesso.';
          this.blocoForm.reset();
          this.carregarBlocos();
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Não foi possível salvar o bloco.';
        }
      });
  }

  verDetalhes(bloco: BlocoQuestao): void {
    if (this.blocoSelecionado?.id === bloco.id) {
      this.blocoSelecionado = null;
      return;
    }

    if (!bloco.id) {
      return;
    }

    this.blocoService.findById(bloco.id).subscribe({
      next: (blocoCompleto) => this.blocoSelecionado = blocoCompleto,
      error: () => this.mensagemErro = 'Não foi possível carregar os detalhes do bloco.'
    });
  }

  getDisciplinaNome(id: number): string {
    return this.disciplinas.find((disciplina) => disciplina.id === id)?.nome || `Disciplina ${id}`;
  }

  getSerieNome(id: number): string {
    return this.series.find((serie) => serie.id === id)?.nome || `Série ${id}`;
  }

  getAssuntoNome(id?: number): string {
    if (!id) {
      return '';
    }

    return this.assuntos.find((assunto) => assunto.id === id)?.nome || `Assunto ${id}`;
  }

  private carregarReferencias(): void {
    this.disciplinaService.listar().subscribe({
      next: (disciplinas) => this.disciplinas = disciplinas || [],
      error: () => this.mensagemErro = 'Não foi possível carregar as disciplinas.'
    });

    this.serieService.listar().subscribe({
      next: (series) => this.series = series || [],
      error: () => this.mensagemErro = 'Não foi possível carregar as séries.'
    });

    this.assuntoService.listar().subscribe({
      next: (assuntos) => this.assuntos = assuntos || [],
      error: () => this.mensagemErro = 'Não foi possível carregar os assuntos.'
    });
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
