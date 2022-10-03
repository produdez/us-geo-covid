import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentStatsComponent } from './current-stats.component';

describe('CurrentStatsComponent', () => {
  let component: CurrentStatsComponent;
  let fixture: ComponentFixture<CurrentStatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentStatsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
