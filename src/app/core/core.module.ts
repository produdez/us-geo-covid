import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { CovidApiService } from './services/covid-api.service'
import { HttpService } from './services/http.service'



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
  ],
  providers: [
    CovidApiService,
    HttpService
  ]
})
export class CoreModule { }
