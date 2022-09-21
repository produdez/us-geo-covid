import { State } from './state'
import { JSONConstructed } from './JSONConstructed'

export class Report extends JSONConstructed {
    // ! NOTE: this syntax allow for creation of automatic constructor (default initialized)

    date: Date = new Date()
    state: State|undefined = undefined

    death: number|undefined = undefined
    // TODO: URGENT: solve these undefined or 0 cases initialization and cement the solution
    positive: number = 0
    negative: number=0

    hospitalizedCumulative: number|undefined = undefined
    inIcuCumulative: number|undefined = undefined
    onVentilatorCumulative: number|undefined = undefined

    recovered: number|undefined = undefined
    
    protected override assignFromMap(
        kwargs: Map<String, any>, 
    ) {
        return super.assignFromMap(kwargs, [{attributeName: 'date', converter: Date.parse}])
    }
}
