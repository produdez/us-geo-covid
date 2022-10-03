import { Injectable, Inject } from '@angular/core'
import { HttpService } from './http.service'
import { environment } from '../../../environments/environment'

@Injectable({
  providedIn: 'root'
})
export class CovidApiService {

  apiURL = environment.BACKEND_URL

  constructor(@Inject(HttpService) private http: HttpService) { 
    console.log('Backend URL: ', this.apiURL)
  }


  getReportDayRange() {
    const requestURL = `${this.apiURL}/start-end-date/`
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
    let requestURL = `${this.apiURL}/polygons/`
    return this.http.getAllPages(requestURL)
  }

  getDateReports(year: number, month: number, day: number) {
    let requestURL = `${this.apiURL}/date-reports/${year}/${month}/${day}/`
    return this.http.getAllPages(requestURL)
  }

  getGlobalReport() {
    let requestURL = `${this.apiURL}/global-reports/`
    return this.http.getAllPages(requestURL)
  }
}
