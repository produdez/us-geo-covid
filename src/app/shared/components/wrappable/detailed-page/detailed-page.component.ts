import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnInit } from '@angular/core'
import { RequiredProperty } from '../../../decorators/requiredProperty'
import { Report } from '../../../models/report'
import { State } from '../../../models/state'
import { CovidApiService } from '../../../services/covid-api.service'
import { DialogService, DialogRef } from '@ngneat/dialog';
import { Data } from '@angular/router'
import { SharedDataService } from 'src/app/shared/services/shared-data.service'

@Component({
  selector: 'app-detailed-page',
  templateUrl: './detailed-page.component.html',
  styleUrls: ['./detailed-page.component.sass']
})
export class DetailedPageComponent implements OnChanges, OnInit {
  @Input() @RequiredProperty stateIdentifier!: string
  state: State | undefined = undefined
  reports : Report[] = []
  loading = false
  columns = this.sharedDataService.allColumns
  graphName = () => 'Covid Situation In ' + this.state?.name

  constructor(
    private covidApiService: CovidApiService,
    private ref: ChangeDetectorRef,
    private sharedDataService: SharedDataService,
  ) {}

  updated() {
    return this.state !== undefined && !this.loading
  }

  updateLineGraphColumns(columns: string[]) {
    this.sharedDataService.updateLineGraphColumns(columns)
  }

  ngOnChanges() {
    console.log('ngOnChanges detailed-page')
  }
  ngOnInit() {
    console.log('Initialized detailed-page')
    // console.log('Inits: ', this.stateIdentifier)
    this.getState(this.stateIdentifier)
  }

  stringifiedReports() {
    return JSON.stringify(this.reports)
  }

  getState(stateIdentifier: string) {
    this.state = undefined
    this.loading = true

    this.covidApiService.getState(stateIdentifier).subscribe({
      next: (data: {[key: string]: any}) => {
        this.state = State.fromJSON<State>(data)
        this.getReports(this.state.id.toString())
      },
      error: (error: any) => {
        this.failAndAlert(error, `Fail to get state "${stateIdentifier}"`)
      }
    })
  }

  getReports(id?: string) {
    console.time('Request reports from server')
    this.reports = []
    this.covidApiService.getStateReports(id).subscribe({
      next: (data: {[key: string]: any}[]) => {
        console.timeEnd('Request reports from server')
        console.time('Processing reports')
        for (let jsonReport of data) {
          // time to process is actually very small so no need to do anything to improve performance
          this.reports.push(Report.fromJSON(jsonReport))
        }
        console.timeEnd('Processing reports')
        this.loading = false
        this.ref.detectChanges()
      },
      error: (error: any) => {
        this.failAndAlert(error, `Fail to get reports for state "${this.state?.initials}"`)
      }
    })
  }

  failAndAlert(err: string, message: string) {
    this.loading = false
    console.log(err)
    alert(message)
  }
}
