import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BlocoQuestaoService, BlocoQuestao } from '../../core/services/bloco-questao.service';
import { DisciplinaService } from '../../core/services/disciplina.service';
import { Disciplina } from '../../shared/models/disciplina.model';
import { SerieService } from '../../core/services/serie.service';
import { Serie } from '../../shared/models/serie.model';
import { AssuntoService } from '../../core/services/assunto.service';
import { Assunto } from '../../shared/models/assunto.model';

@Component({
  selector: 'app-blocos-questoes-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <span>Blocos</span>
          <h1>Blocos de questoes</h1>
          <p>Textos, imagens, tirinhas e perguntas vinculadas serao gerenciados aqui.</p>
        </div>
      </header>

      <section class="panel">
        <h2>Cadastrar Bloco</h2>
        <form [formGroup]="blocoForm" (ngSubmit)="onSubmit()" class="form-container">
          <div class="form-group">
            <label for="textoBase">Texto Base (Opcional se houver anexo)</label>
            <textarea id="textoBase" formControlName="textoBase" rows="4"></textarea>
          </div>

          <div class="form-group">
            <label for="anexoUrl">URL do Anexo (Opcional)</label>
            <input type="text" id="anexoUrl" formControlName="anexoUrl">
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="disciplinaId">Disciplina *</label>
              <select id="disciplinaId" formControlName="disciplinaId">
                <option value="">Selecione...</option>
                <option *ngFor="let d of disciplinas" [value]="d.id">{{ d.nome }}</option>
              </select>
              <div *ngIf="blocoForm.get('disciplinaId')?.invalid && blocoForm.get('disciplinaId')?.touched" class="error-msg">
                Disciplina é obrigatória
              </div>
            </div>

            <div class="form-group">
              <label for="serieId">Série *</label>
              <select id="serieId" formControlName="serieId">
                <option value="">Selecione...</option>
                <option *ngFor="let s of series" [value]="s.id">{{ s.nome }}</option>
              </select>
              <div *ngIf="blocoForm.get('serieId')?.invalid && blocoForm.get('serieId')?.touched" class="error-msg">
                Série é obrigatória
              </div>
            </div>

            <div class="form-group">
              <label for="assuntoId">Assunto (Opcional)</label>
              <select id="assuntoId" formControlName="assuntoId">
                <option value="">Selecione...</option>
                <option *ngFor="let a of assuntos" [value]="a.id">{{ a.nome }}</option>
              </select>
            </div>
          </div>

          <div *ngIf="formError" class="error-msg global-error">{{ formError }}</div>

          <button type="submit" [disabled]="blocoForm.invalid || isLoading">
            {{ isLoading ? 'Salvando...' : 'Salvar Bloco' }}
          </button>
        </form>
      </section>

      <section class="panel">
        <h2>Lista de Blocos</h2>
        <div *ngIf="isLoadingList" class="loading">Carregando blocos...</div>
        <div *ngIf="!isLoadingList && blocos.length === 0" class="empty-panel">
          <p>Nenhum bloco cadastrado ainda.</p>
        </div>

        <div *ngIf="!isLoadingList && blocos.length > 0" class="blocos-list">
          <div *ngFor="let bloco of blocos" class="bloco-card">
            <div class="bloco-header">
              <span class="bloco-id">Bloco #{{ bloco.id }}</span>
              <span class="bloco-tags">
                <span class="tag">Disciplina: {{ getDisciplinaNome(bloco.disciplinaId) }}</span>
                <span class="tag">Série: {{ getSerieNome(bloco.serieId) }}</span>
              </span>
            </div>

            <div class="bloco-content">
              <div *ngIf="bloco.textoBase" class="texto-base-preview">
                <strong>Texto Base:</strong>
                <p>{{ bloco.textoBase.length > 100 ? (bloco.textoBase | slice:0:100) + '...' : bloco.textoBase }}</p>
              </div>
              <div *ngIf="bloco.anexoUrl" class="anexo-preview">
                <strong>Anexo:</strong> <a [href]="bloco.anexoUrl" target="_blank">{{ bloco.anexoUrl }}</a>
              </div>
            </div>

            <div class="bloco-footer">
              <button (click)="verDetalhes(bloco)" class="btn-secondary">Ver Questões Vinculadas ({{ bloco.questoes?.length || 0 }})</button>
            </div>

            <div *ngIf="blocoSelecionado?.id === bloco.id" class="bloco-detalhes">
               <h4>Questões Vinculadas:</h4>
               <ul *ngIf="bloco.questoes && bloco.questoes.length > 0; else noQuestoes">
                  <li *ngFor="let q of bloco.questoes">
                     <p><strong>Questão #{{ q.id }}</strong> - {{ q.enunciado | slice:0:50 }}...</p>
                  </li>
               </ul>
               <ng-template #noQuestoes><p>Nenhuma questão vinculada a este bloco.</p></ng-template>
            </div>
          </div>
        </div>
      </section>
    </section>
  `,
  styles: [`
    .form-container { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
    .form-row { display: flex; gap: 16px; }
    .form-group { display: flex; flex-direction: column; gap: 4px; flex: 1; }
    input, select, textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
    button { padding: 8px 16px; background: #0066cc; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #cccccc; cursor: not-allowed; }
    .btn-secondary { background: #e0e0e0; color: #333; }
    .error-msg { color: #cc0000; font-size: 12px; }
    .global-error { font-weight: bold; margin-top: 8px; }
    .empty-panel { display: grid; gap: 8px; padding: 16px; text-align: center; color: #666; }

    .blocos-list { display: flex; flex-direction: column; gap: 16px; margin-top: 16px; }
    .bloco-card { border: 1px solid #ddd; border-radius: 8px; padding: 16px; }
    .bloco-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; border-bottom: 1px solid #eee; padding-bottom: 8px; }
    .bloco-id { font-weight: bold; font-size: 1.1em; }
    .bloco-tags { display: flex; gap: 8px; }
    .tag { background: #f0f0f0; padding: 4px 8px; border-radius: 4px; font-size: 0.85em; }
    .bloco-content { margin-bottom: 16px; }
    .texto-base-preview p { color: #555; background: #fafafa; padding: 8px; border-left: 3px solid #ddd; }
    .bloco-footer { display: flex; justify-content: flex-end; }
    .bloco-detalhes { margin-top: 16px; padding: 12px; background: #f9f9f9; border-radius: 4px; border: 1px dashed #ccc; }
    .bloco-detalhes ul { padding-left: 20px; }
    .bloco-detalhes li { margin-bottom: 8px; }
  `]
})
export class BlocosQuestoesPageComponent implements OnInit {
  blocoForm: FormGroup;
  blocos: BlocoQuestao[] = [];
  disciplinas: Disciplina[] = [];
  series: Serie[] = [];
  assuntos: Assunto[] = [];

  isLoading = false;
  isLoadingList = false;
  formError = '';
  blocoSelecionado: BlocoQuestao | null = null;

  constructor(
    private fb: FormBuilder,
    private blocoService: BlocoQuestaoService,
    private disciplinaService: DisciplinaService,
    private serieService: SerieService,
    private assuntoService: AssuntoService
  ) {
    this.blocoForm = this.fb.group({
      textoBase: [''],
      anexoUrl: [''],
      disciplinaId: ['', Validators.required],
      serieId: ['', Validators.required],
      assuntoId: ['']
    });
  }

  ngOnInit() {
    this.loadDependencies();
    this.loadBlocos();
  }

  loadDependencies() {
    this.disciplinaService.listar().subscribe(res => this.disciplinas = res || []);
    this.serieService.listar().subscribe(res => this.series = res || []);
    this.assuntoService.listar().subscribe(res => this.assuntos = res || []);
  }

  loadBlocos() {
    this.isLoadingList = true;
    this.blocoService.findAll(0, 50).subscribe({
      next: (res) => {
        this.blocos = res.content || [];
        this.isLoadingList = false;
      },
      error: (err) => {
        console.error('Erro ao carregar blocos', err);
        this.isLoadingList = false;
      }
    });
  }

  onSubmit() {
    if (this.blocoForm.invalid) {
      this.blocoForm.markAllAsTouched();
      return;
    }

    const { textoBase, anexoUrl } = this.blocoForm.value;
    if (!textoBase?.trim() && !anexoUrl?.trim()) {
      this.formError = 'É obrigatório informar ao menos um Texto Base ou a URL do Anexo.';
      return;
    }

    this.isLoading = true;
    this.formError = '';

    const payload = { ...this.blocoForm.value };
    if (!payload.assuntoId) delete payload.assuntoId;
    if (!payload.textoBase) delete payload.textoBase;
    if (!payload.anexoUrl) delete payload.anexoUrl;

    // Convert IDs to numbers
    payload.disciplinaId = Number(payload.disciplinaId);
    payload.serieId = Number(payload.serieId);
    if (payload.assuntoId) payload.assuntoId = Number(payload.assuntoId);

    this.blocoService.create(payload).subscribe({
      next: (novoBloco) => {
        this.isLoading = false;
        this.blocoForm.reset({
          textoBase: '',
          anexoUrl: '',
          disciplinaId: '',
          serieId: '',
          assuntoId: ''
        });
        this.loadBlocos(); // reload list
      },
      error: (err) => {
        this.isLoading = false;
        this.formError = 'Erro ao salvar o bloco. Verifique os dados e tente novamente.';
        console.error(err);
      }
    });
  }

  verDetalhes(bloco: BlocoQuestao) {
    if (this.blocoSelecionado?.id === bloco.id) {
      this.blocoSelecionado = null; // Toggle off
    } else {
      this.blocoService.findById(bloco.id!).subscribe({
        next: (blocoCompleto) => this.blocoSelecionado = blocoCompleto,
        error: (err) => console.error('Erro ao carregar detalhes do bloco', err)
      });
    }
  }

  getDisciplinaNome(id: number): string {
    const d = this.disciplinas.find(x => x.id === id);
    return d ? d.nome : String(id);
  }

  getSerieNome(id: number): string {
    const s = this.series.find(x => x.id === id);
    return s ? s.nome : String(id);
  }
}
