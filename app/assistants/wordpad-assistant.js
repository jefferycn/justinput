function WordpadAssistant() {
	
}

WordpadAssistant.prototype.setup = function() {
	var options = {
		name: "JustInput",
		version: 1,
		replace: false
	};
	this.panel = {
		text: $('text'),
		result: $('result'),
		select: $('select'),
		debug: $('debug')
	};
	this.db = new Database(
		"ext:JustInput", "1",
		this.loadDB.bind(this)
	);
	
	this.controller.setupWidget('text',
         this.attributes = {
             hintText: $L('GPL2 Allrights Received'),
             multiline: true,
             focus: true,
             textCase: Mojo.Widget.steModeLowerCase,
             changeOnKeyPress: true
         },
         this.model = {}
    );

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
}

WordpadAssistant.prototype.readRet = function(value) {
	Mojo.Log.info("read data = " + value);
	$('debug').update(value.join(","));
}

WordpadAssistant.prototype.loadDB = function(isReady) {
	Mojo.Log.info("loadDB; ready = " + isReady);
	if (isReady == false) {
		Mojo.Controller.errorDialog("can not open database");
		return;
	}
	
	// initial ime
	this.ime = new IME(this.panel, this.db);
}

WordpadAssistant.prototype.handleCommand = function(event) {
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
			Mojo.Controller.stageController.pushScene({'name': 'preferences', sceneTemplate: 'preferences/preferences-scene'}, this.db);
		}
	}
}

WordpadAssistant.prototype.dbGetWordsPageSizeSuccess = function(response){
	var wordsPageSize = 3;
	if(Object.isNumber(response)) {
		wordsPageSize = response;
	}
	config.wordsPageSize = wordsPageSize;
}

WordpadAssistant.prototype.dbGetSelectingKeysSuccess = function(response){
	var selectingKeys = [32, 64, 46];
	if(Object.isArray(response)) {
		selectingKeys = response;
	}
	config.selectingKeys = selectingKeys;
}

WordpadAssistant.prototype.dbGetWordsSuccess = function(response){
	var words = [];
	if(Object.isArray(response)) {
		words = response;
	}
	config.words = words;
}

WordpadAssistant.prototype.toggleChange = function() {
	this.ime.toggleIme();
}

WordpadAssistant.prototype.deactivate = function(event) {
}

WordpadAssistant.prototype.cleanup = function(event) {
	//this.db.simpleAdd('words', config.words);
}