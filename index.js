var fs = require("fs");

var express = require('express');
var app = express();
var server = require('http').createServer(app);

app.configure(function() {
    app.use(express.cookieParser("123321aassddccxxzz"));
    app.use(express.bodyParser());
    app.use(express.session({
        secret: '123321aassddccxxzz',
        key: 'express.sid'
    }));
    
    server.listen(process.env.PORT || 8000, process.env.IP || "0.0.0.0");
});



app.all('/', (req, res) => {
    fs.readFile(__dirname+"/index.html",function(err,data){
        
        res.end(data.toString());
    });
})

