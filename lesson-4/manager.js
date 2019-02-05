const {Writable} = require('stream');

class AccountManager extends Writable {
	constructor(options = {}) {
		super(options);
	}
	
	_write(chunk, encoding, done) {
		const {
			payload,
		} = chunk;
		console.log(payload);
		done();
	}
}

module.exports = AccountManager;