/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { DepartementService } from './departement.service';

describe('Service: Departement', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DepartementService]
    });
  });

  it('should ...', inject([DepartementService], (service: DepartementService) => {
    expect(service).toBeTruthy();
  }));
});
