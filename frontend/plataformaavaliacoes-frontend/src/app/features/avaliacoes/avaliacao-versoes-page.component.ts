import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';

import { AvaliacaoService } from '../../core/services/avaliacao.service';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { SerieService } from '../../core/services/serie.service';
import { Avaliacao, AvaliacaoVersao } from '../../shared/models/avaliacao.model';
import { Disciplina } from '../../shared/models/disciplina.model';
import { Serie } from '../../shared/models/serie.model';

@Component({
  selector: 'app-avaliacao-versoes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <section class="avaliacao-versoes-page">
      <a class="back-link" [routerLink]="avaliacao ? ['/avaliacoes', avaliacao.id] : ['/avaliacoes']">Voltar para a avaliação</a>

      @if (carregandoAvaliacao) {
        <section class="panel state">Carregando avaliação...</section>
      } @else if (!avaliacao) {
        <section class="panel state">
          <strong>Avaliação não encontrada.</strong>
          <p>Volte para a listagem e selecione uma avaliação válida.</p>
        </section>
      } @else {
        <header class="page-header detail-header">
          <div>
            <span class="eyebrow">Versões da avaliação</span>
            <h1>{{ avaliacao.titulo }}</h1>
            <p>
              {{ getDisciplinaNome(avaliacao.disciplinaId) }} | {{ getSerieNome(avaliacao.serieId) }}
              @if (avaliacao.periodo) {
                | {{ avaliacao.periodo }}
              }
            </p>
          </div>

          <div class="status-panel" aria-label="Resumo das versões">
            <span>Versões geradas</span>
            <strong>{{ versoes.length }}</strong>
            <small>{{ avaliacao.questoes.length }} questões base</small>
          </div>
        </header>

        @if (mensagemErro || mensagemSucesso) {
          <div class="feedback" [class.error]="mensagemErro" [class.success]="mensagemSucesso">
            {{ mensagemErro || mensagemSucesso }}
          </div>
        }

        <div class="workspace-grid">
          <section class="panel generation-panel">
            <div class="panel-heading">
              <div>
                <span>Geração</span>
                <h2>Nova versão</h2>
              </div>
            </div>

            <form class="generation-form" [formGroup]="form" (ngSubmit)="gerarVersoes()">
              <label>
                <span>Quantidade de versões</span>
                <input type="number" min="1" formControlName="quantidadeVersoes">
              </label>

              <label class="checkbox-row">
                <input type="checkbox" formControlName="embaralharQuestoes">
                <span>Embaralhar questões mantendo blocos unidos</span>
              </label>

              <label class="checkbox-row">
                <input type="checkbox" formControlName="embaralharAlternativas">
                <span>Embaralhar alternativas nas questões objetivas</span>
              </label>

              <button type="submit" class="primary-button" [disabled]="gerando || !avaliacao.questoes.length">Gerar versões</button>
            </form>

            @if (!avaliacao.questoes.length) {
              <div class="state empty-state">
                <strong>A avaliação ainda não possui questões.</strong>
                <p>Adicione questões antes de gerar versões.</p>
              </div>
            }
          </section>

          <section class="panel versions-panel">
            <div class="panel-heading">
              <div>
                <span>Histórico</span>
                <h2>Versões geradas</h2>
              </div>
              <button type="button" class="icon-button" (click)="carregarVersoes()" [disabled]="carregandoVersoes" title="Atualizar">AT</button>
            </div>

            @if (carregandoVersoes) {
              <div class="state">Carregando versões...</div>
            } @else if (!versoes.length) {
              <div class="state empty-state">
                <strong>Nenhuma versão foi gerada.</strong>
                <p>Use o formulário ao lado para criar a primeira versão desta avaliação.</p>
              </div>
            } @else {
              <div class="versions-list">
                @for (versao of versoes; track versao.id) {
                  <article class="version-row" [class.selected]="versaoSelecionada?.id === versao.id">
                    <button type="button" class="version-main" (click)="selecionarVersao(versao)">
                      <div class="version-code">{{ versao.codigo }}</div>
                      <div class="version-meta">
                        <strong>{{ versao.gabarito.length }} itens no gabarito</strong>
                        <small>{{ formatarData(versao.createdAt) }}</small>
                      </div>
                    </button>
                  </article>
                }
              </div>
            }
          </section>
        </div>

        <section class="panel details-panel">
          <div class="panel-heading">
            <div>
              <span>Consulta</span>
              <h2>Detalhes do gabarito</h2>
            </div>
          </div>

          @if (!versaoSelecionada) {
            <div class="state empty-state">
              <strong>Selecione uma versão.</strong>
              <p>Ao selecionar um código, o gabarito detalhado aparece aqui.</p>
            </div>
          } @else {
            <div class="details-header">
              <div>
                <strong>Código {{ versaoSelecionada.codigo }}</strong>
                <small>{{ formatarData(versaoSelecionada.createdAt) }}</small>
              </div>
              <button type="button" class="ghost-button" (click)="recarregarVersaoSelecionada()" [disabled]="consultandoVersao">Reconsultar código</button>
            </div>

            <div class="gabarito-list">
              @for (item of versaoSelecionada.gabarito; track item.numeroQuestao) {
                <article class="gabarito-row">
                  <div class="question-order"><strong>{{ item.numeroQuestao }}</strong></div>
                  <div class="question-body">
                    <strong>Questão {{ item.questaoId }}</strong>
                    <small>Resposta correta: {{ item.letraCorreta }}</small>
                  </div>
                </article>
              }
            </div>
          }
        </section>
      }
    </section>
  `,
  styles: [`
    .avaliacao-versoes-page { display: grid; gap: 18px; }
    .back-link {
      width: fit-content;
      color: var(--pa-muted-strong);
      font-weight: 800;
      text-decoration: none;
    }
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
    .panel-heading span {
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
      grid-template-columns: minmax(320px, 0.7fr) minmax(0, 1fr);
      gap: 10px;
      align-items: start;
    }
    .panel { display: grid; gap: 14px; padding: 16px; }
    .panel-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .generation-form {
      display: grid;
      gap: 14px;
      padding: 16px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .generation-form label { display: grid; gap: 8px; }
    .generation-form span { font-weight: 700; color: var(--pa-ink); }
    .generation-form input[type='number'] {
      min-height: 40px;
      padding: 0 12px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      background: #ffffff;
      color: var(--pa-ink);
    }
    .checkbox-row {
      display: flex !important;
      align-items: center;
      gap: 10px;
      font-weight: 700;
      color: var(--pa-ink);
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
    .versions-list,
    .gabarito-list { display: grid; gap: 10px; }
    .version-row,
    .gabarito-row {
      display: grid;
      gap: 12px;
      padding: 12px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      background: var(--pa-panel-soft);
    }
    .version-row.selected { border-color: rgba(79, 163, 138, 0.48); background: var(--pa-accent-soft); }
    .version-main {
      display: grid;
      grid-template-columns: 88px minmax(0, 1fr);
      gap: 12px;
      align-items: center;
      width: 100%;
      border: 0;
      padding: 0;
      text-align: left;
      background: transparent;
      color: inherit;
    }
    .version-code,
    .question-order {
      display: grid;
      width: 72px;
      height: 42px;
      place-items: center;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-ink);
      font-weight: 800;
    }
    .version-meta,
    .question-body {
      display: grid;
      gap: 4px;
      min-width: 0;
    }
    .version-meta small,
    .question-body small,
    .details-header small { color: var(--pa-muted); font-weight: 700; }
    .details-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;
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

    @media (max-width: 1040px) {
      .workspace-grid { grid-template-columns: 1fr; }
      .status-panel { width: 100%; justify-items: start; }
      .details-header { align-items: stretch; flex-direction: column; }
    }

    @media (max-width: 640px) {
      .version-main,
      .gabarito-row { grid-template-columns: 1fr; }
      .question-order,
      .version-code { width: 42px; }
      .primary-button,
      .ghost-button { width: 100%; }
    }
  `]
})
export class AvaliacaoVersoesPageComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);

  avaliacao?: Avaliacao;
  versoes: AvaliacaoVersao[] = [];
  versaoSelecionada?: AvaliacaoVersao;
  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  carregandoAvaliacao = false;
  carregandoVersoes = false;
  gerando = false;
  consultandoVersao = false;
  mensagemErro = '';
  mensagemSucesso = '';

  form = this.formBuilder.group({
    quantidadeVersoes: [1, [Validators.required, Validators.min(1)]],
    embaralharQuestoes: [true],
    embaralharAlternativas: [true]
  });

  constructor(
    private readonly route: ActivatedRoute,
    private readonly avaliacaoService: AvaliacaoService,
    private readonly disciplinaService: DisciplinaService,
    private readonly serieService: SerieService
  ) {}

  ngOnInit(): void {
    this.carregarReferencias();
    this.carregarAvaliacao();
  }

  carregarVersoes(): void {
    if (!this.avaliacao) {
      return;
    }

    this.carregandoVersoes = true;
    this.limparMensagens();

    this.avaliacaoService.listarVersoes(this.avaliacao.id)
      .pipe(finalize(() => this.carregandoVersoes = false))
      .subscribe({
        next: (versoes) => {
          this.versoes = versoes;
          if (!this.versaoSelecionada && versoes.length) {
            this.versaoSelecionada = versoes[0];
          }
        },
        error: () => this.mensagemErro = 'Não foi possível carregar as versões.'
      });
  }

  gerarVersoes(): void {
    if (!this.avaliacao || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.gerando = true;
    this.limparMensagens();

    const value = this.form.getRawValue();
    this.avaliacaoService.gerarVersoes(this.avaliacao.id, {
      quantidadeVersoes: Number(value.quantidadeVersoes),
      embaralharQuestoes: !!value.embaralharQuestoes,
      embaralharAlternativas: !!value.embaralharAlternativas
    })
      .pipe(finalize(() => this.gerando = false))
      .subscribe({
        next: (versoes) => {
          this.mensagemSucesso = versoes.length > 1 ? 'Versões geradas com sucesso.' : 'Versão gerada com sucesso.';
          this.versaoSelecionada = versoes[0];
          this.carregarVersoes();
        },
        error: (error) => {
          this.mensagemErro = error?.error?.message || 'Não foi possível gerar as versões.';
        }
      });
  }

  selecionarVersao(versao: AvaliacaoVersao): void {
    this.versaoSelecionada = versao;
  }

  recarregarVersaoSelecionada(): void {
    if (!this.versaoSelecionada) {
      return;
    }

    this.consultandoVersao = true;
    this.limparMensagens();

    this.avaliacaoService.consultarVersaoPorCodigo(this.versaoSelecionada.codigo)
      .pipe(finalize(() => this.consultandoVersao = false))
      .subscribe({
        next: (versao) => this.versaoSelecionada = versao,
        error: () => this.mensagemErro = 'Não foi possível consultar o código informado.'
      });
  }

  getDisciplinaNome(id: number): string {
    return this.disciplinas.find((disciplina) => disciplina.id === id)?.nome || `Disciplina ${id}`;
  }

  getSerieNome(id: number): string {
    return this.series.find((serie) => serie.id === id)?.nome || `Série ${id}`;
  }

  formatarData(data: string): string {
    return new Date(data).toLocaleString('pt-BR');
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
          this.avaliacao = avaliacao;
          this.carregarVersoes();
        },
        error: () => this.mensagemErro = 'Avaliação não encontrada.'
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

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}