import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Plataforma de Avaliações';

  navItems = [
    { label: 'Início', route: '/dashboard', icon: 'IN' },
    { label: 'Banco de questões', route: '/banco-questoes', icon: 'BQ' },
    { label: 'Séries', route: '/series', icon: 'SE' },
    { label: 'Assuntos', route: '/assuntos', icon: 'AS' },
    { label: 'Blocos', route: '/blocos-questoes', icon: 'BL' },
    { label: 'Avaliações', route: '/avaliacoes', icon: 'AV' },
    { label: 'Correção', route: '/correcao', icon: 'CO' },
    { label: 'Relatórios', route: '/relatorios', icon: 'RE' }
  ];
}
