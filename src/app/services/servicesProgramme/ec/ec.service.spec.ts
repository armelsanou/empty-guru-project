/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EcService } from './ec.service';

describe('Service: Ec', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EcService]
    });
  });

  it('should ...', inject([EcService], (service: EcService) => {
    expect(service).toBeTruthy();
  }));
});
