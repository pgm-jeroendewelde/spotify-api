/**
 * Create a simple connection with knex
 */

import knex from 'knex';

const knexMusic = knex({
  client: 'sqlite3',
  connection: {
    filename: './db/music.sqlite3',
  },
  useNullAsDefault: true
});

export default knexMusic;