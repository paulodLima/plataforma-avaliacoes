import { Component } from '@angular/core';

@Component({
  selector: 'app-avaliacoes-page',
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <span>Avaliacoes</span>
          <h1>Montagem de provas</h1>
          <p>Criacao de avaliacoes, selecao de questoes e geracao de versoes entram aqui.</p>
        </div>
      </header>

      <section class="panel empty-panel">
        <h2>Fluxo em preparo</h2>
        <p>Esta area vai concentrar a composicao das provas e suas versoes.</p>
      </section>
    </section>
  `,
  styles: [`.empty-panel { display: grid; gap: 8px; padding: 16px; }`]
})
export class AvaliacoesPageComponent {}
