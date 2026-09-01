import { Component } from '@angular/core';

@Component({
  selector: 'app-relatorios-page',
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <span>Relatorios</span>
          <h1>Resultados pedagogicos</h1>
          <p>Indicadores por avaliacao, turma, questao e assunto serao exibidos aqui.</p>
        </div>
      </header>

      <section class="panel empty-panel">
        <h2>Indicadores futuros</h2>
        <p>Os relatorios vao usar os resultados das provas corrigidas.</p>
      </section>
    </section>
  `,
  styles: [`.empty-panel { display: grid; gap: 8px; padding: 16px; }`]
})
export class RelatoriosPageComponent {}
