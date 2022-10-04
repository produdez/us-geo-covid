import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailPageDialogComponent } from './detail-page-dialog.component';

describe('DetailPageDialogComponent', () => {
  let component: DetailPageDialogComponent;
  let fixture: ComponentFixture<DetailPageDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailPageDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailPageDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
