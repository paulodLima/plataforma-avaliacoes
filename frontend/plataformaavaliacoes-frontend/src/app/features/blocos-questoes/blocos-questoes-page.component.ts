import { Component } from '@angular/core';

@Component({
  selector: 'app-blocos-questoes-page',
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <span>Blocos</span>
          <h1>Blocos de questoes</h1>
          <p>Textos, imagens, tirinhas e perguntas vinculadas serao gerenciados aqui.</p>
        </div>
      </header>

      <section class="panel empty-panel">
        <h2>Conteudo compartilhado</h2>
        <p>Use esta area para agrupar tirinhas, textos, imagens e perguntas relacionadas.</p>
      </section>
    </section>
  `,
  styles: [`.empty-panel { display: grid; gap: 8px; padding: 16px; }`]
})
export class BlocosQuestoesPageComponent {}
