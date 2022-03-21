import * as messaging from "messaging";
import { NJPathAPI } from "./api.js"
// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  // Ready to send or receive messages
  console.log('peer socket is open')
  messaging.peerSocket.send(sendSchedule());
}

// Listen for the onmessage event
messaging.peerSocket.onmessage = function(evt) {
  // Output the message to the console
  //console.log(evt.data);
}

function sendSchedule() {
  let station = "journal_square"
  let api = new NJPathAPI();
  api.realTimeDepartures(station).then(function(departures) {
    if (messaging.peerSocket.readyState === messaging.peerSocket.OPEN) {
      console.log('companion sending: ' + JSON.stringify(departures))
      messaging.peerSocket.send(JSON.stringify(departures));
    }
  }).catch(function (e) {
    console.log(e.message);
  });
}
