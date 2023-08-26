

(async function () {
    // var fs = require("fs");
    var express = require('express');
    var app = express();
    var server = require('http').createServer(app);

    require('./src_server')(express, app);

    app.use(express.static('public'))

    server.listen(process.env.PORT || 8080, process.env.IP || "0.0.0.0");

    console.log(process.env.CYCLIC_URL ||
        ("http://" + (process.env.IP || "localhost") + ":" + (process.env.PORT || 8080)))


})();

