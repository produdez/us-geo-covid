import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { RequiredProperty } from '../shared/decorators/requiredProperty'
import { formatDate } from '../shared/helpers/common'
import { CustomDate } from '../shared/models/customDate'

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.sass']
})
export class MapPageComponent {
  constructor() { }
  
  @Input() @RequiredProperty date!: Date  
  formatDate = formatDate
}
