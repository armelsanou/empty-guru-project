/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FiliereService } from './filiere.service';

describe('Service: Filiere', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FiliereService]
    });
  });

  it('should ...', inject([FiliereService], (service: FiliereService) => {
    expect(service).toBeTruthy();
  }));
});
