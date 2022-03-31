import { TestBed } from '@angular/core/testing';

import { TeamsGuard } from './teams.guard';

describe('TeamsGuard', () => {
  let guard: TeamsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(TeamsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
