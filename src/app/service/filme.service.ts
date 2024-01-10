import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private filmesSubject: BehaviorSubject<Filme[]> = new BehaviorSubject<Filme[]>([]);
  filmes$: Observable<Filme[]> = this.filmesSubject.asObservable();

  constructor(private http: HttpClient) {
    this.fetchFilmesFromLocalStorage();
    this.fetchFilmesFromBackend();
  }

  public adicionarFilme(filme: Filme) {
    const filmes = [...this.filmesSubject.value, filme];
    this.updateFilmes(filmes);
    this.updateLocalStorage(filmes);
  }

  public excluirFilme(filmeId: string) {
    this.http.delete(`http://localhost:3000/api/movies/${filmeId}`)
      .subscribe(
        () => {
          console.log('Filme excluído com sucesso do backend');
          // Atualiza os filmes no frontend após a exclusão
          this.removeFilmeFromList(filmeId);
        },
        error => console.error('Erro ao excluir filme do backend:', error)
      );
  }

  private removeFilmeFromList(filmeId: string) {
    // Atualiza a lista de filmes removendo o filme pelo ID
    const filmes = this.filmesSubject.value.filter(filme => filme._id !== filmeId);
    this.updateFilmes(filmes);
    this.updateLocalStorage(filmes);
  }

  public fetchFilmesFromBackend() {
    this.http.get<Filme[]>('http://localhost:3000/api/movies')
      .subscribe(
        filmes => {
          this.updateFilmes(filmes);
          this.updateLocalStorage(filmes);
        },
        error => console.error('Erro ao recuperar filmes do backend:', error)
      );
  }

  private fetchFilmesFromLocalStorage() {
    const filmesFromLocalStorage = localStorage.getItem('filmes');
    if (filmesFromLocalStorage) {
      const filmes = JSON.parse(filmesFromLocalStorage);
      this.updateFilmes(filmes);
    }
  }

  private updateFilmes(filmes: Filme[]) {
    this.filmesSubject.next(filmes);
  }

  private updateLocalStorage(filmes: Filme[]) {
    localStorage.setItem('filmes', JSON.stringify(filmes));
  }

  public getFilmes(): Filme[] {
    return this.filmesSubject.value;
  }
}

export interface Filme {
  _id?: string;
  nomeViewer: string;
  nomeFilme: string;
  anoLancamento: string;
  genero: string;
  tempoCenaExplicita: string;
  resumo: string;
  tempoDuracao: string;
  link: string;
}