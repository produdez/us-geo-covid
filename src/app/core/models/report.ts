import { State } from './state'
import { JSONConstructed } from './JSONConstructed'

export class Report extends JSONConstructed {
    // ! NOTE: this syntax allow for creation of automatic constructor (default initialized)

    date: Date|undefined = undefined
    state: State|undefined = undefined

    death: number|undefined = undefined
    positive: number|undefined = undefined
    negative: number|undefined = undefined

    hospitalizedCumulative: number|undefined = undefined
    inIcuCumulative: number|undefined = undefined
    onVentilatorCumulative: number|undefined = undefined

    recovered: number|undefined = undefined
    
}
