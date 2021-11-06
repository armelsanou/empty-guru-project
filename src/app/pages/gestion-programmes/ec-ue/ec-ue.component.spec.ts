import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcUeComponent } from './ec-ue.component';

describe('EcUeComponent', () => {
  let component: EcUeComponent;
  let fixture: ComponentFixture<EcUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
