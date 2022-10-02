import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineGraphComponent } from './line-graphs.component';

describe('GraphsComponent', () => {
  let component: LineGraphComponent;
  let fixture: ComponentFixture<LineGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LineGraphComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
