import { TestBed } from '@angular/core/testing';

import { EnseignantEcService } from './enseignant-ec.service';

describe('EnseignantEcService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnseignantEcService = TestBed.get(EnseignantEcService);
    expect(service).toBeTruthy();
  });
});
