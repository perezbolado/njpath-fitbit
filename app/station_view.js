import { Application, View, $at } from './view'
import * as messaging from "messaging";

// Create the root selector for the view...
const $ = $at( '#station-view' );

export class StationView extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();
    trainList=$("#trainList")
    stautsLightMap = {
        "ON_TIME" : "green",
        "ARRIVING_NOW" : "green",
        "DELAYED" : "orange" 
      }

    // Lifecycle hook executed on `view.mount()`.
    onMount(){
        console.log('origin: '+this.options.origin)
        this.origin = this.options.origin;
        var currentView = this
        messaging.peerSocket.send({"query" : "getSchedule", "parameters":{"origin":this.origin}});
        // Listen for the onopen event
        messaging.peerSocket.onopen = function() {
            messaging.peerSocket.send({"query" : "getSchedule", "parameters":{"origin":this.origin}});
        }

        // Listen for the message event
        messaging.peerSocket.onmessage = function(evt) {
            var data = JSON.parse(String(evt.data));
            currentView.updateDepartureList(data.departures);
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
        console.log("rendering station view");
    }

    onKeyDown(){
        // Switch between two screens we have.
        Application.switchTo( "MainView" );
    }

    updateDepartureList = function(departures) {
        this.trainList.delegate = {
          getTileInfo: (index) => {
            const poolType = (departures[index].type === "header") ? "my-header-pool" : "my-pool";
            return {
              type: poolType,
              value: "",
              index: index
            };
          },
          configureTile: (tile, info) => {
            if (info.type == "my-pool") {
              tile.getElementById("destination").text = `${departures[info.index]['name']}`;
              let color = this.stautsLightMap[`${departures[info.index]['status']}`];
              console.log(color)
              tile.getElementById("train-status-light").style.fill = color;
              tile.getElementById("minutes").text = `${departures[info.index]['eta']} minutes`;
              let touch = tile.getElementById("touch");
              touch.onclick = function(evt) {
                console.log(`touched: ${info.index}`);
              };
            }else if(info.type == "my-header-pool"){
              console.log("header tile: " + info + "\nheader data: " + departures[info.index] );
              tile.getElementById("text").text = departures[info.index]["fromName"];
            }
          }
        };
        this.trainList.length = departures.length
      }
}