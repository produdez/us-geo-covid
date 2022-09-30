import { Component, OnInit } from '@angular/core'

@Component({
  selector: 'app-map-page',
  templateUrl: './map-page.component.html',
  styleUrls: ['./map-page.component.sass']
})
export class MapPageComponent {

  // TODO: urgent use this as a sub component for main page (refactor main page)
  constructor() { }
  
  date: Date = new Date(2020, 2, 20) // TODO: set a proper init date
  
  addTime (range: number, type?: string) {
    const date = new Date(this.date)
    if (type === 'year') date.setFullYear(date.getFullYear() + range)
    else if (type === 'month') date.setMonth(date.getMonth() + range)
    else date.setDate(date.getDate() + range)
    
    this.date = date
  }

}
