import { Component, Input, OnInit } from '@angular/core'
import { Report } from 'src/app/core/models/report'
import { State } from 'src/app/core/models/state'
import * as d3 from "d3"
@Component({
  selector: 'app-graphs',
  templateUrl: './graphs.component.html',
  styleUrls: ['./graphs.component.sass']
})
export class GraphsComponent implements OnInit {
  @Input() reports: Report[] = []
  @Input() state: State |undefined = undefined
  
  constructor() { }

  ngOnInit() {
    var data: {name: string, value: string}[] = [
      {name: "A", value: "0.08167"},
      {name: "B", value: "0.01492"},
      {name: "C", value: "0.02782"},
      {name: "D", value: "0.04253"},
      {name: "E", value: "0.12702"},
      {name: "F", value: "0.02288"},
      {name: "G", value: "0.02015"},
      {name: "H", value: "0.06094"},
      {name: "I", value: "0.06966"},
      {name: "J", value: "0.00153"},
      {name: "K", value: "0.00772"},
      {name: "L", value: "0.04025"},
      {name: "M", value: "0.02406"},
      {name: "N", value: "0.06749"},
      {name: "O", value: "0.07507"},
      {name: "P", value: "0.01929"},
      {name: "Q", value: "0.00095"},
      {name: "R", value: "0.05987"},
      {name: "S", value: "0.06327"},
      {name: "T", value: "0.09056"},
      {name: "U", value: "0.02758"},
      {name: "V", value: "0.00978"},
      {name: "W", value: "0.0236"},
      {name: "X", value: "0.0015"},
      {name: "Y", value: "0.01974"},
      {name: "Z", value: "0.00074"}
    ]
    var height = 400
    var width = 550
    var margin = ({top: 20, right: 20, bottom: 20, left: 20})

    var x = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1)

    var y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)] as number[])
      .range([height - margin.bottom, margin.top])

    var xAxis = (g: any) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
    
    var yAxis = (g: any) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))

      var svg = d3.select('svg')

    var g = svg.append("g").attr("fill", "orange")

    g.selectAll("rect")
      .data(data)
      .join("rect")
      .attr("x", d => x(d.name) as number)
      .attr("y", d => y(parseFloat(d.value)))
      .attr("height", d => y(0) - y(parseFloat(d.value)))
      .attr("width", x.bandwidth())

    svg.append("g").call(xAxis)

    svg.append("g").call(yAxis)
  }
}
