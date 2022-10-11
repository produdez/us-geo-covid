const { svg } = require("d3")

require.undef('line_graph')
// d3 = require.config({paths: {d3: 'https://d3js.org/d3.v5.min'}})
// import * as d3 from "d3"

define('line_graph', ['d3'], function(d3) {
    function draw(container, data) {
        // * Globals
        const DEBUG = true
        var clicked = false

        function log(...args) {
            if(DEBUG) return console.info(args)
        }

        // * Styling and layout variables setup
        function setup(columns) {
            // Colors
            const colors =  ['#00876c', '#81b788', '#d7e6b4', '#f5dea4', '#eebb7d', '#e99562', '#e16c53', '#d43d51',]
            var colorsDict = {}
            columns.forEach((column, index) => {
                colorsDict[column] = colors[index*2] // TODO: fix this and add better contrast colors
            })
            const color = (column) => colorsDict[column]

            // Wrappers around the graph for testing on notebook
            var backdrop = d3.select(container) 
                .attr('class', 'graph-backdrop')
            var wrapper = backdrop.append('div')
                .attr('class', 'graph-wrapper')

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
                wrapper: wrapper,
                yAxisPadding: 10,
            }
        }

        function parseData(columns) {
            data.forEach((row, index) => {
                data[index]['date'] = d3.isoParse(row.date)
            })
            // separate data into sub-data for each column
            return columns.map((column) => {
                return {
                    name: column,
                    data: data.map((row) => {
                        return {
                            date: row.date,
                            value: row[column]
                        }
                    })
                }
            }) 
            /* 
            ! Data: 
                {
                    column: columns_name, 
                    data: {date: date, value: column_data}[]
                }[] 
            */
        }

        function makeScales(data, width, height, margin, yAxisPadding) {
            var scaleX = d3.scaleTime()
                .domain(d3.extent(data[0].data, d => d.date)) // Use a sub data to get the date scale
                .range([margin.left, width - margin.right])
        
            var scaleY = d3.scaleLinear()
                .domain([0, d3.max(data, (subData) => {
                    // for each column data
                    return d3.max(subData.data, (row) => row.value)
                })]) 
                .rangeRound([height - margin.bottom - yAxisPadding, margin.top])
            return[ scaleX, scaleY]
        }

        function drawAxes(scaleX, scaleY, width, height, margin, svg) {
            var xAxis = d3.axisBottom().scale(scaleX)
            var yAxis = d3.axisLeft().scale(scaleY)
            svg.append("g")
                .attr("class", "x-axis")
                .attr("transform", `translate(0,${height - margin.bottom})`)
                .call(xAxis)
            svg.append("g")
                .attr("class", "y-axis")
                .attr("transform", `translate(${margin.left},0)`)
                .call(yAxis)
        }

        function drawSVG(width, height, wrapper) {
            return wrapper.append("svg")
                .attr("viewBox", "0 0 " + width + " " + height )
                .attr('width', width)
                .attr('height', height)
                .attr('class', 'border border-green-300')
        }
        function drawLines(data) {
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

            var lineFunction = d3.line()
                .x(dataPoint => scaleX(dataPoint.date))
                .y(dataPoint => scaleY(dataPoint.value))
                
            // draw the actual path inside each line-wrapper group
            // ! Very important to note that each path has class 'line', will be used later
            
            const paths = lineWrapper.append("path")
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

        function drawTitle(width, height, svg, wrapper) {
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
            
            d3.xml("info.svg",
                function(error, documentFragment) {
    
                if (error) {console.log(error); return;}
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


                const svgWrapper = d3.select('.graph-wrapper')
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
                        .style("left",(d3.mouse(this)[0] + 400) +"px")
                        .style("top", (d3.mouse(this)[1] - 10) +"px")
                        })
                    .on("mouseout",  () => tooltip.style("visibility", "hidden"));

            })
        }
        function drawLegend(columns, svg) {
            // for each sub-data set (each column), add a legend entry

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
                .attr("cy", function(d,i){ return startY + i*gap}) // 100 is where the first dot appears. gap is the distance between dots
                .transition().duration(1000)
                .attr("r", radius)
                .style("fill", (d) => color(d))
            legends.append("text")
            .attr("text-anchor", "left")
            .style("alignment-baseline", "middle")
            .attr('class', 'text-lg font-semibold')
            .text(function(d){ return d})
            .style("fill", (d) => color(d))
            .attr("x", startX )
            .attr("y", function(d,i){ return startY + i*gap}) // 100 is where the first dot appears. gap is the distance between dots
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
                .attr('class', 'legend-box-rectangle stroke-red-300 fill-transparent')
                .attr('x', boxX)
                .attr('y', boxY)
                .attr('height', boxHeight)
                .attr('width', boxWidth)
                .attr('rx', 10)
                .attr('ry', 10)
            
            legendBox.append('text')
                .attr("text-anchor", "center")
                .attr('class', 'current-date-hover text-lg fill-red-200')
                .style('width', 10).style('height', 10)
                .attr('x', boxX + 10)
                .attr('y', boxY - 10)
                .text('Date: non-selected')
            
            return [legends, startX, startY, boxWidth, gap]
            
        }

        function addMouseHoverIndicators(eventWrapper, data) {
            // Vertical line
            eventWrapper.append("path") // this is the black vertical line to follow mouse
                .attr("class", "vertical-line-indicator stroke-orange-400")
                // .style("stroke", "red")
                .style("stroke-width", "2px")
                .style("opacity", "0");
        
            // Indicator circles, one per sub-data (or one per line)
            var indicators = eventWrapper
                .selectAll(".circle-indicator-per-line")
                .data(data).enter().append('g')
                .attr("class", "circle-indicator-per-line")

            indicators.append("circle")
                .attr("r", 7)
                .style("stroke", (d) => color(d.name))
                .attr('class', 'fill-transparent stroke-2')
                .style("opacity", "0")
            indicators.append("text")
                .style('fill', 'white')
                .attr("transform", "translate(10,3)")
        }
        function createInteractionCaptureBox(eventWrapper, width, height) {
            const offset = 50
            var interactiveRectangle = eventWrapper.append('svg:rect')
                .attr('y', offset)
                .attr('width', width)
                .attr('height', height - offset)
                .attr('fill', 'none')
                .attr('pointer-events', 'all')
        
            return interactiveRectangle
        }
        function addMouseHoverShowsIndicatorEvents(interactiveRectangle, height, scaleX, scaleY) {
            const graphLines = document.getElementsByClassName('line')
            const numberFormatter = new Intl.NumberFormat('en-IN', {roundingMode: 'ceil', roundingIncrement: 1, notation: 'engineering'})
            const yValueHolder = new Array(graphLines.length)
            function hideIndicators() { // on mouse out hide line, circles and text
                d3.select(".vertical-line-indicator")
                .style("opacity", "0");
                d3.selectAll(".circle-indicator-per-line circle")
                .style("opacity", "0");
                d3.selectAll(".circle-indicator-per-line text")
                    .style("opacity", "0");
            }

            function showIndicators() { // on mouse in show line, circles and text
                d3.select(".vertical-line-indicator")
                    .style("opacity", "1");
                d3.selectAll(".circle-indicator-per-line circle")
                    .style("opacity", "1");
                if(!clicked) {
                    d3.selectAll(".circle-indicator-per-line text")
                        .style("opacity", "1");
                }
            }

            function moveIndicators() { // mouse moving over canvas
                // get mouse
                var mouse = d3.mouse(this);
                var mouseX = mouse[0]

                d3.select('.current-date-hover').text('Date: ' + scaleX.invert(mouseX).toLocaleDateString("en-GB"))
                // move the vertical line
                d3.select(".vertical-line-indicator")
                    // draw path from top to bottom at mouse's x location
                    .attr("d", function() { 
                        var d = "M" + mouseX + "," + height;
                        d += " " + mouseX + "," + 0;
                        return d;
                    });

                // position the circle and text
                d3.selectAll(".circle-indicator-per-line") // for each line indicator circle
                    .attr("transform", function(d, i) {
                        /* ------------------------------ Magic begins ------------------------------ */
                        var beginning = 0,
                            graphLine = graphLines[i],
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
                d3.selectAll('.extra-detail-indicator')
                    .text((d, i) => yValueHolder[i])
            }
            
            interactiveRectangle
                .on('mouseout', hideIndicators)
                .on('mouseover', showIndicators)
                .on('mousemove', moveIndicators)
        }

        function addMouseClickIndicators(legends, startX, startY, boxWidth, gap) {
            
            legends.append('text')
                .attr("x", startX + boxWidth - 20)
                .attr("y", function(d,i){ return startY + i * gap }) // 100 is where the first dot appears. 25 is the distance between dots
                .style("fill", (d) => color(d))
                .text(function(d){ return `undefined`})
                .attr("text-anchor", "left")
                .style("alignment-baseline", "middle")
                .attr('class', 'extra-detail-indicator text-lg font-semibold')
                .attr('opacity', 0)
        }

        function addMouseClickShowMoreDetailEvents(interactiveRectangle, originalLegendBoxWidth) {
            const legendBox = d3.select('.legend-box-rectangle')
            const bigLegendBoxWidth = parseInt(originalLegendBoxWidth * 2) - 40
            const extraDetailIndicators = d3.selectAll('.extra-detail-indicator')
            const textHoverIndicator = d3.selectAll('.circle-indicator-per-line text')
            function showMoreDetails() { // mouse clicked on canvas
                clicked = !clicked
                if(clicked) {
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

        // columns of the data set to graph into lines in svg
        const columns = ['positive', 'negative', 'death', 'recovered'] 
        const {color, width, height, margin, wrapper, yAxisPadding} = setup(columns)
        log('Finished Setup Variables')
        data = parseData(columns)
        log('DATA after parsing: ', data)
        
        // svg
        log('svg')
        const svg = drawSVG(width, height, wrapper)

        log('scales')
        const [scaleX, scaleY] = makeScales(data, width, height, margin, yAxisPadding)

        const handyArgs = [scaleX, scaleY, width, height, margin, svg]
        log('draw axes')
        drawAxes(...handyArgs)

        log('draw lines')
        drawLines(data)
    
        log('draw title')
        drawTitle(width, height, svg, wrapper)
        
        log('draw legend')
        const [legends, legendStartX, legendStartY, legendBoxWidth, legendGap] = drawLegend(columns, svg)

        log('add eventWrapper')
        var eventWrapper = svg.append('g')
            .attr("class", "mouse-over-effects")
        
        log('add mouse hover indicators')
        addMouseHoverIndicators(eventWrapper, data)
        log('add mouse click indicators')
        addMouseClickIndicators(legends, legendStartX, legendStartY, legendBoxWidth, legendGap)
        
        log('add interaction box')
        const interactiveRectangle = createInteractionCaptureBox(eventWrapper, width, height)


        
        log('add interactive box to capture mouse movement and add event listeners')
        addMouseHoverShowsIndicatorEvents(interactiveRectangle, height, scaleX, scaleY)
        log('add mouse click show more detail events')
        addMouseClickShowMoreDetailEvents(interactiveRectangle, legendBoxWidth)

        }
    return draw
})
