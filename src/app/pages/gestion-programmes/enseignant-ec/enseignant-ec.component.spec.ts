import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnseignantEcComponent } from './enseignant-ec.component';

describe('EnseignantEcComponent', () => {
  let component: EnseignantEcComponent;
  let fixture: ComponentFixture<EnseignantEcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnseignantEcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnseignantEcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
