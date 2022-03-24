
import { View, $at } from './view'
import { NJPathUI } from "./ui.js";
import * as messaging from "messaging";

// Create the root selector for the view...
const $ = $at( '#main-view' );

export class MainView extends View {
    // Specify the root view element.
    // When set, it will be used to show/hide the view on mount and unmount.
    el = $();

    // Ad-hoc $-queries must be avoided.
    // You've got dumb 120MHz MCU with no JIT in VM, thus everything you do is expensive.
    // Put all of your elements here, like this:

    // otherEl = $( '#other-el-id' );
    // elementsArray = $( '.other-el-class' );

    // Lifecycle hook executed on `view.mount()`.
    onMount(){
        // TODO: insert subviews...
        // TODO: subscribe for events...
        let ui = new NJPathUI();
        ui.updateUI("disconnected");
        var currentView = this;
        // Listen for the onopen event
        messaging.peerSocket.onopen = function() {
            //var payload = JSON.stringify();
            //console.log('peer conection is open, requesting station data: ' + payload)
            messaging.peerSocket.send({"query" : "getStations", "parameters":{}});
            ui.updateUI("loading");
        }

        // Listen for the message event
        messaging.peerSocket.onmessage = function(evt) {
            var data = JSON.parse(String(evt.data));
            ui.updateUI("loaded", data);
            currentView.render();
            
        }
        // Listen for the onerror event
        messaging.peerSocket.onerror = function(err) {
            // Handle any errors
            ui.updateUI("error");
        }
    }

    // Lifecycle hook executed on `view.unmount()`.
    onUnmount(){
        messaging.peerSocket.onopen = null
        messaging.peerSocket.onmessage = null
        messaging.peerSocket.onerror = null
        currentView = null
        this.trash = null;
    }

    // Custom UI update logic, executed on `view.render()`.
    onRender(){
        // TODO: put DOM manipulations here...
        console.log("rendering main view");
        //this.render();
    }
}