/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DroitUniversitaireService } from './droit-universitaire.service';

describe('Service: DroitUniversitaire', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DroitUniversitaireService]
    });
  });

  it('should ...', inject([DroitUniversitaireService], (service: DroitUniversitaireService) => {
    expect(service).toBeTruthy();
  }));
});
