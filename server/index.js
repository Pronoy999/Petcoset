#!/usr/bin/.env node
const server = require('./src/Helpers/server');
require('dotenv').config();
const app = {};
app.init = () => {
    server.init();
};
//Starting the App.
app.init();