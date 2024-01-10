import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-custom-table', 
  templateUrl: './app-custom-table.component.html',
  styleUrls: ['./app-custom-table.component.scss'] 
})
export class AppCustomTableComponent {
  @Input() columns: string[] = [];
  @Input() data: any[] = [];
}
