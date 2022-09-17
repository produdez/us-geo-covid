import { Component, OnInit, ViewEncapsulation } from '@angular/core'
import * as L from 'leaflet'
import { UsStatesService } from '../core/services/us-states.service'
import {CustomLeafletControl} from './custom-leaflet-control'
import { MapStylingService } from './map-styling.service'
@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.sass'],
  encapsulation: ViewEncapsulation.None // ! NOTE VERY IMPORTANT
})
export class ChoroplethMapComponent {

  constructor (
    private statesService: UsStatesService, 
    private style: MapStylingService
  ) {}

  statesData = this.statesService.statesData

  options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19
      })
    ],
    zoom: 4,
    center: L.latLng(37.8, -96)
  }


  onMapReady(map: L.Map) {
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
  
    function onEachFeature(feature: any, layer: any) {
      layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
      })
    }
  
    function zoomToFeature(e: L.LayerEvent) {
      map.fitBounds(e.target.getBounds())
    }



    var geojsonLayer = L.geoJSON(
      this.statesData, 
      {
        style: this.style.choroplethDefaultStyle.bind(this.style),
        onEachFeature: onEachFeature
      }
    )
    geojsonLayer.addTo(map)
    // add info prompt
    var info = new CustomLeafletControl()
    info.addTo(map)
    // add legend
    var legend = new L.Control({position: 'bottomright'})
    const getColor = this.style.getColor.bind(this.style)
    legend.onAdd = function (map) {
    
        var div = L.DomUtil.create('div', 'info legend'),
            grades = [0, 10, 20, 50, 100, 200, 500, 1000],
            labels = []
    
        // loop through our density intervals and generate a label with a colored square for each interval
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+')
        }
    
        return div
    }
    legend.addTo(map)
    

  };
}
