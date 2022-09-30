import { Component, Input, OnInit } from '@angular/core'
import { RequiredProperty } from '../shared/decorators/requiredProperty'

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.sass']
})
export class MapPageComponent {

  constructor() { }
  
  @Input() @RequiredProperty date!: Date
  
  addTime (range: number, type?: string) {
    const date = new Date(this.date)
    if (type === 'year') date.setFullYear(date.getFullYear() + range)
    else if (type === 'month') date.setMonth(date.getMonth() + range)
    else date.setDate(date.getDate() + range)
    
    this.date = date
  }

}
