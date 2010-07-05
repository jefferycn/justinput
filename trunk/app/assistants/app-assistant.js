function AppAssistant() {
}

AppAssistant.prototype.handleLaunch = function(params) {
	if (params && params.action) {
                switch (params.action) {
                        default:
                                this.launchWordPad();
                                break;
                }
        } else {
                this.launchWordPad();
        }
}

AppAssistant.prototype.launchWordPad = function() {
	var f = function(stageController) {
    	stageController.pushScene('wordpad');
    }.bind(this);
    this.controller.createStageWithCallback({name: 'wordpad', lightweight: true}, f);
	//this.controller.pushScene('wordpad');
}