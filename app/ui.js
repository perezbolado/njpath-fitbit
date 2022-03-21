import document from "document";

export function NJPathUI() {
  this.trainList = document.getElementById("trainList");
  this.statusText = document.getElementById("status-text");
  this.stautsLightMap = {
    "ON_TIME" : "green",
    "ARRIVING_NOW" : "green",
    "DELAYED" : "orange" 
  }
}

NJPathUI.prototype.updateUI = function(state, departures) {
  if (state === "loaded") {
    this.trainList.style.display = "inline";
    this.statusText.text = "";
    this.updateDepartureList(departures);
  }
  else {
    this.trainList.style.display = "none";
    if (state === "loading") {
      this.statusText.text = "Loading departures ...";
    }
    else if (state === "disconnected") {
      this.statusText.text = "Please check connection to phone and Fitbit App"
    }
    else if (state === "error") {
      this.statusText.text = "Something terrible happened.";
    }
  }
}

NJPathUI.prototype.updateDepartureList = function(departures) {
  
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
        tile.getElementById("text").text = departures[info.index]["from"];
      }
    }
  };
  this.trainList.length = departures.length
}



