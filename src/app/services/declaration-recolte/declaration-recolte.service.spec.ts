import { TestBed } from '@angular/core/testing';

import { DeclarationRecolteService } from './declaration-recolte.service';

describe('DeclarationRecolteService', () => {
  let service: DeclarationRecolteService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DeclarationRecolteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
