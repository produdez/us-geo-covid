import { ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DialogRef } from '@ngneat/dialog';

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
  stateIdentifier: string = ''
  constructor(
    public ref: DialogRef<Data, boolean>,
  ) {
    if(!this.ref.data || !this.ref.data['stateIdentifier']) {
      throw new Error('No data passed to component')
    }
    this.stateIdentifier = this.ref.data['stateIdentifier']
   }
}
