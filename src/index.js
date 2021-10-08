/**
 * Main Spotify application
 */

import Express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import registerSongsEndpoints from "./actions/songs/registerSongsEndpoints.js";
import registerPlaylistsEndpoints from "./actions/playlists/registerPlaylistsEndpoints.js";
import registerUsersEndpoints from "./actions/users/registerUsersEndpoints.js";
import authenticate from './actions/auth/index.js';
import middleware from "./middleware/index.js";

// create a new epxress applicaiton
const app = Express();

// init dotenv
dotenv.config();

// add json body parser
app.use(bodyParser.json());

// register endpoints
//TODO check om middleware toe te voegen
app.use("/songs", ...middleware, registerSongsEndpoints);
app.use("/playlists", ...middleware, registerPlaylistsEndpoints);
app.use("/users", ...middleware, registerUsersEndpoints);
app.use("/auth", authenticate);

// Start app
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});