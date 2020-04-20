import React, { Component } from 'react';
import './App.css';
import api from './service/api';

import SpotifyWebApi from 'spotify-web-api-js';
const spotifyApi = new SpotifyWebApi();


class App extends Component {
  constructor(){
    super();
    const params = this.getHashParams();
    const token = params.access_token;
    if (token) {
      spotifyApi.setAccessToken(token);
    }
    this.state = {
      loggedIn: token ? true : false,
      tokenV:'Bearer '+token,
      device:'',
      nowPlaying: { name: 'Not Checked', albumArt: '',image:'',trackID:'',totalTrack:0 }
    }
  }
  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  getNowPlaying(){
    console.log(spotifyApi.getMyCurrentPlaybackState())
    
  }

  async artist(){
  await api.get('v1/me/player/currently-playing?market=ES&additional_types=episode',{headers:{
    Authorization:this.state.tokenV
  }}).then((response)=>{
    this.setState({
      nowPlaying:{
        trackID:response.data.item.id,
      }
    })
    console.log(response.data)
  })

  api.get('v1/me/player/currently-playing?market=ES&additional_types=episode',{headers:{
    Authorization:this.state.tokenV
  }}).then((response)=>{
    this.setState({
        totalTrack:response.data.item.album.total_tracks,//Total de musicas no Album
        image:response.data.item.album.images[0].url,//Capa do Album
        numberTrack:response.data.item.track_number // Numero da Musica q esta sendo tocada
    })
    console.log(response.data)
  })

  api.get(`v1/tracks/${this.state.nowPlaying.trackID}?market=ES`,{headers:{
    Authorization:this.state.tokenV
  }}).then((response)=>{
    this.setState({
      nowPlaying:{
        name:response.data.name,//Nome da Musica
        artists:response.data.artists[0].name//Nome da Musica
      }
    })    
  })

  }

  async requestPlay(){
    await spotifyApi.getMyDevices().then((response)=>{
      this.setState({
        device:response.devices[0].id,
      })
    })

    api.put(`/v1/me/player/play?device_id=${this.state.device}`,{
        context_uri:"spotify:album:14XXkmq6rjlKTxRkelMtZx",
        offset: {
          position: 0
          },
        position_ms: 0
    },{headers:{
      Authorization:this.state.tokenV
    }})
    
  }

  requestNext(){
    api.post(`/v1/me/player/next?device_id=${this.state.device}`,{},{headers:{
      Authorization:this.state.tokenV
    }})
  }

  requestPrev(){
    api.post(`/v1/me/player/previous?device_id=${this.state.device}`,{},{headers:{
      Authorization:this.state.tokenV
    }})
  }

  render() {
    return (
      <div className="App">
        {}
        {()=>this.getHashParams()}
        <h3>
          Now Playing: { this.state.nowPlaying.name } <br/>
          Artist: { this.state.nowPlaying.artists } <br/>
          Total Track Album: {this.state.numberTrack}/{ this.state.totalTrack }
        </h3>
        <div>
          <img src={this.state.image} style={{ width: 500, height:500 }}/>
        </div>
        { this.state.loggedIn &&
          <button onClick={()=>{
            this.requestPrev();
            setTimeout(()=>this.artist(),1000) }}>
            Preview
          </button>
        }
        { this.state.loggedIn &&
          <button onClick={()=>{
            this.requestPlay();
            setTimeout(()=>this.artist(),1000) }}>
            Play
          </button>
        }
        { this.state.loggedIn &&
          <button onClick={()=>{
            this.requestNext();
            setTimeout(()=>this.artist(),1000) }}>
            Next
          </button>
        }

      </div>
    );
  }
}

export default App;
