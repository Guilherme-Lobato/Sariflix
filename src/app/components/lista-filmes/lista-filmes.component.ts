import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { SharedService } from '../../service/shared.service';
import { MatDialog } from '@angular/material/dialog';
import { SorteioModalComponent } from '../sorteio-modal/sorteio-modal.component';

@Component({
  selector: 'app-lista-filmes',
  templateUrl: './lista-filmes.component.html',
  styleUrls: ['./lista-filmes.component.scss'],
})
export class ListaFilmesComponent implements OnInit {
  filmes$!: Observable<Filme[]>;
  filtroForm!: FormGroup;
  fb: FormBuilder;
  avaliacoes: number[] = [1, 2, 3, 4, 5];
  filmeSelecionado: Filme | undefined;
  avaliacaoSelecionada: number | null = null;

  constructor(
    private filmesService: FilmesService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private dialog: MatDialog 
  ) {
    this.fb = formBuilder;
  }

  ngOnInit() {
    this.filmes$ = this.filmesService.filmesAutorizados$;
    this.filmesService.fetchFilmesAutorizadosFromBackend();
  
    this.filtroForm = this.formBuilder.group({
      nomeViewer: [''],
      filme: [''],
      ano: [''],
      genero: [''],
    });

    this.obterEstadosAssistidos();
  }
  
  excluirFilme(filme: Filme): void {
    if (filme._id) {
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

  aplicarFiltro(): void {
    const filtro = this.filtroForm.value;
    this.filmesService.aplicarFiltroAutorizados(filtro);
  }

  assistirFilme(filme: Filme | undefined): void {
    console.log('VideoId a ser assistido:', filme?.videoId);

    if (filme?.videoId) {
      this.sharedService.setSelectedVideoId(filme.videoId);
    } else {
      console.error('ID do vídeo não está definido.');
    }

    // Atualizamos a propriedade filmeSelecionado
    this.filmeSelecionado = filme;
  }

  abrirLink(link: string, videoId: string | null): void {
    const isYouTubeLink = this.filmesService.isYouTubeLink(link);

    if (isYouTubeLink && videoId) {
    } else {
        window.open(link, '_blank');
    }
  }

  sortearFilmes(): void {
    const filmes = this.filmesService.filmesAutorizadosSubject.value; 
    const filmesSorteados = this.embaralharFilmes(filmes).slice(0, 5);

    const dialogRef = this.dialog.open(SorteioModalComponent, {
      data: { filmesSorteados },
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('O modal foi fechado', result);
    });
  }

  private embaralharFilmes(filmes: Filme[]): Filme[] {
    let currentIndex = filmes.length;
    let temporaryValue;
    let randomIndex;

    const filmesEmbaralhados = filmes.slice();

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = filmesEmbaralhados[currentIndex];
      filmesEmbaralhados[currentIndex] = filmesEmbaralhados[randomIndex];
      filmesEmbaralhados[randomIndex] = temporaryValue;
    }

    return filmesEmbaralhados;
  }

  marcarComoAssistido(filme: Filme): void {
    if (filme && filme._id) {
      this.filmesService.marcarComoAssistido(filme._id).subscribe(
        () => {
          console.log('Filme marcado como assistido com sucesso');
        },
        (error) => {
          console.error('Erro ao marcar como assistido:', error);
        }
      );
    } else {
      console.error('ID do filme não está definido');
    }
  }
  
  private obterEstadosAssistidos(): void {
    this.filmes$.subscribe(filmes => {
      filmes.forEach(filme => {
        if (filme._id) {
          this.filmesService.getEstadoAssistido(filme._id).subscribe(
            response => {
              filme.assistido = response.assistido;
            },
            error => {
              console.error('Erro ao obter estado assistido:', error);
            }
          );
        }
      });
    });
  }
  
}
