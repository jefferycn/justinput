function AppAssistant() {
}

AppAssistant.prototype.handleLaunch = function(params) {
	if (params && params.action) {
                switch (params.action) {
                        default:
                                this.launchDesktop();
                                break;
                }
        } else {
                this.launchDesktop();
        }
}

AppAssistant.prototype.launchDesktop = function() {
	var stageName = "justin-desktop";
	var dashStage = Mojo.Controller.appController.getStageProxy(stageName);

    if (dashStage) {
        dashStage.activate();
    } else {
		var f = function(stageController) {
    		stageController.pushScene('desktop');
    	}.bind(this);
    	this.controller.createStageWithCallback({name: stageName, lightweight: true}, f);
    }
}