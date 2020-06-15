var domesticVehicles_entry = [];
var foreignVehicles_entry = [];

//dohvaćanje podataka iz data.json 
d3.json('scripts/data.json', function(error, data) {
    if (error) throw error;

    for(var i = 0; i< data.length; i++) {
        if(data[i].type == "domaca_ulaz") {
            domesticVehicles_entry.push(data[i].number)
        }

        if(data[i].type == "strana_ulaz") {
            foreignVehicles_entry.push(data[i].number)
        }
    }

//kreiranje nijansi zelene boje za graf za domaća vozila
var greenColors = ["#33cc33", "#00cc00", "#009900"];

//postavljanje margina i visine i širine SVG-a
var margin = {top: 20, bottom: 70, left: 80, right: 20};
var svgWidth = 500 - margin.left - margin.right;
var svgHeight = 400 - margin.top - margin.bottom;
var barPadding = 15;
var barWidth = svgWidth / domesticVehicles_entry.length - barPadding;

//Stupčasti graf -> domaća vozila

//kreiranje SVG elementa za grafički prikaz -> ulaz u RH za domaća vozila
var svg = d3.select("#domesticVehiclesGraph")
            .append("svg")
            .attr("viewBox", "0 0 "+(svgWidth+margin.left+margin.right)+" "+(svgHeight+margin.top+margin.bottom)+"")
            .attr("preserveAspectRatio", "xMinYMin meet")
            .attr("style", "background-color: lightgrey")
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//kreiranje ordinalne skale za x-os
var x = d3.scale.ordinal()
    .domain(d3.range(domesticVehicles_entry.length)) //[0,1,2,3,4,5,7,8,9]
    .rangeRoundBands([0, svgWidth]); //prebacuje domenu u navedenom rasponu od 0 do širine svg-a

//dodavanje skale na x-os
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
    .tickFormat(function(d, i) {return data[i].year + "."; });

//učitavanje x osi popraćeno animacijom u trajanju od 1s
svg.append("g")
    .attr("transform", "translate(0," + svgHeight + ")") 
    .transition()
    .duration(1000)
    .call(xAxis)
    .style("stroke", "black");

//za naziv x osi
svg.append("text")
    .attr("x", (svgWidth / 2))
    .attr("y", (svgHeight + (margin.bottom / 2)))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .text("Godina [2010. - 2019.]")
    .style("stroke", "red")
    .style("stroke-width", ".75px");

//kreiranje linearne skale za y-os
var y = d3.scale.linear()
    .domain([0, d3.max(domesticVehicles_entry)+1000]) // 0, 8769 u ovom slučaju + 1000 radi ljepše vizualizacije
    .range([svgHeight, 0]); //graf se prostire do točke svgHeight, drugim parametrom se sužava

//dodavanje skale na y-os
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .tickFormat(function(i) { return i;});

//nimacija učitavanja y osi u trajanju od 1s
svg.append("g")
    .transition()
    .duration(1000)
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

//postavljanje bar chart-a za domaća vozila
var barchart = svg.selectAll("rect")
    .data(domesticVehicles_entry)
    .enter()
    .append("rect")
    .attr("x", function(d, i) {return x(i) + 10; })
    .attr("y", function(d) { return y(0)})
    .attr("height", function(d) { return svgHeight - y(0); })
    .attr("width", barWidth)
    .attr("opacity", "90%")
    .attr("fill", function(d) { return greenColors[findGreenColor(d)]});

//animacija postavljanja elemenata grafa u trajanju od 1s
svg.selectAll("rect")
    .transition()
    .duration(1000)
    .attr("y", function(d) { return y(d)})
    .attr("height", function(d) { return (svgHeight - y(d));})
    .delay(function (d, i) { return i*100;})

//na mouseover prikazuje se broj vozila u <span> elementu
svg.selectAll("rect")
    .on("mouseover", function(d) {
        d3.select(this)
            .attr("cursor", "pointer"); 
        d3.select("#domesticVehiclesGraph h6 span")
            .text(d);
    })
    //na mouseout briše se prikaz iz <span> elementa
    .on("mouseout", function() {
        d3.select(this)
        d3.select("#domesticVehiclesGraph h6 span")
            .text("");
    })
});

//odabir nijansi zelene boje na osnovu prijeđenog broja vozila
function findGreenColor(data) {
    if(data<7000) {
            return 0;
        } else if(data>=7000 && data<8000) {
            return 1;
        } else if(data>=8000){
            return 2;
        }
    }