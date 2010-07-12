function DashAssistant(argFromPusher) {
	  this.passedArgument = argFromPusher;
}

DashAssistant.prototype.setup = function() {
	this.controller.get('info').update(this.passedArgument.message);
	this.controller.listen(this.controller.get('info'), Mojo.Event.tap, this.handleApp.bind(this));
}

DashAssistant.prototype.handleApp = function() {
	this.controller.serviceRequest('palm://com.palm.applicationManager', {
	                    method: 'open',
	                    parameters: {
							id: 'com.youjf.justinput',
						}
	                });
}