import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component'
import { HttpClientModule } from '@angular/common/http'
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component'
import { DetailedPageComponent } from './detailed-page/detailed-page.component'
import { SharedModule } from './shared/shared.module'
@NgModule({
  declarations: [
    AppComponent,
    ChoroplethMapComponent,
    NavigationMenuComponent,
    DetailedPageComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    SharedModule,
    HttpClientModule, // NOTE: Global HttpClientModule for other modules to use!
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
