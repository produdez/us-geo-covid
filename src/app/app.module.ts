import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { HttpClientModule } from '@angular/common/http'
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component'
import { SharedModule } from './shared/shared.module'
import { TestPageComponent } from './test-page/test-page.component'
import { MapPageComponent } from './map-page/map-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GraphPageComponent } from './graph-page/graph-page.component'
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';
import { RankingComponent } from './graph-page/ranking/ranking.component';
import { CurrentStatsComponent } from './graph-page/current-stats/current-stats.component';
import { DialogModule } from '@ngneat/dialog';

@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    TestPageComponent,
    MapPageComponent,
    MainPageComponent,
    GraphPageComponent,
    RankingComponent,
    CurrentStatsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    SharedModule,
    HttpClientModule, // NOTE: Global HttpClientModule for other modules to use!
    TippyModule.forRoot({
      defaultVariation: 'tooltip',
      variations: {
        tooltip: tooltipVariation,
        popper: popperVariation,
      }
    }),
    DialogModule.forRoot({
      sizes: {
        sm: {
          width: 300, // 300px
          minHeight: 250 // 250px
        },
        md: {
          width: '60vw',
          height: '80vh'
        },
        lg: {
          width: '90vw',
          height: '90vh'
        },
        fullScreen: {
          width: '100vw',
          height: '100vh'
        },
        stretch: {
          minHeight: '80%',
          maxHeight: '85%'
        }
      }
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
