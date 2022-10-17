import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaffleChartDialogComponent } from './waffle-chart-dialog.component';

describe('WaffleChartDialogComponent', () => {
  let component: WaffleChartDialogComponent;
  let fixture: ComponentFixture<WaffleChartDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaffleChartDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaffleChartDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
