
// api.openweathermap.org/data/2.5/weather?lat=35&lon=139
var appid = "479092b77bcf850403cb2aeb1a302425";

var urlWeatherXML;
console.log(urlWeatherXML);


/*var appid = "9a6f55ccc997272bb9d7bcb47f35bdab";
var ciudad = "Alcobendas";
var urlWeatherXML =
  "https://api.openweathermap.org/data/2.5/forecast?q=" +
  ciudad +
  ",es&lang=es&units=metric&mode=xml&appid=" +
  appid;

  var url = "https://api.openweathermap.org/data/2.5/forecast?
              q=Alcobendas,es&lang=es&units=metric&mode=xml&
              appid=479092b77bcf850403cb2aeb1a302425";
*/

async function myAsyncFunction(){

  var loc = await getLocation();
  var xml = await getXML();
}

myAsyncFunction();

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } 

    return new Promise(devolver => {
      navigator.geolocation.getCurrentPosition(function (position) {
          urlWeatherXML = "https://api.openweathermap.org/data/2.5/forecast/daily?lat=" + position.coords.latitude 
                  + "&lon=" + position.coords.longitude + "&lang=es&units=metric&mode=xml&appid=" + appid;
          console.log(urlWeatherXML);
          devolver(urlWeatherXML);
      }, function() {
         console.log("Error al obtener localizacion");
      });
    });
}

function showPosition(position) {
    console.log( "Latitud: " + position.coords.latitude + " - Longitud: " + position.coords.longitude);
    console.log("https://api.openweathermap.org/data/2.5/forecast/daily?lat="+position.coords.latitude+"&lon="+position.coords.longitude+
        "&lang=es&units=metric&mode=xml&appid=479092b77bcf850403cb2aeb1a302425");
}

class Weather{
  constructor(ciudad, day, symbol, windDirection, windSpeed, tempMin, tempMax, pressure, humidity, clouds){
    this.ciudad = ciudad;
    this.day = day;
    this.symbol = symbol;
    this.windDirection = windDirection;
    this.windSpeed = windSpeed;
    this.tempMax = tempMax;
    this.tempMin = tempMin;
    this.pressure = pressure;
    this.humidity = humidity;
    this.clouds = clouds;
  }
}

// función que devuelve  de manera asíncronada el resultado del API REST
function getXML() {
  return new Promise(function() {
    var xhttp = new XMLHttpRequest();
    xhttp.addEventListener('readystatechange',manageResponse);
    xhttp.open("GET", urlWeatherXML, true);
    xhttp.send();
  });
}

function manageResponse(event) {
    if (this.readyState == 4 && this.status == 200) {
      procesarXML(this);
    }
};
  
function procesarXML(xml) {
  
  var xmlDoc = xml.responseXML;
  var table=" ";
  var time = xmlDoc.getElementsByTagName("time");
  //var weatherdata = xmlDoc.getElementsByTagName("weatherdata");
  var name = xmlDoc.getElementsByTagName("weatherdata")[0].getElementsByTagName("location")[0].childNodes[0].textContent;

  var tiempos=[];

  for(var i=0; i<time.length; i++){
    var symbolimg = time[i].getElementsByTagName("symbol")[0].getAttribute("var");
    symbolimg = 'http://openweathermap.org/img/w/'+symbolimg+'.png';

    tiempo = new Weather(name, 
                  time[i].getAttribute("day"), 
                  time[i].getElementsByTagName("symbol")[0].getAttribute("var"), 
                  time[i].getElementsByTagName("windDirection")[0].getAttribute("name"), 
                  time[i].getElementsByTagName("windSpeed")[0].getAttribute("mps"),
                  Math.round(time[i].getElementsByTagName("temperature")[0].getAttribute("min")), 
                  Math.round(time[i].getElementsByTagName("temperature")[0].getAttribute("max")), 
                  time[i].getElementsByTagName("pressure")[0].getAttribute("value"),
                  time[i].getElementsByTagName("humidity")[0].getAttribute("value"), 
                  time[i].getElementsByTagName("clouds")[0].getAttribute("value") /*,x[i].weather[0].main*/);
    tiempos.push(tiempo);
  }


  for (i = 0; i <time.length; i++) { 
    table += "<tr><td>" +  time[i].getAttribute("from") + "</td>"
    table += "<td>" + time[i].getElementsByTagName("temperature")[0].getAttribute("max") + "</td></tr>"
  }

  imprimeTiempo(tiempos);
  return tiempos;
}

imprimeTiempo = function(tiempos){
  var tabla = document.getElementById("tablaTiempo");
  var contenido = "<h2>"+tiempos[0].ciudad+"</h2>";
  contenido+="<table> <tr>";
  contenido+="<th>Dia</th> <th>Icono</th> <th>Dirección del viento</th> <th>Viento (km/h)</th> <th>Temp (Min/Max) </th> <th>Presion</th> <th>Humedad</th> <th>Nubes</th>";
  contenido+="</tr>";
  
  for (var i=0; i < tiempos.length; i++){
    var tiempo=tiempos[i];
    
    contenido+="<tr>";
    contenido+="<td>"+tiempo.day+"</td>";
    contenido+="<td><img src='http://openweathermap.org/img/w/"+tiempo.symbol+".png'></td>";
    contenido+="<td>"+tiempo.windDirection+"</td>";
    contenido+="<td>"+tiempo.windSpeed+"</td>";
    contenido+="<td>"+tiempo.tempMin + "º / " + tiempo.tempMax+"º </td>";
    contenido+="<td>"+tiempo.pressure+"</td>";
    contenido+="<td>"+tiempo.humidity+"%</td>";
    contenido+="<td>"+tiempo.clouds+"</td>";
    contenido+="</tr>";
  }
  contenido+="</table>";
  tabla.innerHTML = contenido;
}

