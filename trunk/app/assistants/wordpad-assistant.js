function WordpadAssistant() {

}

WordpadAssistant.prototype.setup = function() {
	this.controller.setupWidget('text', this.attributes = {
				multiline : true,
				focus : true,
				textCase : Mojo.Widget.steModeLowerCase,
				changeOnKeyPress : true
			}, this.model = {});

	// document.observe('keypress', this.turnOn.bind(this));

	// var target = Mojo.View.getFocusedElement(this.controller.sceneElement);
	// Mojo.Log.info("initialize ======> " +
	// Mojo.Log.propertiesAsString(this.text));

	this.appMenuModel = {
		visible : true,
		items : [Mojo.Menu.editItem, {
					label : $L('Help'),
					command : 'help'
				}]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {
				omitDefaultItems : true
			}, this.appMenuModel);

	this.buttonModel = {
		buttonLabel : "清空",
		buttonClass : 'secondary'
	};
	this.controller.setupWidget('empty', {
				type : 'default'
			}, this.buttonModel);
	$('empty').observe('click', this.emptyText.bind(this), true);
	$('text').observe(Mojo.Event.propertyChange, this.textOnPropertyChange.bind(this), true);
}

WordpadAssistant.prototype.textOnPropertyChange = function(e) {
	var text = $('text');
	var result = text.mojo.getValue();
	if (!result) {
		return false;
	}
	var pos = text.mojo.getCursorPosition();
	text.mojo.setCursorPosition(0, result.length);
	document.execCommand('copy');
	text.mojo.setCursorPosition(pos.selectionStart, pos.selectionStart);
}

WordpadAssistant.prototype.emptyText = function(event) {
	$('text').mojo.setValue('');
}

WordpadAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		if (event.command == 'help') {
			Mojo.Controller.stageController.pushScene({
						'name' : 'help',
						sceneTemplate : 'help/help-scene'
					});
		}
	}
}

WordpadAssistant.prototype.deactivate = function(event) {
}

WordpadAssistant.prototype.cleanup = function(event) {
}