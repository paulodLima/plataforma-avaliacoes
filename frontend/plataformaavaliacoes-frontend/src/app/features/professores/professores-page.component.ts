import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { EscolaService } from '../../core/services/escola.service';
import { ProfessorService } from '../../core/services/professor.service';
import { Escola } from '../../shared/models/escola.model';
import { Professor } from '../../shared/models/professor.model';

@Component({
  selector: 'app-professores-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="professores-page">
      <header class="page-header">
        <div>
          <span class="eyebrow">Equipe</span>
          <h1>Professores</h1>
          <p>Gerencie o cadastro e acesso dos professores da instituição.</p>
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
              <h2>Professores cadastrados</h2>
            </div>
            <button type="button" class="icon-button" (click)="carregarProfessores()" [disabled]="carregando" title="Atualizar">
              AT
            </button>
          </div>

          @if (carregando) {
            <div class="state">Carregando professores...</div>
          } @else if (!professores.length) {
            <div class="state empty-state">
              <strong>Nenhum professor cadastrado.</strong>
              <p>Preencha o formulário para adicionar o primeiro professor.</p>
            </div>
          } @else {
            <div class="professores-list">
              @for (professor of professores; track professor.id) {
                <article class="professor-row">
                  <div class="row-main">
                    <span class="row-badge">{{ initials(professor.nome) }}</span>
                    <span>
                      <strong>{{ professor.nome }}</strong>
                      <small>
                        {{ professor.email }}
                        @if (professor.escolaNome) {
                          | {{ professor.escolaNome }}
                        }
                      </small>
                    </span>
                  </div>
                  <button type="button" class="secondary-button" (click)="editar(professor)">Editar</button>
                </article>
              }
            </div>
          }
        </section>

        <section class="panel form-panel">
          <div class="panel-heading">
            <div>
              <span>{{ modoEdicao ? 'Editando' : 'Novo cadastro' }}</span>
              <h2>{{ modoEdicao ? 'Editar professor' : 'Criar professor' }}</h2>
            </div>
            @if (modoEdicao) {
              <button type="button" class="text-button" (click)="cancelarEdicao()">Cancelar</button>
            }
          </div>

          <form [formGroup]="form" (ngSubmit)="salvar()">
            <label for="nome">Nome do Professor</label>
            <input id="nome" type="text" formControlName="nome" placeholder="Ex.: João da Silva">
            @if (form.controls.nome.invalid && form.controls.nome.touched) {
              <small class="field-error">Informe o nome completo.</small>
            }

            <label for="email">E-mail</label>
            <input id="email" type="email" formControlName="email" placeholder="Ex.: professor@escola.com">
            @if (form.controls.email.invalid && form.controls.email.touched) {
              <small class="field-error">Informe um e-mail válido.</small>
            }

            <label for="telefone">Telefone</label>
            <input id="telefone" type="text" formControlName="telefone" placeholder="Ex.: (11) 99999-9999">

            <label for="escolaId">Escola</label>
            <select id="escolaId" formControlName="escolaId">
              <option [ngValue]="null">Selecione uma escola</option>
              @for (escola of escolas; track escola.id) {
                <option [ngValue]="escola.id">{{ escola.nome }}</option>
              }
            </select>
            @if (form.controls.escolaId.invalid && form.controls.escolaId.touched) {
              <small class="field-error">Selecione a escola.</small>
            }

            <label for="senha">
              Senha
              @if (modoEdicao) {
                <small>(deixe em branco para não alterar)</small>
              }
            </label>
            <input id="senha" type="password" formControlName="senha" placeholder="Senha de acesso">
            @if (form.controls.senha.invalid && form.controls.senha.touched) {
              <small class="field-error">A senha é obrigatória no cadastro.</small>
            }

            <button type="submit" class="primary-button" [disabled]="salvando">
              {{ salvando ? 'Salvando...' : 'Salvar professor' }}
            </button>
          </form>
        </section>
      </div>
    </section>
  `,
  styles: [`
    .professores-page { display: grid; gap: 18px; }
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
    .professores-list { display: grid; gap: 10px; }
    .professor-row {
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
    label small { font-weight: 400; color: var(--pa-muted); }
    input, select {
      width: 100%;
      min-height: 42px;
      padding: 0 14px;
      border: 1px solid var(--pa-border-strong);
      border-radius: var(--pa-radius-sm);
      color: var(--pa-ink);
      background: var(--pa-panel-soft);
      box-sizing: border-box;
    }
    input:focus, select:focus {
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
export class ProfessoresPageComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly professorService = inject(ProfessorService);
  private readonly escolaService = inject(EscolaService);

  professores: Professor[] = [];
  escolas: Escola[] = [];
  carregando = false;
  salvando = false;
  mensagemErro = '';
  mensagemSucesso = '';

  modoEdicao = false;
  idEditando: number | null = null;

  form = this.fb.group({
    nome: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    telefone: [''],
    escolaId: [null as number | null, Validators.required],
    senha: ['', Validators.required]
  });

  ngOnInit(): void {
    this.carregarEscolas();
    this.carregarProfessores();
  }

  carregarEscolas(): void {
    this.escolaService.listar().subscribe({
      next: (escolas) => this.escolas = escolas,
      error: () => this.mensagemErro = 'Erro ao carregar escolas.'
    });
  }

  carregarProfessores(): void {
    this.carregando = true;
    this.limparMensagens();

    this.professorService.listar()
      .pipe(finalize(() => this.carregando = false))
      .subscribe({
        next: (professores) => this.professores = professores,
        error: () => this.mensagemErro = 'Erro ao carregar professores.'
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
      email: value.email!.trim(),
      telefone: value.telefone?.trim() || undefined,
      senha: value.senha || undefined,
      escolaId: Number(value.escolaId)
    };

    if (this.modoEdicao && this.idEditando) {
      this.professorService.atualizar(this.idEditando, payload)
        .pipe(finalize(() => this.salvando = false))
        .subscribe({
          next: () => {
            this.mensagemSucesso = 'Professor atualizado com sucesso.';
            this.cancelarEdicao();
            this.carregarProfessores();
          },
          error: (err) => this.mensagemErro = err?.error?.message || 'Erro ao atualizar professor.'
        });
    } else {
      this.professorService.criar(payload)
        .pipe(finalize(() => this.salvando = false))
        .subscribe({
          next: () => {
            this.mensagemSucesso = 'Professor criado com sucesso.';
            this.form.reset();
            this.carregarProfessores();
          },
          error: (err) => this.mensagemErro = err?.error?.message || 'Erro ao criar professor.'
        });
    }
  }

  editar(professor: Professor): void {
    this.modoEdicao = true;
    this.idEditando = professor.id;
    this.form.patchValue({
      nome: professor.nome,
      email: professor.email,
      telefone: professor.telefone || '',
      escolaId: professor.escolaId,
      senha: ''
    });
    this.form.controls.senha.removeValidators(Validators.required);
    this.form.controls.senha.updateValueAndValidity();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  cancelarEdicao(): void {
    this.modoEdicao = false;
    this.idEditando = null;
    this.form.reset();
    this.form.controls.senha.addValidators(Validators.required);
    this.form.controls.senha.updateValueAndValidity();
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
