import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty';
import { GlobalReport } from 'src/app/shared/models/report';

@Component({
  selector: 'app-current-stats',
  templateUrl: './current-stats.component.html',
  styleUrls: ['./current-stats.component.sass']
})
export class CurrentStatsComponent implements OnInit, OnChanges {
  @Input() @RequiredProperty globalData!: GlobalReport[]
  @Input() @RequiredProperty date!: Date

  data: GlobalReport | undefined = undefined
  constructor(
    private ref: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.updateData()
  }

  updateData() {
    try {
      const currentTime = this.date.toISOString()
      this.data = this.globalData.find((report) => {
        return report.date.toISOString() === currentTime
      }) as GlobalReport
      this.ref.detectChanges()
    } catch (err) {
      console.log('Data update error in CurrentStatsComponent: ', err)
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    if('date' in changes) {
      this.updateData()
    }
  }
}
