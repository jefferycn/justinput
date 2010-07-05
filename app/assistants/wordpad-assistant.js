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
			this.showDashboard();
}

WordpadAssistant.prototype.showDashboard = function() {
	var stageName = "JustDash";

        var dashStage = Mojo.Controller.appController.getStageProxy(stageName);

        if (dashStage) {
        	return;
                //dashStage.delegateToSceneAssistant("update");
        } else {
                var f = function(stageController){
                        stageController.pushScene({name: 'dash',
					       		   		   sceneTemplate: "wordpad/dash-scene"},
										   {
										 	  message: "I'm a dashboard stage.",
											  stage: stageName
										   });
                };
                Mojo.Controller.appController.createStageWithCallback({
                                name: stageName,
                                                lightweight: true
                                }, f, 'dashboard');
        }
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