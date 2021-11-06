import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CycleDomaineComponent } from './cycle-domaine.component';

describe('CycleDomaineComponent', () => {
  let component: CycleDomaineComponent;
  let fixture: ComponentFixture<CycleDomaineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CycleDomaineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CycleDomaineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
