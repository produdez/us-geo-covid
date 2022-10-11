import { TestBed } from '@angular/core/testing';

import { GraphIdService } from './graph-id.service';

describe('GraphIdService', () => {
  let service: GraphIdService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GraphIdService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
