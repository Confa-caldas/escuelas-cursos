import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardRegisterFormComponent } from './card-register-form.component';

describe('CardRegisterFormComponent', () => {
  let component: CardRegisterFormComponent;
  let fixture: ComponentFixture<CardRegisterFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardRegisterFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRegisterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
