import { Injectable } from '@angular/core';
import { AsyncSubject, BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { State } from '../models/state';
import { CovidApiService } from './covid-api.service';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private _state = new BehaviorSubject<string | undefined>(undefined);
  public state = this._state.asObservable()

  private _allStates = new BehaviorSubject<State[]>([]);
  public allStates = this._allStates.asObservable();
  constructor(
    private covidApiService: CovidApiService
  ) {}

  updateState(state: string) {
    if(!state || state =='') {
      console.log('Update state failed!')
      return
    }
    this._state.next(state);
  }

  updateAllStates(states: State[]){
    if(!states || states.length == 0) {
      console.log('Update all states failed!')
      return
    }
    this._allStates.next(states);
  }
}
