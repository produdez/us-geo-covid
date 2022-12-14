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
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { WaffleChartComponent } from './components/waffle-chart/waffle-chart.component';
import { DetailPageDialogComponent } from './components/dialogs/detail-page-dialog/detail-page-dialog.component';
import { DetailedPageComponent } from './components/wrappable/detailed-page/detailed-page.component'
import { GraphIdService } from './services/graph-id.service';
import { WaffleChartDialogComponent } from './components/dialogs/waffle-chart-dialog/waffle-chart-dialog.component';
import { LineGraphDialogComponent } from './components/dialogs/line-graph-dialog/line-graph-dialog.component';
import { ButtonDialogRadioSelectFormComponent } from './components/dialogs/button-dialog-radio-select-form/button-dialog-radio-select-form.component';
import { RankingWrapperComponent } from './components/wrapper/ranking-wrapper/ranking-wrapper.component'
import { RankingComponent } from '../graph-page/ranking/ranking.component';
import { ButtonDialogCheckboxSelectFormComponent } from './components/dialogs/button-dialog-checkbox-select-form/button-dialog-checkbox-select-form.component'


@NgModule({
  declarations: [
    LoadingComponent,
    CastPipe,
    CastListPipe,
    DetailsComponent,
    LineGraphComponent,
    ChoroplethMapComponent,
    DateSliderComponent,
    WaffleChartComponent,
    DetailPageDialogComponent,
    DetailedPageComponent,
    WaffleChartDialogComponent,
    LineGraphDialogComponent,
    ButtonDialogRadioSelectFormComponent,
    RankingWrapperComponent,
    RankingComponent,
    ButtonDialogCheckboxSelectFormComponent,
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
    ReactiveFormsModule,
  ],
  exports: [
    LoadingComponent,
    CastPipe,
    CastListPipe,
    DetailsComponent,
    LineGraphComponent,
    ChoroplethMapComponent,
    DateSliderComponent,
    WaffleChartComponent,
    DetailPageDialogComponent,
    DetailedPageComponent,
    ButtonDialogRadioSelectFormComponent,
    RankingWrapperComponent,
    RankingComponent,
    ButtonDialogCheckboxSelectFormComponent,
  ],
  providers: [
    CovidApiService,
    HttpService,
    SharedDataService,
    UsStatesGeometryService,
    GraphIdService,
  ]
})
export class SharedModule { }
