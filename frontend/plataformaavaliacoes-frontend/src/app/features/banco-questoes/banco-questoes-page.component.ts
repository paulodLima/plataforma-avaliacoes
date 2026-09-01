import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { Disciplina } from '../../shared/models/disciplina.model';
import { QuestaoService } from '../../core/services/questao.service';
import { SerieService } from '../../core/services/serie.service';
import { AssuntoService } from '../../core/services/assunto.service';
import { QuestaoResponseDTO, Dificuldade, TipoQuestao, Page } from '../../shared/models/questao.model';
import { Serie } from '../../shared/models/serie.model';
import { Assunto } from '../../shared/models/assunto.model';
import { FormArray, FormGroup } from '@angular/forms';

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

      <div class="filter-row" aria-label="Filtros iniciais" [formGroup]="filtrosForm">
        <select formControlName="disciplinaId">
          <option [ngValue]="null">Todas as Disciplinas</option>
          @for (disciplina of disciplinas; track disciplina.id) {
            <option [ngValue]="disciplina.id">{{ disciplina.nome }}</option>
          }
        </select>
        <select formControlName="serieId">
          <option [ngValue]="null">Todas as Series</option>
          @for (serie of series; track serie.id) {
            <option [ngValue]="serie.id">{{ serie.nome }}</option>
          }
        </select>
        <select formControlName="assuntoId">
          <option [ngValue]="null">Todos os Assuntos</option>
          @for (assunto of assuntos; track assunto.id) {
            <option [ngValue]="assunto.id">{{ assunto.nome }}</option>
          }
        </select>
        <select formControlName="dificuldade">
          <option [ngValue]="null">Todas as Dificuldades</option>
          <option value="FACIL">Facil</option>
          <option value="MEDIA">Media</option>
          <option value="DIFICIL">Dificil</option>
        </select>
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
              <span>Listagem</span>
              <h2>Questoes</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarQuestoes()" [disabled]="carregando" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregando) {
            <div class="state">Carregando questoes...</div>
          } @else if (!questoes.length) {
            <div class="state">Nenhuma questao encontrada.</div>
          } @else {
            <div class="questoes-list">
              @for (questao of questoes; track questao.id) {
                <article
                  class="questao-row"
                  [class.selected]="questaoSelecionada?.id === questao.id"
                >
                  <button type="button" class="row-main" (click)="editar(questao)">
                    <span class="row-badge">{{ questao.tipo.slice(0, 3).toUpperCase() }}</span>
                    <span>
                      <strong>{{ questao.enunciado.substring(0, 50) }}{{ questao.enunciado.length > 50 ? '...' : '' }}</strong>
                      <small>Dificuldade: {{ questao.dificuldade }} | Alternativas: {{ questao.alternativas.length || 0 }}</small>
                    </span>
                  </button>

                  <div class="row-actions">
                    <button type="button" class="text-button" (click)="editar(questao)">Editar</button>
                    <button
                      type="button"
                      class="danger-button"
                      (click)="excluir(questao)"
                    >
                      Excluir
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
              <span>{{ questaoSelecionada ? 'Edicao' : 'Novo cadastro' }}</span>
              <h2>{{ questaoSelecionada ? 'Editar questao' : 'Nova questao' }}</h2>
            </div>
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()">
            <label for="disciplinaId">Disciplina</label>
            <select id="disciplinaId" formControlName="disciplinaId">
               <option [ngValue]="null">Selecione uma disciplina</option>
               @for (disciplina of disciplinas; track disciplina.id) {
                  <option [ngValue]="disciplina.id">{{ disciplina.nome }}</option>
               }
            </select>

            <label for="serieId">Serie</label>
            <select id="serieId" formControlName="serieId">
               <option [ngValue]="null">Selecione uma serie</option>
               @for (serie of series; track serie.id) {
                  <option [ngValue]="serie.id">{{ serie.nome }}</option>
               }
            </select>

            <label for="assuntoId">Assunto (Opcional)</label>
            <select id="assuntoId" formControlName="assuntoId">
               <option [ngValue]="null">Selecione um assunto</option>
               @for (assunto of assuntos; track assunto.id) {
                  <option [ngValue]="assunto.id">{{ assunto.nome }}</option>
               }
            </select>

            <label for="enunciado">Enunciado</label>
            <textarea id="enunciado" formControlName="enunciado" rows="3"></textarea>

            <label for="tipo">Tipo da Questao</label>
            <select id="tipo" formControlName="tipo">
              <option value="OBJETIVA">Objetiva</option>
              <option value="VERDADEIRO_FALSO">Verdadeiro ou Falso</option>
              <option value="DISCURSIVA">Discursiva</option>
            </select>

            <label for="dificuldade">Dificuldade</label>
            <select id="dificuldade" formControlName="dificuldade">
              <option value="FACIL">Facil</option>
              <option value="MEDIA">Media</option>
              <option value="DIFICIL">Dificil</option>
            </select>

            <div class="alternativas-section">
              <div class="alternativas-header">
                <label>Alternativas</label>
                <button type="button" class="text-button" (click)="adicionarAlternativa()">+ Adicionar</button>
              </div>

              <div formArrayName="alternativas" class="alternativas-list">
                @for (altCtrl of alternativasFormArray.controls; track $index) {
                  <div [formGroupName]="$index" class="alternativa-item">
                    <input type="checkbox" formControlName="correta" title="Correta" />
                    <input type="text" formControlName="texto" placeholder="Texto da alternativa" />
                    <button type="button" class="danger-button" (click)="removerAlternativa($index)">X</button>
                  </div>
                }
              </div>
              @if (alternativasFormArray.length < 2) {
                 <small class="field-error">Adicione pelo menos 2 alternativas.</small>
              }
            </div>

            <div class="form-actions">
              @if (questaoSelecionada) {
                <button type="button" class="ghost-button" (click)="cancelarEdicao()">Cancelar</button>
              }
              <button type="submit" class="primary-button" [disabled]="salvando">
                {{ salvando ? 'Salvando...' : 'Salvar questao' }}
              </button>
            </div>
          </form>

        </section>
      </div>
    </section>
  `,
  styles: [`
    .banco-page { gap: 18px; }
    textarea, select {
      width: 100%;
      min-height: 42px;
      padding: 8px 14px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
      font-family: inherit;
    }
    textarea:focus, select:focus {
      border-color: var(--pa-accent);
      outline: 3px solid rgba(79, 163, 138, 0.16);
    }
    .alternativas-section {
       display: flex;
       flex-direction: column;
       gap: 10px;
       margin-top: 10px;
       padding-top: 10px;
       border-top: 1px solid var(--pa-border);
    }
    .alternativas-header {
       display: flex;
       justify-content: space-between;
       align-items: center;
    }
    .alternativas-list {
       display: flex;
       flex-direction: column;
       gap: 8px;
    }
    .alternativa-item {
       display: flex;
       align-items: center;
       gap: 10px;
    }
    .alternativa-item input[type="text"] {
       flex-grow: 1;
    }
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
    .questoes-list { display: grid; gap: 10px; }
    .questao-row {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 12px;
      align-items: center;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .questao-row.selected {
      border-color: rgba(79, 163, 138, 0.55);
      background: var(--pa-accent-soft);
    }
    .questao-row.inactive { opacity: 0.66; }
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
      .questao-row { grid-template-columns: 1fr; }
      .row-actions { justify-content: flex-start; flex-wrap: wrap; }
      .form-actions { flex-direction: column-reverse; }
      .form-actions button { width: 100%; }
    }
  `]
})
export class BancoQuestoesPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  questoes: QuestaoResponseDTO[] = [];
  questaoSelecionada?: QuestaoResponseDTO;

  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  assuntos: Assunto[] = [];

  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  filtrosForm = this.formBuilder.group({
    disciplinaId: [null as number | null],
    serieId: [null as number | null],
    assuntoId: [null as number | null],
    dificuldade: [null as Dificuldade | null]
  });

  form = this.formBuilder.group({
    disciplinaId: [null as number | null, Validators.required],
    serieId: [null as number | null, Validators.required],
    assuntoId: [null as number | null],
    enunciado: ['', [Validators.required]],
    tipo: ['OBJETIVA' as TipoQuestao, Validators.required],
    dificuldade: ['MEDIA' as Dificuldade, Validators.required],
    alternativas: this.formBuilder.array([])
  });

  constructor(
    private readonly questaoService: QuestaoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly serieService: SerieService,
    private readonly assuntoService: AssuntoService
  ) {}

  ngOnInit(): void {
    this.carregarDisciplinas();
    this.carregarSeries();
    this.carregarAssuntos();
    this.carregarQuestoes();

    this.filtrosForm.valueChanges.subscribe(() => {
      this.carregarQuestoes();
    });
  }

  get alternativasFormArray() {
    return this.form.get('alternativas') as FormArray;
  }

  adicionarAlternativa(texto = '', correta = false) {
    this.alternativasFormArray.push(this.formBuilder.group({
      texto: [texto, Validators.required],
      correta: [correta]
    }));
  }

  removerAlternativa(index: number) {
    this.alternativasFormArray.removeAt(index);
  }

  carregarDisciplinas(): void {
    this.disciplinaService.listar().subscribe({
      next: (disciplinas) => this.disciplinas = disciplinas,
      error: () => this.mensagemErro = 'Nao foi possivel carregar as disciplinas.'
    });
  }

  carregarSeries(): void {
    this.serieService.listar().subscribe({
      next: (series) => this.series = series,
      error: () => this.mensagemErro = 'Nao foi possivel carregar as series.'
    });
  }

  carregarAssuntos(): void {
    this.assuntoService.listar().subscribe({
      next: (assuntos) => this.assuntos = assuntos,
      error: () => this.mensagemErro = 'Nao foi possivel carregar os assuntos.'
    });
  }

  carregarQuestoes(exibirCarregamento = true, limparFeedback = true): void {
    this.carregando = exibirCarregamento;

    if (limparFeedback) {
      this.limparMensagens();
    }

    const { disciplinaId, serieId, assuntoId, dificuldade } = this.filtrosForm.getRawValue();

    this.questaoService.listar(disciplinaId ?? undefined, serieId ?? undefined, assuntoId ?? undefined, dificuldade ?? undefined)
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (page) => this.questoes = page.content,
        error: () => this.mensagemErro = 'Nao foi possivel carregar as questoes.'
      });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const value = this.form.getRawValue();
    const alternativas = value.alternativas || [];

    if (alternativas.length < 2) {
      this.mensagemErro = 'A questao deve ter pelo menos duas alternativas.';
      return;
    }

    if (!alternativas.some((a: any) => a.correta)) {
      this.mensagemErro = 'Pelo menos uma alternativa deve ser correta.';
      return;
    }

    this.salvando = true;
    this.limparMensagens();

    // @ts-ignore
    const payload = this.form.getRawValue() as unknown as QuestaoRequestDTO;
    const request$ = this.questaoSelecionada
      ? this.questaoService.atualizar(this.questaoSelecionada.id, payload)
      : this.questaoService.criar(payload);

    request$
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: () => {
          this.mensagemSucesso = this.questaoSelecionada
            ? 'Questao atualizada com sucesso.'
            : 'Questao cadastrada com sucesso.';
          this.cancelarEdicao();
          this.carregarQuestoes(false, false);
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Nao foi possivel salvar a questao.';
        }
      });
  }

  editar(questao: QuestaoResponseDTO): void {
    this.questaoSelecionada = questao;
    this.limparMensagens();

    this.alternativasFormArray.clear();
    questao.alternativas.forEach(alt => {
       this.adicionarAlternativa(alt.texto, alt.correta);
    });

    this.form.patchValue({
      disciplinaId: questao.disciplinaId,
      serieId: questao.serieId,
      assuntoId: questao.assuntoId,
      enunciado: questao.enunciado,
      tipo: questao.tipo,
      dificuldade: questao.dificuldade
    });
  }

  cancelarEdicao(): void {
    this.questaoSelecionada = undefined;
    this.alternativasFormArray.clear();
    this.form.reset({
      tipo: 'OBJETIVA',
      dificuldade: 'MEDIA'
    });
  }

  excluir(questao: QuestaoResponseDTO): void {
    this.limparMensagens();

    this.questaoService.excluir(questao.id).subscribe({
      next: () => {
        this.mensagemSucesso = 'Questao excluida com sucesso.';
        this.carregarQuestoes(false, false);
      },
      error: () => this.mensagemErro = 'Nao foi possivel excluir a questao.'
    });
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
