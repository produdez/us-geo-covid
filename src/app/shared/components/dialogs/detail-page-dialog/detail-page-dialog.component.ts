import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';
import { DialogDataMissingKeyError, DialogEmptyDataError } from 'src/app/shared/errors/dialog-data.error';

interface Data {
  stateIdentifier: string
}

@Component({
  selector: 'app-detail-page-dialog',
  templateUrl: './detail-page-dialog.component.html',
  styleUrls: ['./detail-page-dialog.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailPageDialogComponent {
  @HostBinding('class.fit-height')
  stateIdentifier!: string
  constructor(
    public ref: DialogRef<Data, boolean>,
  ) {
    const className = DetailPageDialogComponent.name
    if(!this.ref.data) throw new DialogEmptyDataError(className)
    const data = this.ref.data
    if(!data.stateIdentifier) throw new DialogDataMissingKeyError('stateIdentifier',className)
    this.stateIdentifier = this.ref.data.stateIdentifier
  }
}
