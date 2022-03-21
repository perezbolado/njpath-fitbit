export function NJPathAPI() {
  this.stations_url = "https://path.api.razza.dev/v1/stations"
};

NJPathAPI.prototype.realTimeDepartures = function(origin) {
  let self = this;
  return new Promise(function(resolve, reject) {
    let url = self.stations_url + "/" + origin + "/realtime";
    //console.log(url)
    fetch(url).then(function(response) {
      return response.json();
    }).then(function(json) {
      //console.log("Got JSON response from server:" + JSON.stringify(json));
      let data = json["upcomingTrains"];
      let departures = [{"type" : "header", "from": origin }];
      data.forEach( (destination) => {
          let projTime = Date.parse(destination["projectedArrival"]);
          let currTime = Date.now();
          let timeDiff = projTime - currTime
          let timeDiffMin = Math.round(((timeDiff % 86400000) % 3600000) / 60000);
          //console.log("projected time: " + projTime );
          //console.log("current time: " + Date.now() );
          //console.log("ETA: "+ timeDiff );
          //console.log("ETA mins: "+ timeDiffMin)
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