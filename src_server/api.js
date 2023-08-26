
var WebAPI = require("./WebAPI");
var Gun = require("./gun")

module.exports = function (express, app) {

  var gun = Gun();

  var api = new WebAPI(express);

  // var gunP = gun.get("hello").get("world").get("i").get("need").get("to").get("lol");

  api.on("/*", async function (type, req, res) {
    let body = req.body.data;

    let path = req.params[0];
    path = path.split("/");
    var gunP = gun;

    for (let i = 0; i < path.length; i++) {
      var p = path[i];
      if (p)
        gunP = gunP.get(p);
    }

    if (type == "POST") {
      gunP.put(body, function (data) {
        res.set({
          'content-type': 'application/json'
        })
        res.end(data ? JSON.stringify(data) : JSON.stringify(null));
      })
    } else {
      
      gunP.once(function (data) {
        res.set({
          'content-type': 'application/json'
        })
        res.end(data ? JSON.stringify(data) : JSON.stringify(null));
      })
    }
  })

  app.use("/api/v1", api.router)

};