#!/usr/bin/env node
const server = require('./src/Helpers/server');
const os = require('os');
const cluster = require('cluster');
require('dotenv').config();
const app = {};
app.init = () => {
   const cpuLength = os.cpus().length;
   for (let i = 0; i < cpuLength; i++) {
      if (cluster.isMaster) {
         cluster.fork();
      } else {
         server.init();
      }
   }
};
//Starting the App.
app.init();