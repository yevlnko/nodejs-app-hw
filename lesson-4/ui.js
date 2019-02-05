const {Readable} = require('stream');

class Ui extends Readable {
	constructor(data, options = {}) {
		super(options);
		
		this.data = data;
	}
	
	_read() {
		let data = this.data.shift();
		
		if (!data) {
			this.push(null);
		} else {
			
			data = {
				meta: {
					source: 'ui',
				},
				payload: {
					...data,
				}
			};
			
			this.push(data);
		}
	}
}

module.exports = Ui;