import { TestBed } from '@angular/core/testing';

import { CategorieueService } from './categorieue.service';

describe('CategorieueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CategorieueService = TestBed.get(CategorieueService);
    expect(service).toBeTruthy();
  });
});
