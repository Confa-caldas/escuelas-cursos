import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HistoricoPagosComponent } from './historico-pagos.component';

describe('HistoricoPagosComponent', () => {
  let component: HistoricoPagosComponent;
  let fixture: ComponentFixture<HistoricoPagosComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricoPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricoPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
