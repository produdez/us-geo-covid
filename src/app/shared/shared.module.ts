import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingComponent } from './components/loading/loading.component'
import { LoadingWrapperComponent } from './components/loading-wrapper/loading-wrapper.component'
import { CovidApiService } from './services/covid-api.service'
import { HttpService } from './services/http.service'
import { CastPipe } from './pipes/cast.pipe'
import { CastListPipe } from './pipes/castList.pipe'
import { DetailsComponent } from './components/details/details.component'
import { GraphsComponent } from './components/graphs/graphs.component'
import { ChoroplethMapComponent } from './components/choropleth-map/choropleth-map.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'


@NgModule({
  declarations: [
    LoadingComponent,
    LoadingWrapperComponent,
    CastPipe,
    CastListPipe,
    DetailsComponent,
    GraphsComponent,
    ChoroplethMapComponent,
  ],
  imports: [
    CommonModule,
    LeafletModule
  ],
  exports: [
    LoadingComponent,
    LoadingWrapperComponent,
    CastPipe,
    CastListPipe,
    DetailsComponent,
    GraphsComponent,
    ChoroplethMapComponent,
  ],
  providers: [
    CovidApiService,
    HttpService,
  ]
})
export class SharedModule { }
