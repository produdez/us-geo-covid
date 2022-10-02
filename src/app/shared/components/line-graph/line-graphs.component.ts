import { Component, HostBinding, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core'
import { Report } from 'src/app/shared/models/report'
import { State } from 'src/app/shared/models/state'
import * as d3 from "d3"
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty'
import { CustomDate } from '../../models/customDate'
import { Line } from 'd3'
@Component({
  selector: 'app-line-graphs',
  templateUrl: './line-graphs.component.html',
  styleUrls: ['./line-graphs.component.sass']
})
export class LineGraphComponent implements OnInit{
  @HostBinding('class.component-border-box')
  @Input() @RequiredProperty data!: Report[]
  @Input() @RequiredProperty graphName!: string
  @Input() @RequiredProperty columns!: string[]
  colors =  ['#00876c', '#529f78', '#81b788', '#adce9c', '#d7e6b4', '#ffffd1', '#f5dea4', '#eebb7d', '#e99562', '#e16c53', '#d43d51',]
  colorsDict = {} as {[key: string]: any}
  color(id: any) {
    console.log(this.colorsDict)
    return this.colorsDict[id]
  }
  constructor() {}
  setupVariables() {
    var zippedMap = this.columns.map((column, index) => ({key: column, value: this.colors[index]}))
    this.colorsDict = zippedMap.reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {})
  }
  transform(data: Report[]) {
    return this.columns.map((column) => {
      return {
        id: column,
        values: data.map((value) => {
          const json = value.json
          return {
            date: value.date,
            number: json[column] as number
          }
        })
      }
    })
  }
  ngOnInit() {
    this.setupVariables()
    const data = this.transform(this.data)

    console.time("DrawGraph");
    var height = 400
    var width = 800
    var margin = ({top: 20, right: 20, bottom: 20, left: 80})
    var extraPadding = 10


    const craftScales = () => {
      const xScale = d3.scaleUtc()
        .domain(d3.extent(this.data, (d) => d.date) as CustomDate[])
        .range([margin.left, width + margin.right])
      const yScale = d3
            .scaleLinear()
            .domain([(0), d3.max(data, function(c) {
              return d3.max(c.values, function(d) {
                  return d.number });
                  }) as number
            ])
            .range([height - margin.bottom - extraPadding, margin.top])
      return [xScale, yScale]
    }

    const craftLineAndAxes = (x: any,y: any) => {
      var line = d3.line<any>()
        .x(d => x(d.date))
        .y(d => y(d.number))
  
      var xAxis = (g: any) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x))
      
      var yAxis = (g: any) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
      
      return [line, xAxis, yAxis]
    }

    const createGraphContainer = () => {
      var svg = d3.select('#d3-graph') // ! svg graph component
        .attr("viewBox", "0 0 " + width + " " + height )
        .attr("preserveAspectRatio", "xMinYMin")
      return svg
    }
      
    const createGraphAndAddComponents = (
      components: any, 
      svg: any
    ) => {

      var [line, xAxis, yAxis] = components
      let id = 0;
      const ids = function () {
            return "line-"+id++;
        }  

      const lines = svg.selectAll("lines")
        .data(data)
        .enter()
        .append("g");
      
      lines.append("path")
        .attr("class", ids)
        .attr("d", function(d: any) { return line(d.values); })
        .style("fill", "none")
        .style("stroke", (d: any) => {
          console.log('stroke: ', this.color(d.id))
          return this.color(d.id)
        })
        .style("stroke-width", 2)
        
        svg.append("text")
        .attr("x", width/2)
        .attr("y", 30)
        .attr("text-anchor", "middle")
        .style("font-size", "20px")
        .style('fill', 'white')
        .text(this.graphName)
      
        svg.append("g").call(xAxis)
        .style("font-size", "10px")

        svg.append("g").call(yAxis)
          .style("font-size", "10px")
      }

    const addLegend = (svg: any) => {
    
      svg.selectAll("mydots")
        .data(this.columns)
        .enter()
        .append("circle")
          .attr("cx", 100)
          .attr("cy", function(d: any,i: any){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
          .attr("r", 7)
          .style("fill", (d: any) => this.color(d))
          svg.selectAll("mylabels")
          .data(this.columns)
          .enter()
          .append("text")
            .attr("x", 120)
            .attr("y", function(d:any,i: any){ return 100 + i*25}) // 100 is where the first dot appears. 25 is the distance between dots
            .style("fill", (d: any) => this.color(d))
            .text(function(d: any){ return d})
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
    }
      
    
    var [x,y] = craftScales()
    var components = craftLineAndAxes(x,y)
    var svg = createGraphContainer()
    createGraphAndAddComponents(components, svg)
    addLegend(svg)

    console.timeEnd("DrawGraph");
  }
}
