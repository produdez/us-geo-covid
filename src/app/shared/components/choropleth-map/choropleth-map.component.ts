import { Component, Input, NgZone, OnInit } from '@angular/core'
import * as L from 'leaflet'
import { UsStatesGeometryService } from '../../services/us-states-geometry.service'
import {CustomLeafletControl} from './custom-leaflet-control'
import { MapStylingService } from './map-styling.service'
import { Report } from '../../models/report'
import { RequiredProperty } from '../../decorators/requiredProperty'
import { SharedDataService } from '../../services/shared-data.service'
import { DialogService } from '@ngneat/dialog'
import { DetailPageDialogComponent } from '../dialogs/detail-page-dialog/detail-page-dialog.component'

@Component({
  selector: 'app-choropleth-map',
  templateUrl: './choropleth-map.component.html',
  styleUrls: ['./choropleth-map.component.sass'],
  // encapsulation: ViewEncapsulation.None // ! NOTE VERY IMPORTANT
})
export class ChoroplethMapComponent implements OnInit {
  // TODO: 1.5: modulate the map code currently messy (if needed to then change later)
  constructor (
    private style: MapStylingService,
    private usStatesGeometryService: UsStatesGeometryService,
    private sharedDataService: SharedDataService,
    private dialogService: DialogService,
    private zone: NgZone
  ) {

  }
  @Input() @RequiredProperty date!: Date
  @Input() @RequiredProperty reports!: Report[]
  geometryData = undefined as any
  reportUpdated = false
    
  loaded = () => {
    var loaded = this.loadedGeo() && this.loadedReports()
    if(loaded) {
      if(this.reportUpdated) {
        this.reportUpdated = false
      }
    }
    return loaded
  }

  loadedReports = () => this.reports.length != 0
  loadedGeo = () => this.geometryData !== undefined
  

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
    // TODO: fix when moving back in time it does wrong thing!!!
    this.usStatesGeometryService.statesGeometry.subscribe(data => {
      if(data.length > 0) {
        this.geometryData = this.usStatesGeometryService.constructGeoJSON()
        this.usStatesGeometryService.constructGeoJsonWithReportData(this.reports)
      }
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
        click: selectStateForDetailShowing,
      })
    }
  
    const selectStateForDetailShowing = (e: L.LayerEvent) => {
      var inits = e.target.feature.properties['stateInitials']
      this.sharedDataService.updateState(inits)
      // ! This ngZone is used to make angular know were' calling a function in the angular "zone"
      this.zone.run(() => {
        this.dialogService.open(DetailPageDialogComponent, {
          data: {
            stateIdentifier: inits
          }
        })
      })
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
