function WordpadAssistant() {

}

WordpadAssistant.prototype.setup = function() {
	this.controller.setupWidget('text', this.attributes = {
				multiline : true,
				focus : true,
				textCase : Mojo.Widget.steModeLowerCase,
				changeOnKeyPress : true
			}, this.model = {});

	this.timePress = 0;
	//document.observe('keypress', this.turnOn.bind(this));
	this.db = new Database("ext:JustInput", "1", this.loadDB.bind(this));

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

	this.cmdMenuModel = {
		items : [{
					toggleCmd : 'imeOn',
					items : [{
								label : $L('中文'),
								command : 'imeOn'
							}, {
								label : $L('英文'),
								command : 'imeOff'
							}]
				}, {
					items : [{
								label : $L('短信'),
								command : 'imeMessaging'
							}, {
								label : $L('清空'),
								command : 'imeClean'
							}]
				}]
	};
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined,
			this.cmdMenuModel);
}

WordpadAssistant.prototype.turnOn = function(event) {
	if (event.keyCode == 231 || event.keyCode == 51) {
		if (this.timePress == 0) {
			this.timePress++;
			setTimeout('this.timePress = 0', 1250);
		} else {
			// Mojo.Log.info("text => " +
			// Mojo.Log.propertiesAsString($('text')));
			// Mojo.Log.info("turnOn => " +
			// Mojo.Log.propertiesAsString(this.controller));
			if (typeof(this.ime) == "undefined") {
				this.db = new Database("ext:JustInput", "1", this.loadDB.bind(this));
			}
		}
		event.returnValue = false;
	}
}

WordpadAssistant.prototype.loadDB = function(isReady) {
	// Mojo.Log.info("loadDB; ready = " + isReady);
	if (isReady == false) {
		Mojo.Controller.errorDialog("can not open database");
		return;
	}
	var target = Mojo.View.getFocusedElement(this.controller.sceneElement);
	this.ime = new IME(target, this.db);
}

WordpadAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		if (event.command == 'imeOn' || event.command == 'imeOff') {
			this.toggleChange();
		}
		if (event.command == 'imeCopy') {
			var text = this.controller.get('text');
			text.focus();
			text.mojo.setCursorPosition(0, text.mojo.getValue().length);
			this.controller.doExecCommand(event, 'copy');
		}
		if (event.command == 'imePaste') {
			this.controller.get('text').focus();
			PalmSystem.paste();
		}
		if (event.command == 'imeClean') {
			this.controller.get('text').mojo.setValue('');
		}
		if (event.command == 'imeMessaging') {
			this.controller.serviceRequest(
					'palm://com.palm.applicationManager', {
						method : 'launch',
						parameters : {
							id : "com.palm.app.messaging",
							params : {
								messageText : $('text').mojo.getValue()
							}
						}
					});
		}
		if (event.command == 'help') {
			Mojo.Controller.stageController.pushScene({
						'name' : 'help',
						sceneTemplate : 'help/help-scene'
					});
		}
	}
}

WordpadAssistant.prototype.toggleChange = function() {
	this.ime.toggleIme();
}

WordpadAssistant.prototype.deactivate = function(event) {
}

WordpadAssistant.prototype.cleanup = function(event) {
}