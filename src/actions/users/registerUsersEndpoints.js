/**
 * Registering the Songs API endpoints
 */

import express from 'express';
import UsersDb from '../../lib/UsersDb.js';
import { addUser, getUsers, getUser, updateUser, deleteUser } from './crudUsers.js';

const app = express.Router();
const usersData = new UsersDb();


// get the users
app.get('/', async (req, res) => {
  await getUsers(usersData, req, res);
})

// get user by id
app.get('/:id', async (req, res) => {
  await getUser(usersData, req, res);
})

// add a user
app.post('/', async (req, res) => {
  await addUser(usersData, req, res);
});

// update a user
app.put('/:id', async (req, res) => {
  await updateUser(usersData, req, res);
});

// delete a user
app.delete('/:id', async (req, res) => {
  await deleteUser(usersData, req, res);
});

export default app;
