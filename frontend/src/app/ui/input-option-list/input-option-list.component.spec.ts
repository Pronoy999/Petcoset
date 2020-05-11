import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputOptionListComponent } from './input-option-list.component';

describe('InputOptionListComponent', () => {
  let component: InputOptionListComponent;
  let fixture: ComponentFixture<InputOptionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputOptionListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputOptionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
