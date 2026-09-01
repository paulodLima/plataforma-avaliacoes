import { Routes } from '@angular/router';

import { AssuntosPageComponent } from './features/assuntos/assuntos-page.component';
import { AvaliacaoDetalhePageComponent } from './features/avaliacoes/avaliacao-detalhe-page.component';
import { AvaliacoesPageComponent } from './features/avaliacoes/avaliacoes-page.component';
import { BancoQuestoesPageComponent } from './features/banco-questoes/banco-questoes-page.component';
import { BlocosQuestoesPageComponent } from './features/blocos-questoes/blocos-questoes-page.component';
import { CorrecaoPageComponent } from './features/correcao/correcao-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { RelatoriosPageComponent } from './features/relatorios/relatorios-page.component';
import { SeriesPageComponent } from './features/series/series-page.component';

export const routes: Routes = [
  { path: 'dashboard', component: DashboardPageComponent },
  { path: 'banco-questoes', component: BancoQuestoesPageComponent },
  { path: 'series', component: SeriesPageComponent },
  { path: 'assuntos', component: AssuntosPageComponent },
  { path: 'blocos-questoes', component: BlocosQuestoesPageComponent },
  { path: 'avaliacoes', component: AvaliacoesPageComponent },
  { path: 'avaliacoes/:id', component: AvaliacaoDetalhePageComponent },
  { path: 'correcao', component: CorrecaoPageComponent },
  { path: 'relatorios', component: RelatoriosPageComponent },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
