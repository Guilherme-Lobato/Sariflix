import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { SharedService } from './shared.service';

export interface Filme {
  _id?: string;
  nomeViewer: string;
  filme: string;
  ano: number;
  genero: string;
  tempoCenaExplicita: boolean;
  resumo: string;
  tempoDuracao: number;
  link: string;
  videoId: string; 
  avaliacao: number;
  assistido: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class FilmesService {
  private apiUrl1 = 'http://localhost:3000/api/movies';
  private apiUrl2 = 'http://localhost:3000/api/movies/autorizados';

  private filmesSubject: BehaviorSubject<Filme[]> = new BehaviorSubject<Filme[]>([]);
  filmes$: Observable<Filme[]> = this.filmesSubject.asObservable();

  private filmesPendentesSubject: BehaviorSubject<Filme[]> = new BehaviorSubject<Filme[]>([]);
  filmesPendentes$: Observable<Filme[]> = this.filmesPendentesSubject.asObservable();

  public filmesAutorizadosSubject: BehaviorSubject<Filme[]> = new BehaviorSubject<Filme[]>([]);
  filmesAutorizados$: Observable<Filme[]> = this.filmesAutorizadosSubject.asObservable();


  constructor(
    private http: HttpClient,
    private sharedService: SharedService
     ) {}

  fetchFilmesFromBackend() {
    this.http.get<Filme[]>(this.apiUrl1)
      .subscribe(
        (filmes) => {
          this.filmesSubject.next(filmes);
        },
        (error) => {
          console.error('Erro ao buscar filmes:', error);
        }
      );
  }

  fetchFilmesPendentesFromBackend() {
    this.http.get<Filme[]>(`${this.apiUrl1}/pendentes`)
      .subscribe(
        (filmesPendentes) => {
          this.filmesPendentesSubject.next(filmesPendentes);
        },
        (error) => {
          console.error('Erro ao buscar filmes pendentes:', error);
        }
      );
  }

  fetchFilmesAutorizadosFromBackend() {
    this.http.get<Filme[]>(`${this.apiUrl2}`)
      .subscribe(
        (filmesAutorizados) => {
          this.filmesAutorizadosSubject.next(filmesAutorizados);
        },
        (error) => {
          console.error('Erro ao buscar filmes autorizados:', error);
        }
      );
  }

  salvarFilme(filme: Filme): Observable<string> {
    let videoId: string | null;

    if (this.isYouTubeLink(filme.link)) {
        videoId = this.extractYouTubeVideoId(filme.link);

        if (!videoId) {
            return throwError('Erro ao extrair o ID do vídeo do YouTube.');
        }
    } else {
        videoId = null;
    }
    filme.videoId = videoId ?? '';  
    console.log('Filme antes da solicitação HTTP:', filme);
    return this.http.post<string>(`${this.apiUrl1}/pendentes`, filme).pipe(
        tap(() => {
            if (videoId) {
                this.sharedService.setSelectedVideoId(videoId);
            }
        })
    );
}


  public isYouTubeLink(link: string): boolean {
    const regExp = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    return regExp.test(link);
  }
  
  
  public extractYouTubeVideoId(link: string): string | null {
    const regExp = /^(?:(?:https?:)?\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    
    const match = link.match(regExp);
    return match ? match[1] : null;
  }


  excluirFilme(filmeId: string): Observable<any> {
    const url = `${this.apiUrl2}/${filmeId}/excluir`;
    return this.http.delete(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao excluir filme:', error);
        return throwError('Erro ao excluir filme. Consulte o console para obter mais detalhes.');
      }),
      tap(
        () => {
          console.log('Filme excluído com sucesso');
          this.fetchFilmesAutorizadosFromBackend();  
        },
        (error) => {
          console.error('Erro ao excluir filme:', error);
        }
      )
    );
  }

  autorizarFilmePendente(filmeId: string): Observable<any> {
    const url = `${this.apiUrl2}/${filmeId}/autorizar`;
    return this.http.post(url, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao autorizar filme:', error);
        return throwError('Erro ao autorizar filme. Consulte o console para obter mais detalhes.');
      }),
      tap(() => {
        this.fetchFilmesAutorizadosFromBackend();  
        this.fetchFilmesPendentesFromBackend();  
      })
    );
  }

  excluirFilmePendente(filmeId: string): Observable<any> {
    const url = `${this.apiUrl1}/pendentes/${filmeId}`;
    return this.http.delete(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao excluir filme pendente:', error);
        return throwError('Erro ao excluir filme pendente. Consulte o console para obter mais detalhes.');
      }),
      tap(
        () => {
          console.log('Filme excluído com sucesso');
          this.fetchFilmesPendentesFromBackend();  
        },
        (error) => {
          console.error('Erro ao excluir filme pendente:', error);
        }
      )
    );
  }

  aplicarFiltroPendentes(filtro: any): void {
    const filmesFiltrados = this.filmesPendentesSubject.value.filter(filme => {
      return (
        (!filtro.nomeViewer || filme.nomeViewer.toLowerCase().startsWith(filtro.nomeViewer.toLowerCase())) &&
        (!filtro.filme || filme.filme.toLowerCase().startsWith(filtro.filme.toLowerCase())) &&
        (!filtro.ano || filme.ano === filtro.ano) &&
        (!filtro.genero || filme.genero.toLowerCase().startsWith(filtro.genero.toLowerCase()))
      );
    });
    this.filmesPendentesSubject.next(filmesFiltrados);
  }  

  aplicarFiltroAutorizados(filtro: any): void {
    const filmesFiltrados = this.filmesAutorizadosSubject.value.filter(filme => {
      return (
        (!filtro.nomeViewer || filme.nomeViewer.toLowerCase().startsWith(filtro.nomeViewer.toLowerCase())) &&
        (!filtro.filme || filme.filme.toLowerCase().startsWith(filtro.filme.toLowerCase())) &&
        (!filtro.ano || filme.ano === filtro.ano) &&
        (!filtro.genero || filme.genero.toLowerCase().startsWith(filtro.genero.toLowerCase()))
      );
    });
    this.filmesAutorizadosSubject.next(filmesFiltrados);
  }

  salvarAvaliacao(filmeId: string, avaliacao: number): Observable<any> {
    const url = `${this.apiUrl2}/${filmeId}/avaliacao`;
    return this.http.post(url, { avaliacao }).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao salvar avaliação:', error);
        return throwError('Erro ao salvar avaliação. Consulte o console para obter mais detalhes.');
      }),
      tap(() => {
        console.log('Avaliação salva no servidor com sucesso');
      })
    );
  }

  obterAvaliacao(filmeId: string): Observable<number> {
    const url = `${this.apiUrl2}/${filmeId}/avaliacao`;
    return this.http.get<{ avaliacao: number }>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao obter avaliação:', error);
        return throwError('Erro ao obter avaliação. Consulte o console para obter mais detalhes.');
      }),
      map(response => response.avaliacao)
    );
  }

  getEstadoAssistido(filmeId: string): Observable<{ assistido: boolean }> {
    const url = `${this.apiUrl2}/${filmeId}/assistido`;
    return this.http.get<{ assistido: boolean }>(url);
  }
  
  marcarComoAssistido(filmeId: string): Observable<any> {
    const url = `${this.apiUrl2}/${filmeId}/marcar-assistido`;
    return this.http.post(url, {}).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Erro ao marcar como assistido:', error);
        return throwError('Erro ao marcar como assistido. Consulte o console para obter mais detalhes.');
      }),
      tap(() => {
        console.log('Marcado como assistido com sucesso');
        this.fetchFilmesAutorizadosFromBackend(); 
      })
    );
  }
}  