const bodyParser = require('body-parser');
const express = require('express');


export default function setupSupertest(router : any){
    const app = express();
    app.use(bodyParser.json()); // This line adds body parser middleware
    app.use('/', router);
    const timeoutLimit = 10000
    jest.setTimeout(timeoutLimit)
    return app
}