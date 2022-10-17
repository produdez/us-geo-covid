import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WaffleChartComponent } from './waffle-chart.component';

describe('WaffleChartComponent', () => {
  let component: WaffleChartComponent;
  let fixture: ComponentFixture<WaffleChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WaffleChartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WaffleChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
