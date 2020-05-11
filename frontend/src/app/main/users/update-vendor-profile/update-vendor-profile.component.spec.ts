import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateVendorProfileComponent } from './update-vendor-profile.component';

describe('UpdateVendorProfileComponent', () => {
  let component: UpdateVendorProfileComponent;
  let fixture: ComponentFixture<UpdateVendorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateVendorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateVendorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
