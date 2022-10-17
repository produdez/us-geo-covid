import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { DialogRef, DialogService } from '@ngneat/dialog';
import { DialogDataMissingKeyError, DialogEmptyDataError } from 'src/app/shared/errors/dialog-data.error';
import { Report } from 'src/app/shared/models/report';

interface Data {
  todayData: Report[]
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
  columns: string[]

  constructor(public dialogRef: DialogRef<Data, boolean>) {
    const className = WaffleChartDialogComponent.name
    console.log('data: ', dialogRef.data)
    if(!this.dialogRef.data) throw new DialogEmptyDataError(className)
    const data = this.dialogRef.data
    if(!data.todayData || data.todayData.length === 0) throw new DialogDataMissingKeyError('todayData', className)
    this.todayData = dialogRef.data.todayData
    
    this.columns = ['positive']
  }

  ngOnInit(): void {
  }

}
