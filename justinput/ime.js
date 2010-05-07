var handlerBox = {};

var IME = Class.create();

IME.prototype = {
	canvas : undefined,
	board : undefined,
	candidate : undefined,
	status: undefined,
	searched: [],
	targetType : '',
	active : false,
	cnMode : false,
	targetElement : undefined,
	limit : 3,
	pageDownKey : 44,
	pageUpKey : 95,
	spliterKey : 39,
	lastestKey : 0,
	selectingKeys : [],
	deleteKeys : [49, 50, 51],
	// z x c v b n m
	// [90, 88, 67, 86, 66, 78, 77] [122, 120, 99, 118, 98, 110, 109] [101, 114, 116, 100, 102, 103]
	holdInput : false,
	inputPhase : "",
	candidates : [],
	selected : [],
	selectedCandidate : [],
	hasCandidate : false,
	hasPage : false,
	offset : 0,
//	activeCandidateIndex : 2,
	angleQuotes : false,
	doubleQuotes : false,
	singleQuotes : false,
	isBrowser : false,
	initialize : function(isBrowser) {
		// set all working enviroment
		if(isBrowser) {
			this.isBrowser = true;
			// for the device key codes, some of the keys are not the same as normal
			//this.selectingKeys = [32, 48, 190];
			this.selectingKeys = [48, 32, 190];
			this.pageDownKey = 188;
		}else {
			this.isBrowser = false;
			//this.selectingKeys = [32, 64, 46];
			this.selectingKeys = [64, 32, 46];
		}
		this.hasCandidate = false;
		this.cached = [];
		this.selected = [];
		this.selectedCandidate = [];
		this.offset = 0;
//		this.activeCandidateIndex = 2;
		//this.allPinyin = new PrefixMap(PinyingSource.table);
		this.toggleIme();
		this.setCnMode();
	},
	inArray : function(v, array) {
		if (Object.isArray(array) === false) {
			return false;
		}
		for (var i = 0; i < array.length; i++) {
			if (v == array[i]) {
				return true;
			}
		}
		return false;
	},
	getCursorPos : function() {
		var a = this.targetElement;
		var b = 0;
		if (a.selectionStart !== undefined) {
			b = a.selectionStart;
		} else {
			var c;
			if (a.tagName == "TEXTAREA") {
				var d = 0;
				var e = a.ownerDocument.selection.createRange();
				var f = a.ownerDocument.body.createTextRange();
				f.moveToElementText(a);
				for (d = 0; f.compareEndPoints("StartToStart", e) < 0; d++) {
					f.moveStart('character', 1);
				}
				for (var i = 0; i <= d; i++) {
					if (a.value.charAt(i) == '\n') {
						d++;
					}
				}
				return d;
			} else if (a.tagName == "DIV") {
			} else {
				c = document.selection.createRange();
				c.moveStart("character", -a.value.length);
			}
			b = c.text.length;
		}
		return b;
	},
	setCursorPos : function(n) {
		var a = this.targetElement;
		if (a.tagName == "DIV") {
			return false;
		}
		if (a.selectionStart !== undefined) {
			a.selectionStart = n;
			a.selectionEnd = n;
		} else {
			var b = parseInt(n);
			if (isNaN(b)) {
				return;
			}
			var c = a.createTextRange();
			c.moveStart("character", b);
			c.collapse(true);
			c.select();
		}
	},
	setupCanvas : function(canvas, board, candidate, adapter) {
		this.canvas = canvas;
		this.board = board;
		this.candidate = candidate;
		this.adapter = adapter;
	},
	installCanvas : function() {
		if(document.getElementById('_ime_canvas') === null) {
			var canvas = '<div class="justinputCanvas" id="_ime_canvas" style="z-index:99999999;"><div class="contentWrap"><ul class="boardWrap"><li id="_ime_board"></li></ul><ul class="tabWrapTop" id="_ime_candidate"></ul></div></div>';
			document.body.insert({after : canvas});
			var status = '<div id="_ime_status" style="position: absolute;z-index:99999999;"><img src="/usr/palm/frameworks/mojo/justinput/status-available-dark.png"></div>';
			document.body.insert({after : status});
			this.status = document.getElementById('_ime_status');
			this.canvas = document.getElementById('_ime_canvas');
			this.board = document.getElementById('_ime_board');
			this.candidate = document.getElementById('_ime_candidate');
			this.canvas.hide();
			if(!this.isBrowser) {
				this.setCursorStatusPos();
			}
		}
	},
	uninstallCanvas : function() {
		if(document.getElementById('_ime_canvas')) {
			document.getElementById('_ime_canvas').remove();
			document.getElementById('_ime_status').remove();
			this.canvas = undefined;
			this.board = undefined;
			this.candidate = undefined;
			this.status = undefined;
		}
	},
	toggleIme : function() {
		if (this.active === true) {
			this.active = false;
			this.uninstallCanvas();
		} else {
			this.installCanvas();
			this.active = true;
		}
		
		if(this.isBrowser) {
			return false;
		}
		
		if (handlerBox.fxTextOnKeyDown) {
			this.stopObservingKeyDown = handlerBox.fxTextOnKeyDown;
		}
		if (handlerBox.fxTextOnKeyPress) {
			this.stopObservingKeyPress = handlerBox.fxTextOnKeyPress;
		}
		if (handlerBox.fxTextOnKeyUp) {
			this.stopObservingKeyUp = handlerBox.fxTextOnKeyUp;
		}
		if (handlerBox.fxTextOnFocus) {
			this.stopObservingFocus = handlerBox.fxTextOnFocus;
		}
		if (handlerBox.fxTextOnBlur) {
			this.stopObservingBlur = handlerBox.fxTextOnBlur;
		}

		handlerBox = {};

		if (this.active === true) {
			handlerBox.fxTextOnKeyDown = this.textOnKeyDown.bind(this);
			handlerBox.fxTextOnKeyPress = this.textOnKeyPress.bind(this);
			handlerBox.fxTextOnKeyUp = this.textOnKeyUp.bind(this);
			handlerBox.fxTextOnFocus = this.textOnFocus.bind(this);
			handlerBox.fxTextOnBlur = this.textOnBlur.bind(this);
		}

		var g = document.body.getElementsBySelector('input[type=text], textarea, div[x-mojo-element="SmartTextField"], div[x-mojo-element="RichTextEdit"]');
		for (var i = 0; i < g.length; i++) {
			var handler;
			if (g[i].tagName == "DIV") {
				var smart = g[i].getElementsBySelector('div[class~=editable]');
				if (smart[0]) {
					handler = smart[0];
				} else {
					handler = g[i];
				}
			} else {
				handler = g[i];
			}
			if (this.stopObservingKeyDown) {
				handler.stopObserving('keydown', this.stopObservingKeyDown,
						true);
			}
			if (this.stopObservingKeyPress) {
				handler.stopObserving('keypress', this.stopObservingKeyPress,
						true);
			}
			if (this.stopObservingKeyUp) {
				handler.stopObserving('keyup', this.stopObservingKeyUp,
						true);
			}
			if (this.stopObservingFocus) {
				handler.stopObserving('focus', this.stopObservingFocus, true);
			}
			if (this.stopObservingBlur) {
				handler.stopObserving('blur', this.stopObservingBlur, true);
			}

			if (this.active === true) {
				handler.observe('keydown', handlerBox.fxTextOnKeyDown, true);
				handler.observe('keypress', handlerBox.fxTextOnKeyPress, true);
				handler.observe('keyup', handlerBox.fxTextOnKeyUp, true);
				handler.observe('focus', handlerBox.fxTextOnFocus, true);
				handler.observe('blur', handlerBox.fxTextOnBlur, true);
			}
		}
	},
//	toggleLock : function() {
//		var list = this.candidate.childElements();
//		if(this.spaceLock) {
//			list[0].removeClassName("tabSelectA");
//			list[0].addClassName("tabSelectB");
//			this.spaceLock = false;
//		}else {
//			list[0].removeClassName("tabSelectB");
//			list[0].addClassName("tabSelectA");
//			this.spaceLock = true;
//		}
//	},
	textOnFocus : function(e) {
		this.targetElement = e.currentTarget;
		this.targetType = e.srcElement.tagName;
		this.getCandidatesFalse();
		this.inputPhase = "";
		if(!this.isBrowser) {
			this.status.show();
			this.setCursorStatusPos();
		}
	},
	textOnBlur : function(e) {
		this.status.hide();
		this.canvas.hide();
	},
	textOnKeyUp : function(e) {
		// do nothing
	},
	textOnKeyDown : function(e) {
		if (this.active === false) {
			return true;
		} else {
			if(!this.isBrowser) {
				this.targetType = e.srcElement.tagName;
				this.targetElement = e.srcElement;
			}
		}
		if (e.keyCode == 8) {
			if (this.inputPhase.length > 0) {
				// clean the pagination offset
				this.offset = 0;
//				this.activeCandidateIndex = 2;
				if (this.cached.length > 0) {
					// pop one and unshift it to this.inputPhase
					this.inputPhase = this.cached.pop() + this.inputPhase;
					this.selected.pop();
//					this.inputPinyin = this.inputPhase;
//					var selected = this.selected.pop();
//					for (var i = 0; i < selected.length; i++) {
//						this.inputPinyin.unshift();
//					}
//					this.inputPhase = this.inputPinyin.join("'");
					this.update();
					e.returnValue = false;
				} else {
					this.inputPhase = this.inputPhase.slice(0,
							this.inputPhase.length - 1);
					this.update();
					e.returnValue = false;
				}
				//this.spaceLock = false;
			}
			return false;
		}else if(e.keyCode == 13 && this.inputPhase.length > 0) {
			this.getCandidatesFalse();
			this.sendResult(this.inputPhase);
			this.inputPhase = "";
			e.returnValue = false;
			return false;
		}
	},
	textOnKeyPress : function(e) {
		if (this.active === false) {
			return true;
		} else {
			if(!this.isBrowser) {
				this.targetType = e.srcElement.tagName;
				this.targetElement = e.srcElement;
			}
		}
		// clean the pagination offset
		//this.offset = 0;
		var key = e.keyCode;
			if (this.hasCandidate && this.inArray(key, this.selectingKeys)) {
				// choose from select list
//				if (this.inputPhase.length > 0) {
					if (this.holdInput) {
						e.returnValue = false;
						return false;
					}
//					if () {
//						if (key === this.selectingKeys[0]) {
//							this.phaseSelected(seqMap[this.activeCandidateIndex]);
////							if(this.type == "wb") {
////								this.updateRank();
////							}
//						}
//						var candidatesLength = this.candidates.length;
//						if (key === this.selectingKeys[1]) {
//							if (this.activeCandidateIndex > 0) {
//								this.activeCandidateIndex--;
//								if (seqMap[this.activeCandidateIndex] + 1 > candidatesLength) {
//									this.activeCandidateIndex++;
//								}
//							}
//						}
//						if (key === this.selectingKeys[2]) {
//							if (this.activeCandidateIndex < 4) {
//								this.activeCandidateIndex++;
//								if (seqMap[this.activeCandidateIndex] + 1 > candidatesLength) {
//									this.activeCandidateIndex--;
//								}
//							}
//						}
						var selectIndex = this.selectingKeys.indexOf(key);
						if(this.candidates.length == 1 && selectIndex == 1) {
							selectIndex = 0;
						}
						this.phaseSelected(selectIndex);
						this.update();
//					}
//					else {
//						// there is no cadidates, but the inputPhase is not
//						// empty, just push it out
////						if((this.inputPhase == "ustudy" && this.type == "py") || (this.inputPhase == "zstu" && this.type == "wb")) {
////							this.toggleCnMode();
////							this.getCandidatesFalse();
////							this.inputPhase = "";
////							e.returnValue = false;
////							return false;
////						} else {
//								this.candidates.push(this.inputPhase.substring(1));
//								this.sendResult(this.inputPhase.substring(1));
//							this.inputPhase = '';
//							this.offset = 0;
////							this.activeCandidateIndex = 2;
//							this.update();
////						}
//					}
//				} else {
//					return String.fromCharCode(key);
//				}
			} else if (this.hasCandidate && this.inArray(key, this.deleteKeys)) {
					if (this.holdInput) {
						e.returnValue = false;
						return false;
					}
						var deleteIndex = this.deleteKeys.indexOf(key);
						if(this.candidates.length == 1) {
                            if(deleteIndex > 0) {
						        e.returnValue = false;
						        return false;
                            }
                            this.offset -= this.limit;
						}
						if(this.candidates.length == 2) {
                            if(deleteIndex == 2) {
						        e.returnValue = false;
						        return false;
                            }
						}
						this.phaseDeleted(deleteIndex);
						this.update();
            }else if (key >= 97 && key <= 122 || key == this.spliterKey || key >= 65 && key <= 90) {
				if (key == this.spliterKey && this.hasCandidate === false) {
					if(this.cnMode && this.isBrowser == false) {
					var symbol;
							if(this.singleQuotes) {
								this.singleQuotes = false;
								symbol = "’";
							}else {
								this.singleQuotes = true;
								symbol = "‘";
							}
							this.sendResult(symbol);
							e.returnValue = false;
							return false;
					}else {
						return String.fromCharCode(key);
					}
				}
				if (key >= 65 && key <= 90) {
					// force uppercase to lower case
					key += 32;
				}
//			if (this.type == "wb") {
//				if (this.inputPhase.length >= 5) {
//					// send the active word
//					this.phaseSelected(seqMap[this.activeCandidateIndex]);
//					this.getCandidatesFalse();
//					this.inputPhase = String.fromCharCode(key);
//					this.update();
//					e.returnValue = false;
//					return false;
//				}else {
//					this.inputPhase += String.fromCharCode(key);
//				}
//			}else {
				if(!(this.lastestKey == key && this.spliterKey == key)) {
					this.lastestKey = key;
					this.inputPhase += String.fromCharCode(key);
					this.update();
				}
//			}
				//this.spaceLock = false;
//			}else if(this.hasCandidate && e.keyCode == this.spaceKey) {
//				this.toggleLock();
//				e.returnValue = false;
//				return false;
			} else {
				if (e.keyCode == this.pageDownKey && this.hasCandidate) {
					this.pageDown();
					e.returnValue = false;
					return false;
				}
				if (e.keyCode == this.pageUpKey && this.hasCandidate) {
					this.pageUp();
					e.returnValue = false;
					return false;
				}
				// symbol keys
				if(this.cnMode && this.isBrowser == false) {
					var symbol;
					switch(key) {
						case 47:
							symbol = "∕";
							break;
						case 43:
							symbol = "﹢";
							break;
						case 40:
							symbol = "（";
							break;
						case 41:
							symbol = "）";
							break;
						case 37:
							if(this.angleQuotes) {
								this.angleQuotes = false;
								symbol = "》";
							}else {
								this.angleQuotes = true;
								symbol = "《";
							}
							break;
						case 34:
							if(this.doubleQuotes) {
								this.doubleQuotes = false;
								symbol = "”";
							}else {
								this.doubleQuotes = true;
								symbol = "“";
							}
							break;
						case 61:
							symbol = "﹦";
							break;
						case 38:
							symbol = "﹠";
							break;
						case 45:
							symbol = "•";
							break;
						case 36:
							symbol = "￥";
							break;
						case 33:
							symbol = "！";
							break;
						case 58:
							symbol = "：";
							break;
						case 42:
							symbol = "…";
							break;
						case 35:
							symbol = "﹟";
							break;
						case 63:
							symbol = "？";
							break;
						case 59:
							symbol = "；";
							break;
						case 95:
							symbol = "—";
							break;
						case 44:
							symbol = "，";
							break;
						case 64:
							symbol = "、";
							break;
						case 46:
							symbol = "。";
							break;
						default:
							symbol = String.fromCharCode(key);
					}
					this.sendResult(symbol);
				}else {
					return String.fromCharCode(key);
				}
			}
			e.returnValue = false;
	},
	pageUp : function() {
//		if (this.offsets.length > 0) {
//			this.offset = this.offsets.pop();
//		}else {
//			this.offset = 0;
//		}
		if (this.offset > 0) {
			this.offset -= this.limit;
		}else {
		}
//		this.activeCandidateIndex = 2;
		this.update();
	},
	pageDown : function() {
		if (this.hasPage) {
//			this.offsets.push(this.offset);
//			this.offset = this.offset + this.pageCount;
			this.offset += this.limit;
//			this.activeCandidateIndex = 2;
			this.update();
		}
	},
    phaseDeleted : function(index) {
        var selected = this.candidates[index];
        var id = selected.id;
        var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'delete',
					parameters : {
						id : id
					}
				});
    },
	phaseSelected : function(index) {
		var selected = this.candidates[index];
		var searchString = "";
		for(var i = 0;i < selected.l;i ++) {
			searchString += this.searched.shift() + "";
		}
		if(selected.l > 0) {
			var head = this.inputPhase.substring(0, searchString.length);
			head = head.replace("'", "");
			var cutLength;
			if(head.length < searchString.length) {
				cutLength = searchString.length - head.length + searchString.length;
			}else {
				cutLength = searchString.length;
			}
			this.inputPhase = this.inputPhase.substring(cutLength);
			if(this.inputPhase.substring(0, 1) == "'") {
				this.inputPhase = this.inputPhase.substring(1);
				searchString += "'";
			}
		}else {
			this.inputPhase = "";
			if(selected.v == "ucn") {
				this.toggleCnMode();
				this.getCandidatesFalse();
				return false;
			}
		}
		this.cached.push(searchString);
		this.selected.push(selected.v);
		this.selectedCandidate.push(selected);
		//this.spaceLock = false;
		// clean the pagination offset
		this.offset = 0;
//		this.activeCandidateIndex = 2;
	},
	sendResult : function(str) {
		if(this.isBrowser) {
			this.adapter.insertStringAtCursor(str);
			return false;
		}
		var result;
		switch (this.targetType) {
			case 'DIV' :
				document.execCommand("insertText", true, str);
				break;
			case 'TEXTAREA' :
			case 'INPUT' :
				var cur = this.getCursorPos();
				var exist = this.targetElement.value;
				if (cur < exist.length) {
					result = exist.substr(0, cur) + str + exist.substr(cur, exist.length);
				} else {
					result = exist + str;
				}
				this.targetElement.value = result;
				this.setCursorPos(cur + parseInt(str.length));
				break;
		}
	},
	toggleCnMode : function() {
		if(this.cnMode) {
			this.cnMode = false;
		}else {
			this.cnMode = true;
		}
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggleCnMode',
					parameters : {}
				});
	},
	setCnMode : function() {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'status',
					parameters : {},
					onSuccess : this.setCnModeSuccess.bind(this)
				});
	},
	setCnModeSuccess : function(response) {
		this.cnMode = response.cnMode;
	},
	updateRank : function() {
		var selected = this.selectedCandidate;
		if(selected.length < 1) {
			return false;
		}
		if(selected.length == 1) {
			var l = selected[0].l;
			if(l === 0) {
				return false;
			}
			var id = selected[0].id;
			var s = selected[0].s;
			var r = selected[0].r;
			
			var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'update',
					parameters : {
						id : id,
						s : s,
						r : r
					}
				});
		}else {
			var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'put',
					parameters : {
						words : selected
					}
//					,
//					onSuccess : this.putWords.bind(this),
//					onFailure : this.putWordsFalse.bind(this)
				});
		}
	},
//	putWords : function(response) {
//		Mojo.Log.info("response ======> " + Mojo.Log.propertiesAsString(response));
//	},
//	putWordsFalse : function(response) {
//		Mojo.Log.info("response.errorText ======> " + response.errorText);
//	},
	update : function() {
		var query = this.inputPhase + "";
		this.holdInput = true;
		if(query.length > 0) {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'get',
					parameters : {
						query : query,
						offset : this.offset,
						limit : this.limit
					},
					onSuccess : this.getCandidates.bind(this),
					onFailure : this.getCandidatesFalse.bind(this)
				});
		}else {
			this.getCandidatesFalse();
		}
	},
	getCandidatesFalse : function(response) {
		this.holdInput = false;
		this.sendResult(this.selected.join(''));
		this.updateRank();
		this.hasCandidate = false;
		this.cached = [];
		this.selected = [];
		this.selectedCandidate = [];
		this.offset = 0;
//		this.activeCandidateIndex = 2;
		this.canvas.hide();
	},
	getCandidates : function(response) {
		this.holdInput = false;
		this.time = response.time;
		this.searched = response.fixed;
		this.hasPage = ! (response.isEnd);
		this.cnMode = response.cnMode;
		if (response.words.length > 0) {
				this.candidates = response.words;
				this.hasCandidate = true;
				this.updateCanvas();
		} else {
				this.hasCandidate = false;
				this.cached = [];
				this.sendResult(this.selected.join(''));
				this.selected = [];
				this.selectedCandidate = [];
				this.offset = 0;
//				this.activeCandidateIndex = 2;
				this.canvas.hide();
		}
	},
//	sortArray : function() {
//		var candidates = [];
//		if (!this.candidates) {
//			candidates[2] = this.inputPhase
//					.substring(1, this.inputPhase.length);
//			return candidates;
//		}
//		candidates[2] = this.candidates[0].v;
//		if (this.candidates[1]) {
//			candidates[1] = this.candidates[1].v;
//		} else {
//			candidates[1] = '';
//		}
//		if (this.candidates[2]) {
//			candidates[3] = this.candidates[2].v;
//		} else {
//			candidates[3] = '';
//		}
//		if (this.candidates[3]) {
//			candidates[0] = this.candidates[3].v;
//		} else {
//			candidates[0] = '';
//		}
//		if (this.candidates[4]) {
//			candidates[4] = this.candidates[4].v;
//		} else {
//			candidates[4] = '';
//		}
//		return candidates;
//	},
	updateCanvas : function() {
		//this.inputPinyin = this.inputPhase;
		// calculate the rest of the inputPhase
//		if (this.inputPinyin.length > 0) {
		//<li class="tabUnselect"></li><li class="tabUnselect"></li><li class="tabUnselect"></li><li class="tabUnselect"></li><li class="tabUnselect"></li>
		var workspace = this.selected.join("") + this.searched.join("'");
//		}
		//var candidates = this.sortArray();
		this.board.update(workspace);
		//var list = this.candidate.childElements();
		var wordLength = 0;
		var candidateHtml = "";
//		var lastHtml = "";
//		this.canvas.show();
//		this.pageCount = 0;
		for (var i = 0; i < this.candidates.length; i++) {
			if(i >= this.limit) {
				break;
			}
//			this.pageCount ++;
			if(i === 1) {
//				var c;
//				if(this.spaceLock) {
//					c = "tabSelectA";
//				}else {
//					c = "tabSelectB";
//				}
				candidateHtml += "<li class=\"tabUnselect tabSelectB\">" + this.candidates[i].v + "</li>";
			}else {
				candidateHtml += "<li class=\"tabUnselect\">" + this.candidates[i].v + "</li>";
			}
			this.candidate.update(candidateHtml);
			//list[i].update(candidates[i]);
			wordLength += this.candidates[i].v.length;
//			list[i].removeClassName("tabSelectA");
//			list[i].removeClassName("tabSelectB");
//			if(i == this.activeCandidateIndex) {
//				if(this.cnMode) {
//					list[i].addClassName("tabSelectB");
//				}else {
//					list[i].addClassName("tabSelectA");
//				}
//			}
		}
		
		var minLength;
		if(wordLength > 3)	{
			minLength = 128 + (wordLength - 3) * 21;
		}else {
			minLength = 128;
		}
		this.canvas.setStyle({"min-width" : minLength + "px"});
		if(this.isBrowser) {
			this.canvas.setStyle({top : "120px", left : "0px"});
		}else {
			this.setPosition();
			//this.setCursorStatusPos();
		}
		
		this.canvas.show();
	},
	setCursorStatusPos : function() {
		//var cursorPos = window.caretRect();
		//var left;
		//var top;
		//left = cursorPos.x - 7;
		//top = cursorPos.y + 27;
		this.status.setStyle({top : "4px", left : "4px"});
		this.status.show();
	},
	setPosition : function() {
		var top;
		var left;
		var cursorPos = window.caretRect();
		var pickerDims;
		var viewDims;
		var HI_PADDING_BOTTOM = 20;
		var HI_MINIMUM_TOP = 20;
		var HI_MAX_BOTTOM = 5;

		if (cursorPos) {
			viewDims = document.viewport.getDimensions();

			pickerDims = this.canvas.getDimensions();

			if(pickerDims.height < 72) {
				// can't get the correct dimension height, hack here
				pickerDims.height = 72;
			}
			
			if ((pickerDims.height + HI_PADDING_BOTTOM + cursorPos.y) > viewDims.height) {
				top = cursorPos.y - (pickerDims.height + HI_PADDING_BOTTOM);
				if (top < HI_MINIMUM_TOP) {
					top = HI_MINIMUM_TOP;
				}
			} else {
				top = cursorPos.y + cursorPos.height + HI_PADDING_BOTTOM;
				if ((top + pickerDims.height) > (viewDims.height - HI_MAX_BOTTOM)) {
					top = viewDims.height - HI_MAX_BOTTOM - pickerDims.height;
				}
			}

			left = '0px';
			top += 'px';
		} else {
			left = '0px';
			top = '0px';
		}
		this.canvas.setStyle({
					top : top,
					left : left
				});
	}
};
