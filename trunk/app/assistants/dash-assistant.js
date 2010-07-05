function DashAssistant(argFromPusher) {
	  this.passedArgument = argFromPusher;
}

DashAssistant.prototype.setup = function() {
	this.controller.get('info').update(this.passedArgument.message);
}