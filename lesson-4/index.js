const Ui = require('./ui');
const Guardian = require('./guardian');
const AccountManager = require('./manager');

const customers = [
	{
		name: 'Pitter Black',
		email: 'pblack@email.com',
		password: 'pblack_123',
	},
	{
		name: 'Oliver White',
		email: 'owhite@email.com',
		password: 'owhite_456',
	}
];

const readOptions = {
	objectMode: true
};
const ui = new Ui(customers, readOptions);

const transformOptions = {
	objectMode: true,
};
const guardian = new Guardian(transformOptions);

const writeOptions = {
	objectMode: true
};
const manager = new AccountManager(writeOptions);

ui.pipe(guardian).pipe(manager);

ui.on('error', ({message}) => {
		console.log(message);
		process.exit(1);
	})
	.pipe(guardian)
	.on('error', ({message}) => {
		console.log(message);
		process.exit(1);
	})
	.pipe(manager)
	.on('error', ({message}) => {
		console.log(message);
		process.exit(1);
	});