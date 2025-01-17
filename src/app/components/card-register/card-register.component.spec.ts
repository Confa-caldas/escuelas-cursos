import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardRegisterComponent } from './card-register.component';

describe('CardRegisterComponent', () => {
  let component: CardRegisterComponent;
  let fixture: ComponentFixture<CardRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
