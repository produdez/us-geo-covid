import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GraphIdService {
  id = 0
  constructor() { }
  getId() {
    return (this.id ++).toString()
  }
}
