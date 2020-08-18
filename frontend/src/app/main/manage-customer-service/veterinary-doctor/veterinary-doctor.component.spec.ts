import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VeterinaryDoctorComponent } from './veterinary-doctor.component';

describe('VeterinaryDoctorComponent', () => {
  let component: VeterinaryDoctorComponent;
  let fixture: ComponentFixture<VeterinaryDoctorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeterinaryDoctorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeterinaryDoctorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
