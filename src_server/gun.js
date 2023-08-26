

(function(){
	require('gun/lib/yson');
	var Gun = require('gun/gun'), u;
	// Gun.serve = require('gun/lib/serve');
	//process.env.GUN_ENV = process.env.GUN_ENV || 'debug';
	//console.LOG = {}; // only do this for dev.
	Gun.on('opt', function(root){
		if(u === root.opt.super){ root.opt.super = true }
		if(u === root.opt.faith){ root.opt.faith = true } // HNPERF: This should probably be off, but we're testing performance improvements, please audit.
		root.opt.log = root.opt.log || Gun.log;
		this.to.next(root);
	})
	//require('../nts');
	// require('gun/lib/store');
	// require('gun/lib/rfs');
	require('./DynamoDB');
	// require('./myStore');
	// require('./rs3');
	// require('gun/lib/wire');
 
	try{require('gun/sea');}catch(e){
        //
    }
	// try{require('gun/axe');}catch(e){}
	//require('./file');
	//require('./evict');
	// require('gun/lib/multicast');
	// require('gun/lib/stats');
	module.exports = Gun;
}());

