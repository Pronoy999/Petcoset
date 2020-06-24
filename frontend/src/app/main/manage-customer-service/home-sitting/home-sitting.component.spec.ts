import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeSittingComponent } from './home-sitting.component';

describe('HomeSittingComponent', () => {
  let component: HomeSittingComponent;
  let fixture: ComponentFixture<HomeSittingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeSittingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeSittingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
