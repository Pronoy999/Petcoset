import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinearStepperComponent } from './linear-stepper.component';

describe('LinearStepperComponent', () => {
  let component: LinearStepperComponent;
  let fixture: ComponentFixture<LinearStepperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LinearStepperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LinearStepperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
