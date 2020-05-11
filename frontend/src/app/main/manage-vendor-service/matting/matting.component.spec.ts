import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MattingComponent } from './matting.component';

describe('MattingComponent', () => {
  let component: MattingComponent;
  let fixture: ComponentFixture<MattingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MattingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MattingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
