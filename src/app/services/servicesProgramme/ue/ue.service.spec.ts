/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UeService } from './ue.service';

describe('Service: Specialite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UeService]
    });
  });

  it('should ...', inject([UeService], (service: UeService) => {
    expect(service).toBeTruthy();
  }));
});
