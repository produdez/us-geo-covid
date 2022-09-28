import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core'
import * as L from 'leaflet'
import { UsStatesGeometryService } from '../../services/us-states-geometry.service'
import {CustomLeafletControl} from './custom-leaflet-control'
import { MapStylingService } from './map-styling.service'
import { Report } from '../../models/report'
import { CovidApiService } from '../../services/covid-api.service'
import { RequiredProperty } from '../../decorators/requiredProperty'

@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.sass'],
  encapsulation: ViewEncapsulation.None // ! NOTE VERY IMPORTANT
})
export class ChoroplethMapComponent implements OnInit, OnChanges {
  // TODO: 1.5: modulate the map code currently messy (if needed to then change later)
  // TODO: 4 -> add some general graphs to the layout
  constructor (
    private style: MapStylingService,
    private usStatesGeometryService: UsStatesGeometryService,
    private covidApiService: CovidApiService,
  ) {}
  @Input() @RequiredProperty date!: Date
  geometryData = undefined as any
  reports = [] as Report[]
  private loadedGeo = false
  private loadedReports = false

  loaded = () => {
    var loaded = this.loadedGeo && this.loadedReports
    if(loaded) {
      // ! Callbacks to run before map is ready
      this.usStatesGeometryService.constructGeoJsonWithReportData(this.reports)
    }
    return loaded
  }
  

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      })
    ],
    zoom: 4,
    center: L.latLng(37.8, -96)
  }

  ngOnInit() {
    this.usStatesGeometryService.statesGeometry.subscribe(data => {
      if(data.length > 0) {
        this.geometryData = this.usStatesGeometryService.constructGeoJSON()
  
        console.log('Geometry data: ', this.geometryData)
        this.loadedGeo = true
      }
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    this.loadedReports = false
    this.reports = []
    this.covidApiService.getDateReports(this.date.getFullYear(), this.date.getMonth(), this.date.getDate()).subscribe(data => {
      for(let reportJson of data) {
        this.reports.push(Report.fromJSON<Report>(reportJson))
      }
      console.log('Reports: ', this.reports)
      this.loadedReports = true
    })
  }

  onMapReady(map: L.Map) {
    // ! this runs when the map component is rendered on to the page
    // * So the <loading> variable is used to control when this happens
    this.addGeoJSONLayer(map)
  }

  addGeoJSONLayer(map: L.Map) {
    function resetHighlight(e: L.LayerEvent) {
      geojsonLayer.resetStyle(e.target)
      info.update()
    }
    function highlightFeature(e: L.LayerEvent) {
      var layer = e.target
  
      layer.setStyle({
        weight: 5,
        color: '#666',
        dashArray: '',
        fillOpacity: 0.7
      })
  
      if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
      }
      info.update(layer.feature.properties)
    }
  
    const onEachFeature = (feature: any, layer: any) => {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
    }
  
    const zoomToFeature = (e: L.LayerEvent) => {
      map.fitBounds(e.target.getBounds())

      // TODO: link to detail page after have detail page setup correctly
      var inits = e.target.feature.properties['initials']
      this.covidApiService.getState(inits).subscribe(
        (state: any) => {console.log('State detail: ', state)}
      )
    }



    var geojsonLayer = L.geoJSON(
      this.geometryData,
      {
        style: this.style.choroplethDefaultStyle.bind(this.style),
        onEachFeature: onEachFeature.bind(this)
      }
    )
    geojsonLayer.addTo(map)
    // add info prompt
    var info = new CustomLeafletControl()
    info.addTo(map)
    // add legend
    var legend = new L.Control({position: 'bottomright'})
    const getColor = this.style.getColor.bind(this.style)
    var grades = this.style.colorSteps
      .filter((_, index) => index % 2 ==0)
      .map(
        (val) => val == 1 ? 
          0.8 * this.style.maxPropertyValue 
          : Math.floor(val * this.style.maxPropertyValue)
      )

    legend.onAdd = (map) => {
    
        var div = L.DomUtil.create('div', 'info legend')
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i]) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
        }
    
        return div
    }
    legend.addTo(map)
    

  };
}
