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
		//debug: $('debug'),
		select: $('select')
	};

	this.ime = new IME(this.panel);
	
    this.cmdMenuModel = {
		items: [
			{
				toggleCmd:'imeOn',
				items:[
					{label: $L('中'), command:'imeOn'},
					{label: $L('英'), command:'imeOff'}
				]
			},
			{
				items:[
					{label: $L('M'), command:'imeMessaging'}
				]
			},
			{
				items:[
					{label: $L('复'), command:'imeCopy'}
				]
			},
			{
				items:[
					{label: $L('粘'), command:'imePaste'}
				]
			},
			{
				items:[
					{label: $L('清'), command:'imeClean'}
				]
			}
		]
	};
	
	this.controller.setupWidget(Mojo.Menu.commandMenu, undefined, this.cmdMenuModel);
}

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
	}
}

WordPadAssistant.prototype.toggleChange = function() {
	this.ime.toggleIme();
}

WordPadAssistant.prototype.activate = function(event) {
}


WordPadAssistant.prototype.deactivate = function(event) {
}

WordPadAssistant.prototype.cleanup = function(event) {
}
