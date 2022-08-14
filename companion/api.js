import {Stations} from "./stations.js"

export function NJPathAPI() {
  this.stations_url = "https://path.api.razza.dev/v1/stations"
};

NJPathAPI.prototype.realTimeDepartures = function(origin, cache) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = self.stations_url + "/" + origin + "/realtime";
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      let data = json["upcomingTrains"];
      let departures = [{"type" : "header", "from": origin, "fromName" : Stations.getName(origin) }];
      data.forEach( (destination) => {
          let projTime = Date.parse(destination["projectedArrival"]);
          let currTime = Date.now();
          let timeDiff = projTime - currTime
          let timeDiffMin = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
          let d = {
            "route": destination["route"],
            "name" : destination["lineName"],
            "status": destination["status"],
            "eta": timeDiffMin,
            "type" : "item"
          };
          departures.push(d);
      });
      resolve(departures);
    }).catch(function (error) {
      reject(error);
    });
  });
}

NJPathAPI.prototype.stations = function(parameters) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = self.stations_url
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      let data = json["stations"];
      let stations = [];
      if( typeof parameters.location != "undefined" )
      {
        data = sortByLocation(data,location)
      }  
      data.forEach( (station) => {
          let s = {
            "station": station["station"],
            "name" : station["name"],
          };
          stations.push(s);
      });
      
      resolve(stations);
    }).catch(function (error) {
      reject(error);
    });
  });
}

function sortByLocation(stations, myLocation){
  stations = stations.map(function(x) { 
      x.distance = calcDistance(x.coordinates.longitude, myLocation.longitude, x.coordinates.latitude,myLocation.latitude); 
      return x
    } 
  );
  console.log(stations)
  stations.sort((a, b) => a.distance > b.distance ? 1 : -1);
  return stations
};

function calcDistance(lat1, lon1, lat2, lon2) 
{
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
}

    // Converts numeric degrees to radians
function toRad(Value) 
{
    return Value * Math.PI / 180;
}