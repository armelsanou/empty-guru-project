import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DroitUniversitaireComponent } from './droit-universitaire.component';

describe('DroitUniversitaireComponent', () => {
  let component: DroitUniversitaireComponent;
  let fixture: ComponentFixture<DroitUniversitaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DroitUniversitaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DroitUniversitaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
