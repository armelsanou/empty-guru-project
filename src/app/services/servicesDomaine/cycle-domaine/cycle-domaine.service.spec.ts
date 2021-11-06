import { TestBed } from '@angular/core/testing';

import { CycleDomaineService } from './cycle-domaine.service';

describe('CycleDomaineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CycleDomaineService = TestBed.get(CycleDomaineService);
    expect(service).toBeTruthy();
  });
});
