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
      this._statesGeometry.next(data.sort((featureA, featureB) => {
        // Sort to make sure everything is in the same order
        return featureA['state_id'] < featureB['state_id'] ? -1 : 1
      }))
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
        if(!feature.state_id) console.error("FUCKED: ", feature)
        return {
          "type": "Feature",
          "properties": {
            stateId: feature.state_id, 
            stateName: feature.state_name, 
            stateInitials: feature.state_initials
          }, // state empty give null value
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
    if(reports.length < this._geoJson['features'].length){
      reports.forEach((report) => {
        for (let [index, geoData] of this._geoJson['features'].entries()) {
          if(geoData['properties']['stateId'] == report.stateId) {
            this._geoJson['features'][index]['properties']['report'] = report
            break
          }
        }
      })
    } else if (reports.length == this._geoJson['features'].length) {
      reports = reports.sort((a, b) => a.stateId < b.stateId ? -1 : 1)
      reports.forEach((report, index) => {
        this._geoJson['features'][index]['properties']['report'] = report
      })
    } else {
      console.error("THIS IS FUCKED :)")
    }
  }

  public constructGeoJsonWithReportData(reports: Report[]) {
    this._joinReportData(reports)
  }
}
