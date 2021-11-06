/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DomaineService } from './domaine.service';

describe('Service: Domaine', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DomaineService]
    });
  });

  it('should ...', inject([DomaineService], (service: DomaineService) => {
    expect(service).toBeTruthy();
  }));
});
