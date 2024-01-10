// lista.component.ts

import { Component, OnInit } from '@angular/core';
import { Filme, FilmesService } from '../../service/filme.service';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.scss'],
})
export class ListaComponent implements OnInit {
  filmes: Filme[] = [];

  constructor(private filmesService: FilmesService) {}

  ngOnInit() {
    this.filmesService.filmes$.subscribe((filmes) => {
      this.filmes = filmes;
    });
  }
}
