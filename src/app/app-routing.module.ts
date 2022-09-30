import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { TestPageComponent } from './test-page/test-page.component'
import { MapPageComponent } from './map-page/map-page.component'
import { MainPageComponent } from './main-page/main-page.component'

export const routes: Routes = [
  { path: 'Main', component: MainPageComponent},
  { path: 'Test Page', component: TestPageComponent},
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
