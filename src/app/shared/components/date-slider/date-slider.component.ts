import { Component, HostBinding, Input, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForm} from '@angular/forms';
import { RequiredProperty } from '../../decorators/requiredProperty';
import { addTime } from '../../helpers/common';
import { Output, EventEmitter } from '@angular/core';
import { CustomDate } from '../../models/customDate';
@Component({
  selector: 'app-date-slider',
  templateUrl: './date-slider.component.html',
  styleUrls: ['./date-slider.component.sass']
})
export class DateSliderComponent implements OnInit{
  constructor() { }
  @HostBinding('class.component-border-box')
  @Input() @RequiredProperty startDate!: Date
  @Input() @RequiredProperty sliderRange!: number
  endDate!: Date 
  endValue!: number
  
  startValue: number = 0
  selectedValue: number = this.startValue
  @Output() selectedEvent = new EventEmitter<CustomDate>();
  
  addDay = (date: Date, days: number) => { return addTime(date, days, 'day')}
  addMonth = (date: Date, months: number) => { return addTime(date, months, 'addMonth')}

  selectedDate = () => this.addDay(this.startDate,this.selectedValue)
  formatDate(date: Date): string {
    return date.toLocaleDateString("en-GB")
  }
  
  setValue(event: any) {
    this.selectedValue = event
    this.selectedEvent.emit(this.selectedDate())
  }
  ngOnInit() {
    this.endValue = this.startValue + this.sliderRange
    this.endDate = this.addDay(this.startDate, this.sliderRange)
  }
}
