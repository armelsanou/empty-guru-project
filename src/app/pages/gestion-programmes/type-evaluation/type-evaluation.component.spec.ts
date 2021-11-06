import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeEvaluationComponent } from './type-evaluation.component';

describe('TypeEvaluationComponent', () => {
  let component: TypeEvaluationComponent;
  let fixture: ComponentFixture<TypeEvaluationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TypeEvaluationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TypeEvaluationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
