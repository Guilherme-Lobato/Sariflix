import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPendenteComponent } from './lista-pendentes.component';

describe('ListaComponent', () => {
  let component: ListaPendenteComponent;
  let fixture: ComponentFixture<ListaPendenteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListaPendenteComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListaPendenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
