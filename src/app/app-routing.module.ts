import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { ChoroplethMapComponent } from './choropleth-map/choropleth-map.component'
import { DetailedPageComponent } from './detailed-page/detailed-page.component'

export const routes: Routes = [
  { path: 'map', component: ChoroplethMapComponent },
  { path: 'test-detail', component: DetailedPageComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
