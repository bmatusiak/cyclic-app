/* eslint-disable no-undef */

var assert = require('chai').assert;

describe('API', function () {

    var WebAPI = require("./WebAPI").WebAPI;

    var api;

    describe('setup', function () {
        api = new WebAPI("/api/v1");
        it('should be a object', function (done) {
            assert.equal(typeof api, 'object');
            done();
        });
    });

    describe('set put', function () {

        let sentData;

        it('should be a string', function (done) {
            var data = { some: "test-" + (new Date().getTime()) };
            api.emit("/put", data, function (ack) {
                if (ack == "OK") {
                    sentData = JSON.stringify(data);
                    assert.equal(typeof sentData, 'string');
                    done();
                }
            })
        });

        describe('check put', function () {
            it('should be a the same', function () {
                api.emit("/get", {}, function (recData) {
                    assert.equal(recData, sentData);
                });
            })
        });
    })

});
