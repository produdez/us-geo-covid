import { Injectable } from '@angular/core'
import tinygradient from 'tinygradient'
import { SharedDataService } from '../../services/shared-data.service';
@Injectable({
  providedIn: 'root'
})
export class MapStylingService {
  column!: string
  // ! The gradient does not fit the super fast change of the data, change or update if needed later!!!
  private _colors   = ["BFBAA6","BFB6A1","C0B29C","C0AE97","C1AA92","C1A68D","C2A288","C29E83","C39A7E","C39679","C39274","C48E6F","C48A6A","C58665","C58260","C67F5C","C67B57","C77752","C7734D","C86F48","C86B43","C8673E","C96339","C95F34","CA5B2F","CA572A","CB5325","CB4F20","CC4B1B","CC4716"]
  private _gradient = tinygradient(
    this._colors
  )
  public colorSteps = [...this._colors.keys()].map((val) => val/this._colors.length)

  public maxPropertyValue = 100000 // the hypothetical maximum value that should show up on the map
  public gradient = this._gradient.rgb(this.maxPropertyValue)
  constructor(private sharedDataService: SharedDataService) {
    this.sharedDataService.waffleColumn.subscribe((column) => {
      console.log('in shared: ', column)
      if(this.column === column) return
      this.column = column
    })
  }

  getColor(d: number): string{
    const color = d <= 0 || d == undefined ? 
      "#FFFFFF" // ! Transparent if no value
      : this._gradient.hsvAt(d/this.maxPropertyValue > 1 ? 1.0 : d/this.maxPropertyValue).toHexString()
    return color
  }

  choroplethDefaultStyle(feature: any) {
    console.log("FUCK YOU", this.column)
    if (feature === undefined) return {}
    let value = feature['properties']['report'] === undefined ? -1 : feature.properties['report'][this.column]
    return {
      fillColor: this.getColor(value),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    }
  }
}
