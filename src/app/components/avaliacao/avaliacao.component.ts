import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmesService } from '../../service/filme.service';

@Component({
  selector: 'app-avaliacao',
  templateUrl: './avaliacao.component.html',
  styleUrls: ['./avaliacao.component.scss'],
})
export class AvaliacaoComponent implements OnInit {
  @Input() filmeId: string | undefined;
  @Output() avaliacaoSalva = new EventEmitter<number>();

  avaliacaoForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private filmesService: FilmesService
  ) {
    this.avaliacaoForm = this.fb.group({
      avaliacao: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.filmeId) {
      // Obtém a avaliação do filme do banco de dados
      this.filmesService.obterAvaliacao(this.filmeId).subscribe(
        (avaliacao) => {
          // Configura o valor inicial do controle do formulário
          this.avaliacaoForm.get('avaliacao')?.setValue(avaliacao);
        },
        (error) => {
          console.error('Erro ao obter avaliação:', error);
        }
      );
    }
  }

  salvarAvaliacao() {
    const avaliacaoControl = this.avaliacaoForm.get('avaliacao');

    if (this.filmeId && avaliacaoControl) {
      const avaliacao = avaliacaoControl.value;

      if (avaliacao !== null) {
        console.log('Avaliação salva:', avaliacao);
        this.filmesService.salvarAvaliacao(this.filmeId, avaliacao).subscribe(
          () => {
            console.log('Avaliação salva no servidor com sucesso');
            // Não é necessário mais redefinir o valor aqui, pois já está sendo feito no ngOnInit
          },
          (error) => {
            console.error('Erro ao salvar avaliação:', error);
          }
        );
      }
    }
  }
}
