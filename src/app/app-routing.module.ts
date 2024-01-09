import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ListaComponent } from './components/lista/lista.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';

const routes: Routes = [
  {path: 'Lista', component: ListaComponent},
  {path: 'Cadastro-Filme', component: CadastroComponent},
  { path: '', redirectTo: '', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
