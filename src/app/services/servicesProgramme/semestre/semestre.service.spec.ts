/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SemestreService } from './semestre.service';

describe('Service: Specialite', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SemestreService]
    });
  });

  it('should ...', inject([SemestreService], (service: SemestreService) => {
    expect(service).toBeTruthy();
  }));
});
