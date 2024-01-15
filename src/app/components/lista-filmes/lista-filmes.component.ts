import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { Observable } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { SharedService } from '../../service/shared.service';

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
    private formBuilder: FormBuilder,
    private sharedService: SharedService 
  ) {}

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

  assistirFilme(videoId: string | undefined): void {
    console.log('VideoId a ser assistido:', videoId);
  
    if (videoId) {
      this.sharedService.setSelectedVideoId(videoId);
    } else {
      console.error('ID do vídeo não está definido.');
    }
  }

  abrirLink(link: string, videoId: string | null): void {
    const isYouTubeLink = this.filmesService.isYouTubeLink(link);

    if (isYouTubeLink && videoId) {
    } else {
        window.open(link, '_blank');
    }
}
}
