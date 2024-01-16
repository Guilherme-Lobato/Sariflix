import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-lista-filmes',
  templateUrl: './lista-filmes.component.html',
  styleUrls: ['./lista-filmes.component.scss'],
})
export class ListaFilmesComponent implements OnInit {
  filmes$!: Observable<Filme[]>;
  filtroForm!: FormGroup;
  avaliacaoForm!: FormGroup;
  avaliacoes: number[] = [1, 2, 3, 4, 5];
  fb: FormBuilder;
  filmeSelecionado: Filme | undefined;

  constructor(
    private filmesService: FilmesService,
    private formBuilder: FormBuilder,
    private sharedService: SharedService 
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

    this.avaliacaoForm = this.formBuilder.group({
      avaliacao: [null],
    });
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
  
  salvarAvaliacao(filme: Filme | undefined, avaliacao: number | null): void {
    if (filme?._id && avaliacao !== null) {
      this.filmesService.salvarAvaliacao(filme._id, avaliacao).subscribe(
        () => {
          console.log('Avaliação salva com sucesso');
          // Atualize a lista de filmes autorizados se necessário
          this.filmesService.fetchFilmesAutorizadosFromBackend();
        },
        (error) => {
          console.error('Erro ao salvar avaliação:', error);
        }
      );
    } else {
      console.error('ID do filme ou avaliação não está definido.');
    }
  }

  onSelectAvaliacao(): void {
    const avaliacaoControl = this.avaliacaoForm.get('avaliacao');
    if (avaliacaoControl && this.filmeSelecionado) {
      const avaliacao = avaliacaoControl.value;
      this.salvarAvaliacao(this.filmeSelecionado, avaliacao);
    }
  }
}