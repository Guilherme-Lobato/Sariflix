import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ListaPendentesComponent } from './components/lista-pendentes/lista-pendentes.component';
import { CadastroComponent } from './components/cadastro/cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilmesService } from './service/filme.service';
import { ListaFilmesComponent } from './components/lista-filmes/lista-filmes.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { SorteioModalComponent } from './components/sorteio-modal/sorteio-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AvaliacaoComponent } from './components/avaliacao/avaliacao.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListaPendentesComponent,
    CadastroComponent,
    ListaFilmesComponent,
    InicioComponent,
    SorteioModalComponent,
    AvaliacaoComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    FormsModule,
  ],
  providers:[FilmesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
