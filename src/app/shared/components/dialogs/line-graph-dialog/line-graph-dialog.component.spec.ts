import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphDialogComponent } from './line-graph-dialog.component';

describe('LineGraphDialogComponent', () => {
  let component: LineGraphDialogComponent;
  let fixture: ComponentFixture<LineGraphDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineGraphDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineGraphDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
