/**
 * A User parser to parse the incoming request
 */

// We will receive an object like this:
// {
//  "user": {
//   "username": "the username",
//   "name": "the full nae of the user",
//   "email": "the email-adress of the user",
//   "password": "the hashed Password of the user",
//   "originalPassword": "the Password of the user",
//   "type": "admin or member",
//   !!! when updating user add:
//   "update": true,
//  }
// }

export default (request) => {
  const { user } = request.body;

  if(user === null) {
    throw new Error('The user object was not set.');
  }

  // check if we have a username
  if(user.username !== undefined ) {
    if((user.username === null) || (user.username.length === 0)) {
      throw new Error('The user object does not contain a username.');
    }
  } else {
    if(user.update === undefined) {
      throw new Error('The user object does not contain a username.');
    }
  }

  // check if we have a name
  if(user.name !== undefined ) {
    if((user.name === null) || (user.name.length === 0)) {
      throw new Error('The user object does not contain a name.');
    }
  } else {
    if(user.update === undefined) {
      throw new Error('The user object does not contain a name.');
    }
  }

  // check if we have an email
  if(user.email !== undefined ) {
    if((user.email === null) || (user.email.length === 0)) {
      throw new Error('The user object does not contain an email.');
    }
  } else {
    if(user.update === undefined) {
      throw new Error('The user object does not contain an email.');
    }
  }

  // check if we have a title
  if(user.password !== undefined ) {
    if((user.password === null) || (user.password.length === 0)) {
      throw new Error('The user object does not contain a password.');
    }
  } else {
    if(user.update === undefined) {
      throw new Error('The user object does not contain a password.');
    }
  }

  // check if we have a type, if not valid or not defined, add type 'member'
  if(user.type !== undefined ) {
    if((user.type === null) || (user.type.length === 0)) {
      user.type = 'member';
    } else if((user.type !== 'member') || (user.type !== 'admin')) {
      user.type = 'member';
    }
  } else {
    if(user.update === undefined) {
      user.type = 'member';
    }
  }

  // remove update property if present
  if(user.update) {
    delete user['update'];
  }
  
  // return the parsed user
  return user;
}