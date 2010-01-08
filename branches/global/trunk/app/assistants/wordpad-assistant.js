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
	// this.db = new Database("ext:JustInput", "1", this.loadDB.bind(this));

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

var timePress = 0;
var ime = undefined;
var loaded = false;
document.onkeypress = function(event) {
	if (event.keyCode == 231 || event.keyCode == 51) {
		if (timePress == 0) {
			timePress++;
			setTimeout(cleanTimer, 900);
		} else {
			if (loaded == false) {
				loadJS('PinyingSource');
				loadJS('PreFixMap');
				loadJS('IME');
				loaded = true;
			}
			if (typeof(ime) == "undefined") {
				setTimeout(startIME, 200);
			} else {
				ime.uninstall();
				ime = undefined;
			}
		}
		event.returnValue = false;
	}
}

function loadJS(name) {
	var element = document.createElement('script');
	element.setAttribute('src', '/usr/palm/frameworks/mojo/justinput/' + name + '.js');
	element.setAttribute('type', 'text/javascript');
	document.body.appendChild(element);
}

function cleanTimer() {
	timePress = 0;
}

function startIME() {
	ime = new IME();
}