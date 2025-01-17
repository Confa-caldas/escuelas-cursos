import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionAsistentesComponent } from './seleccion-asistentes.component';

describe('SeleccionAsistentesComponent', () => {
  let component: SeleccionAsistentesComponent;
  let fixture: ComponentFixture<SeleccionAsistentesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionAsistentesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SeleccionAsistentesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
