import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { Report } from 'src/app/shared/models/report'
import { State } from 'src/app/shared/models/state'
import * as d3 from "d3"
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty'
@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.sass']
})
export class GraphsComponent implements OnInit{
  @Input() @RequiredProperty reports!: Report[]
  @Input() @RequiredProperty state!: State
  
  constructor() {
  }
  ngOnInit() {
    var data = this.reports
    var height = 400
    var width = 800
    var margin = ({top: 20, right: 20, bottom: 20, left: 80})

    var x = d3.scaleUtc()
      .domain(d3.extent(data, d => d.date) as Date[])
      .range([margin.left, width + margin.right])
    var y = d3.scaleLinear()
      .domain([d3.min(data, d => d.positive), d3.max(data, d => d.positive)] as number[])
      .range([height - margin.bottom, margin.top])

    
    var line = d3.line<Report>()
      .x(d => x(d.date))
      .y(d => y(d.positive))

    var xAxis = (g: any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
    
    var yAxis = (g: any) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

    var svg = d3.select('svg')
      .attr("viewBox", "0 0 " + width + " " + height )
      .attr("preserveAspectRatio", "xMinYMin")
      .attr("width", '60%')
    var g = svg.append("g").attr("fill", "orange")

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-width", 1.5)
      .attr("d", line)
    svg.append("g").call(xAxis)

    svg.append("g").call(yAxis)
  }
}
