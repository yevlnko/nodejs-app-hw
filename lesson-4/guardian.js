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
				email: Buffer.from(email).toString('hex'),
				password: Buffer.from(password).toString('hex'),
			}
		};
		
		this.push(encryptedChunk);
		done();
	}
	
	_flush(done) {
		console.log('do something before stream is finished');
		
		done();
	}
}

module.exports = Guardian;