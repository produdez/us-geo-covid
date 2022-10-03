import { Component, HostBinding, OnInit } from '@angular/core';

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.sass']
})
export class LoadingComponent implements OnInit {
  
  constructor() { }
  @HostBinding('class.fit-height')

  ngOnInit(): void {
  }

}
