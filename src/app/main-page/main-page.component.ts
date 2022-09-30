import { ChangeDetectorRef, Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { SharedDataService } from '../shared/services/shared-data.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.sass']
})
export class MainPageComponent implements OnInit {
  date: Date = new Date(2020, 2, 20) // TODO: set a proper init date
  stateInitials = ''
  state = this.sharedDataService.state

  constructor(
    private sharedDataService: SharedDataService,
    private ref: ChangeDetectorRef
  ) {}
    
  stateSelected = () => {
    return this.stateInitials != ''
  }
  
  ngOnInit(): void {
    this.sharedDataService.state.subscribe((state) => {
      this.stateInitials = ''
      this.ref.detectChanges()
      if(state != '') {
        this.stateInitials = state
        this.ref.detectChanges()
      }
    })
  }

}
