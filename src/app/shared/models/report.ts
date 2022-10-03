import { State } from './state'
import { JSONConstructed } from './JSONConstructed'
import { CustomDate } from './customDate'

class GeneralReport extends JSONConstructed {
    // ! NOTE: this syntax allow for creation of automatic constructor (default initialized)
    
    date: Date = new CustomDate()    
    death: number = 0
    positive: number = 0
    negative: number = 0
    
    hospitalizedCumulative: number = 0
    inIcuCumulative: number = 0
    onVentilatorCumulative: number = 0
    
    recovered: number = 0
    
    protected override assignFromMap(
        kwargs: Map<String, any>, 
    ) {
        return super.assignFromMap(kwargs, [{attributeName: 'date', converter: (obj) => new Date(obj)}])
    }

}
export class Report extends GeneralReport {
    stateId: number = -1
}

export class GlobalReport extends GeneralReport {
    states: number = -1 // Number of states in today's report
}
