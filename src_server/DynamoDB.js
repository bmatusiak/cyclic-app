
var Gun = require('gun/gun');

Gun.on('create', function lg(root) {
	this.to.next(root);

	const CyclicDb = require("@cyclic.sh/dynamodb")
	const db = CyclicDb(process.env.CYCLIC_DB);
	const COLLECTION = "gun";
	const collection = db.collection(COLLECTION);

	root.on('get', function (msg) {
		this.to.next(msg);
		var lex = msg.get, soul;
		if (!lex || !(soul = lex['#'])) { return }//no soul request?
		collection.get(soul).then((db_data) => {//get soul
			if (db_data && db_data.props) {
				var { value } = db_data.props;
				var data = JSON.parse(value), key;
				if (data && (key = lex['.']) && !Object.plain(key)) {
					data = Gun.state.ify({}, key, Gun.state.is(data, key), data[key], soul);//merge that soul with new soul
				}
				Gun.on.get.ack(msg, data);//ack the soul
			}
		});
	});

	root.on('put', function (msg) {
		this.to.next(msg);
		var lex = msg.put, soul = lex['#'], key = lex['.'], id = msg['#'];
		collection.get(soul).then((db_data) => {//fetch current soul
			var data = {};//prerend we have a soul
			if (db_data && db_data.props) {
				var { value } = db_data.props;
				data = JSON.parse(value);//we do have a soul
			}
			data = Gun.state.ify(data, key, lex['>'], lex[':'], soul); //merge that soul with my soul

			collection.set(soul, { value: JSON.stringify(data) }).then(() => {//save new soul
				root.on('in', { '@': id, err: null, ok: 0 });//ack that we saved it
			})
		});

	});
});
