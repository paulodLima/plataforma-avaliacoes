import { Component } from '@angular/core';

@Component({
  selector: 'app-correcao-page',
  standalone: true,
  template: `
    <section class="page">
      <header class="page-header">
        <div>
          <span>Correcao</span>
          <h1>Correcao por imagem</h1>
          <p>Upload de foto ou scan da prova sera preparado nesta area.</p>
        </div>
      </header>

      <section class="panel empty-panel">
        <h2>Leitura em preparo</h2>
        <p>O processamento de imagem sera conectado ao servico Python nas proximas etapas.</p>
      </section>
    </section>
  `,
  styles: [`.empty-panel { display: grid; gap: 8px; padding: 16px; }`]
})
export class CorrecaoPageComponent {}
