import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'

import { AppRoutingModule } from './app-routing.module'
import { AppComponent } from './app.component'
import { LeafletModule } from '@asymmetrik/ngx-leaflet'
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component'

@NgModule({
  declarations: [
    AppComponent,
    ChoroplethMapComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    LeafletModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
