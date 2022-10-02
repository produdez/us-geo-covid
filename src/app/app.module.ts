import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { HttpClientModule } from '@angular/common/http'
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component'
import { DetailedPageComponent } from './detailed-page/detailed-page.component'
import { SharedModule } from './shared/shared.module'
import { TestPageComponent } from './test-page/test-page.component'
import { MapPageComponent } from './map-page/map-page.component';
import { MainPageComponent } from './main-page/main-page.component';
import { GraphPageComponent } from './graph-page/graph-page.component'
import { TippyModule, tooltipVariation, popperVariation } from '@ngneat/helipopper';

@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    DetailedPageComponent,
    TestPageComponent,
    MapPageComponent,
    MainPageComponent,
    GraphPageComponent,
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
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
