import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private filmesSubject: BehaviorSubject<Filme[]> = new BehaviorSubject<Filme[]>([]);
  filmes$: Observable<Filme[]> = this.filmesSubject.asObservable();

  adicionarFilme(filme: Filme) {
    const filmes = [...this.filmesSubject.value, filme];
    this.filmesSubject.next(filmes);
  }
}

export interface Filme {
  nomeViewer: string;
  nomeFilme: string;
  anoLancamento: string;
  genero: string;
  tempoDuracao: string;
  link: string;
}
