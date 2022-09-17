import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component'
import { CoreModule } from './core/core.module'
import { HttpClientModule } from '@angular/common/http';
import { NavigationMenuComponent } from './navigation-menu/navigation-menu.component';
import { DetailedPageComponent } from './detailed-page/detailed-page.component';
import { DetailsComponent } from './detailed-page/details/details.component';
import { GraphsComponent } from './detailed-page/graphs/graphs.component'
@NgModule({
  declarations: [
    AppComponent,
    ChoroplethMapComponent,
    NavigationMenuComponent,
    DetailedPageComponent,
    DetailsComponent,
    GraphsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,
    CoreModule,
    HttpClientModule, // NOTE: Global HttpClientModule for other modules to use!
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
