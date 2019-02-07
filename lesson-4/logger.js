const {Transform} = require('stream');


class Logger extends Transform {
	constructor(options = {}, loggerDB) {
		super(options);
		this.db = loggerDB;
	}
	
	_transform(chunk, encoding, done) {
		
		const data = {
			data: chunk,
			name: Logger.name,
			instance: this
		};
		
		this.db.save(chunk);
		
		this.push(chunk);
		done();
	}
	
}

module.exports = Logger;