class TimersManager {
	
	constructor() {
		this.timers = [];
		this.log = [];
		this.status = false;
	}
	
	add(timer, ...jobOptions) {
		
		const {
			name,
			delay,
			interval,
			job
		} = timer;
		
		if (this._validation(timer)) {
			
			const timerObj = {
				name: name,
				create: () => {
					const timerFn = interval ? setInterval : setTimeout;
					
					timerObj.timerID = timerFn(
						(job, jobOptions) => {
							
							let jobResult;
							let logOptions = {};
							let logOptionsErrors = false;
							
							try {
								jobResult = job(...jobOptions);
							} catch (e) {
								logOptionsErrors = {
									name: e.name, // Error name
									message: e.message, // Error message
									stack: e.stack // Error stacktrace
								}
							}
							
							logOptions = {
								name: timerObj.name,
								in: [...jobOptions],
								out: jobResult || null,
								error: logOptionsErrors,
								create: Date(Date.now()).toString(),
							};
							
							this._log(logOptions);
						},
						delay,
						job,
						jobOptions,
					);
				},
				start: () => {
					timerObj.create();
				},
				stop: () => {
					const clearTimerFn = interval ? clearInterval : clearTimeout;
					clearTimerFn(timerObj.timerID);
				}
			};
			
			this.timers.push(timerObj);
		}
		
		return this;
	}
	
	remove(timer) {
		this.stop(timer);
		
		let timerIndex;
		this.timers.forEach((thisTimer, index) => {
			if (timer.name == thisTimer.name) {
				timerIndex = index;
			}
		});
		
		this.timers.splice(timerIndex, 1);
		
		return this;
	}
	
	start(timer) {
		this.timers.forEach((thisTimer) => {
			
			if (!timer) {
				thisTimer.start();
			} else if (timer.name == thisTimer.name) {
				thisTimer.start();
			}
			
		});
		
		this.status = true;
		
		return this;
	}
	
	stop(timer) {
		this.timers.forEach((thisTimer) => {
			
			if (!timer) {
				thisTimer.stop();
			} else if (timer.name == thisTimer.name) {
				thisTimer.stop();
			}
			
		});
	}
	
	pause(timer) {
		this.stop(timer);
		
		return this;
	}
	
	resume(timer) {
		this.start(timer);
		
		return this;
	}
	
	print() {
		console.log(this.log);
		
		return this;
	}
	
	_log(options) {
		
		const {
			name,
			in: incoming,
			out,
			created,
			error,
		} = options;
		
		const logObject = {
			name: name,
			in: incoming,
			out: out,
			create: created,
		};
		
		if (error) {
			logObject.error = error;
		}
		
		this.log.push(logObject);
	}
	
	_validation(timer) {
		const {
			name,
			delay,
			interval,
			job
		} = timer;
		
		// check start processing
		if (this.status) {
			console.log('Timers are already running, soryan!');
			return false;
		}
		
		// check Availability timer
		this.timers.forEach((thisTimer) => {
			if (timer.name == thisTimer.name) {
				console.log('You have timer with same name!');
				return false;
			}
		});
		
		// name validation
		if (typeof name != 'string' || name.length == 0) {
			console.log('Invalid name!');
			return false;
		}
		// delay validation
		if (typeof delay != 'number' || (delay < 0 || delay > 5000)) {
			console.log('Invalid delay!');
			return false;
		}
		// interval validation
		if (typeof interval != 'boolean') {
			console.log('Invalid interval!');
			return false;
		}
		// job validation
		if (typeof job != 'function') {
			console.log('Invalid job!');
			return false;
		}
		
		return true;
	}
}

const t1 = {
	name: 't1',
	delay: 1000,
	interval: true,
	job: () => {
		console.log(t1.name);
	}
};
const t2 = {
	name: 't2',
	delay: 1100,
	interval: true,
	job: (a, b) => {
		console.log(t2.name, a + b);
		return a + b;
	},
};

const t3 = {
	name: 't3',
	delay: 1000,
	interval: true,
	job: (a, b) => {
		console.log(t3.name, a + b);
		window.call();
		return a + b;
	},
};

const t4 = {
	name: 't4',
	delay: 1000,
	interval: true,
	job: (a, b) => {
		console.log(t4.name, a + b);
		return a + b;
	},
};

const manager = new TimersManager();

manager
	.add(t1)
	.add(t2, 1, 2)
	.add(t3, 2, 4)
	.add(t4, 12, 42)
	.remove(t2)
	.start();


setTimeout(() => {
	manager.pause(t2).pause(t3);
}, 2000);

setTimeout(() => {
	manager.resume(t2).resume(t3);
}, 4000);

setTimeout(() => {
	manager.stop();
	manager.print();
}, 6000);