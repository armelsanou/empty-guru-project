/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SpecialiteService } from './specialite.service';

describe('Service: Specialite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SpecialiteService]
    });
  });

  it('should ...', inject([SpecialiteService], (service: SpecialiteService) => {
    expect(service).toBeTruthy();
  }));
});
