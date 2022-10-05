import { ChangeDetectorRef, Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty';
import { addTime } from 'src/app/shared/helpers/common';
import { CustomDate } from 'src/app/shared/models/customDate';
import { GlobalReport, Report } from 'src/app/shared/models/report';
import { CovidApiService } from 'src/app/shared/services/covid-api.service';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.sass']
})
export class RankingComponent implements OnInit {

  @Input() @RequiredProperty todayReports!: Report[];
  @Input() @RequiredProperty todayDate!: CustomDate
  top10!: Report[]
  top10Names: string[] = Array(10)
  previousRanking: {[id: number] : number} = {}
  rankingFluctuation: number[] = Array(10)
  nan = NaN

  isNaN(i: number) {
    return Number.isNaN(this.rankingFluctuation[i])
  }
  constructor(
    private covidApiService: CovidApiService,
  ) { }
  
  isInTop10(reportJson: {[k: string] : any}) {
    for(let report of this.top10) {
      if(report.stateId === reportJson['state_id']) return true
    }
    return false
  }
  ngOnInit() {
    this.todayReports = this.filterAndSortByPositive(this.todayReports.filter((report) => report.positive != 0))
    this.top10 = this.todayReports.slice(0, 10)
    this.top10.forEach((report, index) => {
      this.covidApiService.getStateById(report.stateId.toString()).subscribe((state: any) => {
        this.top10Names[index] = state.name
      })
    })

    const yesterday = addTime(this.todayDate, -1, 'day')

    this.covidApiService.getDateReports(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate(),
    ).subscribe((data: any) => {
      data = this.filterAndSortByPositive(data, (x) => x['positive'])
      data.forEach((report: any, index: number) => {
        if(this.isInTop10(report)) {
          this.previousRanking[report['state_id']] = index + 1
        }
      })

      this.top10.forEach((report, index) => {
        this.rankingFluctuation[index] = this.previousRanking[report.stateId] - (index + 1)
      })

    })

  }

  filterAndSortByPositive(data :any[], accessor = (x: any) => x.positive) {
    data = data.filter((report) => accessor(report) != 0)
    return data.sort((a: Report, b: Report): number => {
      var d1 = accessor(a), d2 = accessor(b)
      if(d1 === undefined) return -1
      if(d1==d2) return 0
      return d1 < d2 ? -1 : 1
    }).reverse()
  }
  ngOnChanges(changes: SimpleChanges) {
    this.todayReports = this.filterAndSortByPositive(this.todayReports)
  }
}
