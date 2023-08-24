var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var ejs = require("ejs");
var fs = require("fs");
app.configure(function() {
    app.use(express.cookieParser("123321aassddccxxzz"));
    app.use(express.bodyParser());
    app.use(express.session({
        secret: '123321aassddccxxzz',
        key: 'express.sid'
    }));
    
    io.configure(function() {
        io.set("transports", ["xhr-polling"]);
        io.set("polling duration", 10);
    });
    server.listen(process.env.PORT || 8000, process.env.IP || "0.0.0.0");
});



app.all('/', (req, res) => {
    fs.readFile(__dirname+"/index.html",function(err,data){
        
        res.end(ejs.render(data.toString(),{}));
    });
})


io.sockets.on('connection', function(socket) {
    socket;
    console.log("socket.connection")
});