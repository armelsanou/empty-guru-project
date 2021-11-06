import { TestBed } from '@angular/core/testing';

import { EcUeService } from './ec-ue.service';

describe('EcUeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EcUeService = TestBed.get(EcUeService);
    expect(service).toBeTruthy();
  });
});
