import { Injectable, Inject } from '@angular/core'
import { mergeMap, toArray } from 'rxjs'
import { HttpService } from './http.service'
@Injectable({
  providedIn: 'root'
})
export class CovidApiService {

  constructor(@Inject(HttpService) private http: HttpService) { }

  apiURL = 'http://127.0.0.1:8000/api-covid'

  test() {
    let requestURL = `${this.apiURL}/state-reports/1/`
    return this.http.get(requestURL)
  }

  getState(initials?: string) {
    let requestURL = `${this.apiURL}/state/init/${initials}/`
    console.log('getState', requestURL)
    return this.http.get(requestURL)
  }

  getStateReports(id?: string){
    let requestURL = `${this.apiURL}/state-reports/${id}/`
    return this.http.getAllPages(requestURL)
  }
}
