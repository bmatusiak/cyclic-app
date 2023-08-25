
var WebAPI = require("../lib/express").WebAPI;
var s3 = require("./s3");

module.exports = function (express, app) {


    var api = new WebAPI(express);

    api.on("/list", async function (req, res) {

        res.set({
            'content-type': 'application/json'
        })
        s3.listObjects((data) => { res.end(JSON.stringify(data)) })
        // data;

    }) 

    app.use("/api/v1", api.router)

};