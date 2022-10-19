import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, HostBinding, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import * as d3 from "d3"
import { filter } from 'd3';
import { RequiredProperty } from '../../decorators/requiredProperty';
import { formatDate } from '../../helpers/common';
import { CustomDate } from '../../models/customDate';
import { GlobalReport, Report } from '../../models/report';
import { State } from '../../models/state';
import { CovidApiService } from '../../services/covid-api.service';
import { GraphIdService } from '../../services/graph-id.service';
import { SharedDataService } from '../../services/shared-data.service';

const range = (num: number) => [...Array(num).keys()].map(i => i)
interface WaffleConfig {
    colNum: number,
    rowNum: number,
    cellSize: number,
    padding: number,
    cellCount: number,
    width: number,
    scaleX: any,
    scaleY: any,
}

interface GroupInfo {
  accumulated: number;
  initials: any;
  percentage: number;
}

interface WaffleCellInfo {
  x: number,
  y: number,
  groupIndex: number
}

interface NonIncludedData {
    skippedStates: string[],
    othersPercentageRaw: number
}
@Component({
  selector: 'app-waffle-chart',
  templateUrl: './waffle-chart.component.html',
  styleUrls: ['./waffle-chart.component.sass']
})
export class WaffleChartComponent implements AfterViewChecked, OnInit, OnChanges {
  @HostBinding('class.fit-height')
  @ViewChild('wrapper')
  private chartWrapperRef!: ElementRef

  graphId!: string 
  @Input() @RequiredProperty date!: CustomDate
  @Input() @RequiredProperty todayData!: Report[]
  @Input() @RequiredProperty graphName!: string
  @Input() simplified = true
  NO_CELL_BORDER = !true

  clickedForMoreInfo = false
  states!: State[]
  
  column!: string
  graphWrapperClass!: string
  svgId!: string
  width!: number
  height!: number
  minLegendWidth = 150
  firstInvalidGroupIndex: number
  noGraph = false

  constructor(private ref: ChangeDetectorRef,graphIdService: GraphIdService, private sharedDataService: SharedDataService) {
    this.firstInvalidGroupIndex = 1
    // this.column = this.columns[0]

    // this.chartContainerRef = elementRef
    this.graphId = graphIdService.getId()
    this.svgId = 'waffle-graph-' + this.graphId
    this.graphWrapperClass = this.appendId('waffle-graph-wrapper')+'h-full w-full px-5 flex-grow my-auto flex justify-center'
  }

  appendId(className: string) {
    return className + '-' + this.graphId + ' '
  }

  updateWidthHeight() {
    this.width = this.chartWrapperRef.nativeElement.offsetWidth
    this.height = this.chartWrapperRef.nativeElement.offsetHeight
  } 

  valid() {
    if(!this.states || !this.todayData) return false
    return this.states.length > 0 && this.todayData.length > 0 && this.column != undefined
  }

  ngOnInit() {
    this.sharedDataService.waffleColumn.subscribe((column: string) => {
        if(this.column == column) return
        this.column = column
        console.log('Column: ', this.column)
        if(this.valid()) this.drawGraph()
    })
    this.sharedDataService.allStates.subscribe((states: State[]) => {
      this.states = states.sort((a, b) => a.id < b.id ? -1 : 1)
    })
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log('Changes', changes)
    if('todayData' in changes) {
        console.log('in keys')
        this.noGraph = false
    }
  }
  ngAfterViewChecked() {
    // ! The div of this component will be resized so we wait until it's updated to draw the graph
    const newHeight = this.chartWrapperRef.nativeElement.offsetHeight,
      newWidth = this.chartWrapperRef.nativeElement.offsetWidth,
      heightDiff = newHeight - this.height,
      widthDiff = newWidth - this.width
    if(heightDiff > (0.3 * this.height) || widthDiff > (0.3 * this.width)) {
      this.width = newWidth
      this.height = newHeight
      console.log('Drawing from ngAfterViewChecked')

      this.drawGraph()
    }
  }

  ngAfterViewInit() {
    this.updateWidthHeight()
    console.log('Draw from ngAfterViewInit')
    this.drawGraph()
  }

    // * Styling and layout variables setup
  setupBasics(container: any) {
      // Colors
      const reds = ['#DD5353','#B73E3E',]
      const yellows = ['#EDDBC0','#C4B6B6','#FFD372',]
      const blues =['#8BBCCC','#256D85','#31C6D4','#277BC0','#30475E']
      const teals = ['#628E90','#B4CDE6','#4C6793',]
      const purples = ['#372948','#5C2E7E', '#AF0171','#905E96','#D58BDD','#FF99D7',]
      const oranges = ['#E3C770','#FFC18E','#F0A500', '#FD841F','#E14D2A',]
      const browns = ['#C69B7B','#3C2317','#704F4F', '#A77979',]
      const greens = ['#1A4D2E','#1C6758','#3D8361','#7FB77E', '#B1D7B4'] 
      const ugly = ['#EE6983','#CD104D','#A10035','#FF1E00','#850E35','#9CFF2E','#9C2C77','#874C62']
      const grays = ['#413F42','#222831','#06283D','#47B5FF','#3120E0','#000000',]
      
      const colorList = [...reds, ...yellows,...blues, ...teals, ...purples,...oranges,...browns, ...greens,...ugly, ...grays,]
      const color = (i: number) => {
        const scale = d3.scaleOrdinal<number, string>(colorList).domain(range(this.states.length))
        return (i === this.firstInvalidGroupIndex) ? "#FFFFFF" : scale(i)
      }

      // Wrappers around the graph for testing on notebook
      var backdrop = d3.select(container) 
      var graphWrapper = backdrop.append('div')
            .attr('id', this.svgId)
          .attr('class', 'graph-wrapper w-full h-full')
      var layoutWrapper = graphWrapper.append('div')
          .attr('class', this.appendId('layout-wrapper') + 'flex h-full w-full')

      const [width, height] = [this.width, this.height]
      if (width < height) throw new Error('width must be greater than height')
      return {
          color: color,
          width: width,
          height: height,
          wrapper: layoutWrapper,
      }
  }

  makeWaffleLayoutConfig(width: number, height: number) {
            const colNum = 15 // ! max should be 20
            const padding =  0.3
            var cellSize = Math.floor(height * (1- padding) / colNum)
            var waffleWidth = colNum * cellSize * (1 + padding)
            const remainingWidth = width - waffleWidth
            if(remainingWidth < this.minLegendWidth) {
                // recalculate the whole thing if not enough space for legend
                waffleWidth = width - this.minLegendWidth
                cellSize = Math.floor(waffleWidth * (1- padding) / colNum)
            } 
            var rowNum = Math.ceil(height * (1- padding) / cellSize) + 1
            var cellCount = rowNum * colNum


            const scaleY = d3.scaleBand<number>()
                .domain(range(rowNum))
                .range([0, cellSize * rowNum * (1+padding)])
                .padding(padding)   
                
            const scaleX = d3.scaleBand<number>()
                .domain(range(colNum))
                .range([0, waffleWidth])
                .padding(padding)

            return {
                colNum: colNum,
                rowNum: rowNum,
                cellSize: cellSize,
                padding: padding,
                cellCount: cellCount,
                width: waffleWidth,
                scaleX: scaleX,
                scaleY: scaleY,
            }
  }

  parseData() {
    const sort = (arr: any[], accessor: (x: any) => any) => arr.sort((a,b) => accessor(a) < accessor(b) ? -1 : 1)
    const column = this.column
    const accessor = (r: Report) => r.json[column]
    const totalPositive = this.todayData.reduce((a,b) => a + b.json[column], 0)
    var acc = 0

    this.todayData = filter(this.todayData, (r: Report) => accessor(r) != null && accessor(r) > 0)
    this.todayData = sort(this.todayData, (r: Report) => r.stateId)
    console.log('Today data after sort: ', this.todayData)
    var zippedData
    if(this.todayData.length < this.states.length) {
        var searchIndex = 0
        zippedData = this.todayData.map((report: Report) => {
            while(searchIndex < this.states.length) {
                const state = this.states[searchIndex]
                if(report.stateId === state.id) return [report, state]
                searchIndex ++
            }
            throw new Error(`Report with state id: ${report.stateId} not found in state list`)
        })
    } else {
        zippedData =  d3.zip<any>(
            this.todayData, 
            this.states
        )
    }
    const data = zippedData
        .map(([report, state]) => {
                return {
                    'initials': state.initials,
                    'percentage' : accessor(report) / totalPositive * 100
                }
            }
        )
        .sort((a,b) => a.percentage > b.percentage ? -1 : 1)
        .map(x => {
            acc = acc + x.percentage
            return {...x, 'accumulated' : acc}
        })
    
    if(data.length === 0 ) return []
    if(acc != 100.0) { // some cases sum is 99.99999
        const missing = 100.0 - acc
        data[data.length - 1].percentage += missing
        data[data.length - 1].accumulated += missing
    }
    console.log('data: ', data)
    return data
  }
  private drawGraph() {

    function makeWrappers(wrapper: any, waffleConfig: WaffleConfig, height: number, sideWidth: number) {
      const titleWrapperHeight = 50
    
      // waffle on the left
      const padding = 3
      const waffleWrapper = wrapper.append('div')
          .attr('class', 'waffle-wrapper')
          .style('height', height + 'px')
          .style('width', waffleConfig.width - padding + 'px')
          .style('margin-right', padding + 'px')
      
      // side wrapper on the right with title on top and legend at the bottom
      const sideWrapper = wrapper.append('div')
          .attr('class', 'side-wrapper')
          .style('height', height + 'px')
          .style('width', sideWidth + 'px')

      
      const titleWrapper = sideWrapper.append('div')
          .attr('class', 'title-wrapper')
          .style('height', titleWrapperHeight + 'px')
          .style('width', sideWidth + 'px')

          
      const legendWrapper = sideWrapper.append('div') 
          .attr('class', 'legend-wrapper scrollbar scrollbar-thin overflow-y-scroll scrollbar-thumb-blue-100 scrollbar-track-gray-700')
          .style('height', height - titleWrapperHeight + 'px')
          .style('width', sideWidth + 'px')
      return {
          waffleWrapper: waffleWrapper,
          legendWrapper: legendWrapper,
          titleWrapper: titleWrapper,
          titleWrapperHeight: titleWrapperHeight
      }
    }

    
    function drawSVG(x: number,y: number,width: number, height: number, wrapper: any) {
        return wrapper.append("svg")
            .attr("viewBox", `${x} ${y} ${width} ${height}`)
            .attr('width', width)
            .attr('height', height)
            .attr('class', 'border border-green-300')
    }
    const getWaffles = (initGroupData: GroupInfo[], waffleConfig: WaffleConfig): any =>  {
        const cellCount = waffleConfig.cellCount,
            rows = waffleConfig.rowNum,
            cols = waffleConfig.colNum
        var groupCount = initGroupData.length, 
            groupIndex = 0,
            initCellPercentage = 1/cellCount * 100
        // rounding initData to the value of one cell
        var runningSum = 0.0
        const groupData = initGroupData.map((d) => {
            const rounded = Math.round(d.percentage / initCellPercentage)
            runningSum += rounded
            return {...d, percentage: rounded, accumulated: runningSum}
        })
        const cellPercentage = 1.0
        if(groupData[0].percentage < cellPercentage) {
            throw new Error('BULL SHIT, biggest percentage smaller than one cell percentage!!!')
        }
        
        var cellArray = [] as WaffleCellInfo[], 
        accumulatedGroupPercentage = groupData[0].percentage,
        accumulatedCellPercentage = 0

        var nonIncludedData: NonIncludedData = {
            skippedStates: [] as string[],
            othersPercentageRaw: 0.0
        }
        // ! Starts from top left with as x=0 y=0, 
        var cell, othersPercentage = 0.0
        for(let y of range(rows))
            for(let x of range(cols)) {
                accumulatedCellPercentage += cellPercentage
                if (
                    accumulatedCellPercentage <=  accumulatedGroupPercentage
                    && groupData[groupIndex].percentage >= cellPercentage
                ) {

                    cell = {x: x, y: y, groupIndex: groupIndex}
                }else if (
                    accumulatedGroupPercentage + groupData[groupIndex + 1].percentage 
                    >= accumulatedCellPercentage
                ){
                    groupIndex += 1
                    accumulatedGroupPercentage += groupData[groupIndex].percentage
                    
                    cell = {x: x, y: y, groupIndex: groupIndex}
                    this.firstInvalidGroupIndex = groupIndex + 1
                } else {
                    while(groupIndex < groupData.length - 1) {
                        groupIndex ++
                        othersPercentage += groupData[groupIndex].percentage

                        nonIncludedData.skippedStates.push(initGroupData[groupIndex].initials)
                        nonIncludedData.othersPercentageRaw += initGroupData[groupIndex].percentage
                    }

                    break
                }
                cellArray.push(cell)
            }
        
        // ! The others will just get what ever cells are left over!!
        console.log('firstInvalid: ', this.firstInvalidGroupIndex)
        const othersCellCount = groupData.length > 1 ?
            cellCount - groupData[this.firstInvalidGroupIndex-1].accumulated :
            0 
        console.log('Others: ',othersCellCount)

        if (othersCellCount == 0) { // other's data does not worth one cell
            console.log('NO OTHERS cell@!@@')
            return {
                waffle: cellArray,
                legendData: initGroupData.slice(0, this.firstInvalidGroupIndex),
                firstInvalidGroupIndex: this.firstInvalidGroupIndex,
                nonIncludedData: nonIncludedData
            }
        } 

        const lastCellArrayIndex = cellArray.length -1
        var [lastX, lastY] = [cellArray[lastCellArrayIndex].x, cellArray[lastCellArrayIndex].y]
        for(let j of range(othersCellCount)) {
            const i = j + 1
            const x = (lastX + i) % cols,
                y = Math.floor((lastX + i)/cols) + lastY
            cellArray.push({x: x, y: y, groupIndex: this.firstInvalidGroupIndex})
        }

        var legendData = initGroupData.slice(0, this.firstInvalidGroupIndex)
        legendData.push({
          initials: 'Others', 
          percentage: nonIncludedData.othersPercentageRaw,
          accumulated: 0
        })
        return {
            waffle: cellArray,
            legendData: legendData,
            firstInvalidGroupIndex: this.firstInvalidGroupIndex,
            nonIncludedData: nonIncludedData
        }
    }

    const drawLegend = (legendWrapper: any, cells: d3.Selection<any, any, any, any>, sideWrapperWidth: number, legendData: GroupInfo[], nonIncludedData: NonIncludedData, lastIndex: number) => {
        const legendEntryHeight = 20
        const legendEntryPadding = 10
        const legendColumnWidth = this.minLegendWidth
        const legendColumnCount = Math.floor(sideWrapperWidth / legendColumnWidth)
        const waffleMargin = Math.round((sideWrapperWidth - (legendColumnCount * legendColumnWidth)) / 2) + 10
        const legendEntryFHeight = legendEntryHeight + legendEntryPadding
        const maxLegendRows = Math.ceil(lastIndex / legendColumnCount)

        const legendSvgHeight = (maxLegendRows + 2) * legendEntryFHeight

        const svg = legendWrapper.append('svg')
            .attr('class','legend')
            .attr("viewBox", `${0} ${0} ${sideWrapperWidth} ${legendSvgHeight}`)
                .attr('width', sideWrapperWidth)
                .attr('height', legendSvgHeight)
        const lastLegendEntryHeight = legendSvgHeight - (2* legendEntryFHeight)
        
        
        
        
        
        
        const drawMoreInfoTooltip = () => {
            const svgOther = legendWrapper.append('svg')
                .attr('width', sideWrapperWidth)
                .attr('height', 50)
            svgOther.append('text')
                .attr("x", sideWrapperWidth/2)
                .attr('y', 40)
                .attr("text-anchor", "middle")
                .attr('class', 'fill-green-400 bold description')
                .text('Hover for details!')
            const interactiveRectOthersInfo = svgOther.append('rect')
                .attr("x", 0)
                .attr('y', 10)
                .attr('class', 'fill-transparent w-full h-full')

            const svgWrapper = d3.select(this.appendId('.layout-wrapper'))
            var tooltipOthersInfo = svgWrapper.append("div")
                .attr('class', this.appendId('others-tooltip'))
                .style('position', 'absolute')
                .style("visibility", "hidden")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("background-color", "#475569")
                .html(` \
                        <h4>Minor infected states includes: </h4> \
                        <h6> ${nonIncludedData.skippedStates.length == 0 ? 'None' : nonIncludedData.skippedStates}! <h6> \
                        <p> which sums up to ${(nonIncludedData.othersPercentageRaw.toFixed(4))}% of the cases<p>
                        <p> Number of color group except 'Others':  ${lastIndex} states<p>
                `)
            
            interactiveRectOthersInfo
                .on('mouseover', () => {
                    tooltipOthersInfo.style('visibility', 'visible')
                })
                .on("mousemove", (event: any) => {
                    if(this.simplified) {
                        return tooltipOthersInfo
                            .style("right",d3.pointer(event)[0] + 0+"px")
                            .style("bottom", d3.pointer(event)[1] + 0 +"px")
                    }
                    return tooltipOthersInfo
                        .style("left",d3.pointer(event)[0] +"px")
                        .style("top", d3.pointer(event)[1] + 150 +"px")
                })
                .on("mouseout",  () => tooltipOthersInfo.style("visibility", "hidden"));
        }
        
        drawMoreInfoTooltip()
        const legend = svg.selectAll(this.appendId(".legend-entry"))
            .data(legendData.map((d, i) => ({
                initials: d.initials,
                groupIndex: i
            })))
            .join("g")
            .attr('class', this.appendId('legend-entry'))
            .attr("opacity", 1)
            .attr("transform", (_: any, i: number) => {
                const x = i%legendColumnCount,
                    y = Math.floor(i/legendColumnCount)
                return `translate(
                    ${waffleMargin + x * legendColumnWidth},
                    ${legendEntryPadding + y * (legendEntryPadding + legendEntryHeight)})
                `
            })
        
        
        
        legend.append("rect")
            .transition().duration(300)
            .attr("rx", 3).attr("ry", 3)
            .attr("width", 25).attr("height", legendEntryHeight * 3/4)
            .attr("fill", (d: any, i: number) => color(d.groupIndex))
            .attr('class', 'stroke-2 stroke-gray-400')
            
        legend.append('svg').append("text")
            .transition().duration(200)
            .attr('class', 'text-xs stroke-white stroke-[0.5] fill-white')
            .attr("dx", 40)
            .attr('dy', 3)
            .attr("alignment-baseline", "hanging")
            .text((d: GroupInfo, i:number) => `${d.initials} (${legendData[i].percentage.toFixed(2)}%)`);

        const highlight = (event: any, data: any) => {
            cells.transition().duration(200)
                .attr("fill", (d: WaffleCellInfo) => (d.groupIndex === data.groupIndex ? color(d.groupIndex) : "transparent"))  
                .attr('stroke', (d: WaffleCellInfo) => d.groupIndex === data.groupIndex ? 'rgb(156 163 175)':'transparent')
                .attr('stroke-width', (d: WaffleCellInfo) => {
                    if(this.NO_CELL_BORDER) return '0'
                    return d.groupIndex === data.groupIndex ? '3':'0'
                })
        }
        legend.append('rect')
            .attr("width", legendColumnWidth - 5).attr("height", legendEntryFHeight)
            .attr('class', 'fill-transparent')
            .on("mouseover", highlight)
            .on("mouseout", () => restore(cells, 500));

        
    }

    const restore = (cells: d3.Selection<any, any, any, any>, duration: number) => {
        cells.transition().duration(duration)
            .ease(d3.easePoly)
            .attr('stroke', 'rgb(156 163 175)')
            .attr('stroke-width', this.NO_CELL_BORDER ? '0' : '2')
            .attr("fill", (d: WaffleCellInfo) => color(d.groupIndex))

    }

    const drawWaffle = (
      waffle: any[], 
      svg: any, 
      legendData: any[],
      nonIncludedData: any, 
      firstInvalidGroupIndex: number, 
      waffleConfig: WaffleConfig, 
      legendWrapper: any, 
      sideWrapperWidth: number) => {
        const {scaleX, scaleY, cellSize} = waffleConfig

        const g = svg.selectAll(this.appendId(".waffle-cell"))  
            .data(waffle)
            .join("g")
            .attr("class", this.appendId("waffle-cell"));


        const cells = g.append("rect")
            .join('rect')
            .attr('class', this.appendId('waffle-cell-rect'))
            .attr("fill", (d: WaffleCellInfo) => color(d.groupIndex))
                    
        cells.attr("x", (d: WaffleCellInfo) => scaleX(d.x))
            .attr("y", (d: WaffleCellInfo) => scaleY(d.y))
            .attr("rx", 3).attr("ry", 3)
            .attr("width", cellSize).attr("height", cellSize)   
            .attr('stroke', 'rgb(156 163 175)')
            .attr('stroke-width', this.NO_CELL_BORDER ? '0' : '2')
            
        const lineTransitionDuration = 50
        cells.transition()
            .duration((d: WaffleCellInfo) => d.y * lineTransitionDuration)
            .ease(d3.easeBounce)
            .attr('y', (d: WaffleCellInfo) => scaleY(d.y))
            .end().then(
                () => drawLegend(legendWrapper, cells, sideWrapperWidth, legendData, nonIncludedData, firstInvalidGroupIndex)
            )
    }


    const drawTitle = (width: number, height: number, wrapper: any) => {

        const svg = wrapper.append("svg").attr('width', width).attr('height', height)
        const titleWrapper = svg.append('g').attr('class', 'waffle-title')
        const cells = d3.selectAll(this.appendId('.waffle-cell-rect'))
        const svgWrapper = d3.select(this.appendId('.layout-wrapper'))

        const addDisableBorderIcon = () => {
            const iconWidth = 30,
                iconHeight = iconWidth
            const appendIcon = (group: any) => {
                if(this.NO_CELL_BORDER) {
                    group.append('path')
                        .attr('id', this.appendId('icon-toggle-border'))
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr('width', iconWidth)
                        .attr('height', iconHeight)
                        .attr('d', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z')
                        .attr('class', 'stroke-2 fill-transparent stroke-red-400')
                } else {
                    group.append('path')
                        .attr('id', this.appendId('icon-toggle-border'))
                        .attr("x", 0)
                        .attr("y", 0)
                        .attr('width', iconWidth)
                        .attr('height', iconHeight)
                        .attr('d', 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z')
                        .attr('class', 'stroke-2 fill-transparent stroke-green-400')
                }
            }

            const [disableX, disableY] = [35, 10]
            const disableIconWrapper = titleWrapper.append('svg')
                .attr('x', disableX)
                .attr('y', disableY)
                .attr('width', iconWidth)
                .attr('height', iconHeight)
            appendIcon(disableIconWrapper)
            

            const disableIconInteraction = titleWrapper.append('rect')
                .attr('x', disableX)
                .attr('y', disableY)
                .attr('width', iconWidth)
                .attr('height', iconHeight)
                .attr('class', 'fill-transparent')
                .on('click', () => {
                    this.NO_CELL_BORDER = !this.NO_CELL_BORDER
                    restore(cells, 200)
                    disableIconWrapper.select('*').remove()
                    appendIcon(disableIconWrapper)

                })
            var tooltipDisableBorder = svgWrapper.append("div")
                .attr('class', this.appendId('waffle-border-tooltip'))
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("background-color", "white")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("background-color", "#475569")
                .html(' \
                        <p>Click this to disable the waffle border😋!</p> \
                ')

            disableIconInteraction
                .on('mouseover', () => {
                    tooltipDisableBorder.style('visibility', 'visible')
                })
                .on("mousemove", (event: any) => {
                    return tooltipDisableBorder
                    .style("left",d3.pointer(event)[0] + 400 +"px")
                    .style("top", d3.pointer(event)[1] - 30 +"px")
                })
                .on("mouseout",  () => tooltipDisableBorder.style("visibility", "hidden"));
        }
        const addTitle = () => {
            const title = titleWrapper.append("text")
                .attr("x", width/2)
                .attr("y", 30)
                .attr("text-anchor", "middle")
                .attr('class', 'graph-title fill-white bold text-md')
                .text(this.graphName)
            titleWrapper.append("text")
                .attr("x", width/2)
                .attr("y", 30 + 15)
                .attr("text-anchor", "middle")
                .attr('class', 'description-mini fill-gray-200')
                .text(formatDate(this.date))
            return title
        }
        const addInfoHover = (title: any) => {

            d3.xml("/assets/info.svg").then((data) => {
                const titleBBox = title.node().getBBox()

                const [iconX, iconY] = [width/2 + parseInt(titleBBox.width)/2 + 10, 30/2 - 10]
                const iconWrapper = titleWrapper.append('svg')
                    .attr('width', 25)
                    .attr('height', 25)
                    .attr("x", iconX)
                    .attr("y", iconY)

                iconWrapper.node().append(data.documentElement)
                
                
                // ! tooltip
                var tooltipLegend = svgWrapper.append("div")
                    .attr('class', this.appendId('waffle-tooltip'))
                    .style("position", "absolute")
                    .style("visibility", "hidden")
                    .style("background-color", "white")
                    .style("border", "solid")
                    .style("border-width", "1px")
                    .style("border-radius", "5px")
                    .style("padding", "10px")
                    .style("background-color", "#475569")
                    .html('<p>Hover the legend entries for better details!</p>')
                
                const hoverRect = iconWrapper.append('rect')
                    .attr('class', 'info-icon-wrapper fill-transparent w-8 h-8')
                hoverRect
                    .on('mouseover', () => {
                        tooltipLegend.style('visibility', 'visible')
                    })
                    .on("mousemove", (event: any) => {
                        tooltipLegend
                            .style("left",d3.pointer(event)[0] + 600 +"px")
                            .style("top", d3.pointer(event)[1] + 100 +"px")
                    })
                    .on("mouseout",  () => tooltipLegend.style("visibility", "hidden"));

            })
        }
        const title =addTitle()
        if(this.simplified) return
        addDisableBorderIcon()
        addInfoHover(title)
        
    }

    console.log('Today: ', this.todayData)
    if(this.noGraph) return
    
    const data: GroupInfo[] = this.parseData()
    console.log('Data: ', data)
    if(data.length === 0 ) {
        this.noGraph = true
        console.log('Reparsed and check: ', !this.noGraph)
        this.ref.detectChanges()
        return
    }
    var d3Element = (this.chartWrapperRef as ElementRef).nativeElement;
    var svg = d3.select(d3Element)
    if(svg) svg.selectAll("*").remove()
    const container = this.chartWrapperRef.nativeElement
    // const initialData = this.todayData
    var {width, height, wrapper, color} = this.setupBasics(container)

    const waffleConfig = this.makeWaffleLayoutConfig(width, height)

    const sideWrapperWidth = width - waffleConfig.width
    const {waffleWrapper, legendWrapper, titleWrapper, titleWrapperHeight} = makeWrappers(wrapper, waffleConfig, height, sideWrapperWidth)
    const svgWaffle = drawSVG(0, 0 ,waffleConfig.width, height, waffleWrapper)
    const {waffle, legendData, firstInvalidGroupIndex, nonIncludedData} = getWaffles(data, waffleConfig)
    drawWaffle(waffle, svgWaffle, legendData, nonIncludedData, this.firstInvalidGroupIndex, waffleConfig, legendWrapper, sideWrapperWidth)
    drawTitle(sideWrapperWidth, titleWrapperHeight, titleWrapper)

  }
}
