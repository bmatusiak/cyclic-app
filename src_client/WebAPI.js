
export class WebAPI {
    constructor(apiPath) {
        this.path = apiPath;
    }
    _post(api, data, callback) {
        return fetch(this.path + api, {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            // mode: "cors", // no-cors, *cors, same-origin
            cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
            // credentials: "same-origin", // include, *same-origin, omit
            headers: {
                "Content-Type": "application/json",
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            // redirect: "follow", // manual, *follow, error
            // referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify({data}), // body data type must match "Content-Type" header
        }).then(async (response) => {
            return callback ? callback(await response.json()) : await response.json() 
        })  ; // parses JSON response into native JavaScript objects

    }

    _get(api, callback) {
        return fetch(this.path + api, {
            method: "GET", 
            cache: "no-cache",
        }).then(async (response) => {
            return callback ? callback(await response.json()) : await response.json()
        });
    }

}