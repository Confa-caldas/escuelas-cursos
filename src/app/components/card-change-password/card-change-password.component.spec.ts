import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardChangePasswordComponent } from './card-change-password.component';

describe('CardChangePasswordComponent', () => {
  let component: CardChangePasswordComponent;
  let fixture: ComponentFixture<CardChangePasswordComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardChangePasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardChangePasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
