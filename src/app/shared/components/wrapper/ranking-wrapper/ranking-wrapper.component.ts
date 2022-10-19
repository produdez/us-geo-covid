import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty';
import { CustomDate } from 'src/app/shared/models/customDate';
import { Report } from 'src/app/shared/models/report';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-ranking-wrapper',
  templateUrl: './ranking-wrapper.component.html',
  styleUrls: ['./ranking-wrapper.component.sass']
})
export class RankingWrapperComponent implements OnInit {
  @Input() @RequiredProperty todayDate!: CustomDate
  @Input() @RequiredProperty todayReports!: Report[]
  column!: string
  show = false
  constructor(
    private sharedDataService: SharedDataService,
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit(): void {
    this.sharedDataService.waffleColumn.subscribe(column => {
      this.show=false
      this.column = column
      this.ref.detectChanges()
      this.show=true
    })
  }

}
