import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlankProgrammeComponent } from './blank-programme.component';

describe('BlankProgrammeComponent', () => {
  let component: BlankProgrammeComponent;
  let fixture: ComponentFixture<BlankProgrammeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlankProgrammeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlankProgrammeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
