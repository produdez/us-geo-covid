import { Component, Input, OnInit } from '@angular/core';
import { Report } from 'src/app/core/models/report';
import { State } from 'src/app/core/models/state';

@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.sass']
})
export class GraphsComponent {
  @Input() reports: Report[] = []
  @Input() state: State |undefined = undefined
  constructor() { }
}
