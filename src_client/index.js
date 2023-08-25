
// window.location = "https://github.com/bmatusiak/cyclic-app";

var WebAPI = require("./WebAPI").WebAPI;

(async function () {

    var api = new WebAPI("/api/v1");

    api.emit("/list", { user: "test" }, function (response) {
        // console.log("response", response)
        var output = window.document.getElementById("output");
        output.textContent = JSON.stringify(response)
        // output.
        // output.write
    })
})();