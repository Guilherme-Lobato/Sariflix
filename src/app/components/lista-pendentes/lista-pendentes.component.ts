import { Component, OnInit } from '@angular/core';
import { FilmesService, Filme } from '../../service/filme.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lista-pendentes',
  templateUrl: './lista-pendentes.component.html',
  styleUrls: ['./lista-pendentes.component.scss'],
})
export class ListaPendentesComponent implements OnInit {
  filmes$!: Observable<Filme[]>;
  filtroForm!: FormGroup;

  constructor(
    private filmesService: FilmesService,
    private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.filmes$ = this.filmesService.filmesPendentes$;
    this.filmesService.fetchFilmesPendentesFromBackend();
    this.filtroForm = this.formBuilder.group({
      nomeViewer: [''],
      filme: [''],
      ano: [''],
      genero: [''],
    });
  }

  adicionarFilme(filme: Filme) {
    console.log('Tentando adicionar filme:', filme);

    if (filme) {
      this.filmesService.salvarFilme(filme).subscribe(
        () => {
          console.log('Filme salvo com sucesso');
          this.filmesService.fetchFilmesPendentesFromBackend();
        },
        (error) => {
          console.error('Erro ao salvar filme:', error);
          // Adicione tratamento de erro aqui, se necessário
        }
      );
    } else {
      console.warn('Nenhum filme fornecido para adicionarFilme.');
    }
  }

  autorizarFilme(filme: Filme) {
    if (filme && filme._id) {
      this.filmesService.autorizarFilmePendente(filme._id).subscribe(
        () => {
          console.log('Filme autorizado com sucesso');
          this.filmesService.fetchFilmesAutorizadosFromBackend(); // Atualiza a lista de filmes autorizados
          this.filmesService.fetchFilmesPendentesFromBackend(); // Atualiza a lista de filmes pendentes
        },
        (error) => {
          console.error('Erro ao autorizar filme:', error);
        }
      );
    }
  }

  excluirFilme(filme: Filme | undefined) {
    if (filme && filme._id) {
      this.filmesService.excluirFilmePendente(filme._id).subscribe(
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
    this.filmesService.aplicarFiltroPendentes(filtro);
  }
}
