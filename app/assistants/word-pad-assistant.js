function WordPadAssistant() {
	
}

WordPadAssistant.prototype.setup = function() {
	
	
	this.controller.setupWidget('text',
         this.attributes = {
             hintText: $L('GPL2 Allrights Received'),
             multiline: true,
             focus: true,
             textCase: Mojo.Widget.steModeLowerCase
         },
         this.model = {}
    );
	this.panel = {
		text: $('text'),
		result: $('result'),
		select: $('select'),
		debug: $('debug'),
	};

	this.ime = new IME(this.panel);
	//this.ime.setSelectingWordsPageSize(5);
	//this.ime.setSelectingKeys([49, 50, 51, 52, 53]);
	
	this.appMenuModel = {
		visible: true,
		items: [
			Mojo.Menu.editItem,
			{label: $L('设置'), command: 'prefs'},
			{label: $L('帮助'), command: 'help'}
		]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {omitDefaultItems: true}, this.appMenuModel);
	
    this.cmdMenuModel = {
		items: [
			{
				toggleCmd:'imeOn',
				items:[
					{label: $L('中文'), command:'imeOn'},
					{label: $L('英文'), command:'imeOff'}
				]
			},
			{
				items:[
					{label: $L('短信'), command:'imeMessaging'},
					{label: $L('清空'), command:'imeClean'}
				]
			}
		]
	};
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
	this.controller.listen("text", Mojo.Event.propertyChange, this.textOnPropertyChange.bindAsEventListener(this));
}

WordPadAssistant.prototype.textOnPropertyChange = function(e) {
	var text = this.controller.get('text');
	var result = text.mojo.getValue();
	var pos = text.mojo.getCursorPosition();
	text.mojo.setCursorPosition(0, result.length);
	document.execCommand('copy');
	text.mojo.setCursorPosition(pos, pos);
};

WordPadAssistant.prototype.handleCommand = function(event) {
	if(event.type == Mojo.Event.command) {
		if(event.command == 'imeOn' || event.command == 'imeOff') {
			this.toggleChange();
		}
		if(event.command == 'imeCopy') {
			var text = this.controller.get('text');
			text.focus();
			text.mojo.setCursorPosition(0, text.mojo.getValue().length);
			this.controller.doExecCommand(event, 'copy');
		}
		if(event.command == 'imePaste') {
			this.controller.get('text').focus();
			PalmSystem.paste();
		}
		if(event.command == 'imeClean') {
			this.controller.get('text').mojo.setValue('');
		}
		if(event.command == 'imeMessaging') {
			this.controller.serviceRequest('palm://com.palm.applicationManager', {
     			method: 'launch',
     			parameters: {
         			id: "com.palm.app.messaging",
         			params: {
         				messageText: this.panel.text.mojo.getValue()
         			}
         		}
			});
		}
		if(event.command == 'prefs') {
			//Mojo.controller.stageController.assistant.showScene("preferences/preferences", 'preferences', this.db);
			Mojo.Controller.stageController.pushScene({'name': 'preferences', sceneTemplate: 'preferences/preferences-scene'}, false);
		}
	}
}

WordPadAssistant.prototype.toggleChange = function() {
	this.ime.toggleIme();
}

WordPadAssistant.prototype.deactivate = function(event) {
}

WordPadAssistant.prototype.cleanup = function(event) {
}