import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPendenteComponent } from './components/lista-pendentes/lista-pendentes.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { HeaderComponent } from './components/header/header.component';

const routes: Routes = [
  {path: 'Lista', component: ListaPendenteComponent},
  {path: 'Cadastro-Filme', component: CadastroComponent},
  {path: 'Inicio', component: HeaderComponent},
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
