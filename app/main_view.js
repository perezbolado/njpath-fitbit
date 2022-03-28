
import { Application, View, $at } from './view'
import * as messaging from "messaging";

// Create the root selector for the view...
const $ = $at( '#main-view' );

export class MainView extends View {
    el = $();
    stationList = $('#stationList')
    statusText = $('#status-text')
    v = this
 
    onMount(){
        var currentView = this
        this.statusText.text = "Loading departures ...";
        // Listen for the onopen event
        messaging.peerSocket.onopen = function() {
            messaging.peerSocket.send({"query" : "getStations", "parameters":{}});
        }

        // Listen for the message event
        messaging.peerSocket.onmessage = function(evt) {
            var data = JSON.parse(String(evt.data));
            currentView.updateStationsList(data.stations);
            currentView.render();
            
        }
        // Listen for the onerror event
        messaging.peerSocket.onerror = function(err) {
            console.log(err.message)
        }
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount(){
        messaging.peerSocket.onopen = null
        messaging.peerSocket.onmessage = null
        messaging.peerSocket.onerror = null
        this.currentView = null
        this.trash = null;
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender(){
        // TODO: put DOM manipulations here...
        console.log("rendering main view");
        //this.render();
    }

    updateStationsList(stations) {
        this.stationList.style.display = "inline";
        console.log('lenght: '+stations.length)
        this.stationList.delegate = {
          getTileInfo: (index) => {
             return {
              type: "station-pool",
              value: "",
              index: index
            };
          },
          configureTile: (tile, info) => {
            if (info.type == "station-pool") {
              tile.getElementById("station").text = `${stations[info.index]['name']}`;
              let touch = tile.getElementById("touch");
                touch.onclick = function(evt) {
                console.log(`touched: ${info.index}`);
                Application.switchTo( "StationView", {"origin":stations[info.index]['station']} );
              };
            }
          }
        }
        this.stationList.length = stations.length
    }

}

