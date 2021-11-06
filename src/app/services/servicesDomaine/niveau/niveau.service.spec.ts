/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NiveauService } from './niveau.service';

describe('Service: Niveau', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NiveauService]
    });
  });

  it('should ...', inject([NiveauService], (service: NiveauService) => {
    expect(service).toBeTruthy();
  }));
});
