import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardPayDuesFormComponent } from './card-pay-dues-form.component';

describe('CardPayDuesFormComponent', () => {
  let component: CardPayDuesFormComponent;
  let fixture: ComponentFixture<CardPayDuesFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardPayDuesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardPayDuesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
