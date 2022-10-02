import { Component, OnInit } from '@angular/core';
import {routes as navigationRoutes} from '../app-routing.module'
@Component({
  selector: 'app-navigation-menu',
  templateUrl: './navigation-menu.component.html',
  styleUrls: ['./navigation-menu.component.sass']
})
export class NavigationMenuComponent {
  routes = navigationRoutes.map((route) => "/" + route.path)
  constructor() { }

  openGithub(){
    window.open('https://github.com/produdez', "_blank");
  }
}
