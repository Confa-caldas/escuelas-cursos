import { Routes, RouterModule } from '@angular/router';

// Guards
import { AuthGuard } from './_helpers/auth.guard';
import { LoginComponent } from './components/content/login/login.component';
import { HomeComponent } from './components/content/home/home.component';
import { QuestionsLoginComponent } from './components/content/questions-login/questions-login.component';
import { ConfirmRegistroServicesComponent } from './components/content/confirm-registro-services/confirm-registro-services.component';
import { HistoricoPagosComponent } from "./components/historico-pagos/historico-pagos.component";
import { CursosComponent } from "./components/content/cursos/cursos.component";
import { SeleccionAsistentesComponent } from "./components/content/seleccion-asistentes/seleccion-asistentes.component";
import { ResumenCompraComponent } from "./components/content/resumen-compra/resumen-compra.component";
// Components
export const routes: Routes = [
  
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]}, //
  { path: 'cursos', component: CursosComponent,canActivate: [AuthGuard]}, //, canActivate: [AuthGuard]
  { path: 'asistente', component: SeleccionAsistentesComponent},
  { path: 'resumen', component: ResumenCompraComponent},
  { path: 'questions', component: QuestionsLoginComponent}, //canActivate: [AuthGuard]
  { path: 'confirm', component: ConfirmRegistroServicesComponent},
  {path: "historico", component: HistoricoPagosComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'login' }
];