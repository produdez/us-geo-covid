require.undef('waffle_chart')
// d3 = require.config({paths: {d3: 'https://d3js.org/d3.v5.min'}})
// import * as d3 from "d3"

define('waffle_chart', ['d3'], function(d3) {
    function draw(container, data_today, data_states) {
        // * Globals
        const DEBUG = true
        var NO_CELL_BORDER = !true

        function log(...args) {
            if(DEBUG) return console.info(args)
        }
        const range = (num) => [...Array(num).keys()]

        // * Styling and layout variables setup
        function setupBasics() {
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
    
            const colorList = [...reds, ...yellows,...blues, ...teals, ...purples,...oranges,...browns, ...greens,...ugly, ...grays]
            log('COLOR LIST COUNT: ', colorList.length)
            const color = (i) => {
                return i === firstInvalidGroupIndex ? "#FFFFFF" : 
                d3.scaleOrdinal(colorList) //replacing color
                .domain(range(data.length))(i)
            }

            // Wrappers around the graph for testing on notebook
            var backdrop = d3.select(container) 
                .attr('class', 'graph-backdrop')
            var graphWrapper = backdrop.append('div')
                .attr('class', 'graph-wrapper')
            var layoutWrapper = graphWrapper.append('div')
                .attr('class', 'layout-wrapper flex')

            const [width, height] = [800, 500]
            if (width < height) throw new Error('width must be greater than height')
            return {
                color: color,
                width: width,
                height: height,
                wrapper: layoutWrapper,
            }
        }

        function makeWaffleLayoutConfig() {
            const colNum = 20 // ! max should be 20
            const padding =  0.3
            const cellSize = Math.floor(height * (1- padding) / colNum)
            const rowNum = Math.ceil(height * (1- padding) / cellSize)
            const cellCount = rowNum * colNum
            const waffleWidth = colNum * cellSize * (1 + padding)
            const scaleY = d3.scaleBand()
                .domain(range(rowNum))
                .range([0, cellSize * rowNum * (1+padding)])
                .padding(padding)   
                
            const scaleX = d3.scaleBand()
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

        function makeWrappers(waffleConfig, height, sideWidth) {
            const titleWrapperHeight = 50

            // waffle on the left
            const waffleWrapper = wrapper.append('div')
                .attr('class', 'waffle-wrapper')
                .style('height', height + 'px')
                .style('width', waffleConfig.width + 'px')
            
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
                .attr('class', 'legend-wrapper')
                .style('height', height - titleWrapperHeight + 'px')
                .style('width', sideWidth + 'px')
                .style('overflow-y', 'scroll')
            return {
                waffleWrapper: waffleWrapper,
                legendWrapper: legendWrapper,
                titleWrapper: titleWrapper,
            }
        }
        const sort = (arr, accessor) => arr.sort((a,b) => accessor(a) < accessor(b) ? -1 : 1)
        function parseData() {
            const totalPositive = data_today.reduce((a,b) => a + b.positive, 0)
            var acc = 0
            const data =  d3
                .zip(sort(data_today, (x) => x.state_id), sort(data_states, (x) => x.id))
                .map(([report, state]) => {
                        return {
                            'initials': state.initials,
                            'percentage' : report.positive / totalPositive * 100
                        }
                    }
                )
                .sort((a,b) => a.percentage > b.percentage ? -1 : 1)
                .map(x => {
                    acc = acc + x.percentage
                    return {...x, 'accumulated' : acc}
                })

            if(acc != 100.0) { // some cases sum is 99.99999
                const missing = 100.0 - acc
                data[data.length - 1].percentage += missing
                data[data.length - 1].accumulated += missing
            }
            return data
        }




        function drawSVG( x, y,width, height, wrapper) {
            return wrapper.append("svg")
                .attr("viewBox", `${x} ${y} ${width} ${height}`)
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'border border-green-300')
        }

        function drawTitle(width, wrapper) {

            const svg = wrapper.append("svg").attr('width', width)
            const titleWrapper = svg.append('g').attr('class', 'waffle-title')
            const cells = d3.selectAll('.waffle-cell-rect')
            const svgWrapper = d3.select('.layout-wrapper')

            function addDisableBorderIcon() {
                const iconWidth = 30,
                    iconHeight = iconWidth
                function appendIcon(group) {
                    if(NO_CELL_BORDER) {
                        group.append('path')
                            .attr('id', 'icon-toggle-border')
                            .attr("x", 0)
                            .attr("y", 0)
                            .attr('width', iconWidth)
                            .attr('height', iconHeight)
                            .attr('d', 'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z')
                            .attr('class', 'stroke-2 fill-transparent stroke-red-400')
                    } else {
                        group.append('path')
                            .attr('id', 'icon-toggle-border')
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
                    .on('click', function () {
                        NO_CELL_BORDER = !NO_CELL_BORDER
                        restore(cells, 200)
                        disableIconWrapper.select('#icon-toggle-border').remove()
                        appendIcon(disableIconWrapper)
    
                    })
                var tooltipDisableBorder = svgWrapper.append("div")
                    .attr('class', 'waffle-tooltip')
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
                    .on("mousemove", function(){
                        return tooltipDisableBorder
                        .style("left",d3.mouse(this)[0] + 400 +"px")
                        .style("top", d3.mouse(this)[1] - 30 +"px")
                        })
                    .on("mouseout",  () => tooltipDisableBorder.style("visibility", "hidden"));
            }
            function addTitle() {
                const title = titleWrapper.append("text")
                    .attr("x", width/2)
                    .attr("y", 30)
                    .attr("text-anchor", "middle")
                    .attr('class', 'graph-title fill-white bold text-xl')
                    .text('Covid 19 in USA')
                return title
            }
            function addInfoHover(title) {

                d3.xml("info.svg", function(error, documentFragment) {
                    if (error) { console.log(error) }
                }).then((data) => {
                    const titleBBox = title.node().getBBox()
    
                    const [iconX, iconY] = [width/2 + parseInt(titleBBox.width/2) + 10, 30/2 - 10]
                    const iconWrapper = titleWrapper.append('svg')
                        .attr('width', 25)
                        .attr('height', 25)
                        .attr("x", iconX)
                        .attr("y", iconY)
    
                    iconWrapper.node().append(data.documentElement)
                    const hoverRect = iconWrapper.append('rect')
                        .attr('class', 'info-icon-wrapper fill-transparent w-full h-full')
    
    
                    // ! tooltip
                    var tooltipLegend = svgWrapper.append("div")
                        .attr('class', 'waffle-tooltip')
                        .style("position", "absolute")
                        .style("visibility", "hidden")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "1px")
                        .style("border-radius", "5px")
                        .style("padding", "10px")
                        .style("background-color", "#475569")
                        .html(' \
                                <p>Hover the legend\'s entries for better details!</p> \
                        ')
    
                    hoverRect
                        .on('mouseover', () => {
                            tooltipLegend.style('visibility', 'visible')
                        })
                        .on("mousemove", function(){
                            return tooltipLegend
                            .style("left",d3.mouse(this)[0] + 600 +"px")
                            .style("top", d3.mouse(this)[1] - 20 +"px")
                            })
                        .on("mouseout",  () => tooltipLegend.style("visibility", "hidden"));
    
                })
            }
            addDisableBorderIcon()
            const title =addTitle()
            addInfoHover(title)
            
        }


        function getWaffles(initData, waffleConfig) {
            const cellCount = waffleConfig.cellCount,
                rows = waffleConfig.rowNum,
                cols = waffleConfig.colNum
            var groupCount = initData.length, 
                groupIndex = 0,
                initCellPercentage = 1/cellCount * 100
            console.log('initCellPercentage: ', initCellPercentage)
            // rounding initData to the value of one cell
            const data = initData.map((d) => {
                const rounded = Math.round(d.percentage / initCellPercentage)
                return {...d, percentage: rounded}
            })
            console.log('after round: ', data)
            const cellPercentage = 1.0
            if(data[0].percentage < cellPercentage) {
                throw new Error('BULL SHIT, biggest percentage smaller than one cell percentage!!!')
            }
            
            var cellArray = [], 
            accumulatedGroupPercentage = data[0].percentage,
            accumulatedCellPercentage = 0

            var nonIncludedData = {
                skippedStates: [],
                othersPercentageRaw: 0.0
            }
            // ! Starts from top left with as x=0 y=0, 
            var cell, firstInvalidGroupIndex, othersPercentage = 0.0
            for(let y of range(rows))
                for(let x of range(cols)) {
                    accumulatedCellPercentage += cellPercentage
                    // console.log('-------------')
                    // console.log('acc cell per: ', accumulatedCellPercentage)
                    // console.log('groupIndex: ', groupIndex, 'percentage: ', data[groupIndex].percentage)
                    // console.log('accumulate gPercentage: ', accumulatedGroupPercentage)
                    if (
                        accumulatedCellPercentage <=  accumulatedGroupPercentage
                        && data[groupIndex].percentage >= cellPercentage
                    ) {
                        cell = {x: x, y: y, groupIndex: groupIndex}
                    }else if (
                        groupIndex + 1 < data.length - 1 // not last
                        && accumulatedGroupPercentage + data[groupIndex + 1].percentage >= accumulatedCellPercentage
                    ){
                        groupIndex += 1
                        console.log('Move one groupIndex')
                        accumulatedGroupPercentage += data[groupIndex].percentage
                        
                        cell = {x: x, y: y, groupIndex: groupIndex}
                        firstInvalidGroupIndex = groupIndex + 1
                        console.log('firstInvalid:',firstInvalidGroupIndex)
                    } else {
                        console.log('No more singular cell')
                        while(groupIndex < data.length - 1) {
                            groupIndex ++
                            console.log('skipped group: ', groupIndex)
                            othersPercentage += data[groupIndex].percentage

                            nonIncludedData.skippedStates.push(initData[groupIndex].initials)
                            nonIncludedData.othersPercentageRaw += initData[groupIndex].percentage
                        }

                        break
                    }
                    cellArray.push(cell)
                }
                
            const othersCellCount = Math.round(nonIncludedData.othersPercentageRaw / initCellPercentage)
            console.log('Others: ',othersCellCount)

            if (othersCellCount == 0) { // other's data does not worth one cell
                log('NO OTHERS')
                return {
                    waffle: cellArray,
                    legendData: initData.slice(0, firstInvalidGroupIndex),
                    firstInvalidGroupIndex: firstInvalidGroupIndex,
                    nonIncludedData: nonIncludedData
                }
            } 
            log('YES OTHERS')

            const lastCellArrayIndex = cellArray.length -1
            var [lastX, lastY] = [cellArray[lastCellArrayIndex].x, cellArray[lastCellArrayIndex].y]
            for(let _ of range(othersCellCount)) {
                cellArray.push({x: ++lastX, y: lastY, groupIndex: firstInvalidGroupIndex})
            }

            var legendData = initData.slice(0, firstInvalidGroupIndex)
            legendData.push({initials: 'Others', percentage: nonIncludedData.othersPercentageRaw})
            console.log('legendata w other', legendData)
            return {
                waffle: cellArray,
                legendData: legendData,
                firstInvalidGroupIndex: firstInvalidGroupIndex,
                nonIncludedData: nonIncludedData
            }
        }

        const drawLegend = (legendWrapper, cells, sideWrapperWidth, legendData, nonIncludedData, lastIndex) => {
            console.log("#Group in legend: ", lastIndex)
            const legendEntryHeight = 20
            const legendEntryPadding = 10
            const legendColumnWidth = 150
            const legendColumnCount = Math.floor(sideWrapperWidth / legendColumnWidth)
            const waffleMargin = Math.round((sideWrapperWidth - (legendColumnCount * legendColumnWidth)) / 2) + 10
            const legendEntryFHeight = legendEntryHeight + legendEntryPadding
            const maxLegendRows = Math.ceil(lastIndex / legendColumnCount)

            const legendSvgHeight = maxLegendRows * legendEntryFHeight

            const svg = legendWrapper.append('svg')
                .attr('class','legend')
                .attr("viewBox", `${0} ${0} ${sideWrapperWidth} ${legendSvgHeight}`)
                    .attr('width', sideWrapperWidth)
                    .attr('height', legendSvgHeight)
            const lastLegendEntryHeight = legendSvgHeight - (2* legendEntryFHeight)
            
            
            
            const svgOther = legendWrapper.append('svg')
                .attr('width', sideWrapperWidth)
                .attr('height', 50)
            svgOther.append('text')
                .attr("x", sideWrapperWidth/2)
                .attr('y', 40)
                .attr("text-anchor", "middle")
                .attr('class', 'fill-green-400 bold description')
                .text('Hover for other details!')
            const interactiveRectOthersInfo = svgOther.append('rect')
                .attr("x", 0)
                .attr('y', 10)
                .attr('class', 'fill-transparent w-full h-full')

            const svgWrapper = d3.select('.layout-wrapper')
            var tooltipOthersInfo = svgWrapper.append("div")
                .attr('class', 'others-tooltip')
                .style("position", "absolute")
                .style("visibility", "hidden")
                .style("border", "solid")
                .style("border-width", "1px")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("background-color", "#475569")
                .html(` \
                        <h4>Minor infected states includes: </h4> \
                        <h6> ${nonIncludedData.skippedStates}! <h6> \
                        <p> which sums up to ${nonIncludedData.othersPercentageRaw}% of the cases<p>
                        <p> Number of color group except 'Others':  ${lastIndex} states<p>
                `)

            interactiveRectOthersInfo
                .on('mouseover', () => {
                    tooltipOthersInfo.style('visibility', 'visible')
                })
                .on("mousemove", function(){
                    console.log('mousemove')
                    return tooltipOthersInfo
                        .style("left",d3.mouse(this)[0] + 200+"px")
                        .style("top", d3.mouse(this)[1] + 350 +"px")
                })
                .on("mouseout",  () => tooltipOthersInfo.style("visibility", "hidden"));
            
            const legend = svg.selectAll(".legend-entry")
                .data(legendData.map(d => d.initials))
                .join("g")
                .attr('class', 'legend-entry')
                .attr("opacity", 1)
                .attr("transform", (d, i) => {
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
                .attr("width", 30).attr("height", legendEntryHeight)
                .attr("fill", (d, i)=> color(i))
                .attr('class', 'stroke-2 stroke-gray-400')
                
            legend.append('svg').append("text")
                .transition().duration(200)
                .attr('class', 'stroke-white stroke-[0.5] fill-white')
                .attr("dx", 40)
                .attr('dy', 3)
                .attr("alignment-baseline", "hanging")
                .text((d, i) => `${d} (${legendData[i].percentage.toFixed(2)}%)`);

            legend.append('rect')
                .attr("width", legendColumnWidth - 5).attr("height", legendEntryFHeight)
                .attr('class', 'fill-transparent')
                .on("mouseover", highlight)
                .on("mouseout", () => restore(cells, 500));

            function highlight(initials, groupIndex) {
                cells.transition().duration(200)
                    .attr("fill", d => d.groupIndex === groupIndex ? color(d.groupIndex) : "transparent")  
                    .attr('stroke', d => d.groupIndex === groupIndex ? 'rgb(156 163 175)':'transparent')
                    .attr('stroke-width', d => {
                        if(NO_CELL_BORDER) return '0'
                        return d.groupIndex === groupIndex ? '3':'0'
                    })
                }
            
        }

        function restore(cells, duration) {
            cells.transition().duration(duration)
                .ease(d3.easePoly)
                .attr('stroke', 'rgb(156 163 175)')
                .attr('stroke-width', NO_CELL_BORDER ? '0' : '2')
                .attr("fill", d => color(d.groupIndex))

        }

        function drawWaffle (waffle, svg, legendData, nonIncludedData, firstInvalidGroupIndex, waffleConfig, legendWrapper, sideWrapperWidth) {
            const {scaleX, scaleY, cellSize} = waffleConfig


            const g = svg.selectAll(".waffle-cell")  
                .data(waffle)
                .join("g")
                .attr("class", "waffle-cell");
     
    
            const cells = g.append("rect")
                .join('rect')
                .attr('class', 'waffle-cell-rect')
                .attr("fill", d => d.groupIndex === firstInvalidGroupIndex ? "#FFFFFF" : color(d.groupIndex))
                        
            cells.attr("x", d => scaleX(d.x))
                .attr("y", d =>  0)
                .attr("rx", 3).attr("ry", 3)
                .attr("width", cellSize).attr("height", cellSize)   
                .attr('stroke', 'rgb(156 163 175)')
                .attr('stroke-width', NO_CELL_BORDER ? '0' : '2')
                
            const lineTransitionDuration = 50
            cells.transition()
                .duration(d => d.y * lineTransitionDuration)
                .ease(d3.easeBounce)
                .attr('y', d => scaleY(d.y))
                .end().then(
                    () => drawLegend(legendWrapper, cells, sideWrapperWidth, legendData, nonIncludedData, firstInvalidGroupIndex)
                )
        }



        log('Init data: ', data_today, data_states)

        var {width, height, wrapper, color} = setupBasics()
        log('basic setups')

        const waffleConfig = makeWaffleLayoutConfig()
        log('waffle configs', waffleConfig)


        const data = parseData()
        console.log('DATA after parsing: ', data)

        
        const sideWrapperWidth = width - waffleConfig.width
        console.log('with: ', width, 'waffle width: ', waffleConfig.width, 'side wrapper width: ', sideWrapperWidth)
        const {waffleWrapper, legendWrapper, titleWrapper} = makeWrappers(waffleConfig, height, sideWrapperWidth)
        log('made wrappers')
        const svgWaffle = drawSVG(0, 0 ,waffleConfig.width, height, waffleWrapper)
        log('made svg for waffle')
        const {waffle, legendData, firstInvalidGroupIndex, nonIncludedData} = getWaffles(data, waffleConfig)
        console.log('legend data: ', legendData)
        console.log('waffle data: ', waffle)
        console.log('non included data: ', nonIncludedData)
        log('setup waffle data')
        console.log('first invalid: ', firstInvalidGroupIndex)
        drawWaffle(waffle, svgWaffle, legendData, nonIncludedData, firstInvalidGroupIndex, waffleConfig, legendWrapper, sideWrapperWidth)
        log('draw waffle')
        console.log('waffle cell count: ', d3.selectAll('.waffle-cell-rect').size())    
        drawTitle(sideWrapperWidth, titleWrapper)
        log('draw title')

    }
    return draw
})
