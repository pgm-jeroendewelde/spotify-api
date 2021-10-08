import { v4 as uuidv4 } from 'uuid';
import knexMusic from '../../db/knexMusic.js';

export default class UsersDb {
  constructor() {
    this.table = "users";
  }

  /**
   * Get array of songs OR single User with given ID
   * 
   * @param { null|String } id 
   * @returns Array OR Object
   */
  async get(id = null) {
    try {
      if(!id) {
        return await knexMusic(this.table).select('*');
      }
      const [user] = await knexMusic(this.table).where("id", id);
      console.log(user);
      return user
    } catch ({ message }) {
        console.log(message);
    }
  }

  /**
   * Add User with given Object
   * {id, username, type, name, email, password}
   * 
   * @param { Object } field 
   * @returns ID of added song
   */
  async add(field) {
    try {
      let newUser = {
        username: field.username,
        type: field.type,
        name: field.name,
        email: field.email,
        password: field.password,
        originalPassword: field.originalPassword,
        dateAdded: Date.now(),
        dateAdjusted: Date.now()
      }
      if(field.id) {
        newUser.id = field.id
      } else {
        newUser.id = uuidv4();
      }
      return await knexMusic(this.table).insert(newUser)
    } catch ({ message }) {
      console.error(message);
    }
  }

  /**
   * Update an existing user with given Object
   * {id, username, type, name, email, password}
   * 
   * @param { Object } field 
   * @returns 
   */
  async update(field) {
    try {
      const updatedUser = {
        username: field.username,
        type: field.type,
        name: field.name,
        email: field.email,
        password: field.password,
        dateAdjusted: Date.now()
      }
      console.log(updatedUser);
        return await knexMusic(this.table).where('id', field.id).update(updatedUser);
      
    } catch ({ message }) {
      console.log(message);
    }
  }

  /**
   * Deletes a specific user
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

  /**
   * Get user with given username
   * 
   * @param { String } username
   * @returns  Object
   */
   async findOne(username) {
    try {
        return await knexMusic(this.table).select('*')
        .where({ username: username }).first();
    } catch ({ message }) {
        console.log(message);
    }
  }
}