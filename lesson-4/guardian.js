const {Transform} = require('stream');


class Guardian extends Transform {
	constructor(options = {}) {
		super(options);
	}
	
	_transform(chunk, encoding, done) {
		
		const {
			meta,
			payload,
			payload: { email, password },
		} = chunk;
		
		const encryptedChunk = {
			meta,
			payload: {
				...payload,
				email: this._bcrypt(email),
				password: this._bcrypt(password),
			}
		};
		
		this.push(encryptedChunk);
		done();
	}
	
	/*
	* =)
	* */
	_bcrypt(data) {
		return Buffer.from(data).toString('hex');
	}
	
	_flush(done) {
		console.log('do something before stream is finished');
		
		done();
	}
}

module.exports = Guardian;