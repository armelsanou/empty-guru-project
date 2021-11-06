/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InscriptionService } from './inscription.service';

describe('Service: Inscription', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InscriptionService]
    });
  });

  it('should ...', inject([InscriptionService], (service: InscriptionService) => {
    expect(service).toBeTruthy();
  }));
});
