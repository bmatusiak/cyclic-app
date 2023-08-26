
var Gun = require('gun/gun');

Gun.on('create', function lg(root) {
	this.to.next(root);

	const CyclicDb = require("@cyclic.sh/dynamodb")
	const db = CyclicDb(process.env.CYCLIC_DB)
	const COLLECTION = "gun";

	root.on('get', function (msg) {
		this.to.next(msg);
		var lex = msg.get, soul;
		if (!lex || !(soul = lex['#'])) { return }
		db.collection(COLLECTION).get(soul).then((db_data) => {
			if (db_data && db_data.props) {
				var { value } = db_data.props;
				var data = JSON.parse(value), tmp;
				if (data && (tmp = lex['.']) && !Object.plain(tmp)) { // pluck!
					data = Gun.state.ify({}, tmp, Gun.state.is(data, tmp), data[tmp], soul);
				}
				Gun.on.get.ack(msg, data);
			}
		});
	});

	root.on('put', function (msg) {
		this.to.next(msg); // remember to call next middleware adapter
		var put = msg.put, soul = put['#'], key = put['.'], id = msg['#'];//, ok = msg.ok||'', tmp; // pull data off wire envelope

		db.collection(COLLECTION).get(soul).then((db_data) => {
			var data = {};
			if (db_data && db_data.props) {
				var { value } = db_data.props;
				data = JSON.parse(value);
			}

			data = Gun.state.ify(data, key, put['>'], put[':'], soul); // merge into disk object

			db.collection(COLLECTION).set(soul, { value: JSON.stringify(data) }).then(() => {
				root.on('in', { '@': id, err: null, ok: 0 });
			})
		});

	});
});
