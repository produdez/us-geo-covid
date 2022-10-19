import { Control, Map, DomUtil } from 'leaflet'
import { SharedDataService } from '../../services/shared-data.service'
export class CustomLeafletControl extends Control {
    column!: string
    constructor(private dataService: SharedDataService, props?: any, ) {
        super(props)
        dataService.waffleColumn.subscribe(column => {
            this.column = column
        })
    }

    div?: HTMLElement
    update (props?: {[key: string]: any}): void {
        const invalidProps = props === undefined
        var name = invalidProps ? 'Invalid state' : `${props['stateName']} - Id: ${props['stateId']}`
        var value = invalidProps || props['report'] === undefined ? 'No data currently !!' : props['report'][this.column] + ' people'
        if(!this.div) throw new Error('Div not initialized!')
        if(!props) this.div.innerHTML = ''
        this.div.innerHTML = 
            '<h4>Covid Situation</h4>' +  
                (
                    props ?
                    '<p class="text-lg">' + name + '</p>'
                     + '<p class="text-base font-semibold">' + value + ` ${this.column}  </p>`

                    : 'Hover over a state'
                )
    };

    override onAdd(map : Map) {
        this.div = DomUtil.create('div', 'info') // create a div with a class "info"
        this.div.className = 'bg-slate-600 rounded-xl opacity-80 p-5'
        this.update()
        return this.div
    }
}
