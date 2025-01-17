import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { QuestionsLoginComponent } from './questions-login.component';

describe('QuestionsLoginComponent', () => {
  let component: QuestionsLoginComponent;
  let fixture: ComponentFixture<QuestionsLoginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ QuestionsLoginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuestionsLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
