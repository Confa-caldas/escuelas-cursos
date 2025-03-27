import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidacionIdentidadComponent } from './validacion-identidad.component';

describe('ValidacionIdentidadComponent', () => {
  let component: ValidacionIdentidadComponent;
  let fixture: ComponentFixture<ValidacionIdentidadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ValidacionIdentidadComponent]
    });
    fixture = TestBed.createComponent(ValidacionIdentidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
