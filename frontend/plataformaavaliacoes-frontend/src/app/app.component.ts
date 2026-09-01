import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Plataforma de Avaliacoes';

  navItems = [
    { label: 'Dashboard', route: '/dashboard', icon: 'IN' },
    { label: 'Banco de questoes', route: '/banco-questoes', icon: 'BQ' },
    { label: 'Series', route: '/series', icon: 'SE' },
    { label: 'Assuntos', route: '/assuntos', icon: 'AS' },
    { label: 'Blocos', route: '/blocos-questoes', icon: 'BL' },
    { label: 'Avaliacoes', route: '/avaliacoes', icon: 'AV' },
    { label: 'Correcao', route: '/correcao', icon: 'CO' },
    { label: 'Relatorios', route: '/relatorios', icon: 'RE' }
  ];
}
