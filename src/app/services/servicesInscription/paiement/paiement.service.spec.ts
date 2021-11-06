/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaiementService } from './paiement.service';

describe('Service: Paiement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaiementService]
    });
  });

  it('should ...', inject([PaiementService], (service: PaiementService) => {
    expect(service).toBeTruthy();
  }));
});
