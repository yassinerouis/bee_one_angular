import { TestBed } from '@angular/core/testing';

import { ParcelleCulturaleService } from './parcelle-culturale.service';

describe('ParcelleCulturaleService', () => {
  let service: ParcelleCulturaleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParcelleCulturaleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
