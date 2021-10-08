/**
 * All the CRUD endpoint actions together for the Users
 */

import parseUsers from './parseUsers.js';

/**
 * Getting the Users
 * 
 * @param {*} users 
 * @param {*} request 
 * @param {*} response 
 */
export const getUsers = async (users, request, response) => {
  try {
    response.status(200).json({ users: await users.get() });
  } catch ({ message }) {
    response.status(500);
    response.json({ error: message });
  }
}

/**
 * Gett User by UserId
 * 
 * @param {*} users 
 * @param {*} request 
 * @param {*} response 
 */
export const getUser = async (users, request, response) => {
  try {
    const userId = request.params.id;
    response.status(200).json({ users: await users.get(userId) });
  } catch ({ message }) {
    response.status(500);
    response.json({ error: message });
  }
}

/**
 * Create a new User
 * 
 * @param {*} users 
 * @param {*} request 
 * @param {*} response 
 */
export const addUser = async (users, request, response) => {
  try {
    const user = parseUsers(request, response);
    const count = await users.add(user);
    response.status(201).json({ users: count });
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}

/**
 * Update user with given ID from URL
 * 
 * @param {*} users 
 * @param {*} request 
 * @param {*} response 
 */
export const updateUser = async (users, request, response) => {
  try {
    let user = parseUsers(request);
    const { id } = request.params;
    user.id = id;
    const count = await users.update(user);
    
    if(count) {
      response.status(200).json({ updated: count });
    } else {
      response.status(404).json({ message: "Record not found" });
    }
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}

/**
 * Delete user with given ID from URL
 * 
 * @param {*} users 
 * @param {*} request 
 * @param {*} response 
 */
export const deleteUser = async (users, request, response) => {
  try {
    const { id } = request.params;
    await songs.delete(id);
    response.status(204).end();
  } catch ({ message }) {
    response.status(500).json({ error: message });
  }
}