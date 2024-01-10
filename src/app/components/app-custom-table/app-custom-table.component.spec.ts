import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppCustomTableComponent } from './app-custom-table.component';

describe('AppCustomTableComponent', () => {
  let component: AppCustomTableComponent;
  let fixture: ComponentFixture<AppCustomTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppCustomTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppCustomTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
