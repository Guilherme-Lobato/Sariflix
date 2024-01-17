import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Filme } from '../../service/filme.service';

@Component({
  selector: 'app-sorteio-modal',
  templateUrl: './sorteio-modal.component.html',
  styleUrls: ['./sorteio-modal.component.scss'],
  styles: [
    `
      :host {
        display: block;
        width: 600px;
        height: 100%;
        overflow: hidden;
        background-color: red;
      }
    `,
  ],
})
export class SorteioModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { filmesSorteados: Filme[] }) {}
}
