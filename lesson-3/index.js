const EventEmitter = require('events').EventEmitter;
const getUniqueID = require('./getUniqueID');

class Bank extends EventEmitter {
	
	constructor() {
		super();
		this.users = {};
		
		this.on('add', this._add);
		this.on('get', this._get);
		this.on('withdraw', this._withdraw);
		this.on('send', this._send);
		this.on('error', this._errorHandler);
	}
	
	register(user) {
		const {
			name,
			balance,
		} = user;
		
		const newUserValidate = (name, balance) => {
			if (balance <= 0 || !name.length) {
				this.emit('error', 'Register: Invalid user data, check user name or balance!');
				return false;
			}
			
			return true;
		};
		
		if (newUserValidate(name, balance)) {
			const userID = getUniqueID(16);
			this.users[userID] = {
				user: name,
				balance: balance,
			};
			
			return userID;
		}
		
	}
	
	_add(...data) {
		const [
			userID,
			value,
		] = data;
		
		const addValueValidate = (value) => {
			if (value <= 0) {
				this.emit('error', 'Add: Invalid value for add!');
				return false;
			}
			
			return true;
		};
		
		if (addValueValidate(value) && this._checkUserAvailability(userID)) {
			const newUserBalance = this.users[userID].balance + value;
			this.users[userID].balance = newUserBalance;
		}
		
	}
	
	_get(...data) {
		const [
			userID,
			callback,
		] = data;
		
		if (this._checkUserAvailability(userID)) {
			const userAvailableBalance = this.users[userID].balance;
			callback(userAvailableBalance);
		}
	}
	
	_withdraw(...data) {
		const [
			userID,
			value,
		] = data;
		
		const newUserBalance = this.users[userID].balance - value;
		
		const withDrawValueValidate = (value, newUserBalance) => {
			if (value <= 0 || newUserBalance < 0) {
				this.emit('error', 'WithDraw: Invalid value for withdraw or user has so much money!');
				return false;
			}
			
			return true;
		};
		
		if (withDrawValueValidate(value, newUserBalance)) {
			this.users[userID].balance = newUserBalance;
		}
	}
	
	_send(...data) {
		const [
			fromUserID,
			toUserID,
			value,
		] = data;
		
		if (this._checkUserAvailability(fromUserID, toUserID)) {
			this.emit('withdraw', fromUserID, value);
			this.emit('add', toUserID, value);
		}
	}
	
	_errorHandler(error) {
		console.log(error);
		
		return false;
	}
	
	_checkUserAvailability(...usersID) {
		
		const valid = usersID.map((item) => {
			if (typeof this.users[item] == 'undefined') {
				
				return false;
			}
			
		});
		
		if (valid.includes(false)) {
			this.emit('error', 'Invalid user ID!');
			
			return false;
		}
		
		return true;
	}
}

const bank = new Bank();

const personId = bank.register({
	name: 'Jone Dou',
	balance: 100,
});

const personSecondId = bank.register({
	name: 'Oliver White',
	balance: 700,
});

bank.emit('add', personId, 20);
bank.emit('add', personId, 120);
bank.emit('withdraw', personId, 40);
bank.emit('send', personId, personSecondId, 50);

bank.emit('get', personId, (balance) => {
	console.log(`PersonId have ${balance}₴`);
});
bank.emit('get', personSecondId, (balance) => {
	console.log(`PersonSecondId have ${balance}₴`);
});

