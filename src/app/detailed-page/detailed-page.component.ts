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
      }
    })
  }

  getReports(id?: string) {
    console.log('Getting reports')
    this.reports = []
    this.covidApiService.getStateReports(id).subscribe({
      next: (data: {[key: string]: any}[]) => {
        for (let jsonReport of data) {
          // TODO: can make this more efficient by converting them during the html request (just add a converterFunction)
          // Or make use of the next/complete to batch process (https://rxjs.dev/deprecations/subscribe-arguments)
          this.reports.push(Report.fromJSON(jsonReport))
        }
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
