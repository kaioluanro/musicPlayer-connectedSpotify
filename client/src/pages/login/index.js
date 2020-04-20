import React from 'react';
import './styles.css';

export default function login(){
  return(
    <div className='div-a'>
      <p>
        Please Connection with your Spotify.
      </p>
      <a href='http://localhost:8888' >
        <button type='button'>Login to Spotify </button>
      </a>
    </div>
  )
}