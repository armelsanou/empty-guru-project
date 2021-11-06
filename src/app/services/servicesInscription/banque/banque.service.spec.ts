/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BanqueService } from './banque.service';

describe('Service: Banque', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BanqueService]
    });
  });

  it('should ...', inject([BanqueService], (service: BanqueService) => {
    expect(service).toBeTruthy();
  }));
});
