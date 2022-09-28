import { Injectable, Inject } from '@angular/core'
import { mergeMap, toArray } from 'rxjs'
import { HttpService } from './http.service'
@Injectable({
  providedIn: 'root'
})
export class CovidApiService {

  constructor(
    @Inject(HttpService) private http: HttpService,
    ) { }

  apiURL = 'http://127.0.0.1:8000/api-covid'

  test() {
    let requestURL = `${this.apiURL}/state-reports/1/`
    return this.http.get(requestURL)
  }

  getAllStates() {
    const requestURL = `${this.apiURL}/states/`
    return this.http.getAllPages(requestURL)
  }

  getState(identifier: string) {
    const searchType = identifier.length == 2 ?
      'init' : 'name'
    let requestURL = `${this.apiURL}/state/${searchType}/${identifier}/`
    return this.http.get(requestURL)
  }

  getStateReports(id?: string){
    let requestURL = `${this.apiURL}/state-reports/${id}/`
    return this.http.getAllPages(requestURL)
  }

  getGeometryData() {
    let requestURL = `${this.apiURL}/polygons`
    return this.http.getAllPages(requestURL)
  }

  getDateReports(year: number, month: number, day: number) {
    let requestURL = `${this.apiURL}/date-reports/${year}/${month}/${day}/`
    return this.http.getAllPages(requestURL)
  }
}
