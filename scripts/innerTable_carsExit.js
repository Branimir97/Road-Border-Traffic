//ispunjavanje tablice podacima iz data.json kreirane u HTML-u pod id = #table
//podaci se odnose na izlaz domaćih i stranih vozila
$(document).ready(function(){
    $.getJSON("scripts/data.json", function(json){
        var domesticVehicles = [];
        var foreignVehicles = [];
        for(let i=0;i<json.length;i++) {
            if(json[i].type=="domaca_izlaz") {
                domesticVehicles.push(json[i]);
            }

            if(json[i].type == "strana_izlaz") {
                foreignVehicles.push(json[i]);
            }
        }

        for(let i=0;i<domesticVehicles.length;i++){
            $("#table tbody").append("<tr><td>"+domesticVehicles[i].year+"."+"</td><td>"+domesticVehicles[i].number+"</td><td>"+foreignVehicles[i].number+"</td></tr>")
        }
    })
})