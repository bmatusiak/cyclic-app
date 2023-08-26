/* eslint-disable no-undef */

var assert = require('chai').assert;

var goingTo = it;

describe('Test', function () {

    var api  = require("./api").api("/api/v1");
    console.log(api)
    
    goingTo('check if a random key has a null value ', function (done) {
        api.get("hello/world+"+(new Date().getTime())+"/shouldBeNull", function(data){
            assert.equal(data, null);
            done();
        })
    });   

    describe('check if data can be set', function () {

        var testPath, testData;

        goingTo('set test path, and test data', function (done) {
            testData = (new Date().getTime());
            testPath = "hello/world-"+testData+"/testPath";
            done();
        });

        goingTo('set data', function (done) {
            api.put(testPath, testData, function(ack){
                assert.equal(ack.err, null);
                done();
            })
        });

        goingTo('check data', function (done) {
            api.get(testPath, function(data){
                assert.equal(data, testData);
                done();
            })
        });
    });
});
