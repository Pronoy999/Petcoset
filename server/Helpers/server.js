/**
 * dependencies:
 * @type {module:http}:
 */
const http = require('http');
const url = require('url');
const config = require('./config');
const StringDecoder = require('string_decoder').StringDecoder;
const router = require('./../Helpers/router');
const generator = require('./../Services/generator');
const responseGenerator = require('./../Services/responseGenerator');
const validator = require('./../Helpers/validators');
const printer = require('./../Helpers/printer');
const constants = require('./constants');
const server = {};
/**
 * Core Server logic for parsing and choosing the handlers.
 * @param req: the Request object.
 * @param res: The Response object.
 */
server.unifiedServer = function (req, res) {
    const parsedUrl = url.parse(req.url, true);
    const pathName = parsedUrl.pathname;
    const path = pathName.replace(/^\/+|\/+$/g, '');
    const firstRoute = path.split("/")[0];
    const secondPath = path.substr(path.indexOf("/") + 1);
    const method = req.method.toLowerCase();
    const queryString = parsedUrl.query;
    const decoder = new StringDecoder('utf-8');
    const contentType = req.headers['content-type'];
    const apiToken = req.headers[constants.API_TOKEN_KEY];
    const chosenHandler = router.getPath(firstRoute);
    let postData = "";
    let handlerData;
    if (contentType === 'application/octet-stream') {
        let data = [];
        req.on('data', d => {
            data.push(d);
        }).on('end', () => {
            const buffer = Buffer.concat(data);
            handlerData = {
                path: secondPath,
                method,
                queryString,
                data: buffer,
                request: req,
            };
            handlerData[constants.API_TOKEN_KEY] = apiToken;
            execHandlers(handlerData);
        });
    } else {
        req.on('data', function (data) {
            postData += decoder.write(data);
        }).on('end', () => {
            postData += decoder.end();
            postData = generator.generateParsedJSON(postData);
            handlerData = {
                path: secondPath,
                method,
                queryString,
                postData,
                request: req
            };
            handlerData[constants.API_TOKEN_KEY] = apiToken;
            execHandlers(handlerData);
        });
    }

    /**
     * Method to send the response back to the client.
     * @param responseData: The response data to be send.
     * @param statusCode: The status code that to be send.
     */
    function sendResponse(responseData, statusCode) {
        responseData = validator.validateUndefined(responseData) ? responseData : {};
        statusCode = validator.validateNumber(statusCode) ? statusCode : 500;
        responseData = JSON.stringify(responseData);
        try {
            res.setHeader(constants.CONTENT_TYPE_TEXT, constants.CONTENT_TYPE_JSON);
            res.writeHead(statusCode, constants.HEADERS);
            res.end(responseData);
            printer.printHighlightedLog("RETURNING: " + responseData + "FOR PATH: " + handlerData.path);
        } catch (e) {
            printer.printError(e);
        }
    }

    /**
     * Method to execute the Handlers.
     * @param handlerData: The request object after parsing it.
     */
    function execHandlers(handlerData) {
        if (handlerData.path !== 'ping') {
            validator.validateToken(handlerData[constants.API_TOKEN_KEY]).then(() => {
                delete handlerData[constants.API_TOKEN_KEY];
                if (handlerData.method === 'options') {
                    sendResponse({}, 200);
                } else {
                    let promise = chosenHandler(handlerData);
                    promise.then((responseObject) => {
                        sendResponse(responseObject[1], responseObject[0]);
                    }).catch(err => {
                        sendResponse(err[1], err[0]);
                    });
                }
            }).catch(err => {
                printer.printError(err);
                const response = responseGenerator.generateErrorResponse(constants.ERROR_MESSAGE, constants.ERROR_LEVEL_4,
                    constants.FORBIDDEN_MESSAGE);
                sendResponse(response[1], response[0]);
            });
        } else {
            sendResponse(constants.WELCOME_MESSAGE, 200);
        }
    }
};
//TODO: Add the HTTPS Server.
/**
 * Method to create the Server.
 */
server.httpServer = http.createServer((req, res) => {
    server.unifiedServer(req, res);
});
/**
 * Initializing the server.
 */
server.init = () => {
    /**
     * Method to listen on the port.
     */
    server.httpServer.listen(config.port, () => {
        console.log("Server Listening on Port ", config.port);
    });
};
/**
 * exporting the server module.
 */
module.exports = server;
