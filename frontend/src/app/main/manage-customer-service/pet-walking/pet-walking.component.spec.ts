import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PetWalkingComponent } from './pet-walking.component';

describe('PetWalkingComponent', () => {
  let component: PetWalkingComponent;
  let fixture: ComponentFixture<PetWalkingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PetWalkingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PetWalkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
