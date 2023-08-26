const CyclicDb = require("@cyclic.sh/dynamodb")
const db = CyclicDb("dull-tan-marlin-yokeCyclicDB")

const radata = db.collection("radata");

var Gun = require('gun/gun');

var u;

const store = {
	setItem: function (k, v, cb) {
		console.log("setItem", k, v)
		// this[k] = v;
		// cb ? cb() : u;

		radata.set(k, { value: v }).then(cb)

	},
	removeItem: function (k, cb) {
		delete this[k];
		cb ? cb() : u;
	},
	getItem: function (k, cb) {
		// cb ? cb(this[k]) : u;
		// return this[k];

		radata.get(k).then((data) => {
			console.log("getItem", k, data.props.value)
			cb(data.props.value)
		});

	}
}

// var parse = JSON.parseAsync || function (t, cb, r) { var u; try { cb(u, JSON.parse(t, r)) } catch (e) { cb(e) } }
var json = JSON.stringifyAsync || function (v, cb, r, s) { var u; try { cb(u, JSON.stringify(v, r, s)) } catch (e) { cb(e) } }

Gun.on('create', function lg(root) {
	this.to.next(root);
	var opt = root.opt, acks = [], disk, to, stop;
	if (false === opt.localStorage) { return }
	opt.prefix = opt.file || 'gun/';
	store.getItem(opt.prefix, function (size) {

		try {
			disk = lg[opt.prefix] = lg[opt.prefix] || JSON.parse(size) || {}; // TODO: Perf! This will block, should we care, since limited to 5MB anyways?
		} catch (e) { disk = lg[opt.prefix] = {}; }
		size = (size || '').length;

		root.on('get', function (msg) {
			this.to.next(msg);
			var lex = msg.get, soul, data, tmp, u;
			if (!lex || !(soul = lex['#'])) { return }
			data = disk[soul] || u;
			if (data && (tmp = lex['.']) && !Object.plain(tmp)) { // pluck!
				data = Gun.state.ify({}, tmp, Gun.state.is(data, tmp), data[tmp], soul);
			}
			//if(data){ (tmp = {})[soul] = data } // back into a graph.
			//setTimeout(function(){
			Gun.on.get.ack(msg, data); //root.on('in', {'@': msg['#'], put: tmp, lS:1});// || root.$});
			//}, Math.random() * 10); // FOR TESTING PURPOSES!
		});

		root.on('put', function (msg) {
			this.to.next(msg); // remember to call next middleware adapter
			var put = msg.put, soul = put['#'], key = put['.'], id = msg['#'], ok = msg.ok || ''; // pull data off wire envelope
			disk[soul] = Gun.state.ify(disk[soul], key, put['>'], put[':'], soul); // merge into disk object
			if (stop && size > (4999880)) { root.on('in', { '@': id, err: "localStorage max!" }); return; }
			//if(!msg['@']){ acks.push(id) } // then ack any non-ack write. // TODO: use batch id.
			if (!msg['@'] && (!msg._.via || Math.random() < (ok['@'] / ok['/']))) { acks.push(id) } // then ack any non-ack write. // TODO: use batch id.
			if (to) { return }
			to = setTimeout(flush, 9 + (size / 333)); // 0.1MB = 0.3s, 5MB = 15s 
		});
		function flush() {
			if (!acks.length && ((setTimeout.turn || '').s || '').length) { setTimeout(flush, 99); return; } // defer if "busy" && no saves.
			var ack = acks; clearTimeout(to); to = false; acks = [];
			json(disk, function (err, tmp) {
				try {
					!err && store.setItem(opt.prefix, tmp, function () {
						size = tmp.length;

						//if(!err && !Object.empty(opt.peers)){ return } // only ack if there are no peers. // Switch this to probabilistic mode
						setTimeout.each(ack, function (id) {
							root.on('in', { '@': id, err: err, ok: 0 }); // localStorage isn't reliable, so make its `ok` code be a low number.
						}, 0, 99);
					});
				} catch (e) { err = stop = e || "localStorage failure" }
				if (err) {
					Gun.log(err + " Consider using GUN's IndexedDB plugin for RAD for more storage space, https://gun.eco/docs/RAD#install");
					root.on('localStorage:error', { err: err, get: opt.prefix, put: disk });
				}

			})
		}

	})
});
