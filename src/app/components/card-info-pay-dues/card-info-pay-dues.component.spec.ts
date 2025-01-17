import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CardInfoPayDuesComponent } from './card-info-pay-dues.component';

describe('CardInfoPayDuesComponent', () => {
  let component: CardInfoPayDuesComponent;
  let fixture: ComponentFixture<CardInfoPayDuesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CardInfoPayDuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardInfoPayDuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
