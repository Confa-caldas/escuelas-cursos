import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ModalPoliciesComponent } from './modal-policies.component';

describe('ModalPoliciesComponent', () => {
  let component: ModalPoliciesComponent;
  let fixture: ComponentFixture<ModalPoliciesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalPoliciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalPoliciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
