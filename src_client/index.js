
// window.location = "https://github.com/bmatusiak/cyclic-app";

var WebAPI = require("./WebAPI").WebAPI;
var $ = require("jquery");

(async function () {

    var api = new WebAPI("/api/v1");
    function update() {
        api.emit("/get", {}, function (response) {
            // // console.log("response", response)
            // var output = window.document.getElementById("output");
            // output.textContent = JSON.stringify(response)

            $("#output").text(JSON.stringify(response))
            // output.
            // output.write
        })
    }
    update();

    $("#theButton").on("click", () => {
        api.emit("/put", { some: "test-" + (new Date().getTime()) }, function (response) {
            // // console.log("response", response)
            // var output = window.document.getElementById("output");
            // output.textContent = JSON.stringify(response)

            $("#output2").text(JSON.stringify(response))
            // output.
            // output.write
            update();

        })
    })
})();