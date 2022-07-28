import { Control, Map, DomUtil } from 'leaflet'
export class CustomLeafletControl extends Control {
    constructor(props?: any) {
        super(props)
    }

    div?: HTMLElement
    update (props?: {name: string, density: number}) {
        if(!this.div) throw new Error('Div not initialized!')
        if(!props) this.div.innerHTML = ''
        this.div.innerHTML = '<h4>US Population Density</h4>' +  (props ?
            '<b>' + props.name + '</b><br />' + props.density + ' people / mi<sup>2</sup>'
            : 'Hover over a state')
    };

    override onAdd(map : Map) {
        this.div = DomUtil.create('div', 'info') // create a div with a class "info"
        this.update()
        return this.div
    }
}
