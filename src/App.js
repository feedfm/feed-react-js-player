import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Popper from 'popper.js';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import { useState, useEffect } from "react";
import './App.css';
import $ from 'jquery'; 
import Feed from 'feed-media-audio-player';

var player;
var playerView;

class App extends React.Component {
 
render(){

  return (
    <div>
    <div style={{paddingTop: 90, paddingBottom: 175, backgroundColor: '#ededed'}}>
      <div
        className="header fixed-top"
        height="75"
        style={{backgroundColor: '#163a3f'}}
      >
        <div className="col-sm-12 mt-2 mb-2 text-center">
          <img src="images/logo.svg" width="150" height="70" alt="" style ={{marginLeft: 10}}/>
          <h2 style={{color: 'white'}}>React Web Player</h2>
        </div>
        <hr style={{width: '100%', textAlign: 'left', marginLeft: 0}} />
      </div>
      <form>
        <div className="form-group mx-4">
          <label htmlFor="inputToken" className="mb-n1">Token</label>
          <input
            type="password"
            className="form-control mb-n1"
            id="userToken"
            placeholder="Token"
            defaultValue="demo"
            style={{width: '50%'}}
          />
        </div>
        <div className="form-group mx-4">
          <label htmlFor="inputSecret" className="mb-n1">Secret</label>
          <input
            type="password"
            className="form-control mb-n1"
            id="userSecret"
            placeholder="Secret"
            defaultValue="demo"
            style={{width: '50%'}}
          />
        </div>
        <button
          type="button"
          className="btn btn-secondary mx-4 mb-n1"
          onClick= {()=> submitUserCredentials()}
        >
          Submit
        </button>
      </form>
      <hr style={{width: '100%', textAlign: 'left', marginLeft: 0}} />
      <div className="form-group mx-4">
        <label htmlFor="inputStationSearch">Search for station</label>
        <input
          type="text"
          className="form-control"
          id="inputStationSearch"
          placeholder="Station Name"
          style={{width: '50%'}}
        />
      </div>
      <div
        className="list-group mx-4 mr-5"
        id="station-list-div"
        style={{width: '48%'}}
      ></div>
      <footer
        className="fixed-bottom"
        height="100"
        style={{backgroundColor: 'rgba(255, 255, 255, 1)'}}
      >
        <hr
          style={{
            width: '100%',
            textAlign: 'left',
            marginLeft: 0,
            marginBottom: 1,
            marginTop: 0
          }}
        />
		  
        <div className="mx-4" id="player-view-div" styles="width: 95%">
          <div className="status"></div>
          <div style={{height: 20, backgroundColor: 'rgba(94, 94, 94, 0.3)'}}>
            <div
              className="h-100 d-inline-block progress"
              style={{backgroundColor: 'rgba(123, 192, 166, 1)'}}
            ></div>
          </div>
          <div>
            <label className="elapsed"></label> /
            <label className="duration"></label>
          </div>
          <button className="play-button btn btn-secondary">play</button>
          <button className="pause-button btn btn-secondary">pause</button>
          <button className="skip-button btn btn-secondary">skip</button>
		  <button className="btn btn-secondary" onClick = {() => resetStation()}>reset</button>
        </div>
		  
        <div className="container text-center">
          <div className="row">
            <div className="col-12">
              <p style={{fontSize: '50%'}}>
                Copyright © Feed Media Group. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );

}

componentDidMount(){
  initializePlayer();
}


}

function initializePlayer() {
  // Create basic player.
  player = new Feed.Player(
    document.getElementById("userToken").value,
    document.getElementById("userSecret").value,
    {secondsOfCrossfade:5}
  );

  player.initializeAudio();

  // Display all the events the player triggers
  player.on("all", function (event) {
    console.log(
      "player triggered event '" + event + "' with arguments:",
      Array.prototype.splice.call(arguments, 1)
    );
  });

  player.on("stations", function (stations) {
    var mydiv = document.getElementById("station-list-div");
    mydiv.innerHTML = " ";

    stations.forEach((station) => {
      console.log("Station ID: " + station.id + ", Station name: " + station.name);
      mydiv.innerHTML +=
        '<a href ="#" class="list-group-item list-group-item-action" data-crossfade="'+
        (station.options?.crossfade_seconds || 0) +
        '" id="' +
        station.id +
        '"> <h5 id="station_name" class="mb-0">' +
        station.name +
        '</h5><p id="station_id" class="mb-0">' +
        station.id +
        "</p></a>";
    });

    $(".list-group-item").click(function () {
      console.log("selected station: " + this.id);
      console.log('crossfade:', this.dataset.crossfade)
      // player.options.secondsOfCrossfade = +this.dataset.crossfade;
      player.serverAssignedCrossfade=true;
      player.setStationId(this.id);
      
      // Select all list items
      var listItems = $(".list-group-item");

      // Remove 'active' tag for all list items
      for (let i = 0; i < listItems.length; i++) {
        listItems[i].classList.remove("active");
      }

      // Add 'active' tag for currently selected item
      this.classList.add("active");
    });
  });

  playerView = new Feed.PlayerView("player-view-div", player);

  player.tune();
}

function submitUserCredentials() {
  try {
    player.off("all");
    playerView._disablePositionTracker();
    player.destroy();
   
   
    window.resetStation = resetStation;
    var playDiv = document.getElementById("player-view-div");
    playDiv.innerHTML = " ";
    playDiv.innerHTML =
      '<div id="player-view-div"><div class="status"></div><div style="height: 20px; background-color: rgba(94,94,94,0.30);"><div class="h-100 d-inline-block progress" style="background-color: rgba(123,192,166,1.00)"></div></div><div><label class="elapsed"></label> /<label class="duration"></label></div><button class="play-button btn btn-secondary">play</button><button class="pause-button btn btn-secondary">pause</button><button class="skip-button btn btn-secondary">skip</button><button class="btn btn-secondary" onclick = resetStation()>reset</button></div>';

    initializePlayer();
    console.log("previous player destroyed");
  } catch (e) {
    initializePlayer();
    console.log(e + " no active player to destroy");
  }
}
function uuidv4() {
  return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
  (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}	   
async function resetStation(){
var id = uuidv4();
player.session._setStoredCid(id);
console.log("stored client id: " + player.session._getStoredCid());
var pr = await player.session._getClientId();
console.log("client id: " + pr);
//submitUserCredentials();
window.location.reload();
   
}

$(document).ready(function () {
  $("#inputStationSearch").on("keyup", function () {
    var value = $(this).val().toLowerCase();
    $("#station-list-div a").filter(function () {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });
});


export default App;
