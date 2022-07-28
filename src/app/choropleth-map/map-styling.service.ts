import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root'
})
export class MapStylingService {

  constructor() { }

  getColor(d: Number): string{
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0'
  }

  choroplethDefaultStyle(feature: any) {
    return {
      fillColor: this.getColor(feature.properties['density']),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  }
}
