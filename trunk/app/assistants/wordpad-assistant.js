function WordpadAssistant() {

}

WordpadAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible : true,
		items : [Mojo.Menu.editItem, {
					label : $L('Donators'),
					command : 'help'
				}]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {
				omitDefaultItems : true
			}, this.appMenuModel);
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