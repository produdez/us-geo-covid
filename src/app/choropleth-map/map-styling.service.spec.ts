import { TestBed } from '@angular/core/testing'

import { MapStylingService } from './map-styling.service'

describe('MapStylingService', () => {
  let service: MapStylingService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(MapStylingService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
