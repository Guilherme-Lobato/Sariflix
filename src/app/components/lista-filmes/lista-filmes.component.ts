import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-lista-filmes',
  templateUrl: './lista-filmes.component.html',
  styleUrls: ['./lista-filmes.component.scss'],
})
export class ListaFilmesComponent implements OnInit {
  filmes$!: Observable<Filme[]>;

  constructor(private filmesService: FilmesService) {}

  ngOnInit() {
    this.filmes$ = this.filmesService.filmesAutorizados$;
    this.filmesService.fetchFilmesAutorizadosFromBackend();
  }

  excluirFilme(filme: Filme | undefined) {
    if (filme && filme._id) {
      this.filmesService.excluirFilme(filme._id)
        .subscribe(
          () => {
            console.log('Filme excluído com sucesso');
            this.filmesService.fetchFilmesAutorizadosFromBackend(); // Atualiza a lista de filmes autorizados
          },
          (error: any) => {
            console.error('Erro ao excluir filme:', error);
          }
        );
    }
  }
}
