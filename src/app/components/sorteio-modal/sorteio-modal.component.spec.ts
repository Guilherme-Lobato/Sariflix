import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SorteioModalComponent } from './sorteio-modal.component';

describe('SorteioModalComponent', () => {
  let component: SorteioModalComponent;
  let fixture: ComponentFixture<SorteioModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SorteioModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SorteioModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
