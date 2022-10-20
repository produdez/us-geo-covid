import { ChangeDetectionStrategy, Component, HostBinding, Input, OnInit } from '@angular/core';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { DialogDataMissingKeyError, DialogEmptyDataError } from 'src/app/shared/errors/dialog-data.error';
import { CustomDate } from 'src/app/shared/models/customDate';
import { Report } from 'src/app/shared/models/report';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

interface Data {
  todayData: Report[]
  date: CustomDate
}

@Component({
  selector: 'app-waffle-chart-dialog',
  templateUrl: './waffle-chart-dialog.component.html',
  styleUrls: ['./waffle-chart-dialog.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WaffleChartDialogComponent implements OnInit {
  @HostBinding('class.fit-height')
  todayData: Report[]
  column!: string
  columns = this.sharedDataService.allColumns
  date: CustomDate

  constructor(public dialogRef: DialogRef<Data, boolean>,
    private sharedDataService: SharedDataService
    ) {
    const className = WaffleChartDialogComponent.name
    if(!this.dialogRef.data) throw new DialogEmptyDataError(className)
    const data = this.dialogRef.data
    if(!data.todayData || data.todayData.length === 0) throw new DialogDataMissingKeyError('todayData', className)
    this.todayData = dialogRef.data.todayData
    this.date = dialogRef.data.date
  }

  setWaffleColumn(column: string) {
    this.sharedDataService.updateWaffleColumn(column)
  }

  ngOnInit(): void {
    this.sharedDataService.waffleColumn.subscribe(column => this.column = column)
  }

}
