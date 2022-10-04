import { NgModule } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LoadingComponent } from './components/loading/loading.component'
import { CovidApiService } from './services/covid-api.service'
import { HttpService } from './services/http.service'
import { CastPipe } from './pipes/cast.pipe'
import { CastListPipe } from './pipes/castList.pipe'
import { DetailsComponent } from './components/details/details.component'
import { LineGraphComponent } from './components/line-graph/line-graphs.component'
import { ChoroplethMapComponent } from './components/choropleth-map/choropleth-map.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { SharedDataService } from './services/shared-data.service'
import { UsStatesGeometryService } from './services/us-states-geometry.service';
import { DateSliderComponent } from './components/date-slider/date-slider.component'
import { FormsModule } from '@angular/forms'
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { DetailPageDialogComponent } from './components/dialogs/detail-page-dialog/detail-page-dialog.component';
import { DetailedPageComponent } from './components/wrappable/detailed-page/detailed-page.component'


@NgModule({
  declarations: [
    LoadingComponent,
    CastPipe,
    CastListPipe,
    DetailsComponent,
    LineGraphComponent,
    ChoroplethMapComponent,
    DateSliderComponent,
    PieChartComponent,
    DetailPageDialogComponent,
    DetailedPageComponent
  ],
  imports: [
    CommonModule,
    LeafletModule,
    FormsModule,
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
  ],
  exports: [
    LoadingComponent,
    CastPipe,
    CastListPipe,
    DetailsComponent,
    LineGraphComponent,
    ChoroplethMapComponent,
    DateSliderComponent,
    PieChartComponent,
    DetailPageDialogComponent,
    DetailedPageComponent
  ],
  providers: [
    CovidApiService,
    HttpService,
    SharedDataService,
    UsStatesGeometryService,
  ]
})
export class SharedModule { }
