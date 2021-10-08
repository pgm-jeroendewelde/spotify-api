import { v4 as uuidv4 } from 'uuid';
import knexMusic from '../../db/knexMusic.js';

export default class SongsDb {
  constructor() {
    this.table = "songs";
  }

  /**
   * Get array of songs OR single song with given ID
   * 
   * @param { null|string } id 
   * @returns Array OR Object
   */
  async get(id = null) {
    try {
      if(!id) {
        return await knexMusic(this.table).select('*');
      }
      const [song] = await knexMusic(this.table).where("id", id);
      return song
    } catch ({ message }) {
        console.log(message);
    }
  }

  /**
   * Add song with given Object
   * {id, title, artist, URI, dateAdded}
   * 
   * @param { Object } field 
   * @returns ID of added song
   */
  async add(field) {
    //console.log(field)
    try {
      //console.log(field);
      const newSong = {
        id: uuidv4(),
        title: field.title,
        artist: field.artist,
        URI: field.URI,
        dateAdded: Date.now(),
        dateAdjusted: Date.now()
      }
      return await knexMusic(this.table).insert(newSong)
    } catch ({ message }) {
      console.error(message);
    }
  }

  /**
   * Update an existing song item with given Object
   * {id, title, artist, URI, dateAdded}
   * 
   * @param { Object } field 
   * @returns 
   */
   async update(field) {
    try {
      const updatedSong = {
        id: field.id,
        title: field.title,
        artist: field.artist,
        URI: field.URI,
        dateADjusted: Date.now()
      }
        return await knexMusic(this.table).where('id', field.id).update(updatedSong);
    } catch ({ message }) {
      console.log(message);
    }
  }

  /**
   * Deletes a specific song
   * 
   * @param { String } id 
   * @returns 
   */
  async delete(id) {
    try {
      return await knexMusic(this.table).where('id', id).del();
    } catch ({ message }) {
      console.log(message);
    }
  }

  /**
   * Deletes all records from table
   * @returns Amount of records erased
   */
  async clearTable() {
    try {
      return await knexMusic(this.table).select('*').del();
    } catch ({message}) {
      console.log(message);
    }
  }
}