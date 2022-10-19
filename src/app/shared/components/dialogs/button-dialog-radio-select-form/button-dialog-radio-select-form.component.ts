import { Component, EventEmitter, Input, OnInit, Output, TemplateRef } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { DialogConfig, DialogService } from '@ngneat/dialog';
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty';
import { uppercaseFirstLetter } from 'src/app/shared/helpers/common';

@Component({
  selector: 'app-button-dialog-radio-select-form',
  templateUrl: './button-dialog-radio-select-form.component.html',
  styleUrls: ['./button-dialog-radio-select-form.component.sass']
})
export class ButtonDialogRadioSelectFormComponent implements OnInit {
  constructor(private dialog: DialogService) { }
  @Input() @RequiredProperty buttonName!: string
  @Input() @RequiredProperty dialogName!: string
  @Input() @RequiredProperty selectList!: any[]
  @Output() selectedItemEvent = new EventEmitter<any>();
  radioForm!: FormGroup

  formatString = uppercaseFirstLetter

  dialogConfig = {
    size: 'sm'
  } as Partial<DialogConfig<any>>

  open(tpl: TemplateRef<any>) {
    this.dialog.open(tpl, this.dialogConfig);
  }
  ngOnInit(): void {
    this.radioForm = new FormGroup({
      value: new FormControl(this.selectList[0]),
    });
  }

  onSubmitRadio() {
    const f = this.radioForm
    const result = f.value['value']
    this.dialog.closeAll()
    this.selectedItemEvent.emit(result);
  }
}
