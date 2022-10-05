import { Component, HostBinding, Input, OnInit, TemplateRef, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DialogConfig, DialogService } from '@ngneat/dialog';
import { RequiredProperty } from '../shared/decorators/requiredProperty';
import { GlobalReport, Report } from '../shared/models/report';
import { CovidApiService } from '../shared/services/covid-api.service';

@Component({
  selector: 'app-graph-page',
  templateUrl: './graph-page.component.html',
  styleUrls: ['./graph-page.component.sass']
})
export class GraphPageComponent implements OnInit {
  @ViewChild('dialogVCR', { static: true, read: ViewContainerRef })
  dialogVCR!: ViewContainerRef
  
  @HostBinding('class.fit-height')

  @Input() todayReports: Report[] = []
  @Input() globalReports: GlobalReport[] = []
  @Input() currentDate!: Date | undefined

  @Input() loadedTodayReports: boolean = false
  @Input() loadedGlobalReports: boolean = false
  loadedDate = () => this.currentDate != undefined


  lineGraphTooltip = 'Click on the graph for a bigger popup'
  constructor(
    private covidApiService: CovidApiService,
    private dialog: DialogService,
  ) { }
  
  openDialog(compOrTemplate: Type<any> | TemplateRef<any>, config: DialogConfig<any>) {
    const ref = this.dialog.open(compOrTemplate, config);
    return ref
  }
  openDialogWithVCR(compOrTemplate: Type<any> | TemplateRef<any>) {
    var config = {
      id: '',
      vcr: this.dialogVCR,
      data: {}
    }
    return this.dialog.open(compOrTemplate, config)
  }
  ngOnInit(): void {
  }

}
