import { Component, OnInit } from '@angular/core'
import { CustomDate } from '../shared/models/customDate'
import { DialogService } from '@ngneat/dialog';
import { DetailedPageComponent } from '../shared/components/wrappable/detailed-page/detailed-page.component';
import { DetailPageDialogComponent } from '../shared/components/dialogs/detail-page-dialog/detail-page-dialog.component';
        
@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.sass']
})
export class TestPageComponent {
  constructor(private dialog: DialogService) {}

  open() {
    const dialogRef = this.dialog.open(DetailPageDialogComponent, {data: {
      stateIdentifier: 'AK'
    }});
  }
}
