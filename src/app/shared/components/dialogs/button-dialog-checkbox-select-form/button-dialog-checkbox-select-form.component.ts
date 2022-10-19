import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewContainerRef } from '@angular/core';
import { FormGroup, FormArray, FormControl } from '@angular/forms';
import { DialogConfig, DialogRef, DialogService } from '@ngneat/dialog';
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty';
import { uppercaseFirstLetter } from 'src/app/shared/helpers/common';
import { SharedDataService } from 'src/app/shared/services/shared-data.service';

@Component({
  selector: 'app-button-dialog-checkbox-select-form',
  templateUrl: './button-dialog-checkbox-select-form.component.html',
  styleUrls: ['./button-dialog-checkbox-select-form.component.sass']
})
export class ButtonDialogCheckboxSelectFormComponent implements OnInit {
  @Input() @RequiredProperty buttonName!: string
  @Input() @RequiredProperty dialogName!: string
  @Input() @RequiredProperty selectList!: any[]
  @Output() selectedItemsEvent = new EventEmitter<any>();

  formatString = uppercaseFirstLetter
  checkboxForm!: FormGroup
  initialized = false
  constructor(
    private dialog: DialogService,
    private sharedDataService: SharedDataService,
  ) {}
  dialogConfig = {
    size: 'sm'
  } as Partial<DialogConfig<any>>
  
  ngOnInit(): void {
    this.sharedDataService.lineGraphColumns.subscribe(columns => {
      const isInInitColumns = (x: string) => columns.reduce((prev, cur) => (prev || (cur == x)), false)
      if(this.initialized) return
      this.checkboxForm = new FormGroup({
        values: new FormArray(this.selectList.map((value) => {
          return new FormControl(isInInitColumns(value))
        }))
      })
      
    })
  }

  open(tpl: TemplateRef<any>) {
    this.dialog.open(tpl, this.dialogConfig);
  }
  
    

  get checkBoxFormArray() { return this.checkboxForm.controls['values'] as FormArray; }


  onSubmitCheckbox(ref: DialogRef) {
    const f = this.checkboxForm
    const results = f.value.values
      .map((checked: any, i: number) => checked ? this.selectList[i] : null)
      .filter((v: any) => v !== null);

    if(results.length == 0) {
      this.dialog.error('Please select at least one value to display as line in the graph!!☠️')
      return
    }
    ref.close()
    this.selectedItemsEvent.emit(results);
  }
}
