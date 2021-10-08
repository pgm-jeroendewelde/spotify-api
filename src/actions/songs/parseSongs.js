/**
 * A Song parser to parse the incoming request
 */

// We will receive an object like this:
// {
//  "song": {
//   "title": "the title of the song",
//   "artist": "the artist of the song",
//   "URI": "the Spotify-URI for this song",
//   !!! when updating song add:
//   "update": true,
//  }
// }

export default (request) => {
  const { song } = request.body;

  //validate if we have a song in the body
  if(song === null) {
    throw new Error('The song object was not set.');
  }

  // check if we have a title
  if(song.title !== undefined ) {
    if((song.title === null) || (song.title.length === 0)) {
      throw new Error('The song object does not contain a title.');
    }
  } else {
    if(song.update === undefined) {
      throw new Error('The song object does not contain a title.');
    }
  }

  // check if we have an artist
    if(song.artist !== undefined ) {
      if((song.artist === null) || (song.artist.length === 0)) {
        throw new Error('The song object does not contain an artist.');
      }
    } else {
      if(song.update === undefined) {
        throw new Error('The song object does not contain an artist.');
      }
    }

  // check if we have a URI
  // TODO check if URI is valid?
  if(song.URI !== undefined ) {
    if((song.URI === null) || (song.URI.length === 0)) {
      throw new Error('The song object does not contain a Spotify-URI.');
    }
  } else {
    if(song.update === undefined) {
      throw new Error('The song object does not contain a Spotify-URI.');
    }
  }

  // remove update property if present
  if(song.update) {
    delete user['update'];
  }

  // return the parsed song
  return song;
}