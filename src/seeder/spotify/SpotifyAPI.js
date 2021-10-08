/**
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#client_credentials_flow
 * 
 * Code modified from:
 * https://www.ben-townsend.com/getting-started-with-the-spotify-web-api-using-nodejs/
 * 
 * Attention! Don't share my ID + SECRET!
 * NOT saved in .env, so it can be teste by the teachers. 
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const request = require('request-promise-native');

const CLIENT_ID = 'daf5f78a5e4d476a9ee319cd8c1e7198'; // Your client id (from Spotify API Dashboard)
const CLIENT_SECRET = '2777742a23bc411dac23100de6b05cd0'; // Your client secret (from Spotify API Dashboard)
const SPOTIFY_USER_ID = 't6laiprkrp6vvyda5h07v0gfw'; // Your Spotify-user-id, used to fetch YOUR playlists
const base64Credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64'); // encoded user credentials
let tokenObject = {};

/**
 * Request to get acces-token with globally saved ID+SECRET
 * {
      access_token: 'BQB6iSmX7p.....',
      token_type: 'Bearer',
      expires_in: 3600
    }
 * @returns accesData-Object 
 */
const getAccesData = async() => {
  const accessData = await request({
    method: 'POST',
    uri: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization: `Basic ${base64Credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials',
    json: true
  });
  saveToken(accessData);
  return accessData;
}

/**
 * access_token is saved globally, current time + 1hr (expires_in) is also added as property
 * @param { Object } accessData 
 */
const saveToken = (accessData) => {
  tokenObject = {
    access_token : accessData.access_token,
    expiration : Date.now() + accessData.expires_in
  }
}

/**
 * Fetch Playlists from globally saved Spotify-User, Token is also being fetcht/called
 * @returns response of playlist
 */
export const fetchPlaylists = async() => {
  
  const { access_token } = await getAccesData();

    if (access_token) {
      const token = access_token;
      const playlistData = await request({
        method: 'GET',
        uri: `https://api.spotify.com/v1/users/${SPOTIFY_USER_ID}/playlists`,
        headers: {
          Authorization: `Bearer ${token}`
        },
        json: true
      });
  
      return playlistData;
    }
}

/**
 * Fetch Songs from specific Playlist with URI
 * If the token isn't expired, get new Token. Get token from global TokenObject
 * EXTRA NOTE for teachers:
 * This one didn't work INSIDE other request, therefore responses are saved in './src/seeder/backupSongs/playlistData.js'
 * @param { String | SongsFromPlaylistURI } songsURI 
 * @returns response of songs
 */
export const fetchSongsFromPlaylist = async(songsURI) => {
  let token = '';
  
  if(tokenObject.expiration < Date.now()) {
    await getAccesData();
  }
  token = tokenObject.access_token;

  const songsData = await request({
    method: 'GET',
    uri: songsURI,
    headers: {
      Authorization: `Bearer ${token}`
    },
    json: true
  });

  return songsData;
}