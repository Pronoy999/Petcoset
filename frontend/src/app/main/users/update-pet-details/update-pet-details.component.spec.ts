import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePetDetailsComponent } from './update-pet-details.component';

describe('UpdatePetDetailsComponent', () => {
  let component: UpdatePetDetailsComponent;
  let fixture: ComponentFixture<UpdatePetDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePetDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePetDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
