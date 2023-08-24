
(async function () {
    var fs = require("fs");
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);

    await setup();

    app.get('/', (req, res) => {
        res.set({
            'content-type': 'text/html'
        })
        fs.readFile(__dirname + "/index.html", function (err, data) {
            res.end(data.toString());
        });
    })

    server.listen(process.env.PORT || 8000, process.env.IP || "0.0.0.0");

    async function setup() {
        var cookieParser = require('cookie-parser')
        var session = require('express-session')

        app.use(cookieParser("123321aassddccxxzz"));
        app.use(session({
            secret: '123321aassddccxxzz',
            key: 'express.sid'
        }));
    }


})();

