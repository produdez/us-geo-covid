import { ChangeDetectorRef, Component, HostBinding, Input, OnInit } from '@angular/core'
import { Subject } from 'rxjs'
import { RequiredProperty } from '../shared/decorators/requiredProperty'
import { formatDate } from '../shared/helpers/common'
import { CustomDate } from '../shared/models/customDate'
import { Report } from '../shared/models/report'
import { SharedDataService } from '../shared/services/shared-data.service'

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.sass']
})
export class MapPageComponent {
  constructor(
    private sharedDataService: SharedDataService,
    private ref: ChangeDetectorRef,
  ) { }
  
  @Input() @RequiredProperty date!: Date
  @Input() @RequiredProperty reports!: Report[]
  showMap = true
  formatDate = formatDate
  ngOnInit() {
    this.sharedDataService.waffleColumn.subscribe((_) => {
      this.showMap = false
      this.ref.detectChanges()
      this.showMap = true
      this.ref.detectChanges()
    })
  }
  mapTooltip = 'Click on any state to show more details and statistics about the situation of the state during the whole pandemic'
}
