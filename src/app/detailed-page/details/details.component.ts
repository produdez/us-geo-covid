import { Component, Input, OnInit } from '@angular/core';
import { Report } from 'src/app/core/models/report';
import { State } from 'src/app/core/models/state';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent {
  @Input() reports: Report[] = []
  @Input() state: State |undefined = undefined
  constructor() { }
}
