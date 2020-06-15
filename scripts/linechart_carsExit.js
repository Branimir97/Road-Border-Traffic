var domesticVehicles_exit = [];
var foreignVehicles_exit = [];

d3.json('scripts/data.json', function(error, data) {
    if (error) throw error;

    for(var i = 0; i< data.length; i++) {
        if(data[i].type == "domaca_ulaz") {
            domesticVehicles_exit.push(data[i].number)
        }

        if(data[i].type == "strana_ulaz") {
            foreignVehicles_exit.push(data[i].number)
        }
    }

//postavljanje margina i visine i širine SVG-a
var margin = {top: 20, bottom: 70, left: 90, right: 20};
var svgWidth = 560 - margin.left - margin.right;
var svgHeight = 500 - margin.top - margin.bottom;

var maxNumberOfVehicles = [d3.max(domesticVehicles_exit), d3.max(foreignVehicles_exit)];


//kreiranje SVG elementa za grafički prikaz -> izlaz domaćih i stranih vozila iz RH
var svg = d3.select("body .container .graph")
    .append("svg")
    .attr("viewBox", "0 0 "+(svgWidth+margin.left+margin.right)+" "+(svgHeight+margin.top+margin.bottom)+"")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", "lightgrey")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//kreiranje ordinalne skale za x-os
var x = d3.scale.ordinal()
    .domain(d3.range(domesticVehicles_exit.length)) //[0,1,2,3,4,5,7,8,9]
    .rangePoints([0, svgWidth]); //prebacuje domenu u navedenom rasponu od 0 do širine svg-a

//dodavanje skale na x-os
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d, i) {return data[i].year});

//učitavanje x-osi popraćeno animacijom u trajanju od 1s
svg.append("g")
    .attr("transform", "translate(0, "+ svgHeight + ")")
    .transition()
    .duration(1500)
    .call(xAxis)
    .style("stroke", "black");

//za naziv x-osi
svg.append("text")
    .attr("x", (svgWidth / 2))
    .attr("y", (svgHeight + (margin.bottom / 2)))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Godina [2010. - 2019.]")
    .style("stroke", "red")
    .style("stroke-svgWidth", ".75px");

//kreiranje linearne skale za y-os
var y = d3.scale.linear()
    .domain([0, d3.max(maxNumberOfVehicles) + 1000]) // 0, 17763 u ovom slučaju + 1000 radi ljepše vizualizacije
    .range([svgHeight, 0]); ////graf se prostire do točke height, drugim parametrom se sužava

//dodavanje skale na y-os
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(20)  

//Animacija učitavanja y osi u trajanju od 1s
svg.append("g")
    .transition()
    .duration(1500)
    .call(yAxis)
    .style("stroke", "black")

//za naziv y-osi
svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x",0 - (svgHeight / 2))
    .attr("y", 0 - margin.left)
    .attr("dy", "1.5em")
    .style("text-anchor", "middle")
    .text("Broj automobila")
    .style("stroke", "red")
    .style("stroke-width", ".75px");   

//definiranje linije za x i y koordinate
var valueLine = d3.svg.line()
    .x(function(d, i) { return x(i); })
    .y(function(d) { return y(d)});

//kreiranje linechart-a za podatke -> Izlaz domaćih osobnih vozila
var linechart = svg.append("path")
    .attr("class", "line")
    .attr("d", valueLine(domesticVehicles_exit))
    .style("stroke-width", "0")
    .transition()
    .duration(3000)
    .style("stroke", "limegreen")
    .style("stroke-width", "3px")
    .attr("fill", "none");

//kreiranje linechart-a za podatke -> Izlaz stranih osobnih vozila
var linechart = svg.append("path")
    .attr("class", "line")
    .attr("d", valueLine(foreignVehicles_exit))
    .style("stroke-width", "0")
    .transition()
    .duration(3000)
    .style("stroke", "red")
    .style("stroke-width", "3px")
    .attr("fill", "none");

//postavljanje točkica za svaku vrijednost za podatke -> Izlaz domaćih osobnih vozila
svg.selectAll(".dot1")
    .data(domesticVehicles_exit)
    .enter()
    .append("circle")
    .attr("class", "dot1")
    .attr("r", 5)
    .attr("cx", function(d, i) { return x(i); })
    .attr("cy", function(d) { return y(d); })
    .on("mouseover", function(d, i) {
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +")")
            .style("background-color", "limegreen")
            .style("color", "white")
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +") td:nth-child(3)")
            .style("font-weight", "bold")
    })
    .on("mouseout", function(d, i) {
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +")")
            .style("background-color", "")
            .style("opacity", "100%")
            .style("color", "")
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +") td:nth-child(3)")
            .style("border", "")
            .style("font-weight", "")
            .style("text-decoration", "")
    })

//postavljanje točkica za svaku vrijednost za podatke -> Izlaz stranih osobnih vozila
svg.selectAll(".dot2")
    .data(foreignVehicles_exit)
    .enter()
    .append("circle")
    .attr("class", "dot2")
    .attr("r", 5)
    .attr("cx", function(d, i) { return x(i); })
    .attr("cy", function(d) { return y(d); })
    .on("mouseover", function(d, i) {
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +")")
            .style("background-color", "#ff3232")
            .style("color", "white")
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +") td:nth-child(3)")
            .style("font-weight", "bold")
    })
    .on("mouseout", function(d, i) {
        d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +")")
            .style("background-color", "")
            .style("opacity", "100%")
            .style("color", "")
    d3.select("body div.container .table tbody tr:nth-child("+ (i+1) +") td:nth-child(3)")
        .style("border", "")
        .style("font-weight", "")
        .style("text-decoration", "")
    })
});