import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConfirmRegistroServicesComponent } from './confirm-registro-services.component';

describe('ConfirmRegistroServicesComponent', () => {
  let component: ConfirmRegistroServicesComponent;
  let fixture: ComponentFixture<ConfirmRegistroServicesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmRegistroServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmRegistroServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
