import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-lista-filmes',
  templateUrl: './lista-filmes.component.html',
  styleUrls: ['./lista-filmes.component.scss'],
})
export class ListaFilmesComponent implements OnInit {
  filmes$!: Observable<Filme[]>;
  filtroForm!: FormGroup;

  constructor(
    private filmesService: FilmesService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.filmes$ = this.filmesService.filmesAutorizados$;
    this.filmesService.fetchFilmesAutorizadosFromBackend();
    
    this.filtroForm = this.formBuilder.group({
      nomeViewer: [''],
      filme: [''],
      ano: [''],
      genero: [''],
    });
  }

  excluirFilme(filme: Filme | undefined) {
    if (filme && filme._id) {
      this.filmesService.excluirFilme(filme._id).subscribe(
        () => {
          console.log('Filme excluído com sucesso');
        },
        (error) => {
          console.error('Erro ao excluir filme:', error);
        }
      );
    }
  }

  aplicarFiltro() {
    const filtro = this.filtroForm.value;
    this.filmesService.aplicarFiltroAutorizados(filtro);
  }
}
