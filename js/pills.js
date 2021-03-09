const printVals = (data) =>{
    for(let i = 0; i < data.length; i++){
        console.log(data[i]);
    }
}

const buildVis = (data,svg_name) => {
    let chart = d3.select(svg_name);
    let chart_width = $(svg_name).width();
    let chart_height = $(svg_name).height();
    margin = {
        left: 60,
        right: 40,
        bottom: 20,
        top: 20
    }
    let xDomain = [];
    for(let i = 0; i < data.length; i++){
        xDomain[i] = data[i].countyName;
    }
    let y = d3.scaleLinear()
                .domain([0,d3.max(data, (d) => {return d.oxyCount + d.hydCount;})]).nice()
                .range([chart_height - margin.bottom,margin.top]);
    let x = d3.scaleBand()
                .domain(xDomain)
                .range([margin.left + 20, chart_width - margin.right])
    let y_axis = d3.axisLeft().scale(y);
    let x_axis = d3.axisBottom().scale(x);
    chart.append("g").call(y_axis).attr("transform","translate(" + margin.left + ",0)")
    let xAxisTranslate = chart_height - margin.bottom;
    chart.append("g").call(x_axis).attr("transform","translate(0," + xAxisTranslate + ")");

    let colorArr = ["#0008A8","#8086F5"];
    let colorGroups = ["oxyCount","hydCount"];
    let color = d3.scaleOrdinal()
                    .domain(colorGroups)
                    .range(colorArr);

    let stackedData = d3.stack().keys(colorGroups)(data);
    console.log(stackedData);
    let bars = chart.append("g").selectAll("g")
                    .data(stackedData)
                        .enter().append("g")
                            .attr("fill",(d) => { return color(d.key)})
                            .attr("class", (d) => { return d.key;})
                        .selectAll("rect")
                        .data((d) => {return d;})
                        .enter().append("rect")
                            .attr("x",(d,i) => {
                                return x(d.data.countyName);
                            })
                            .attr("y",(d) => {
                                return y(d[1]);
                            })
                            .attr("width",(chart_width/data.length) - 10)
                            .attr("height",(d) => {
                                return y(d[0]) - y(d[1]);
                            })
                            .on("mouseover", (d) => {
                                if(d[0] == 0){
                                    text = "Oxycodone ";
                                    v = d[1];
                                }else{
                                    text = "Hydrocodone ";
                                    v = d[1] - d[0];
                                }
                                d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(text + "Count: " + v)
                            })
                            .on("mouseout" , (d) =>{
                                d3.select('#tooltip').style('opacity', 0)
                            })
                            .on("mousemove", (d) =>{
                                d3.select('#tooltip')
                                    .style('left', (d3.event.pageX) + 'px')
                                    .style('top', (d3.event.pageY - 30) + 'px')
                            });
    let legPad = 200;
    let legend = chart.selectAll(".legend")
        .data(colorArr)
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => { return "translate(30," + i * 19 + ")"; });
    
    legend.append("rect")
        .attr("x", chart_width - legPad)
        .attr("y",5)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", (d, i) => {return colorArr.slice().reverse()[i];});
    
    legend.append("text")
        .attr("x", chart_width - (legPad - 20))
        .attr("y", 15)
        .attr("dy", ".35em")
        .style("text-anchor", "start")
        .text((d, i) => {
        switch(i){
            case 0:
                return "Hydrocodone";
            case 1:
                return "Oxycodone"
        };
    })
}

