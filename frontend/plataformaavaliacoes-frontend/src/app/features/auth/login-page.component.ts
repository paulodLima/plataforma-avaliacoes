import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Bem-vindo</h1>
          <p>Faça login para acessar a Plataforma de Avaliações</p>
        </div>

        @if (mensagemErro) {
          <div class="feedback error">
            {{ mensagemErro }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="login()">
          <label for="login">E-mail ou Telefone</label>
          <input
            id="login"
            type="text"
            formControlName="login"
            placeholder="Ex.: professora@escola.com">
          @if (form.controls.login.invalid && form.controls.login.touched) {
            <small class="field-error">Campo obrigatório.</small>
          }

          <label for="senha">Senha</label>
          <input
            id="senha"
            type="password"
            formControlName="senha"
            placeholder="Sua senha">
          @if (form.controls.senha.invalid && form.controls.senha.touched) {
            <small class="field-error">Campo obrigatório.</small>
          }

          <button type="submit" class="primary-button" [disabled]="carregando">
            {{ carregando ? 'Entrando...' : 'Entrar' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: grid;
      place-items: center;
      min-height: 100vh;
      background-color: var(--pa-background);
      padding: 16px;
    }
    .login-card {
      width: 100%;
      max-width: 400px;
      padding: 32px;
      border: 1px solid var(--pa-border);
      border-radius: var(--pa-radius-md);
      background-color: var(--pa-panel);
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .login-header {
      text-align: center;
      margin-bottom: 24px;
    }
    .login-header h1 {
      margin: 0 0 8px;
      color: var(--pa-ink);
    }
    .login-header p {
      margin: 0;
      color: var(--pa-muted);
      font-size: 0.9rem;
    }
    form {
      display: grid;
      gap: 16px;
    }
    label {
      color: var(--pa-muted-strong);
      font-weight: 800;
      font-size: 0.85rem;
    }
    input {
      width: 100%;
      min-height: 44px;
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
    .field-error {
      color: var(--pa-danger);
      font-weight: 700;
      font-size: 0.8rem;
    }
    .primary-button {
      min-height: 44px;
      margin-top: 8px;
      border: 0;
      border-radius: var(--pa-radius-sm);
      color: #ffffff;
      background: var(--pa-accent);
      font-weight: 800;
      font-size: 1rem;
      cursor: pointer;
    }
    .primary-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    .feedback {
      padding: 12px 14px;
      margin-bottom: 16px;
      font-weight: 800;
      border-radius: var(--pa-radius-sm);
    }
    .feedback.error {
      color: #7a271a;
      background: #ffebe6;
    }
  `]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  form = this.fb.group({
    login: ['', Validators.required],
    senha: ['', Validators.required]
  });

  carregando = false;
  mensagemErro = '';

  login(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.carregando = true;
    this.mensagemErro = '';

    const payload = {
      login: this.form.value.login!,
      senha: this.form.value.senha!
    };

    this.authService.login(payload).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.carregando = false;
        if (err.status === 401) {
          this.mensagemErro = 'Login ou senha incorretos.';
        } else {
          this.mensagemErro = 'Erro ao conectar no servidor.';
        }
      }
    });
  }
}
