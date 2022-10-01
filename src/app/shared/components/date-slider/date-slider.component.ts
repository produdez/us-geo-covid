import { Component, HostBinding, Input, OnInit } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {NgForm} from '@angular/forms';
import { RequiredProperty } from '../../decorators/requiredProperty';
import { addTime, formatDate } from '../../helpers/common';
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

  formatDate = formatDate
  lastEmitted = this.startValue
  updated = () => this.lastEmitted != this.selectedValue // To make sure the value is actually changed when confirm is clicked!

  addDay = (date: Date, days: number) => { return addTime(date, days, 'day')}
  addMonth = (date: Date, months: number) => { return addTime(date, months, 'addMonth')}

  selectedDate = () => this.addDay(this.startDate,this.selectedValue)
  
  setValue(event: any) {
    this.selectedValue = event
  }
  onConfirmButtonClicked() {
    if(this.updated()) {
      this.selectedEvent.emit(this.selectedDate())
      this.lastEmitted = this.selectedValue
    }else{
      console.log("No value change, no update needed!")
    }
  }
  ngOnInit() {
    this.endValue = this.startValue + this.sliderRange
    this.endDate = this.addDay(this.startDate, this.sliderRange)
  }
}
