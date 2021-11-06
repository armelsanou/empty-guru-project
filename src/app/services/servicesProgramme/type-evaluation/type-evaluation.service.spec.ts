import { TestBed } from '@angular/core/testing';

import { TypeEvaluationService } from './type-evaluation.service';

describe('TypeEvaluationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TypeEvaluationService = TestBed.get(TypeEvaluationService);
    expect(service).toBeTruthy();
  });
});
