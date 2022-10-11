import { Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core'
import { GlobalReport, Report } from 'src/app/shared/models/report'
import { State } from 'src/app/shared/models/state'
import * as d3 from "d3"
import { RequiredProperty } from 'src/app/shared/decorators/requiredProperty'
import { CustomDate } from '../../models/customDate'
import { Line } from 'd3'
import { GraphIdService } from '../../services/graph-id.service'

interface DataPoint {
  date: CustomDate,
  value: number
}
interface SubData {
  name: string
  data: DataPoint[]
}
@Component({
  selector: 'app-line-graphs',
  templateUrl: './line-graphs.component.html',
  styleUrls: ['./line-graphs.component.sass']
})
export class LineGraphComponent implements OnInit{
  @HostBinding('class.fit-height')
  @ViewChild('chart') private chartContainer: ElementRef | undefined;
  graphId!: string 
  @Input() @RequiredProperty data!: (Report | GlobalReport)[]
  @Input() @RequiredProperty graphName!: string
  @Input() @RequiredProperty columns!: string[]
  colors =  ['#00876c', '#529f78', '#81b788', '#adce9c', '#d7e6b4', '#ffffd1', '#f5dea4', '#eebb7d', '#e99562', '#e16c53', '#d43d51',]
  colorsDict = {} as {[key: string]: any}
  clickedForMoreInfo = false
  graphWrapperClass = ''
  color(id: any) {
    return this.colorsDict[id]
  }
  constructor(elementRef: ElementRef, graphIdService: GraphIdService) {
    this.chartContainer = elementRef
    this.graphId = graphIdService.getId()
    this.graphWrapperClass = `${this.appendId('line-graph-wrapper')} w-5/6 h-5/6 pr-5 flex-grow my-auto flex justify-center`
  }
  setup() {
    // var zippedMap = this.columns.map((column, index) => ({key: column, value: this.colors[index]}))
    // this.colorsDict = zippedMap.reduce((obj, item) => Object.assign(obj, { [item.key]: item.value }), {})
    
    // Colors
    const colors =  ['#00876c', '#81b788', '#d7e6b4', '#f5dea4', '#eebb7d', '#e99562', '#e16c53', '#d43d51',]
    var colorsDict = {} as {[key: string]: any}
    this.columns.forEach((column, index) => {
        colorsDict[column] = colors[index*2] // TODO: fix this and add better contrast colors
    })
    const color = (column: string) => colorsDict[column]

    // Wrappers around the graph for testing on notebook
    // var backdrop = d3.select(container) 
    //     .attr('class', 'graph-backdrop')
    // var wrapper = backdrop.append('div')
    //     .attr('class', 'graph-wrapper')
    // var d3Element = (this.chartContainer as ElementRef).nativeElement;

    return {
        color: color,
        width: 800,
        height: 400,
        margin: {
            top: 20,
            bottom: 20,
            left: 60,
            right: 20
        },
        // wrapper: d3Element,
        yAxisPadding: 10,
    }
  }
  parseData(data: (Report| GlobalReport)[]) {
    // return this.columns.map((column) => {
    //   return {
    //     id: column,
    //     values: data.map((value) => {
    //       const json = value.json
    //       return {
    //         date: value.date,
    //         number: json[column] as number
    //       }
    //     })
    //   }
    // })
    return this.columns.map((column) => {
      return {
          name: column,
          data: data.map((row) => {
              return {
                  date: row.date,
                  value: row.json[column]
              }
          })
      }
    }) as SubData[]
  }

  appendId(className: string) {
    return className + '-' + this.graphId
  }
  ngOnInit() {
    // this.graphHTMLId = 'd3-line-graph-' + this.graphId
    const {color, width, height, margin, yAxisPadding} = this.setup()

    const data = this.parseData(this.data)

    console.time("DrawGraph");

    const makeScales = (
      data: SubData[], 
      width: number, height: number, 
      margin: any, 
      yAxisPadding: number
    ) => {
      // const xScale = d3.scaleUtc()
      //   .domain(d3.extent(this.data, (d) => d.date) as CustomDate[])
      //   .range([margin.left, width + margin.right])
      // const yScale = d3
      //       .scaleLinear()
      //       .domain([(0), d3.max(data, function(c) {
      //         return d3.max(c.values, function(d) {
      //             return d.number });
      //             }) as number
      //       ])
      //       .range([height - margin.bottom - extraPadding, margin.top])
      // return [xScale, yScale]
      var scaleX = d3.scaleUtc()
        .domain(d3.extent(data[0].data, (d) => d.date) as CustomDate[]) // Use a sub data to get the date scale
        .range([margin.left, width - margin.right])

      var scaleY = d3.scaleLinear()
          .domain([0, d3.max(data, (subData) => {
              // for each column data
              return d3.max(subData.data, (row) => row.value) as number
          }) as number]) 
          .rangeRound([height - margin.bottom - yAxisPadding, margin.top])
      return[ scaleX, scaleY]
    }

    const drawAxes = (
      scaleX: any, 
      scaleY: any, 
      width: number, height: number, margin: any, svg: any) => {
      
      // NOTE: dangerous
      var xAxis = d3.axisBottom(scaleX).scale(scaleX)
      var yAxis = d3.axisLeft(scaleY).scale(scaleY)
      svg.append("g")
          .attr("class", "x-axis")
          .attr("transform", `translate(0,${height - margin.bottom})`)
          .call(xAxis)
      svg.append("g")
          .attr("class", "y-axis")
          .attr("transform", `translate(${margin.left},0)`)
          .call(yAxis)
    }
    // const craftLineAndAxes = (x: any,y: any) => {
    //   var line = d3.line<any>()
    //     .x(d => x(d.date))
    //     .y(d => y(d.number))
  
    //   var xAxis = (g: any) => g
    //     .attr("transform", `translate(0,${height - margin.bottom})`)
    //     .call(d3.axisBottom(x))
      
    //   var yAxis = (g: any) => g
    //     .attr("transform", `translate(${margin.left},0)`)
    //     .call(d3.axisLeft(y))
      
    //   return [line, xAxis, yAxis]
    // }

    const drawSVGContainer = (width: number, height: number) => {
      var d3Element = (this.chartContainer as ElementRef).nativeElement;
      var svg = d3.select(d3Element).select('#d3-graph')
        // .attr("viewBox", "0 0 " + width + " " + height )
        // .attr("minHeight", '0')
        // .style("height", "100%")
        .attr("viewBox", "0 0 " + width + " " + height )
        .attr('width', width)
        .attr('height', height)
        .attr("preserveAspectRatio", "xMinYMin")
        .attr('class', 'border border-green-300')
      return svg
      // console.log('Wrapper: ', wrapper)
      // return wrapper.append("svg")
    }
      
    // const createGraphAndAddComponents = (
    //   components: any, 
    //   svg: any
    // ) => {

    //   var [line, xAxis, yAxis] = components
    //   let id = 0;
    //   const ids = function () {
    //         return "line-"+id++;
    //     }  

    //   const lines = svg.selectAll("lines")
    //     .data(data)
    //     .enter()
    //     .append("g")
      
    //   lines.append("path")
    //     .attr("class", ids)
    //     .attr("d", function(d: any) { return line(d.values); })
    //     .style("fill", "none")
    //     .style("stroke", (d: any) => {
    //       return this.color(d.id)
    //     })
    //     .style("stroke-width", 2)
        
    //     svg.append("text")
    //     .attr("x", width/2)
    //     .attr("y", 30)
    //     .attr("text-anchor", "middle")
    //     .style("font-size", "20px")
    //     .style('fill', 'white')
    //     .text(this.graphName)
      
    //     svg.append("g").call(xAxis)
    //     .style("font-size", "10px")

    //     svg.append("g").call(yAxis)
    //       .style("font-size", "10px")
    //   }
    const drawLines = (data: SubData[]) => {
        /* 
            ! Confusing part !
            1. LineWrapper is bound to DATA -> each line wrapper = 1 sub dataset {name: .., data..}
            2. Same for each path (graph line)
            3. But each point in path will be a tuple from sub-data.data
            4. So the lineFunction is bound to each actual data tuple {date.., value: ..}

        */
      // bind each sub-dataset to a group that wraps a path
      var lineWrapper = svg.selectAll('line-wrapper')
          .data(data)
          .enter().append('g').attr('class', 'line-wrapper')

        var lineFunction = d3.line<DataPoint>()
            .x(dataPoint => scaleX(dataPoint.date))
            .y(dataPoint => scaleY(dataPoint.value))
            
        // draw the actual path inside each line-wrapper group
        // ! Very important to note that each path has class 'line', will be used later
        
        const paths: d3.Selection<any, any, any,any> = 
            lineWrapper.append("path")
            .attr("class", "line") 
            .attr("d", function(subData) { return lineFunction(subData.data); }) // data points
            .style("fill", "none")
            .style("stroke", (subData) => {
                return color(subData.name)
            })
            .style("stroke-width", 2)
          
        var totalLength = paths.node().getTotalLength();
        paths
            .attr("stroke-dasharray", totalLength + " " + totalLength)
            .attr("stroke-dashoffset", totalLength)
            .transition()
                .duration(3000)
                .ease(d3.easePoly)
                .attr("stroke-dashoffset", 0);
    }

    const drawTitle = (width: number, height: number, svg: any) => {
      const titleWrapper = svg.append('g').attr('class', 'title-wrapper')
      const title = titleWrapper.append("text")
          .attr("x", width/2)
          .attr("y", 30)
          .attr("text-anchor", "middle")
          .attr('class', 'graph-title fill-white bold text-3xl')
          .text('Covid 19 in USA')
          .attr('opacity', 0)
          .transition().duration(1000)
          .attr('opacity', 1)
      
      d3.xml("/assets/info.svg")
        .catch(err => console.log('parsing info.svg error: ', err))
        .then((data) => {
          if(!data) return
          const titleBBox = title.node().getBBox()

          const [iconX, iconY] = [width/2 + titleBBox.width/2 + 10, 30/2 - 10]
          const iconWrapper: d3.Selection<any, any, any, any> = titleWrapper.append('svg')
              .attr('width', 25)
              .attr('height', 25)
              .attr("x", iconX)
              .attr("y", iconY)

          iconWrapper.node().append(data.documentElement)
          const hoverRect = iconWrapper.append('rect')
              .attr('class', 'info-icon-wrapper fill-transparent w-full h-full')

          // TODO: fix the wrapper holding the tooltip
          const svgWrapper = d3.select('.' + this.appendId('line-graph-wrapper'))
          // ! tooltip
          var tooltip = svgWrapper.append("div")
              .style("position", "absolute")
              .style("visibility", "hidden")
              .style("background-color", "white")
              .style("border", "solid")
              .style("border-width", "1px")
              .style("border-radius", "5px")
              .style("padding", "10px")
              .style("background-color", "#475569")
              .html(' \
                      <p>Click on the graph for better details!</p> \
              ')

          hoverRect
              .on('mouseover', () => tooltip.style('visibility', 'visible'))
              .on("mousemove", function(){
                  return tooltip
                    .style("left",(d3.pointer(this)[0] + 400) +"px")
                    .style("top", (d3.pointer(this)[1] - 10) +"px")
                  })
              .on("mouseout",  () => tooltip.style("visibility", "hidden"));

      })
    }
    const drawLegend = (svg: any) => {
            // for each sub-data set (each column), add a legend entry
            const columns = this.columns
            const [radius, startX, startY, paddingWords, gap] = [7, 100, 100, 20, 25]
            var legendWrapper = svg.append('g')
                .attr("class", "legend-wrapper")

            var legendBox = legendWrapper.append('g').attr('class', 'legend-box')
            var legends = legendWrapper
                .selectAll("legends")
                .data(columns)
                .enter()
                .append('g').attr('class', 'legend-entry')
            
            legends.append("circle")
                .attr("cx", startX)
                .attr("cy", function(_: any, i: number){ return startY + i*gap}) // 100 is where the first dot appears. gap is the distance between dots
                .transition().duration(1000)
                .attr("r", radius)
                .style("fill", (d: string) => color(d))
            legends.append("text")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr('class', 'text-lg font-semibold')
            .text(function(d: string){ return d})
            .style("fill", (d: string) => color(d))
            .attr("x", startX )
            .attr("y", function(_: string,i: number){ return startY + i*gap}) // 100 is where the first dot appears. gap is the distance between dots
            .transition().duration(500)
            .attr("x", startX + paddingWords)

            const boxPadding = {x: 15, y:15}

            const [boxX, boxY, boxWidth, boxHeight] = [
                startX - radius - boxPadding.x,
                startY - radius - boxPadding.y,
                150,
                (columns.length -1) * gap + 2 * boxPadding.y + 2* radius,
            ]
            legendBox
                .append('rect')
                .attr('class', this.appendId('legend-box-rectangle') + ' stroke-red-300 fill-transparent')
                .attr('x', boxX)
                .attr('y', boxY)
                .attr('height', boxHeight)
                .attr('width', boxWidth)
                .attr('rx', 10)
                .attr('ry', 10)
            
            legendBox.append('text')
                .attr("text-anchor", "center")
                .attr('class', this.appendId('current-date-hover') + ' text-lg fill-red-200')
                .style('width', 10).style('height', 10)
                .attr('x', boxX + 10)
                .attr('y', boxY - 10)
                .text('Date: non-selected')
            
            return [legends, startX, startY, boxWidth, gap]
    }

    const  addMouseHoverIndicators = (eventWrapper: any, data: SubData[]) => {
      // Vertical line
      eventWrapper.append("path") // this is the black vertical line to follow mouse
          .attr("class", `${this.appendId('vertical-line-indicator')} stroke-orange-400`)
          // .style("stroke", "red")
          .style("stroke-width", "2px")
          .style("opacity", "0");
  
      // Indicator circles, one per sub-data (or one per line)
      var indicators = eventWrapper
          .selectAll("." + this.appendId('circle-indicator-per-line'))
          .data(data).enter().append('g')
          .attr("class", this.appendId('circle-indicator-per-line'))

      indicators.append("circle")
          .attr("r", 7)
          .style("stroke", (d: SubData) => color(d.name))
          .attr('class', 'fill-transparent stroke-2')
          .style("opacity", "0")
      indicators.append("text")
          .style('fill', 'white')
          .attr("transform", "translate(10,3)")
  }
  function createInteractionCaptureBox(eventWrapper:any, width: number, height: number) {
      const offset = 50
      var interactiveRectangle = eventWrapper.append('svg:rect')
          .attr('y', offset)
          .attr('width', width)
          .attr('height', height - offset)
          .attr('fill', 'none')
          .attr('pointer-events', 'all')
  
      return interactiveRectangle
  }
  const addMouseHoverShowsIndicatorEvents = (interactiveRectangle: any, height: number, scaleX: any, scaleY: any) => {
      const graphLines = document.getElementsByClassName('line') as HTMLCollectionOf<SVGPathElement>
      const numberFormatter = new Intl.NumberFormat('en-IN', ) // {roundingMode: 'ceil', roundingIncrement: 1, notation: 'engineering'}
      const yValueHolder = new Array(graphLines.length)

      const hideIndicators = (event: any) => { // on mouse out hide line, circles and text
          d3.select('.' + this.appendId('vertical-line-indicator'))
          .style("opacity", "0");
          d3.selectAll("." + this.appendId('circle-indicator-per-line') + " circle")
          .style("opacity", "0");
          d3.selectAll("." + this.appendId('circle-indicator-per-line') + " text")
              .style("opacity", "0");
      }

      const  showIndicators = (event: any) => { // on mouse in show line, circles and text
        d3.select('.' + this.appendId('vertical-line-indicator'))
            .style("opacity", "1");
          d3.selectAll("." + this.appendId('circle-indicator-per-line') + " circle")
            .style("opacity", "1");
          if(!event.clickedForMoreInfo) {
            d3.selectAll("." + this.appendId('circle-indicator-per-line') + " text")
              .style("opacity", "1");
          }
      }

      const moveIndicators = (event: any) => { // mouse moving over canvas
          // get mouse
          var mouse = d3.pointer(event);
          var mouseX = mouse[0]

          d3.select('.' + this.appendId('current-date-hover')).text('Date: ' + scaleX.invert(mouseX).toLocaleDateString("en-GB"))
          // move the vertical line
          d3.select('.' + this.appendId('vertical-line-indicator'))
              // draw path from top to bottom at mouse's x location
              .attr("d", () => { 
                  var d = "M" + mouseX + "," + height;
                  d += " " + mouseX + "," + 0;
                  return d;
              });

          // position the circle and text
          d3.selectAll("." + this.appendId('circle-indicator-per-line')) // for each line indicator circle
              .attr("transform", function(d, i) {
                  /* ------------------------------ Magic begins ------------------------------ */
                  var beginning = 0,
                      graphLine: SVGPathElement = graphLines[i],
                      end = graphLine.getTotalLength(),
                      target = null;

                  while (true){
                      target = Math.floor((beginning + end) / 2);
                      var pos = graphLine.getPointAtLength(target);
                      if ((target === end || target === beginning) && pos.x !== mouseX) {
                          break;
                      }
                      if (pos.x > mouseX) end = target;
                      else if (pos.x < mouseX) beginning = target;
                      else break; //position found
                  }
                  /* -------- Magic ends and correct position of mouse on line is found ------- */

                  // update the text with y value
                  const textIndicator = d3.select(this).select('text')
                  textIndicator.text(numberFormatter.format(scaleY.invert(pos.y)));
                  yValueHolder[i] = numberFormatter.format(scaleY.invert(pos.y))
                  // return position
                  return "translate(" + mouseX + "," + pos.y +")";
              })
          d3.selectAll('.'+ this.appendId('extra-detail-indicator'))
              .text((d, i) => yValueHolder[i])
      }
      interactiveRectangle
      .on('mouseout', hideIndicators)
      .on('mouseover', showIndicators)
      .on('mousemove', moveIndicators)


      

  }

  const addMouseClickIndicators = (
    legends: d3.Selection<any, any, any, any>,
    startX: any, startY: any, boxWidth: number, gap: any) => {
      
      legends.append('text')
          .attr("x", startX + boxWidth - 20)
          .attr("y", function(d,i){ return startY + i * gap }) // 100 is where the first dot appears. 25 is the distance between dots
          .style("fill", (d) => color(d))
          .text(function(d){ return `undefined`})
          .attr("text-anchor", "left")
          .style("alignment-baseline", "middle")
          .attr('class', this.appendId('extra-detail-indicator') + ' text-lg font-semibold')
          .attr('opacity', 0)
  }

  const addMouseClickShowMoreDetailEvents = (
      interactiveRectangle: any, originalLegendBoxWidth: number)  => {
      const legendBox = d3.select('.' + this.appendId('legend-box-rectangle'))
      const bigLegendBoxWidth = originalLegendBoxWidth * 2 - 40
      const extraDetailIndicators = d3.selectAll('.' + this.appendId('extra-detail-indicator'))
      const textHoverIndicator = d3.selectAll('.circle-indicator-per-line text')
      const showMoreDetails = () => { // mouse clicked on canvas
          this.clickedForMoreInfo = !this.clickedForMoreInfo
          if(this.clickedForMoreInfo) {
              legendBox.transition()
                  .attr('width', bigLegendBoxWidth)
              extraDetailIndicators.transition().style('opacity', 1)
              textHoverIndicator.transition().style('opacity', 0)
          }else {
              legendBox.transition()
              .attr('width', originalLegendBoxWidth)
              extraDetailIndicators.transition().style('opacity', 0)
              textHoverIndicator.transition().style('opacity', 1)
          }
      }
      interactiveRectangle.on('click', showMoreDetails)
  }
      
    var svg = drawSVGContainer(width, height)
    
    var [scaleX, scaleY] = makeScales(data, width, height, margin, yAxisPadding)
    // var components = craftLineAndAxes(scaleX, scaleY)
    // createGraphAndAddComponents(components, svg)
    // addLegend(svg)
    drawAxes(scaleX, scaleY, width, height, margin, svg)
    drawLines(data)

    drawTitle(width, height, svg)
    const [legends, legendStartX, legendStartY, legendBoxWidth, legendGap] = drawLegend(svg)

    var eventWrapper = svg.append('g')
      .attr("class", "mouse-over-effects")
    addMouseHoverIndicators(eventWrapper, data)
    addMouseClickIndicators(legends, legendStartX, legendStartY, legendBoxWidth, legendGap)
    const interactiveRectangle = createInteractionCaptureBox(eventWrapper, width, height)
    addMouseHoverShowsIndicatorEvents(interactiveRectangle, height, scaleX, scaleY)
    addMouseClickShowMoreDetailEvents(interactiveRectangle, legendBoxWidth)

    // Ref for interactivity: https://stackoverflow.com/questions/29440455/how-to-as-mouseover-to-line-graph-interactive-in-d3
    // const line = components[0] //lines
    // valueCircle = 
    console.timeEnd("DrawGraph");
  }
}
