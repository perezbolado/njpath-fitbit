import * as messaging from "messaging";
import { NJPathAPI } from "./api.js"

let api = new NJPathAPI();

let cache = {}

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  console.log('peer socket is open')
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  console.log("companion received:" + String(evt.data.query))
  messaging.peerSocket.send(apiRequest(evt.data.query, evt.data.parameters));
}

function apiRequest(request,parameters) {
  if(request === 'getStations' )
  {
    api.stations().then(function(locations) {
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

