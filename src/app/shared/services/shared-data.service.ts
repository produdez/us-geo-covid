import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { State } from '../models/state';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private _state = new BehaviorSubject<string | undefined>(undefined);
  public state = this._state.asObservable()
  constructor() {}

  updateState(state: string) {
    if(!state || state =='') {
      console.log('Update state failed!')
      return
    }
    this._state.next(state);
  }
}
