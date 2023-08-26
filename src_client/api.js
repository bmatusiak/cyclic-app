

var WebAPI = require("./WebAPI").WebAPI;

export const api = function(apiPath){
    const basePath = apiPath;
    var api = {};

    
    api = new WebAPI(basePath);

    api.get = function(path, callback){
        api._get("/"+ path, callback);
    }
    
    api.put = function(path, data, callback){
        
        api._post("/"+ path, data, callback);
    }

    return api;
}