import { TestBed } from '@angular/core/testing';

import { UsStatesGeometryService } from './us-states-geometry.service';

describe('UsStatesGeometryService', () => {
  let service: UsStatesGeometryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsStatesGeometryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
