import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnInit } from '@angular/core'
import { RequiredProperty } from '../shared/decorators/requiredProperty'
import { Report } from '../shared/models/report'
import { State } from '../shared/models/state'
import { CovidApiService } from '../shared/services/covid-api.service'

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
  columns: string[] =['positive', 'negative', 'death', 'recovered']
  graphName = () => 'Covid Situation In ' + this.state?.name

  constructor(
    private covidApiService: CovidApiService,
    private ref: ChangeDetectorRef
  ) {}

  updated() {
    return this.state !== undefined && !this.loading
  }

  ngOnChanges() {
    console.log('Detail page state: ', this.stateIdentifier)
    this.getState(this.stateIdentifier)
  }
  ngOnInit() {
    console.time('GetReports')
    console.log('Initialized')
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
        // TODO: add a message to frontend to display fail to user
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
