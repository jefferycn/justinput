function DesktopAssistant() {
	this.choices = [];
}

DesktopAssistant.prototype.setup = function() {
	this.appMenuModel = {
		visible : true,
		items : [Mojo.Menu.editItem, {
					label : $L('Donate'),
					command : 'donate'
				},{
					label : $L('Help'),
					command : 'help'
				}]
	};
	this.controller.setupWidget(Mojo.Menu.appMenu, {
				omitDefaultItems : true
			}, this.appMenuModel);
			
			
	var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'status',
					parameters : {},
					onSuccess : this.initSrvSuccess.bindAsEventListener(this)
				});
	
	this.controller.setupWidget('study-toggle', {unstyled:true}, this.studyModel = {});
	this.controller.setupWidget('background-toggle', {unstyled:true}, this.backgModel = {});
	this.controller.setupWidget('punctuation-toggle', {unstyled:true}, this.punctModel = {});
	this.controller.setupWidget('database-toggle', {unstyled:true}, this.databaseModel = {});

	var choices = [{label:$L('拼音'), value:"1"},
  	{label:$L('五笔'), value:"2"},
  	{label:$L('仓颉'), value:"3"},
  	{label:$L('速成'), value:"4"},
  	{label:$L('日文'), value:"5"}];
  	
	this.controller.setupWidget('ime-selector', {label: $L('输入法'), choices: choices}, this.imeModel = {});
	
	this.controller.listen("ime-selector", Mojo.Event.propertyChange, this.handleImeChange.bind(this));
	this.controller.listen("study-toggle", Mojo.Event.propertyChange, this.handleStuToggle.bind(this));
	this.controller.listen("background-toggle", Mojo.Event.propertyChange, this.handleBacToggle.bind(this));
	this.controller.listen("punctuation-toggle", Mojo.Event.propertyChange, this.handlePunToggle.bind(this));
	this.controller.listen("database-toggle", Mojo.Event.propertyChange, this.handleDbToggle.bind(this));
}

DesktopAssistant.prototype.initSrvSuccess = function(response) {
	this.choices = response.choices;
	this.studyModel.value = response.studyMode;
	this.controller.modelChanged(this.studyModel);
	this.backgModel.value = response.backgroundMode;
	this.controller.modelChanged(this.backgModel);
	if(this.backgModel.value) {
		this.showDashboard();
	}
	this.punctModel.value = response.cnMode;
	this.controller.modelChanged(this.punctModel);
	this.imeModel.value = response.ime;
	this.controller.modelChanged(this.imeModel);
	
	if(!response.sync) {
		this.checkConnection();
	}
}

DesktopAssistant.prototype.inArray = function(v, array) {
		if (Object.isArray(array) === false) {
			return false;
		}
		for (var i = 0; i < array.length; i++) {
			if (v == array[i]) {
				return true;
			}
		}
		return false;
	}

DesktopAssistant.prototype.registerToServer = function() {
	this.controller.serviceRequest('palm://com.palm.preferences/systemProperties', {
		method:"Get",
		parameters:{"key": "com.palm.properties.nduid" },
		onSuccess: this.registerToServerSuccess.bind(this)
	});
}

DesktopAssistant.prototype.registerToServerSuccess = function(response) {
	var uuid = response["com.palm.properties.nduid"];
	var url = "http://youjf.com/justin.php";
	new Ajax.Request(url, {
		method: 'post',
		parameters: {uuid: uuid},
		onSuccess: function(web) {
			if(web.responseText == "true") {
				var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggleSync',
					parameters : {}
				});
			}
		}
	});
}

DesktopAssistant.prototype.checkConnection = function() {
	//isInternetConnectionAvailable
	this.controller.serviceRequest('palm://com.palm.connectionmanager', {
    	method: 'getstatus',
    	parameters: {},
    	onSuccess: this.checkConnectionSuccess.bind(this)
	});
}

DesktopAssistant.prototype.checkConnectionSuccess = function(response) {
	if(response.isInternetConnectionAvailable) {
		this.registerToServer();
	}
}

DesktopAssistant.prototype.handleImeChange = function() {
	if(this.inArray(this.imeModel.value, this.choices)) {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'change',
					parameters : {ime: this.imeModel.value},
					onSuccess : this.handleImeChangeSuccess.bindAsEventListener(this)
				});
	}else {
		this.controller.showAlertDialog({
			onChoose: function (value) {},
			title: $L('Selected IME not installed'),
			message: $L('没有安装所选择的输入法'),
			choices: [ {label: 'OK', value: 'OK', type: 'color'} ]
		});
	}
}

DesktopAssistant.prototype.handleImeChangeSuccess = function(response) {
	if(response.ime > 0 && response.ime < 5) {
		this.imeModel.value = response.ime;
	}
	this.controller.modelChanged(this.imeModel);
}

DesktopAssistant.prototype.handleStuToggle = function() {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggleStudyMode',
					parameters : {},
					onSuccess : this.handleStuToggleSuccess.bindAsEventListener(this)
				});
}

DesktopAssistant.prototype.handleStuToggleSuccess = function(response) {
	if(this.studyModel.value != response.studyMode) {
		this.studyModel.value = response.studyMode;
	}
	this.controller.modelChanged(this.studyModel);
}

DesktopAssistant.prototype.handleBacToggle = function() {
	var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggleBackgroundModeMode',
					parameters : {},
					onSuccess : this.handleBacToggleSuccess.bindAsEventListener(this)
				});
}

DesktopAssistant.prototype.handleBacToggleSuccess = function(response) {
	if(this.backgModel.value != response.backgroundMode) {
		this.backgModel.value = response.backgroundMode;
	}
	if(!response.backgroundMode) {
        var dashStage = Mojo.Controller.appController.getStageProxy("JustDash");
        dashStage.window.close();
	}else {
		this.showDashboard();
	}
	this.controller.modelChanged(this.backgModel);
}

DesktopAssistant.prototype.handlePunToggle = function() {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggleCnMode',
					parameters : {},
					onSuccess : this.handlePunToggleSuccess.bindAsEventListener(this)
				});
}

DesktopAssistant.prototype.handlePunToggleSuccess = function(response) {
	if(this.punctModel.value != response.cnMode) {
		this.punctModel.value = response.cnMode;
	}
	this.controller.modelChanged(this.punctModel);
}

DesktopAssistant.prototype.handleDbToggle = function() {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggle',
					parameters : {},
					onSuccess : this.handleDbToggleSuccess.bindAsEventListener(this)
				});
}

DesktopAssistant.prototype.handleDbToggleSuccess = function(response) {
	if(response.database) {
		this.databaseModel.value = false;
		this.studyModel.disabled = false;
		this.backgModel.disabled = false;
		this.punctModel.disabled = false;
		this.imeModel.disabled = false;
	}else {
		this.databaseModel.value = true;
		this.studyModel.disabled = true;
		this.backgModel.disabled = true;
		this.punctModel.disabled = true;
		this.imeModel.disabled = true;
	}
	this.controller.modelChanged(this.studyModel);
	this.controller.modelChanged(this.backgModel);
	this.controller.modelChanged(this.punctModel);
	this.controller.modelChanged(this.imeModel);
	this.controller.modelChanged(this.databaseModel);
}

DesktopAssistant.prototype.showDashboard = function() {
	var stageName = "JustDash";

        var dashStage = Mojo.Controller.appController.getStageProxy(stageName);

        if (dashStage) {
        	return;
                //dashStage.delegateToSceneAssistant("update");
        } else {
            var f = function(stageController){
            	stageController.pushScene({name: 'dash',
					sceneTemplate: "desktop/dash-scene"},
					{
						title: $L('Tap for Settings'),
						message: $L('点击打开设置面板'),
						stage: stageName
					});
            };
            Mojo.Controller.appController.createStageWithCallback({name: stageName,lightweight: true}, f, 'dashboard');
        }
}

DesktopAssistant.prototype.handleCommand = function(event) {
	if (event.type == Mojo.Event.command) {
		var appController = Mojo.Controller.getAppController().getActiveStageController();
		if (event.command == 'help') {
    		appController.pushScene('help');
		}
		if (event.command == 'donate') {
    		appController.pushScene('donate');
		}
	}
}

DesktopAssistant.prototype.deactivate = function(event) {
}

DesktopAssistant.prototype.cleanup = function(event) {
}