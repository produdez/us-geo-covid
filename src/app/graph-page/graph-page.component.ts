import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { RequiredProperty } from '../shared/decorators/requiredProperty';
import { GlobalReport, Report } from '../shared/models/report';
import { CovidApiService } from '../shared/services/covid-api.service';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.sass']
})
export class GraphPageComponent implements OnInit {
  @HostBinding('class.fit-height')

  @Input() todayReports: Report[] = []
  @Input() globalReports: GlobalReport[] = []
  @Input() currentDate!: Date | undefined

  @Input() loadedLocalReports: boolean = false
  @Input() loadedGlobalReports: boolean = false
  loadedDate = () => this.currentDate != undefined

  lineGraphTooltip = 'Click on the graph for a bigger popup'
  constructor(
    private covidApiService: CovidApiService,
  ) { }

  ngOnInit(): void {
  }

}
