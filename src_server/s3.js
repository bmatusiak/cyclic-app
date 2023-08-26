
module.exports = (function () {

    const s3_bucket = process.env.CYCLIC_BUCKET_NAME || process.env.AWS_BUCKET;
    const s3_region = process.env.AWS_REGION;
    
    const {
        S3Client,
        ListObjectsCommand,
        GetObjectCommand,
        PutObjectCommand,
        DeleteObjectCommand
    } = require("@aws-sdk/client-s3");

    const client = new S3Client({
        AWS_REGION: s3_region
    });

    async function listObjects(params, callback) {
        return new Promise(function (resolve, reject) {
            const command = new ListObjectsCommand({...params, Bucket: s3_bucket });
            try {
                client.send(command).then(function (data) {
                    // var keys = data.Contents.map((d) => d.Key);
                    if (callback) callback(null, data)
                    resolve(data)
                })
            } catch (error) {
                reject(error);
                callback(error);
            }
        });
    }

    async function putObject(params, callback) {
        return new Promise(function (resolve, reject) {
            const command = new PutObjectCommand({ ...params, Bucket: s3_bucket });
            try {
                client.send(command).then(() => {
                    if (callback)
                        callback(null, "success");
                    resolve("success")
                });
            } catch (error) {
                reject(error);
                callback(error);
            }
        });
    }

    async function getObject(params, callback) {
        // var body = "";
        return new Promise(function (resolve) {
            const command = new GetObjectCommand({ ...params, Bucket: s3_bucket });
            try {
                client.send(command).then(function (data) {
                    callback(null, data)
                    resolve(data)
                    // if (data.Body && callback) {
                    //     data.Body.on('readable', function () {
                    //         var s = data.Body.read();
                    //         if (s)
                    //             body += s;
                    //     });
                    //     data.Body.on('end', function () {
                    //         callback(null, body)
                    //         resolve(body)
                    //     })
                    // }
                }).catch((error)=>{

                    // reject(error);
                    callback(error);
                }).finally(()=>{});
            } catch (error) {
                // reject(error);
                callback(error);
            }
        });
    }

    async function deleteObject(key, callback) {
        return new Promise(function (resolve, reject) {
            const command = new DeleteObjectCommand({ Bucket: s3_bucket, Key: key });
            try {
                client.send(command).then(() => {
                    if (callback)
                        callback(null, "success");
                    resolve("success")
                });
            } catch (error) {
                reject(error);
                callback(error);
            }
        });
    }

    
    // listObjects({}, (err, list) => console.log(list));

    return {
        listObjects,
        putObject,
        getObject,
        deleteObject
    }
    
    // await listData((list) => console.log(list));

    // await setData("test-key", "test-value", (body) => console.log(body));

    // await getData("test-key", (body) => console.log(body));

    // await listData((list) => console.log(list));
    
    // await rmData("test-key", (body) => console.log(body));

    // await listData((msg) => console.log(msg));
})();