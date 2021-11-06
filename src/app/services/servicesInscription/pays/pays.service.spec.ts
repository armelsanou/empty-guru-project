/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { PaysService } from './pays.service';

describe('Service: Pays', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PaysService]
    });
  });

  it('should ...', inject([PaysService], (service: PaysService) => {
    expect(service).toBeTruthy();
  }));
});
