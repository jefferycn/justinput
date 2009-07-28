function WordPadAssistant() {
	/* this is the creator function for your scene assistant object. It will be passed all the 
	   additional parameters (after the scene name) that were passed to pushScene. The reference
	   to the scene controller (this.controller) has not be established yet, so any initialization
	   that needs the scene controller should be done in the setup function below. */
}

WordPadAssistant.prototype.setup = function() {
	/* this function is for setup tasks that have to happen when the scene is first created */
	this.controller.setupWidget('text',
         this.attributes = {
             hintText: $L('youjf.com'),
             multiline: true,
             focus: true,
             textCase: Mojo.Widget.steModeLowerCase
         },
         this.model = {}
    );
    this.controller.setupWidget('result',
         this.attributes = {
             multiline: false
         },
         this.model = {
            disabled: true
    });
    this.controller.setupWidget('select',
         this.attributes = {
             multiline: true
         },
         this.model = {
            disabled: true
    });
	var panel = {
		text: $('text'),
		//input: $('input'),
		result: $('result'),
		select: $('select')
	};
	// space = 32
	this.ime = new IME(panel);
	//ime.init(panel)
	
	this.controller.setupWidget('toggle',
		this.attributes = {
            modelProperty: "value",
			trueValue: "true",
			trueLabel: 'Yes',
			falseValue: "false",
			falseLabel: 'No'
        },
		this.model = {
			value: 'true',
            disabled: false
    });
    
    this.controller.listen("toggle",
    	Mojo.Event.propertyChange,
    	this.toggleChange.bindAsEventListener(this)
    );
    
	/* use Mojo.View.render to render view templates and add them to the scene, if needed. */
	
	/* setup widgets here */
	
	/* add event handlers to listen to events from widgets */
}

WordPadAssistant.prototype.toggleChange = function() {
	this.ime.toggleIme();
}

WordPadAssistant.prototype.activate = function(event) {
	/* put in event handlers here that should only be in effect when this scene is active. For
	   example, key handlers that are observing the document */
}


WordPadAssistant.prototype.deactivate = function(event) {
	/* remove any event handlers you added in activate and do any other cleanup that should happen before
	   this scene is popped or another scene is pushed on top */
}

WordPadAssistant.prototype.cleanup = function(event) {
	/* this function should do any cleanup needed before the scene is destroyed as 
	   a result of being popped off the scene stack */
}
