
 class WebAPI {
    constructor(express) {
        this.router = express.Router();
        this.router.use(express.json())
    }
    router = null;
    on(api, callback) {
        
        this.router.all(api, (req, res) => {
            callback(req.method, req, res)
        })

        // this.router.get(api, (req, res) => {
        //     callback("GET", req, res)
        // })

        // this.router.post(api, (req, res) => {
        //     callback("POST", req, res)
        // })

    }

}

module.exports = WebAPI;