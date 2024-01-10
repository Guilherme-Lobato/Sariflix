import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista',
  templateUrl: './lista-pendentes.component.html',
  styleUrls: ['./lista-pendentes.component.scss'],
})
export class ListaPendenteComponent implements OnInit {
  filmes$!: Observable<Filme[]>;

  constructor(private filmesService: FilmesService) {}

  ngOnInit() {
    this.filmes$ = this.filmesService.filmes$;
    this.filmesService.fetchFilmesFromBackend();
  }

  excluirFilme(filme: Filme | undefined) {
    if (filme && filme._id) {
      this.filmesService.excluirFilme(filme._id);
    }
    console.log(filme)
  }
}
