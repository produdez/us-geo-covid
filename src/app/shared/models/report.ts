import { State } from './state'
import { JSONConstructed } from './JSONConstructed'

export class Report extends JSONConstructed {
    // ! NOTE: this syntax allow for creation of automatic constructor (default initialized)

    date: Date = new Date()
    stateId: number = -1

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
        return super.assignFromMap(kwargs, [{attributeName: 'date', converter: Date.parse}])
    }
}
