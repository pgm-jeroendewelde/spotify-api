import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

// init dotenv
dotenv.config();

// encrypt password so both are saved in the database
export default (password) => {
  return bcrypt.hashSync(password, parseInt(process.env.BCRYPT_SALT_ROUNDS));
}