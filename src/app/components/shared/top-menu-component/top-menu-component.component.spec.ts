import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopMenuComponentComponent } from './top-menu-component.component';

describe('TopMenuComponentComponent', () => {
  let component: TopMenuComponentComponent;
  let fixture: ComponentFixture<TopMenuComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopMenuComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TopMenuComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
