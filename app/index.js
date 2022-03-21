import * as messaging from "messaging";
import { NJPathUI } from "./ui.js";

let ui = new NJPathUI();
ui.updateUI("disconnected");

// Listen for the onopen event
messaging.peerSocket.onopen = function() {
  print
  ui.updateUI("loading");
  messaging.peerSocket.send("Hi!");
}

// Listen for the message event
messaging.peerSocket.onmessage = function(evt) {
  var data = JSON.parse(String(evt.data));
  ui.updateUI("loaded", data);
}

// Listen for the onerror event
messaging.peerSocket.onerror = function(err) {
  // Handle any errors
  ui.updateUI("error");
}


