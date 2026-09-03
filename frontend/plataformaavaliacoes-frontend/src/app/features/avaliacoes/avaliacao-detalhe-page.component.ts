import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { QuestaoService } from '../../core/services/questao.service';
import { SerieService } from '../../core/services/serie.service';
import { Avaliacao } from '../../shared/models/avaliacao.model';
import { Disciplina } from '../../shared/models/disciplina.model';
import { Dificuldade, QuestaoResponseDTO } from '../../shared/models/questao.model';
import { Serie } from '../../shared/models/serie.model';

@Component({
  selector: 'app-avaliacao-detalhe-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="avaliacao-detalhe-page">
      <a class="back-link" routerLink="/avaliacoes">Voltar para avaliações</a>

      @if (carregandoAvaliacao) {
        <section class="panel state">Carregando avaliação...</section>
      } @else if (!avaliacao) {
        <section class="panel state">
          <strong>Avaliação não encontrada.</strong>
          <p>Volte para a listagem e selecione uma avaliação cadastrada.</p>
        </section>
      } @else {
        <header class="page-header detail-header">
          <div>
            <span class="eyebrow">Detalhe da avaliação</span>
            <h1>{{ avaliacao.titulo }}</h1>
            <p>
              {{ getDisciplinaNome(avaliacao.disciplinaId) }} | {{ getSerieNome(avaliacao.serieId) }}
              @if (avaliacao.periodo) {
                | {{ avaliacao.periodo }}
              }
            </p>
            <a class="back-link versions-link" [routerLink]="['/avaliacoes', avaliacao.id, 'versoes']">Gerar e consultar versões</a>
          </div>

          <div class="status-panel" aria-label="Resumo da composição">
            <span>{{ avaliacao.status }}</span>
            <strong>{{ avaliacao.questoes.length }}</strong>
            <small>questões na composição</small>
          </div>
        </header>

        @if (mensagemErro || mensagemSucesso) {
          <div class="feedback" [class.error]="mensagemErro" [class.success]="mensagemSucesso">
            {{ mensagemErro || mensagemSucesso }}
          </div>
        }

        <div class="workspace-grid">
          <section class="panel composition-panel">
            <div class="panel-heading">
              <div>
                <span>Composição</span>
                <h2>Questões adicionadas</h2>
              </div>
            </div>

            @if (!avaliacao.questoes.length) {
              <div class="state empty-state">
                <strong>A avaliação ainda não tem questões.</strong>
                <p>Use a busca ao lado para adicionar itens do banco de questões.</p>
              </div>
            } @else {
              <div class="composition-list">
                @for (questao of avaliacao.questoes; track questao.id; let index = $index) {
                  <article class="composition-row" [class.blocked]="questao.blocoQuestaoId">
                    <div class="question-order">
                      <strong>{{ index + 1 }}</strong>
                    </div>

                    <div class="question-body">
                      <div class="question-tags">
                        <span>{{ labelDificuldade(questao.dificuldade) }}</span>
                        @if (questao.blocoQuestaoId) {
                          <span class="block-tag">Bloco {{ questao.blocoQuestaoId }}</span>
                        }
                      </div>
                      <strong>{{ questao.enunciado }}</strong>
                      <small>{{ questao.alternativas.length }} alternativas</small>
                    </div>

                    <button type="button" class="danger-button" (click)="removerQuestao(questao)" [disabled]="salvando">
                      Remover
                    </button>
                  </article>
                }
              </div>
            }
          </section>

          <section class="panel search-panel">
            <div class="panel-heading">
              <div>
                <span>Banco</span>
                <h2>Adicionar questões</h2>
              </div>
              <button type="button" class="icon-button" (click)="buscarQuestoes()" [disabled]="buscandoQuestoes" title="Atualizar">
                AT
              </button>
            </div>

            <form class="filter-form" [formGroup]="filtrosForm" (ngSubmit)="buscarQuestoes()">
              <select formControlName="dificuldade">
                <option [ngValue]="null">Todas as dificuldades</option>
                <option value="FACIL">Fácil</option>
                <option value="MEDIA">Média</option>
                <option value="DIFICIL">Difícil</option>
              </select>
              <button type="submit" class="ghost-button" [disabled]="buscandoQuestoes">Buscar</button>
            </form>

            @if (buscandoQuestoes) {
              <div class="state">Buscando questões...</div>
            } @else if (!questoesDisponiveis.length) {
              <div class="state empty-state">
                <strong>Nenhuma questão disponível.</strong>
                <p>A busca usa a disciplina e a série desta avaliação.</p>
              </div>
            } @else {
              <div class="question-list">
                @for (questao of questoesDisponiveis; track questao.id) {
                  <article class="question-card" [class.blocked]="questao.blocoQuestaoId">
                    <div class="question-body">
                      <div class="question-tags">
                        <span>{{ labelDificuldade(questao.dificuldade) }}</span>
                        @if (questao.blocoQuestaoId) {
                          <span class="block-tag">Bloco {{ questao.blocoQuestaoId }}</span>
                        }
                      </div>
                      <strong>{{ questao.enunciado }}</strong>
                      <small>{{ questao.alternativas.length }} alternativas</small>
                    </div>

                    <div class="question-actions">
                      <button type="button" class="primary-button" (click)="adicionarQuestao(questao)" [disabled]="salvando">
                        Adicionar
                      </button>
                      @if (questao.blocoQuestaoId) {
                        <button type="button" class="ghost-button" (click)="adicionarBloco(questao.blocoQuestaoId)" [disabled]="salvando">
                          Adicionar bloco
                        </button>
                      }
                    </div>
                  </article>
                }
              </div>
            }
          </section>
        </div>
      }
    </section>
  `,
  styles: [`
    .avaliacao-detalhe-page { display: grid; gap: 18px; }
    .back-link {
      width: fit-content;
      color: var(--pa-muted-strong);
      font-weight: 800;
      text-decoration: none;
    }
    .versions-link { margin-top: 10px; }
    .detail-header { align-items: stretch; }
    .status-panel {
      display: grid;
      justify-items: end;
      min-width: 220px;
      padding: 14px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .status-panel span,
    .panel-heading span,
    .question-tags span {
      color: var(--pa-muted);
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .status-panel strong {
      font-size: 1.5rem;
      line-height: 1.1;
    }
    .status-panel small { color: var(--pa-muted); font-weight: 700; }
    .workspace-grid {
      display: grid;
      grid-template-columns: minmax(0, 1.2fr) minmax(340px, 0.8fr);
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
    .composition-list,
    .question-list {
      display: grid;
      gap: 10px;
    }
    .composition-row,
    .question-card {
      display: grid;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .composition-row {
      grid-template-columns: 42px minmax(0, 1fr) auto;
      align-items: center;
    }
    .composition-row.blocked,
    .question-card.blocked {
      border-color: rgba(79, 163, 138, 0.48);
      background: var(--pa-accent-soft);
    }
    .question-order {
      display: grid;
      width: 42px;
      height: 42px;
      place-items: center;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-ink);
    }
    .question-body {
      display: grid;
      min-width: 0;
      gap: 6px;
    }
    .question-body strong {
      min-width: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .question-body small {
      color: var(--pa-muted);
      font-weight: 700;
    }
    .question-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .question-tags span {
      padding: 4px 7px;
      border-radius: var(--pa-radius-sm);
      background: #ffffff;
    }
    .question-tags .block-tag {
      color: #ffffff;
      background: var(--pa-accent);
    }
    .filter-form {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      gap: 8px;
    }
    select {
      width: 100%;
      min-height: 40px;
      padding: 0 12px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
    }
    .question-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .icon-button,
    .ghost-button,
    .primary-button,
    .danger-button {
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
    .primary-button,
    .danger-button {
      border: 0;
      color: #ffffff;
    }
    .primary-button { background: var(--pa-accent); }
    .danger-button { background: var(--pa-danger); }
    button:disabled { opacity: 0.55; }

    @media (max-width: 1040px) {
      .workspace-grid { grid-template-columns: 1fr; }
      .status-panel { width: 100%; justify-items: start; }
    }

    @media (max-width: 640px) {
      .composition-row { grid-template-columns: 1fr; }
      .question-order { width: 36px; height: 36px; }
      .filter-form { grid-template-columns: 1fr; }
      .filter-form button,
      .question-actions button,
      .danger-button { width: 100%; }
    }
  `]
})
export class AvaliacaoDetalhePageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  avaliacao?: Avaliacao;
  questoesDisponiveis: QuestaoResponseDTO[] = [];
  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  carregandoAvaliacao = false;
  buscandoQuestoes = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  filtrosForm = this.formBuilder.group({
    dificuldade: [null as Dificuldade | null]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly avaliacaoService: AvaliacaoService,
    private readonly questaoService: QuestaoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly serieService: SerieService
  ) {}

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregarAvaliacao();
  }

  buscarQuestoes(): void {
    if (!this.avaliacao) {
      return;
    }

    this.buscandoQuestoes = true;
    this.limparMensagens();

    const { dificuldade } = this.filtrosForm.getRawValue();
    this.questaoService.listar(
      this.avaliacao.disciplinaId,
      this.avaliacao.serieId,
      undefined,
      dificuldade || undefined,
      0,
      50
    )
      .pipe(finalize(() => this.buscandoQuestoes = false))
      .subscribe({
        next: (page) => {
          const questoesNaAvaliacao = new Set((this.avaliacao?.questoes || []).map((questao) => questao.id));
          this.questoesDisponiveis = page.content.filter((questao) => !questoesNaAvaliacao.has(questao.id));
        },
        error: () => this.mensagemErro = 'Não foi possível buscar questões para esta avaliação.'
      });
  }

  adicionarQuestao(questao: QuestaoResponseDTO): void {
    this.adicionarQuestoes([questao], 'Questão adicionada à avaliação.');
  }

  adicionarBloco(blocoQuestaoId: number): void {
    this.adicionarQuestoes([], 'Bloco adicionado à avaliação.', [blocoQuestaoId]);
  }

  removerQuestao(questao: QuestaoResponseDTO): void {
    if (!this.avaliacao) {
      return;
    }

    this.salvando = true;
    this.limparMensagens();

    this.avaliacaoService.removerQuestao(this.avaliacao, questao.id)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: (avaliacao) => {
          this.avaliacao = this.normalizarAvaliacao(avaliacao);
          this.mensagemSucesso = 'Questão removida da avaliação.';
          this.buscarQuestoes();
        },
        error: () => this.mensagemErro = 'Não foi possível remover a questão.'
      });
  }

  getDisciplinaNome(id: number): string {
    return this.disciplinas.find((disciplina) => disciplina.id === id)?.nome || `Disciplina ${id}`;
  }

  getSerieNome(id: number): string {
    return this.series.find((serie) => serie.id === id)?.nome || `Série ${id}`;
  }

  labelDificuldade(dificuldade: Dificuldade): string {
    const labels: Record<Dificuldade, string> = {
      FACIL: 'Fácil',
      MEDIA: 'Média',
      DIFICIL: 'Difícil'
    };
    return labels[dificuldade];
  }

  private carregarAvaliacao(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.mensagemErro = 'Avaliação inválida.';
      return;
    }

    this.carregandoAvaliacao = true;
    this.avaliacaoService.obter(id)
      .pipe(finalize(() => this.carregandoAvaliacao = false))
      .subscribe({
        next: (avaliacao) => {
          this.avaliacao = this.normalizarAvaliacao(avaliacao);
          this.buscarQuestoes();
        },
        error: () => this.mensagemErro = 'Avaliação não encontrada.'
      });
  }

  private adicionarQuestoes(questoes: QuestaoResponseDTO[], sucesso: string, blocoQuestaoIds?: number[]): void {
    if (!this.avaliacao || !questoes.length) {
      return;
    }

    this.salvando = true;
    this.limparMensagens();

    this.avaliacaoService.adicionarQuestoes(this.avaliacao, questoes, blocoQuestaoIds)
      .pipe(finalize(() => this.salvando = false))
      .subscribe({
        next: (avaliacao) => {
          this.avaliacao = this.normalizarAvaliacao(avaliacao);
          this.mensagemSucesso = sucesso;
          this.buscarQuestoes();
        },
        error: () => this.mensagemErro = 'Não foi possível adicionar as questões.'
      });
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

  private normalizarAvaliacao(avaliacao: Avaliacao): Avaliacao {
    return {
      ...avaliacao,
      status: avaliacao.status || 'RASCUNHO',
      questoes: avaliacao.questoes || []
    };
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
