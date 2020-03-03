const server = require('./src/Helpers/server');
const app = {};
app.init = () => {
    server.init();
};
//Starting the App.
app.init();