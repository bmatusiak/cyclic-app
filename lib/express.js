
 class WebAPI {
    constructor(express) {
        // this.router = express();
        this.router = express.Router();

        // this.router.use((req, res, next) => {
        //     console.log('Time: ', Date.now())
        //     next()  
        // })   
  
        this.router.use(express.json())

    }
    router = null;
    on(api, callback) {

        this.router.get(api, (req, res) => {
            res.end("POST required, current method GET");
        })

        this.router.post(api, (req, res) => {
            callback(req, res)
        })

    }

}
module.exports = { WebAPI };