import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FilmesService } from '../../service/filme.service';
import { SharedService } from '../../service/shared.service';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html',
  styleUrls: ['./cadastro.component.scss']
})
export class CadastroComponent {
  filmeForm: FormGroup;
  formSubmitted: boolean = false;

  originalFormState: any;

  constructor(
    private fb: FormBuilder, 
    private filmesService: FilmesService,
    private sharedService: SharedService) {

    this.filmeForm = this.fb.group({
      nomeViewer: ['', Validators.required],
      filme: ['', Validators.required],
      ano: ['', Validators.required],
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
      
      this.filmesService.salvarFilme(filme).subscribe(
        () => {
          console.log('Filme salvo com sucesso');
          this.filmesService.fetchFilmesPendentesFromBackend(); 
          this.filmeForm.reset(this.originalFormState, { emitEvent: false });
          this.clearErrorMessages();
        },
        error => {
          console.error('Erro ao salvar o filme:', error);
        }
      );
    } else {
      console.error('Formulário inválido. Preencha todos os campos obrigatórios.');
    }
  }

  
  

  clearErrorMessages() {
    this.filmeForm.markAsPristine();
    this.filmeForm.markAsUntouched();
    this.formSubmitted = false;
  }
}