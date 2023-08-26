
var WebAPI = require("./WebAPI");
// var s3 = require("./s3");
var Gun = require("./gun")

module.exports = function (express, app) {

    var gun = Gun();
    gun;

    // gun.get("hello").get("world").put("Test")

    var api = new WebAPI(express);

    var gunP = gun.get("hello").get("world").get("i").get("need").get("to").get("lol");

    api.on("/get", async function (req, res) {


        gunP.once(function (data) {

            res.set({
                'content-type': 'application/json'
            })
            res.end(data ? JSON.stringify(data) : JSON.stringify("FAIL"));
            // s3.listObjects((data) => { res.end(JSON.stringify(data)) })
        })



        // data;

    })

    api.on("/put", async function (req, res) {

        if (req.body)
                gunP.put(JSON.stringify(req.body), () => {

                res.set({
                    'content-type': 'application/json'
                })
                res.end(JSON.stringify("OK"));
            })




        // data;

    })


    app.use("/api/v1", api.router)

};