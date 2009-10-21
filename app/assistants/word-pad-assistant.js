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
	try {
		/**
		this.db = openDatabase('JustInput', '', 'JustInput Data Store', 65536);
		try {
			// get database config
			var string = 'select * from config';
			this.db.transaction(
        		(function (transaction) {
            		transaction.executeSql(string, [], this.queryConfigHandler.bind(this), this.createConfigHandler.bind(this));
        		}).bind(this)
    		);
		}catch(e) {
			var string = 'CREATE TABLE config (id TEXT NOT NULL DEFAULT "", name TEXT NOT NULL DEFAULT ""); GO;';
			this.db.transaction(
	        	(function (transaction) {
					transaction.executeSql('DROP TABLE IF EXISTS config; GO;', []);
	            	transaction.executeSql(string, [], this.createTableDataHandler.bind(this), this.errorHandler.bind(this));
	        	}).bind(this)
	    	);
		}
		**/
	}catch(e) {
		$('debug').update(e);
	}
}


WordPadAssistant.prototype.deactivate = function(event) {
}

WordPadAssistant.prototype.cleanup = function(event) {
}

WordPadAssistant.prototype.errorHandler = function(transaction, error) { 
    console.log('Error was '+error.message+' (Code '+error.code+')'); 
    return true;
}

WordPadAssistant.prototype.queryConfigHandler = function(transaction, results) { 
    var string = "";
	try {
		if(results.rows.length > 0) {
			for (var i = 0; i < results.rows.length; i++) {
				var row = results.rows.item(i);
				var name;
				//string = "";
				for (name in row) {
					if (typeof row[name] !== 'function') {
						string = string + name + ': ' + row[name] + " | ";
					}
				}
			}
			$('debug').update(string);
		}else {
			
		}
		//update the list widget
		//this.resultList.clear();
		//Object.extend(this.resultList,list);
		//this.controller.modelChanged(this.listModel, this);
	}catch (e) {
		$('result').update(e);	
	} 
}