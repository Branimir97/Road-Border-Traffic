//postavljanje visine i širine SVG-a, vanjskog i unutarnjeg radijusa
var svgWidth = 400;
var svgHeight = 300;
var outerRadius = 100;
var innerRadius = 30;

var svg = d3.select("#pieChart")
    .append("svg")
    .attr("viewBox", "0 0 "+(svgWidth)+" "+(svgHeight)+"")
    .attr("preserveAspectRatio", "xMinYMin meet")
    .style("background-color", "lightgrey")
    
//kreiranje skale
var colors = d3.scale.ordinal()
        .domain(domesticVehicles_entry)
        .range( [d3.rgb("green"), d3.rgb("red")]);

var totalDomesticVehicles = 0;
var totalForeignVehicles = 0;

d3.json('scripts/data.json', function(error, data) {
        if (error) throw error;

        for(var i = 0; i< data.length; i++) {
            if(data[i].type == "domaca_ulaz") {
                totalDomesticVehicles+=data[i].number;
            }

            if(data[i].type == "strana_ulaz") {
                totalForeignVehicles+=data[i].number;
            }
        }
        var percentageOfDomesticVehicles = Math.round(totalDomesticVehicles/(totalDomesticVehicles+totalForeignVehicles)*100);
        var percentageOfForeignVehicles = Math.round(totalForeignVehicles/(totalDomesticVehicles+totalForeignVehicles)*100);

        var data = [
                {name : 'domaca_vozila', value: percentageOfDomesticVehicles},
                {name : 'strana_vozila', value: percentageOfForeignVehicles}
        ];

        var pie = d3.layout.pie()
                    .value(function(d){return d.value; });

        var arc = d3.svg.arc()
            .innerRadius(innerRadius)
            .outerRadius(outerRadius);

        var label = d3.svg.arc()
            .outerRadius(outerRadius)
            .innerRadius(innerRadius);

        var pieArcs = svg.selectAll("g.pie")
            .data(pie(data))
            .enter()
            .append("g")
            .attr("class", "pie")
            .attr("transform", "translate("+(svgWidth/2)+"," + (svgHeight/2) +")")
            .style("cursor", "pointer")
            .on("click", function(d){
                d3.select(this)
                    
                alert("Tip: " + d.data.name + ", Udio vozila: "+ d.data.value + "%");
            });

        pieArcs.append("path")
            .attr("fill", function(d, i) { return colors(i); })
            .attr("d", arc);

        pieArcs.append("text")
            .attr("transform", function(d) { return "translate(" + label.centroid(d) + ")" ; }) 
            .attr("text-anchor", "middle")
            .text(function(d) { return d.value + "%"; })
            .style("fill", "white");

        //postavljanje prvog kružića kao elementa legende
        svg.append("circle")
            .attr("cx", 300)
            .attr("cy", 30)
            .attr("r", 3)
            .style("fill", "green");
        
        //postavljanje teksta za prvi kružić
        svg.append("text")
            .attr("x", 310)
            .attr("y", 30)
            .text("Domaća vozila")
            .style("font-size", "12px")
            .style("alignment-baseline", "middle") //poravnanje u sredinu elementa kružića

        //postavljanje drugog kružića kao elementa legende
        svg.append("circle")
            .attr("cx", 300)
            .attr("cy", 50)
            .attr("r", 3)
            .style("fill", "red");
        
        //postavljanje teksta za drugi kružić
        svg.append("text")
            .attr("x", 310)
            .attr("y", 50)
            .text("Strana vozila")
            .style("font-size", "12px")
            .style("alignment-baseline", "middle") //poravnanje u sredinu elementa kružića
        });  