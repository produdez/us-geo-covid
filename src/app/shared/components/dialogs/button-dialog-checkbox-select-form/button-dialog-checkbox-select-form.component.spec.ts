import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtonDialogCheckboxSelectFormComponent } from './button-dialog-checkbox-select-form.component';

describe('ButtonDialogCheckboxSelectFormComponent', () => {
  let component: ButtonDialogCheckboxSelectFormComponent;
  let fixture: ComponentFixture<ButtonDialogCheckboxSelectFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ButtonDialogCheckboxSelectFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtonDialogCheckboxSelectFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
