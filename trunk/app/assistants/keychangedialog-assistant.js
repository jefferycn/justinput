function KeyChangeDialogAssistant(sceneAssistant, callbackFunc, index) {
	this.callbackFunc = callbackFunc;
	this.sceneAssistant = sceneAssistant;
	this.controller = sceneAssistant.controller;
	this.index = index;
}

KeyChangeDialogAssistant.prototype.setup = function(widget) {
	this.widget = widget;
	this.save = this.save.bindAsEventListener(this);
	this.cancel = this.cancel.bindAsEventListener(this);
	Mojo.Event.listen(this.widget, Mojo.Event.keypress, this.save);
	Mojo.Event.listen(this.controller.get('cancel'), Mojo.Event.tap, this.cancel);
}

KeyChangeDialogAssistant.prototype.save = function(event){
	var keyCode = event.originalEvent.keyCode;
	if(keyCode >= 97 && keyCode <= 122 || keyCode == 39 || keyCode == 44 || keyCode == 95 || keyCode >= 65 && keyCode <= 90) {
		$('message').update('You can not use this key as a slecting key');
	}else {
		$('message').update(keyCode);
		config.selectingKeys[this.index] = keyCode;
		this.callbackFunc(keyCode, this.index);
		this.widget.mojo.close();
	}
}

KeyChangeDialogAssistant.prototype.cancel = function(event) {
	  this.widget.mojo.close();
}

KeyChangeDialogAssistant.prototype.activate = function(event) {
}

KeyChangeDialogAssistant.prototype.deactivate = function(event) {
}

KeyChangeDialogAssistant.prototype.cleanup = function(event) {
	Mojo.Event.stopListening(this.controller.get('cancel'), Mojo.Event.tap, this.cancel);
}