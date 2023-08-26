var Gun = require('gun/gun');
var u, s3;

Gun.on('create', function (root) {
	this.to.next(root);
	var opt = root.opt;
	// if(opt.s3){
		s3 = require('./s3');
		opt.s3 = s3;
		opt.rfs = false;
		opt.store = Store(opt);
	// }

});

function Store(opt) {
	opt = opt || {};
	opt.file = String(opt.file || 'radata');
	var c = { p: {}, g: {}, l: {} };

	var store = function Store() { };
	if (Store[opt.file]) {
		console.log("Warning: reusing same S3 store and options as 1st.");
		return Store[opt.file];
	}
	Store[opt.file] = store;

	store.put = function (file, data, cb) {
		var params = { Key: file, Body: data };
		console.log("store.put",params);
		//console.log("RS3 PUT ---->", (data||"").slice(0,20));
		c.p[file] = data;
		delete c.g[file];//Gun.obj.del(c.g, file);
		delete c.l[1];//Gun.obj.del(c.l, 1);
		s3.putObject(params, function (err, ok) {
			ok;
			delete c.p[file];
			cb(err, 's3');
		});
	};
	store.get = function (file, cb) {
		var tmp;
		tmp = c.p[file]
		if (tmp) { cb(u, tmp); return }
		tmp = c.g[file]
		if (tmp) { tmp.push(cb); return }
		var cbs = c.g[file] = [cb];
		var params = { Key: file || '' };
		//console.log("RS3 GET ---->", file);
		function buildBody(data, callback) {
			var body = "";
			if (data.Body && callback) {
				data.Body.on('readable', function () {
					var s = data.Body.read();
					if (s)
						body += s;
				});
				data.Body.on('end', function () {
					callback(body)
				})
			}
		}
		
		console.log("store.get",params);
		s3.getObject(params, function got(err, ack) {
			if (err && 'NoSuchKey' === err.Code) { err = u }
			//console.log("RS3 GOT <----", err, file, cbs.length, ((ack||{}).Body||'').length);//.toString().slice(0,20));
			delete c.g[file];//Gun.obj.del(c.g, file);

			buildBody(ack,(data)=>{
				var i = 0, cba = cbs[i++]; while (cba) { cba && cba(err, data); cba = cbs[i++] }//Gun.obj.map(cbs, cbe);
			})

			// var data = (ack || '').Body;
			//console.log(1, process.memoryUsage().heapUsed);
			// var i = 0, cba = cbs[i++]; while (cba) { cba && cba(err, data); cba = cbs[i++] }//Gun.obj.map(cbs, cbe);
		});
	};
	/*
	store.list = function (cb, match, params, cbs) {
		if (!cbs) {
			if (c.l[1]) { return c.l[1].push(cb) }
			cbs = c.l[1] = [cb];
		}
		params = params || {};
		//console.log("RS3 LIST --->");
		s3.listObjects(params, function (err, data) {
			//console.log("RS3 LIST <---", err, data, cbs.length);
			if (err) { return Gun.log(err, err.stack) }
			var IT = data.IsTruncated, cbe = function (cb) {
				if (cb.end) { return }
				if (Gun.obj.map(data.Contents, function (content) {
					return cb(content.Key);
				})) { cb.end = true; return }
				if (IT) { return }
				// Stream interface requires a final call to know when to be done.
				cb.end = true; cb();
			};
			cbe;
			Gun.obj.map(cbs, cbe); // lets see if fixes heroku
			if (!IT) { delete c.l[1]; return }
			params.ContinuationToken = data.NextContinuationToken;
			store.list(cb, match, params, cbs);
		});
	};
	*/
	//store.list(function(){ return true });
	// if (false !== opt.rfs) { require('./rfsmix')(opt, store) } // ugly, but gotta move fast for now.
	return store;
}

module.exports = Store;
