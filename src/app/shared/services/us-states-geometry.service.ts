import { Injectable } from '@angular/core'
import { BehaviorSubject, concatAll, map, Observable, ObservableInput, tap, toArray, zip } from 'rxjs'
import { State } from '../models/state'
import { CovidApiService } from './covid-api.service'
import { HttpService } from './http.service'
import * as geojson from 'geojson'
import { Report } from '../models/report'

@Injectable({
  providedIn: 'root',
})
export class UsStatesGeometryService {
  private _statesGeometry: BehaviorSubject<any[]> = new BehaviorSubject([] as any[])
  public statesGeometry = this._statesGeometry.asObservable()
  private _geoJson: {[key: string]: any}  = {}

  constructor(private covidApiService: CovidApiService) 
  {
    this.initializeGeometryData()
  } 
  
  private initializeGeometryData() {
    this.covidApiService.getGeometryData().subscribe((data) => {
      this._statesGeometry.next(data)
    })
  }

  public constructGeoJSON() {
    if (Object.keys(this._geoJson).length != 0) return this._geoJson
    return this._constructGeoJSON(this._statesGeometry.getValue())
  }
  private _constructGeoJSON(geometryList: {[key: string]: any}[]) {
    this._geoJson = <geojson.FeatureCollection>{
      "type": "FeatureCollection",
      "features": geometryList.map((feature: any) => {
        return {
          "type": "Feature",
          "properties": {...feature.state}, // state empty give null value
          "geometry" : {
            "coordinates" : JSON.parse(feature.coordinates),
            "type": feature.type
          }
        }
      })
    }

    return this._geoJson
  }

  private _joinReportData(reports: Report[]) {
    this._geoJson['features'].forEach((_: any, index: number) => {
      this._geoJson['features'][index]['properties']['report'] = reports[index]
    })
  }

  public constructGeoJsonWithReportData(reports: Report[]) {
    this._joinReportData(reports)
  }
}
