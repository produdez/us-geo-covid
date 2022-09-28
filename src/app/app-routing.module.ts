import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChoroplethMapComponent } from './shared/components/choropleth-map/choropleth-map.component'
import { DetailedPageComponent } from './detailed-page/detailed-page.component'
import { TestPageComponent } from './test-page/test-page.component'
import { MapPageComponent } from './map-page/map-page.component'

export const routes: Routes = [
  { path: 'map', component: MapPageComponent },
  { path: 'detail', component: DetailedPageComponent},
  { path: 'test-page', component: TestPageComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
