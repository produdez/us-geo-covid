import { Component, ComponentRef, ElementRef, Input, OnChanges, OnInit, Type, ViewChild, ViewContainerRef } from '@angular/core';
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty';

@Component({
  selector: 'app-loading-wrapper',
  templateUrl: './loading-wrapper.component.html',
  styleUrls: ['./loading-wrapper.component.sass']
})
export class LoadingWrapperComponent implements OnInit, OnChanges{
  @Input() @RequiredProperty condition: boolean = false
  @Input() @RequiredProperty componentClass!: any
  @Input() @RequiredProperty factoryArguments!:  any[][]
  @Input() clearOnChange: boolean = true
  @ViewChild("componentContainer", { read: ViewContainerRef }) container!: ElementRef
  constructor(private viewContainerRef: ViewContainerRef) {}

  ngOnChanges() {
    console.log('condition: ', this.condition)
    if (this.condition) {
      this.createComponent()
    }
  }
  ngOnInit() {
    console.log('Init cond: ', this.condition)
  }
  createComponent() {
    const componentRef: ComponentRef<typeof this.componentClass> = this.viewContainerRef.createComponent(this.componentClass)
    
    for (let [key, value] of this.factoryArguments) {
      console.log('assigning: ', key, value)
      componentRef.instance[key] = value
    }
  }
}
