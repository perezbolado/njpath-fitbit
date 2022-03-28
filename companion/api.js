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

NJPathAPI.prototype.stations = function() {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = self.stations_url
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      let data = json["stations"];
      let stations = [];
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