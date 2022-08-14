import * as messaging from "messaging";
import { geolocation } from "geolocation";
import { NJPathAPI } from "./api.js"

let api = new NJPathAPI();
let cache = {}
let location = null
let watchID = null

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  console.log('peer socket is open')
  
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  console.log("companion received:" + String(evt.data.query))
  if(location!=null)
    evt.data.parameters.location = location
  messaging.peerSocket.send(apiRequest(evt.data.query, evt.data.parameters));
}

function locationSuccess(position) {
  console.log("Latitude: " + position.coords.latitude,
              "Longitude: " + position.coords.longitude);
  location = position;
  let response = JSON.stringify({ 'query' : 'initialize', 'gps' : 1});
  console.log('companion sending: ' + response)
  messaging.peerSocket.send(response);
}

function locationError(error) {
  console.log("Error: " + error.code,
            "Message: " + error.message);
  let response = JSON.stringify({ 'query' : 'initialize', 'gps' : 0});
  console.log('companion sending: ' + response)
  messaging.peerSocket.send(response);
}

function apiRequest(request,parameters) {
  if (request ==='initialize'){
    watchID = geolocation.getCurrentPosition(locationSuccess, locationError, { timeout: 60 * 1000 });
  }
  else if(request === 'getStations' )
  {
    api.stations(parameters).then(function(locations) {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        let response = JSON.stringify({ 'query' : 'getStations', 'stations' : locations});
        console.log('companion sending: ' + response)
        cache['stations'] = response
        messaging.peerSocket.send(response);
      }
    }).catch(function (e) {
      console.log(e.message);
      if('stations' in cache){
        console.log("will send cached data");
        messaging.peerSocket.send(cache['stations']);
      }
    });
  }else if(request === 'getSchedule'){
    api.realTimeDepartures(parameters.origin, cache).then(function(departures) {
      if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
        let response = JSON.stringify({ 'query' : 'getSchedule', 'departures' : departures });
        console.log('companion sending: ' + response)
        messaging.peerSocket.send(response);
      }
    }).catch(function (e) {
      console.log(e.message);
    });
  }else{
    console.log("Unknown API request: "+request)
  }
}

