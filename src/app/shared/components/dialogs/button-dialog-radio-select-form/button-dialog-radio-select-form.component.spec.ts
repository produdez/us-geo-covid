import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDialogRadioSelectFormComponent } from './button-dialog-radio-select-form.component';

describe('ButtonDialogRadioSelectFormComponent', () => {
  let component: ButtonDialogRadioSelectFormComponent;
  let fixture: ComponentFixture<ButtonDialogRadioSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonDialogRadioSelectFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonDialogRadioSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
