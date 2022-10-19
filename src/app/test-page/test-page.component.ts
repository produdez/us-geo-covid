import { Component, OnInit, TemplateRef } from '@angular/core'
import { CustomDate } from '../shared/models/customDate'
import { DialogConfig, DialogService } from '@ngneat/dialog';
import { DetailedPageComponent } from '../shared/components/wrappable/detailed-page/detailed-page.component';
import { DetailPageDialogComponent } from '../shared/components/dialogs/detail-page-dialog/detail-page-dialog.component';
import { FormArray, FormBuilder, FormControl, FormGroup, NgForm } from '@angular/forms';
        
@Component({
  selector: 'app-test-page',
  templateUrl: './test-page.component.html',
  styleUrls: ['./test-page.component.sass']
})
export class TestPageComponent {
  constructor() {}

  printTest(event: any) {
    console.log('test: ', event)
  }
}
