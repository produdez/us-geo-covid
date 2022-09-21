import { Component, DoCheck, Input, IterableDiffers, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { BehaviorSubject } from 'rxjs'
import { JSONConstructed } from '../shared/models/JSONConstructed'
import { Report } from '../shared/models/report'
import { State } from '../shared/models/state'
import { CovidApiService } from '../shared/services/covid-api.service'
@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.sass']
})
export class DetailedPageComponent implements OnInit{
  stateInitials = "AK" // TODO: remove hardcode later and take value from hyperlink params
  state: State | undefined = undefined
  reports : Report[] = []

  constructor(private covidApiService: CovidApiService) {}

  updated() {
    return (this.state !== undefined && this.reports.length > 0)
  }


  stringifiedReports() {
    return JSON.stringify(this.reports)
  }

  ngOnInit(): void {
    this.covidApiService.getState(this.stateInitials).subscribe((data: {[key: string]: any}) => {
      this.state = State.fromJSON<State>(data)
      this.getReports(this.state.id)
    })
  }
  getReports(id?: string) {
    this.covidApiService.getStateReports(id).subscribe((data) => {
      for (let jsonReport of data) {
        // TODO: can make this more efficient by converting them during the html request (just add a converterFunction)
        this.reports.push(Report.fromJSON(jsonReport))
      }
    })
  }
}
