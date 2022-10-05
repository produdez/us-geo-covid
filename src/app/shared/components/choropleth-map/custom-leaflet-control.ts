import { Control, Map, DomUtil } from 'leaflet'
export class CustomLeafletControl extends Control {
    constructor(props?: any) {
        super(props)
    }

    div?: HTMLElement
    update (props?: {[key: string]: any}): void {
        const invalidProps = props === undefined
        var name = invalidProps ? 'Invalid state' : `${props['stateName']} - Id: ${props['stateId']}`
        var value = invalidProps || props['report'] === undefined ? 'No data currently !!' : props['report']['positive'] + ' people'
        if(!this.div) throw new Error('Div not initialized!')
        if(!props) this.div.innerHTML = ''
        this.div.innerHTML = 
            '<h4>Covid Situation</h4>' +  
                (
                    props ?
                    '<b>' + name + '</b>' +
                    '<br />' + value
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
