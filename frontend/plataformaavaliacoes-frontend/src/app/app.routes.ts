import { Routes } from '@angular/router';

import { AssuntosPageComponent } from './features/assuntos/assuntos-page.component';
import { AvaliacaoDetalhePageComponent } from './features/avaliacoes/avaliacao-detalhe-page.component';
import { AvaliacaoVersoesPageComponent } from './features/avaliacoes/avaliacao-versoes-page.component';
import { AvaliacoesPageComponent } from './features/avaliacoes/avaliacoes-page.component';
import { BancoQuestoesPageComponent } from './features/banco-questoes/banco-questoes-page.component';
import { BlocosQuestoesPageComponent } from './features/blocos-questoes/blocos-questoes-page.component';
import { CorrecaoPageComponent } from './features/correcao/correcao-page.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { RelatoriosPageComponent } from './features/relatorios/relatorios-page.component';
import { SeriesPageComponent } from './features/series/series-page.component';
import { LoginPageComponent } from './features/auth/login-page.component';
import { EscolasPageComponent } from './features/escolas/escolas-page.component';
import { ProfessoresPageComponent } from './features/professores/professores-page.component';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginPageComponent },
  { path: 'dashboard', component: DashboardPageComponent, canActivate: [authGuard] },
  { path: 'escolas', component: EscolasPageComponent, canActivate: [authGuard] },
  { path: 'professores', component: ProfessoresPageComponent, canActivate: [authGuard] },
  { path: 'banco-questoes', component: BancoQuestoesPageComponent, canActivate: [authGuard] },
  { path: 'series', component: SeriesPageComponent, canActivate: [authGuard] },
  { path: 'assuntos', component: AssuntosPageComponent, canActivate: [authGuard] },
  { path: 'blocos-questoes', component: BlocosQuestoesPageComponent, canActivate: [authGuard] },
  { path: 'avaliacoes', component: AvaliacoesPageComponent, canActivate: [authGuard] },
  { path: 'avaliacoes/:id', component: AvaliacaoDetalhePageComponent, canActivate: [authGuard] },
  { path: 'avaliacoes/:id/versoes', component: AvaliacaoVersoesPageComponent, canActivate: [authGuard] },
  { path: 'correcao', component: CorrecaoPageComponent, canActivate: [authGuard] },
  { path: 'relatorios', component: RelatoriosPageComponent, canActivate: [authGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: '**', redirectTo: 'dashboard' }
];
