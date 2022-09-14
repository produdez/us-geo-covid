import { State } from './state'
import { JSONConstructed } from './JSONConstructed'

export class Report extends JSONConstructed {
    // ! NOTE: this syntax allow for creation of automatic constructor (default initialized)

    date: Date|null = null
    state: State|null = null

    death: number|null = null
    positive: number|null = null
    negative: number|null = null

    hospitalizedCumulative: number|null = null
    inIcuCumulative: number|null = null
    onVentilatorCumulative: number|null = null

    recovered: number|null = null
    
}
