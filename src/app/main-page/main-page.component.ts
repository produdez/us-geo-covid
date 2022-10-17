import { ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { DetailPageDialogComponent } from '../shared/components/dialogs/detail-page-dialog/detail-page-dialog.component';
import { CustomDate } from '../shared/models/customDate';
import { GlobalReport, Report } from '../shared/models/report';
import { State } from '../shared/models/state';
import { CovidApiService } from '../shared/services/covid-api.service';
import { SharedDataService } from '../shared/services/shared-data.service';
@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {
  // Vars to initialize with api
  startDate: Date | undefined = undefined
  dateRange: number | undefined = undefined
  date: Date | undefined = undefined
  stateInitials: string | undefined = undefined

  // data stream
  state = this.sharedDataService.state
  todayReports: Report[] = []
  loadedTodayReports =false
  globalReports: GlobalReport[] = []
  loadedGlobalReports = false

  //  state variable
  loadingDateRange = true

  constructor(
    private sharedDataService: SharedDataService,
    private ref: ChangeDetectorRef,
    private covidApiService: CovidApiService,
  ) {}
    
  stateSelected = () => {
    return this.stateInitials != undefined
  }

  updateDate(emittedDate: Date): void {
    this.date = emittedDate
    this.updateLocalReports()
  }

  updateLocalReports() {
    if(this.date) {
      this.loadedTodayReports = false
      this.todayReports = []
      this.covidApiService.getDateReports(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()).subscribe(data => {
        for(let reportJson of data) {
          this.todayReports.push(Report.fromJSON<Report>(reportJson))
        }
        this.loadedTodayReports = true
        this.ref.detectChanges()
      })
    }
  }
  
  ngOnInit(): void {
    this.covidApiService.getAllStates().subscribe((states: {[k: string] : any}[]) => {
      this.sharedDataService.updateAllStates(states.map((state) => State.fromJSON<State>(state)))
    })
    this.covidApiService.getGlobalReport().subscribe(reports =>{
      for(let reportJson of reports) {
        this.globalReports.push(GlobalReport.fromJSON(reportJson))
      }
      this.loadedGlobalReports = true
      this.ref.detectChanges()
    })
    this.covidApiService.getReportDayRange().subscribe((data) => {
      this.startDate = new CustomDate(data['start'])
      this.dateRange = data['range']
      this.date = this.startDate
      this.loadingDateRange = false
      this.ref.detectChanges()
      this.updateLocalReports()


      this.sharedDataService.state.subscribe((state) => {
        this.stateInitials = undefined
        this.ref.detectChanges()
        if(state != undefined) {
          this.stateInitials = state
          this.ref.detectChanges()
        }
      })
    })

  }

}
