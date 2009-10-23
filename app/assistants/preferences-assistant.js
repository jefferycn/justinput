function PreferencesAssistant(db) {
	this.db = db;
	this.wordsPageSize = config.wordsPageSize;
}

PreferencesAssistant.prototype.setup = function() {
    this.controller.setupWidget("wordsPageSize",
    {
        label: $L("候选词数量"),
        modelProperty: "value",
        min: 3,
        max: 8
    },
    this.wordsPageSizeModel = {
        value : this.wordsPageSize
    });

    this.changeWordsPageSizeHandler = this.changeWordsPageSize.bindAsEventListener(this);
    this.controller.listen("wordsPageSize", Mojo.Event.propertyChange, this.changeWordsPageSizeHandler);
    
    for(var i = 0; i < 8; i++) {
    	if(i >= this.wordsPageSize) {
    		this.controller.get('selecting_' + i).hide();
    	}
    	var buttonLabel = '';
    	if(config.selectingKeys[i] == 32) {
    		buttonLabel = i + 1 + ': ' + $L("空格");
    	}else {
    		buttonLabel = i + 1 + ': ' + String.fromCharCode(config.selectingKeys[i]);
    	}
		this.controller.get('selecting_' + i).update(buttonLabel);
    	this.controller.get('selecting_' + i).observe(Mojo.Event.tap, this.setSelecting.curry(i).bindAsEventListener(this));
    }
};

PreferencesAssistant.prototype.setSelecting = function(index) {
	this.controller.showDialog({
		template: 'preferences/keychangedialog-scene',
		assistant: new KeyChangeDialogAssistant(this, this.callback.bind(this), index),
		preventCancel: true
	});
}

PreferencesAssistant.prototype.callback = function(key, index) {
	var buttonLabel = '';
	if(key == 32) {
		buttonLabel = index + 1 + ': ' + $L("空格");
	}else {
		buttonLabel = index + 1 + ': ' + String.fromCharCode(key);
	}
	this.controller.get('selecting_' + index).update(buttonLabel);
	this.db.simpleAdd('selectingKeys', config.selectingKeys);
}

PreferencesAssistant.prototype.deactivate = function() {
};

PreferencesAssistant.prototype.cleanup = function() {
    this.controller.stopListening("wordsPageSize", Mojo.Event.propertyChange, this.changeWordsPageSizeHandler);
    
    for(var i = 0; i < 8; i++) {
    	this.controller.stopListening(this.controller.get('selecting_' + i),Mojo.Event.tap, this.setSelecting.curry(i).bind(this));
    }
};

PreferencesAssistant.prototype.changeWordsPageSize = function(event) {
	// save data to db
	config.wordsPageSize = this.wordsPageSizeModel.value;
	for(var i = this.wordsPageSizeModel.value; i <= 8; i ++) {
		config.selectingKeys[i] = null;
	}
	for(var i = 0; i < 8; i++) {
    	if(i >= this.wordsPageSizeModel.value) {
    		this.controller.get('selecting_' + i).hide();
    		this.controller.get('selecting_' + i).update('');
    	}else {
    		this.controller.get('selecting_' + i).show();
    	}
	}
	this.db.simpleAdd('wordsPageSizeSetting', this.wordsPageSizeModel.value);
};