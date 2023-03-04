import { TestBed } from '@angular/core/testing';

import { CaughtPokemonService } from './caught-pokemon.service';

describe('CaughtPokemonService', () => {
  let service: CaughtPokemonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CaughtPokemonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
