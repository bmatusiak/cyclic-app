

(async function () {
    var fs = require("fs");
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);

    require('./src_server')(express, app);

    app.get('/', (req, res) => {
        res.set({
            'content-type': 'text/html'
        })
        fs.readFile(__dirname + "/index.html", function (err, data) {
            res.end(data.toString());
        });
    })
    app.get('/webapi.js', (req, res) => {
        res.set({
            'content-type': 'text/javascript'
        })
        fs.readFile(__dirname + "/dist/fetch.js", function (err, data) {
            res.end(data.toString());
        });
    })

    server.listen(process.env.PORT || 8000, process.env.IP || "0.0.0.0");

    console.log(process.env.CYCLIC_URL ||
        ("http://" + (process.env.IP || "localhost") + ":" + (process.env.PORT || 8000)))


})();

