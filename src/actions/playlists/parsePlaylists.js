/**
 * A Playlist parser to parse the incoming request
 */

// We will receive an object like this:
// {
//  "playlist": {
//   "title": "the title of the song",
//   "ownerID": "the id of the owner-user",
//   "songs": "Array of song-ids",
//   "songsURI": "Spotify URI for all songs if it is a real Spotify-playlist",
//   !!! when updating playlist add:
//   "update": true,
//  }
// }

export default (request) => {
  const { playlist } = request.body;

  //validate if we have a playlist in the body
  if(playlist === null) {
    throw new Error('The playlist object was not set.');
  }

  // check if we have a title
  if(playlist.title !== undefined ) {
    if((playlist.title === null) || (playlist.title.length === 0)) {
      throw new Error('The playlist object does not contain a title.');
    }
  } else {
    if(playlist.update === undefined) {
      throw new Error('The playlist object does not contain a title.');
    }
  }

  // check if we have a ownerID
  if(playlist.ownerID !== undefined ) {
    if((playlist.ownerID === null) || (playlist.ownerID.length === 0)) {
      throw new Error('The playlist object does not contain a ownerID.');
    }
  } else {
    if(playlist.update === undefined) {
      throw new Error('The playlist object does not contain a ownerID.');
    }
  }

  // remove update property if present
  if(playlist.update) {
    delete playlist['update'];
  }

  // return the parsed playlist
  return playlist;
}