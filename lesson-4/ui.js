const {Readable} = require('stream');
const validate = require('./help/validate');

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
			
			const modifyData = {
				meta: {
					source: 'ui',
				},
				payload: {
					...data,
				}
			};
			
			const validateData = {
				data: modifyData,
				name: 'Ui',
				instance: this,
			};
			
			validate(validateData);
			
			this.push(modifyData);
		}
	}
}

module.exports = Ui;