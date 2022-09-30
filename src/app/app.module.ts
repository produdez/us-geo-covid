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
import { MainPageComponent } from './main-page/main-page.component'
@NgModule({
  declarations: [
    AppComponent,
    NavigationMenuComponent,
    DetailedPageComponent,
    TestPageComponent,
    MapPageComponent,
    MainPageComponent,
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
