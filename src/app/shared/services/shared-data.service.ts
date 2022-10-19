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

  private _waffleColumn = new BehaviorSubject<string>('positive');
  public waffleColumn = this._waffleColumn.asObservable()

  private _lineGraphColumns = new BehaviorSubject<string[]>(['positive', 'negative'])
  public lineGraphColumns = this._lineGraphColumns.asObservable()

  public allColumns = ['positive', 'negative', 'death', 'recovered', 'in_icu_cumulative', 'on_ventilation_cumulative', 'hospitalized_cumulative']

  constructor() {}

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

  updateWaffleColumn(column: string) {
    this._waffleColumn.next(column)
    console.log('Updateing shared column: ',this._waffleColumn.getValue());
  }

  updateLineGraphColumns(columns: string[]) {
    if(columns.length == 0) return

    this._lineGraphColumns.next(columns);
  }
}
