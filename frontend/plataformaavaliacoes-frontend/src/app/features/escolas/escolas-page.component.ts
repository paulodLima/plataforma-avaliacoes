import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { EscolaService } from '../../core/services/escola.service';
import { Escola } from '../../shared/models/escola.model';

@Component({
  selector: 'app-escolas-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="escolas-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Institucional</span>
          <h1>Escolas</h1>
          <p>Gerencie as informações institucionais utilizadas nos cabeçalhos das avaliações.</p>
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
              <h2>Escolas cadastradas</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarEscolas()" [disabled]="carregando" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregando) {
            <div class="state">Carregando escolas...</div>
          } @else if (!escolas.length) {
            <div class="state empty-state">
              <strong>Nenhuma escola cadastrada.</strong>
              <p>Preencha o formulário para adicionar a primeira instituição.</p>
            </div>
          } @else {
            <div class="escolas-list">
              @for (escola of escolas; track escola.id) {
                <article class="escola-row">
                  <div class="row-main">
                    <span class="row-badge">{{ initials(escola.nome) }}</span>
                    <span>
                      <strong>{{ escola.nome }}</strong>
                      <small>
                        {{ escola.cidade || 'Cidade não informada' }}
                        {{ escola.estado ? ' - ' + escola.estado : '' }}
                      </small>
                    </span>
                  </div>
                  <button type="button" class="secondary-button" (click)="editar(escola)">Editar</button>
                </article>
              }
            </div>
          }
        </section>

        <section class="panel form-panel">
          <div class="panel-heading">
            <div>
              <span>{{ modoEdicao ? 'Editando' : 'Novo cadastro' }}</span>
              <h2>{{ modoEdicao ? 'Editar escola' : 'Criar escola' }}</h2>
            </div>
            @if (modoEdicao) {
              <button type="button" class="text-button" (click)="cancelarEdicao()">Cancelar</button>
            }
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()">
            <label for="nome">Nome da Escola</label>
            <input id="nome" type="text" formControlName="nome" placeholder="Ex.: Escola Municipal de Ensino Fundamental">
            @if (form.controls.nome.invalid && form.controls.nome.touched) {
              <small class="field-error">Informe o nome da escola.</small>
            }

            <label for="sigla">Sigla</label>
            <input id="sigla" type="text" formControlName="sigla" placeholder="Ex.: EMEF">

            <label for="cidade">Cidade</label>
            <input id="cidade" type="text" formControlName="cidade" placeholder="Ex.: São Paulo">

            <label for="estado">Estado</label>
            <input id="estado" type="text" formControlName="estado" placeholder="Ex.: SP">

            <button type="submit" class="primary-button" [disabled]="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar escola' }}
            </button>
          </form>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .escolas-page { display: grid; gap: 18px; }
    .page-header h1 { margin-bottom: 4px; }
    .page-header p { color: var(--pa-muted); }
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
      background: #ffffff;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-md);
    }
    .panel-heading {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 12px;
    }
    .panel-heading span {
      color: var(--pa-muted);
      font-size: 0.72rem;
      font-weight: 800;
      text-transform: uppercase;
    }
    .panel-heading h2 { font-size: 1.1rem; margin-top: 4px; }
    .icon-button {
      width: 42px;
      height: 42px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
      font-weight: 900;
      cursor: pointer;
    }
    .feedback { padding: 12px 14px; font-weight: 800; border-radius: 4px; }
    .feedback.error { color: #7a271a; background: #ffebe6; }
    .feedback.success { color: #075e45; background: #dcfae6; }
    .state {
      display: grid;
      gap: 6px;
      padding: 18px;
      color: var(--pa-muted);
      background: var(--pa-panel-soft);
      border-radius: 4px;
    }
    .empty-state strong { color: var(--pa-ink); }
    .escolas-list { display: grid; gap: 10px; }
    .escola-row {
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
    .row-main small { margin-top: 4px; color: var(--pa-muted); font-weight: 700; }
    form { display: grid; gap: 12px; }
    label { color: var(--pa-muted-strong); font-weight: 800; }
    input {
      width: 100%;
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
      box-sizing: border-box;
    }
    input:focus {
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
      cursor: pointer;
    }
    .secondary-button {
      padding: 8px 12px;
      border: 1px solid var(--pa-border-strong);
      border-radius: 4px;
      background: white;
      font-weight: 700;
      cursor: pointer;
    }
    .text-button {
      background: transparent;
      border: none;
      color: var(--pa-muted);
      font-weight: 700;
      cursor: pointer;
    }

    @media (max-width: 980px) {
      .workspace-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class EscolasPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly escolaService = inject(EscolaService);

  escolas: Escola[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  modoEdicao = false;
  idEditando: number | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    sigla: [''],
    cidade: [''],
    estado: ['']
  });

  ngOnInit(): void {
    this.carregarEscolas();
  }

  carregarEscolas(): void {
    this.carregando = true;
    this.limparMensagens();

    this.escolaService.listar()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (escolas) => this.escolas = escolas,
        error: () => this.mensagemErro = 'Erro ao carregar escolas.'
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

    const payload = {
      nome: value.nome!.trim(),
      sigla: value.sigla?.trim() || undefined,
      cidade: value.cidade?.trim() || undefined,
      estado: value.estado?.trim() || undefined
    };

    if (this.modoEdicao && this.idEditando) {
      this.escolaService.atualizar(this.idEditando, payload)
        .pipe(finalize(() => this.salvando = false))
        .subscribe({
          next: () => {
            this.mensagemSucesso = 'Escola atualizada com sucesso.';
            this.cancelarEdicao();
            this.carregarEscolas();
          },
          error: (err) => this.mensagemErro = err?.error?.message || 'Erro ao atualizar escola.'
        });
    } else {
      this.escolaService.criar(payload)
        .pipe(finalize(() => this.salvando = false))
        .subscribe({
          next: () => {
            this.mensagemSucesso = 'Escola criada com sucesso.';
            this.form.reset();
            this.carregarEscolas();
          },
          error: (err) => this.mensagemErro = err?.error?.message || 'Erro ao criar escola.'
        });
    }
  }

  editar(escola: Escola): void {
    this.modoEdicao = true;
    this.idEditando = escola.id;
    this.form.patchValue({
      nome: escola.nome,
      sigla: escola.sigla || '',
      cidade: escola.cidade || '',
      estado: escola.estado || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.idEditando = null;
    this.form.reset();
  }

  initials(nome: string): string {
    return nome
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }

  private limparMensagens(): void {
    this.mensagemErro = '';
    this.mensagemSucesso = '';
  }
}
