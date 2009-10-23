function PreferencesAssistant(arg) {
	this.db = arg;
	this.wordsPageSize = 3;
}

PreferencesAssistant.prototype.setup = function() {
    this.db.simpleGet('wordsPageSize', this.dbGetWordsPageSizeSuccess, this.dbFailure);
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
    	this.controller.listen(this.controller.get('selecting_' + i),Mojo.Event.tap, this.setSelecting.curry(i).bind(this));
    }
};

PreferencesAssistant.prototype.setSelecting = function(index) {
	this.db.simpleGet('wordsPageSize', this.dbGetWordsPageSizeSuccess, this.dbFailure);
	this.controller.showAlertDialog({
				    title: $L("Prefs Menu"),
				    message: $L("You have selected the prefs menu: ") + this.wordsPageSize,
					choices:[
         				{label:$L('Thanks'), value:"refresh", type:'affirmative'}
						]
				    });	
}

// Deactivate - save News preferences and globals
PreferencesAssistant.prototype.deactivate = function() {
};

// Cleanup - remove listeners
PreferencesAssistant.prototype.cleanup = function() {
    this.controller.stopListening("wordsPageSize", Mojo.Event.propertyChange, this.changeWordsPageSizeHandler);
    
    for(var i = 0; i < 8; i++) {
    	this.controller.stopListening(this.controller.get('selecting_' + i),Mojo.Event.tap, this.setSelecting.curry(i).bind(this));
    }
};

//    changeFeatureDelay - Handle changes to the feature feed interval
PreferencesAssistant.prototype.changeWordsPageSize = function(event) {
	// save data to db
	this.data = {'wordsPageSize': this.wordsPageSizeModel.value};
	this.db.simpleAdd('wordsPageSize', this.data, this.dbSuccess, this.dbFailure);
	this.db.simpleGet('wordsPageSize', this.dbGetWordsPageSizeSuccess, this.dbFailure);
};

PreferencesAssistant.prototype.dbGetWordsPageSizeSuccess = function(response){
	var recordSize = Object.values(response).size();
	if(recordSize == 0) {
		// no data something here
	} else {
		this.wordsPageSize = response.wordsPageSize;
	}
	
	this.controller.showAlertDialog({
		title: $L("Error"),
		message: $L("Database operation failure: ") + this.wordsPageSize,
		choices:[
        	{label:$L('Thanks'), value:"refresh", type:'affirmative'}
		]
	});
}

PreferencesAssistant.prototype.dbSuccess = function() {
}

PreferencesAssistant.prototype.dbFailure = function(transaction, result) {
	this.controller.showAlertDialog({
		title: $L("Error"),
		message: $L("Database operation failure: ") + result.message,
		choices:[
        	{label:$L('Thanks'), value:"refresh", type:'affirmative'}
		]
	});
}