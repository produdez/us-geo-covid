import { ChangeDetectionStrategy, Component, HostBinding, OnInit } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { DialogDataMissingKeyError, DialogEmptyDataError } from 'src/app/shared/errors/dialog-data.error';
import { GlobalReport, Report } from 'src/app/shared/models/report';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

interface Data {
  data: (Report | GlobalReport)[]
}
@Component({
  selector: 'app-line-graph-dialog',
  templateUrl: './line-graph-dialog.component.html',
  styleUrls: ['./line-graph-dialog.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,

})
export class LineGraphDialogComponent implements OnInit {

  @HostBinding('class.fit-height')
  data: (Report | GlobalReport)[]
  columns: string[]

  constructor(public dialogRef: DialogRef<Data, boolean>,
    private sharedDataService: SharedDataService,
    ) {
    const className = LineGraphDialogComponent.name
    console.log('data: ', dialogRef.data)
    if(!this.dialogRef.data) throw new DialogEmptyDataError(className)
    const data = this.dialogRef.data
    if(!data.data || data.data.length === 0) throw new DialogDataMissingKeyError('data', className)
    this.data = dialogRef.data.data
    
    this.columns = this.sharedDataService.allColumns
  }

  updateLineGraphColumns(columns: string[]) {
    this.sharedDataService.updateLineGraphColumns(columns)
  }

  ngOnInit(): void {
  }

}
