import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaPendentesComponent } from './components/lista-pendentes/lista-pendentes.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ListaFilmesComponent } from './components/lista-filmes/lista-filmes.component';

const routes: Routes = [
  { path: 'ListaAutorizar', component: ListaPendentesComponent },
  { path: 'ListaFilmes', component: ListaFilmesComponent },
  { path: 'CadastroFilme', component: CadastroComponent },
  { path: 'Inicio/:videoId', component: InicioComponent },
  { path: 'Inicio', component: InicioComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
