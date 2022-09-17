import { Component, OnInit } from '@angular/core';
import { JSONConstructed } from '../core/models/JSONConstructed';
import { Report } from '../core/models/report';
import { State } from '../core/models/state';
import { CovidApiService } from '../core/services/covid-api.service';
@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.sass']
})
export class DetailedPageComponent implements OnInit {
  stateInitials = "AK" // TODO: remove hardcode later and take value from hyperlink params
  state: State | undefined = undefined
  reports : State[] = []
  test: string | undefined = undefined
  constructor(private covidApiService: CovidApiService) {}

  stringifiedReports() {
    return JSON.stringify(this.reports)
  }

  ngOnInit(): void {
    this.covidApiService.getState(this.stateInitials).subscribe((data: {[key: string]: any}) => {
      // TODO: go to making graphs
      console.log('State data: ', JSON.stringify(data))
      this.state = State.fromJSON<State>(data)
      this.getReports(this.state.id)
    })
  }
  getReports(id?: string) {
    // TODO: URGENT - currently json is working, continue to convert to Report[]
    console.log('id: ', id)
    this.covidApiService.getStateReports(id).subscribe((data) => {
      this.test = JSON.stringify(data)
      console.log('Final: ', data)
    })
  }
}
