/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EtudiantService } from './etudiant.service';

describe('Service: Etudiant', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EtudiantService]
    });
  });

  it('should ...', inject([EtudiantService], (service: EtudiantService) => {
    expect(service).toBeTruthy();
  }));
});
