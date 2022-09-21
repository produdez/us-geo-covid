import { Component, HostBinding, Input, OnInit } from '@angular/core'
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty'
import { Report } from 'src/app/shared/models/report'
import { State } from 'src/app/shared/models/state'

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.sass']
})
export class DetailsComponent {
  @Input() @RequiredProperty reports!: Report[]
  @Input() @RequiredProperty state!: State

  @HostBinding('class.display-block')
  @HostBinding('class.wrap-text')

  firstReport = () => JSON.stringify(this.reports[0])
  constructor() { }
}
