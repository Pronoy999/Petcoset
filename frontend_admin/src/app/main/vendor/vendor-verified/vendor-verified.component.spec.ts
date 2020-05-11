import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorVerifiedComponent } from './vendor-verified.component';

describe('VendorVerifiedComponent', () => {
  let component: VendorVerifiedComponent;
  let fixture: ComponentFixture<VendorVerifiedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorVerifiedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorVerifiedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
