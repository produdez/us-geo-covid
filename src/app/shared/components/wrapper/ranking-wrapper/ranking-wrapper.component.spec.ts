import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingWrapperComponent } from './ranking-wrapper.component';

describe('RankingWrapperComponent', () => {
  let component: RankingWrapperComponent;
  let fixture: ComponentFixture<RankingWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RankingWrapperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
