/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SousDomaineService } from './sous-domaine.service';

describe('Service: SousDomaine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SousDomaineService]
    });
  });

  it('should ...', inject([SousDomaineService], (service: SousDomaineService) => {
    expect(service).toBeTruthy();
  }));
});
