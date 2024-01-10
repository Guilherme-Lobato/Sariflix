import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmesService } from '../../service/filme.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  filmeForm: FormGroup; 
  formSubmitted: boolean = false;

  originalFormState: any;

  constructor(private http: HttpClient, private fb: FormBuilder, private filmesService: FilmesService) {
    this.filmeForm = this.fb.group({
      nomeViewer: ['', Validators.required],
      nomeFilme: ['', Validators.required],
      anoLancamento: ['', Validators.required],
      genero: ['GÊNERO', Validators.required],
      tempoCenaExplicita: [''],
      resumo: [''],
      tempoDuracao: ['', Validators.required],
      link: ['', Validators.required]
    });

    this.originalFormState = this.filmeForm.value;
  }

  salvarFilme() {
    this.formSubmitted = true;

    if (this.filmeForm.valid) {
      const filme = this.filmeForm.value;
      this.filmesService.adicionarFilme(filme);

      this.http.post('http://localhost:3000/api/movies', filme, { responseType: 'text' })
        .subscribe(
          response => {
            console.log('Filme salvo com sucesso:', response);

            this.filmeForm.reset(this.originalFormState, { emitEvent: false });
            this.clearErrorMessages();
          },
          error => {
            console.error('Erro ao salvar o filme:', error);
          }
        );
    } else {
      console.error('Formulário inválido. Por favor, preencha todos os campos obrigatórios.');
    }
  }

  clearErrorMessages() {
    Object.keys(this.filmeForm.controls).forEach(key => {
      const control = this.filmeForm.get(key);

      if (control && control.touched) {
        control.setErrors(null);
      }
    });

    this.filmeForm.markAsPristine();
    this.formSubmitted = false;
  }
}
