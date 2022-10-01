import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomDate } from '../shared/models/customDate';
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

  //  state variable
  loadingDateRange = true

  // TODO: URGENT add mechanism to stop the slider when we are fetching data!!!
  //  and only go fetch data when the user lets of the slider

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
  }
  
  ngOnInit(): void {
    this.covidApiService.getReportDayRange().pipe().subscribe((data) => {
      console.log(data)
      this.startDate = new CustomDate(data['start'])
      this.dateRange = data['range']
      this.date = this.startDate
      this.loadingDateRange = false
      this.ref.detectChanges()

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
