var handlerBox = {};

var IME = Class.create();

IME.prototype = {
	wb : false,
	canvas : undefined,
	board : undefined,
	candidate : undefined,
	status: undefined,
	targetType : '',
	active : false,
	studyMode : false,
	text : undefined,
	limit : 5,
	allPinyin : undefined,
	pageDownKey : 44,
	pageUpKey : 95,
	spliterKey : 39,
	spaceKey : 32,
	selectingKeys : [32, 64, 46],
	holdInput : false,
	inputPhase : "",
	inputPinyin : [],
	selectedPinyin : [],
	candidates : [],
	selected : [],
	hasCandidate : false,
	offset : 0,
	candidatesNum : 0,
	activeCandidateIndex : 2,
	isBrowser : false,
	sending : "",
	initialize : function(type, isBrowser) {
		// set all working enviroment
		if (type == 'wb') {
			this.wb = true;
		}
		if(isBrowser) {
			this.isBrowser = true;
			// for the device key codes, some of the keys are not the same as normal
			this.selectingKeys = [32, 48, 190];
			this.pageDownKey = 188;
		}else {
			this.isBrowser = false;
			this.selectingKeys = [32, 64, 46];
		}
		this.hasCandidate = false;
		this.selectedPinyin = [];
		this.selected = [];
		this.offset = 0;
		this.activeCandidateIndex = 2;
		if (this.wb === false) {
			this.allPinyin = new PrefixMap(PinyingSource.table);
		}
		this.toggleIme();
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
		var a = this.text;
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
		var a = this.text;
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
		if(document.getElementById('canvas') === null) {
			var canvas = '<div class="justinputCanvas" id="canvas" style="z-index:99999999;"><div class="contentWrap"><ul class="boardWrap"><li id="board"></li></ul><ul class="tabWrapTop" id="candidate"><li class="tabUnselect"></li><li class="tabUnselect"></li><li class="tabUnselect"></li><li class="tabUnselect"></li><li class="tabUnselect"></li></ul></div></div>';
			document.body.insert({after : canvas});
			var status = '<div id="status" style="position: absolute;z-index:99999999;opacity:0.7;"><img src="/usr/palm/frameworks/mojo/submissions/200.72/images/status-available-dark.png"></div>';
			document.body.insert({after : status});
			this.status = document.getElementById('status');
			this.canvas = document.getElementById('canvas');
			this.board = document.getElementById('board');
			this.candidate = document.getElementById('candidate');
			this.canvas.hide();
			if(!this.isBrowser) {
				this.setCursorStatusPos();
			}
		}
	},
	uninstallCanvas : function() {
		if(document.getElementById('canvas')) {
			document.getElementById('canvas').remove();
			document.getElementById('status').remove();
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
			if (this.stopObservingFocus) {
				handler.stopObserving('focus', this.stopObservingFocus, true);
			}
			if (this.stopObservingBlur) {
				handler.stopObserving('blur', this.stopObservingBlur, true);
			}

			if (this.active === true) {
				handler.observe('keydown', handlerBox.fxTextOnKeyDown, true);
				handler.observe('keypress', handlerBox.fxTextOnKeyPress, true);
				handler.observe('focus', handlerBox.fxTextOnFocus, true);
				handler.observe('blur', handlerBox.fxTextOnBlur, true);
			}
		}
	},
	textOnFocus : function(e) {
		this.text = e.currentTarget;
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
	textOnKeyDown : function(e) {
		if (this.active === false) {
			return true;
		} else {
			if(!this.isBrowser) {
				this.targetType = e.srcElement.tagName;
				this.text = e.srcElement;
			}
		}
		if (e.keyCode == 8) {
			if (this.inputPhase.length > 0) {
				// clean the pagination offset
				this.offset = 0;
				this.activeCandidateIndex = 2;
				if (this.selectedPinyin.length > 0) {
					// pop one and unshift it to this.inputPhase
					this.inputPinyin = this.formatPinyin();
					var selected = this.selected.pop();
					for (var i = 0; i < selected.length; i++) {
						this.inputPinyin.unshift(this.selectedPinyin.pop());
					}
					this.inputPhase = this.inputPinyin.join("'");
					this.update();
					e.returnValue = false;
				} else {
					this.inputPhase = this.inputPhase.slice(0,
							this.inputPhase.length - 1);
					this.update();
					e.returnValue = false;
				}
			}
			
			if(!this.isBrowser) {
				this.setCursorStatusPos();
			}
			return false;
		}else if(e.keyCode == 13 && this.inputPhase.length > 0) {
			this.getCandidatesFalse();
			this.sendResult(this.inputPhase);
			this.inputPhase = "";
			e.returnValue = false;
			if(!this.isBrowser) {
				this.setCursorStatusPos();
			}
			return false;
		}
	},
	textOnKeyPress : function(e) {
		if (this.active === false) {
			return true;
		} else {
			if(!this.isBrowser) {
				this.targetType = e.srcElement.tagName;
				this.text = e.srcElement;
			}
		}
		var key = e.keyCode;
		var seqMap = [3, 1, 0, 2, 4];
		if (key >= 97 && key <= 122 || key == this.spliterKey || key >= 65 && key <= 90) {
			if (key == this.spliterKey && this.hasCandidate === false) {
				return String.fromCharCode(key);
			}
			if (key >= 65 && key <= 90) {
				// force uppercase to lower case
				key += 32;
			}
			if (this.wb === true) {
				if (this.inputPhase.length >= 4) {
					// send the active word
					this.phaseSelected(seqMap[this.activeCandidateIndex]);
					this.getCandidatesFalse();
					this.inputPhase = String.fromCharCode(key);
					this.update();
					e.returnValue = false;
					return false;
				}else {
					this.inputPhase += String.fromCharCode(key);
				}
			}else {
				this.inputPhase += String.fromCharCode(key);
			}
			this.update();
		} else {
			if (this.inArray(key, this.selectingKeys)) {
				// choose from select list
				if (this.inputPhase.length > 0) {
					if (this.holdInput) {
						e.returnValue = false;
						return false;
					}
					if (this.hasCandidate) {
						if (key === this.selectingKeys[0]) {
							this.phaseSelected(seqMap[this.activeCandidateIndex]);
							if(this.wb) {
								this.updateRank();
							}
						}
						var candidatesLength = this.candidates.length;
						if (key === this.selectingKeys[1]) {
							if (this.activeCandidateIndex > 0) {
								this.activeCandidateIndex--;
								if (seqMap[this.activeCandidateIndex] + 1 > candidatesLength) {
									this.activeCandidateIndex++;
								}
							}
						}
						if (key === this.selectingKeys[2]) {
							if (this.activeCandidateIndex < 4) {
								this.activeCandidateIndex++;
								if (seqMap[this.activeCandidateIndex] + 1 > candidatesLength) {
									this.activeCandidateIndex--;
								}
							}
						}
						this.update();
					} else {
						// there is no cadidates, but the inputPhase is not
						// empty, just push it out
						if((this.inputPhase == "ustudy" && this.wb === false) || (this.inputPhase == "zstu" && this.wb)) {
							this.toggleStudyMode();
							this.getCandidatesFalse();
							this.inputPhase = "";
							e.returnValue = false;
							return false;
						} else {
							if (this.wb === true) {
								this.candidates.push(this.inputPhase);
								this.sendResult(this.inputPhase);
							} else {
								this.candidates.push(this.inputPhase.substring(1));
								this.sendResult(this.inputPhase.substring(1));
							}
							this.inputPhase = '';
							this.offset = 0;
							this.activeCandidateIndex = 2;
							this.update();
						}
					}
				} else {
					return String.fromCharCode(key);
				}
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
				return String.fromCharCode(key);
			}
		}
		e.returnValue = false;
	},
	pageUp : function() {
		if (this.offset >= this.limit) {
			this.offset = this.offset - this.limit;
			this.activeCandidateIndex = 2;
			this.update();
		}
	},
	pageDown : function() {
		if (this.offset + this.limit < this.candidatesNum) {
			this.offset = this.offset + this.limit;
			this.activeCandidateIndex = 2;
			this.update();
		}
	},
	formatPinyin : function() {
		if (this.wb === true) {
			return [this.inputPhase];
		}
		var pinyins = [];
		var phases = this.inputPhase.split("'");
		for (var i = 0; i < phases.length; i++) {
			var phase = phases[i];
			if (phase.length > 0) {
				do {
					var ret = this.allPinyin.search(phase, true);
					if (Object.isString(ret[0]) === false) {
						pinyins.push(phase);
						return pinyins;
					}
					var searched = ret[0];
					var shift = phase.slice(0, searched.length);
					phase = phase.slice(searched.length);
					pinyins.push(searched);
				} while (phase.length > 0);
			}
		}

		return pinyins;
	},
	phaseSelected : function(index) {
		// the inputPinyin will lose, why?
		this.inputPinyin = this.formatPinyin();
		var selected = this.candidates[index];
		for (var i = 0; i < selected.length; i++) {
			this.selectedPinyin.push(this.inputPinyin.shift());
		}
		this.selected.push(selected);
		this.inputPhase = this.inputPinyin.join("'");
		// clean the pagination offset
		this.offset = 0;
		this.activeCandidateIndex = 2;
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
				var exist = this.text.value;
				if (cur < exist.length) {
					result = exist.substr(0, cur) + str + exist.substr(cur, exist.length);
				} else {
					result = exist + str;
				}
				this.text.value = result;
				this.setCursorPos(cur + parseInt(str.length));
				break;
		}
	},
	toggleStudyMode : function() {
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'toggleStudyMode',
					parameters : {}
				});
	},
	updateRank : function() {
		var selected = this.selected;
		if(selected.length < 1) {
			return false;
		}
		var pinyin = this.selectedPinyin.compact();
		var query = [];
		var item = {};
		var wordLength;
			for (var i = 0; i < selected.length; i++) {
				item = {};
				item.q = selected[i];
				item.k = pinyin.splice(0, selected[i].length);
				query.push(item);
			}
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'put',
					parameters : {
						query : query
					}
				});
	},
	update : function() {
		this.inputPinyin = this.formatPinyin();
		var query = [];
        var q;
        var full;
		if (this.wb === true) {
			q = this.inputPinyin.reduce();
			if(q.length > 2) {
				full = "false";
			}else {
				full = "true";
			}
			query.push({
						"q" : q,
						"full" : full
					});
		} else {
			var rest = this.inputPinyin;
			var first;
			if (rest.length > 6) {
				first = rest.splice(0, 6);
			} else {
				first = rest;
				rest = [];
			}

			for (var i = 0; i < first.length; i++) {
				q = first[i];
				full = "true";
				if (q.length == 1 && !(q == 'a' || q == 'e' || q == 'o')) {
					full = "false";
				} else {
					if (this.inArray(q, nonCompleteMap)) {
						full = "false";
					}
				}
				query.push({
							"q" : q,
							"full" : full
						});
			}
		}
		
		this.holdInput = true;
		var request = new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'get',
					parameters : {
						query : query,
						offset : this.offset,
						isWb : this.wb
					},
					onSuccess : this.getCandidates.bind(this),
					onFailure : this.getCandidatesFalse.bind(this)
				});
	},
	getCandidatesFalse : function() {
		this.holdInput = false;
		this.sendResult(this.selected.join(''));
		this.updateRank();
		this.hasCandidate = false;
		this.selectedPinyin = [];
		this.selected = [];
		this.offset = 0;
		this.activeCandidateIndex = 2;
		this.canvas.hide();
		if(!this.isBrowser) {
			this.setCursorStatusPos();
		}
	},
	getCandidates : function(response) {
		this.holdInput = false;
		this.ms = response.ms;
		this.studyMode = response.studyMode;
		if (response.count > 0) {
			if (this.wb === true && response.count == "1") {
				this.selected.push(response.words.reduce());
				this.selectedPinyin.push(this.inputPhase);
				this.sendResult(this.selected.join(""));
				this.updateRank();
				this.hasCandidate = false;
				this.selectedPinyin = [];
				this.selected = [];
				this.offset = 0;
				this.activeCandidateIndex = 2;
				this.inputPhase = "";
				this.canvas.hide();
			} else {
				this.candidates = response.words;
				this.candidatesNum = response.count;
				this.hasCandidate = true;
				this.updateCanvas();
			}
		} else {
			this.candidatesNum = 0;
			if (this.inputPhase.length > 0) {
                this.candidates = [];
				var start = this.inputPhase.substring(0, 1);
				if (this.inArray(start, ['i', 'u', 'v'])) {
                    this.candidates.push(this.inputPhase.substring(1));
				} else {
					this.candidates.push(this.inputPhase);
				}
                this.updateCanvas();
			} else {
				this.hasCandidate = false;
				this.selectedPinyin = [];
				this.sendResult(this.selected.join(''));
				this.selected = [];
				this.offset = 0;
				this.activeCandidateIndex = 2;
				this.canvas.hide();
			}
		}
	},
	sortArray : function() {
		var candidates = [];
		if (!this.candidates) {
			candidates[2] = this.inputPhase
					.substring(1, this.inputPhase.length);
			return candidates;
		}
		candidates[2] = this.candidates[0];
		if (this.candidates[1]) {
			candidates[1] = this.candidates[1];
		} else {
			candidates[1] = '';
		}
		if (this.candidates[2]) {
			candidates[3] = this.candidates[2];
		} else {
			candidates[3] = '';
		}
		if (this.candidates[3]) {
			candidates[0] = this.candidates[3];
		} else {
			candidates[0] = '';
		}
		if (this.candidates[4]) {
			candidates[4] = this.candidates[4];
		} else {
			candidates[4] = '';
		}
		return candidates;
	},
	updateCanvas : function() {
		var workspace = '';
		this.inputPinyin = this.formatPinyin();
		if (this.inputPinyin.length > 0) {
			workspace = this.selected.join('') + this.inputPinyin.join("'");
		}
		var candidates = this.sortArray();
		this.board.update(workspace);
		var list = this.candidate.childElements();
		var wordLength = 0;
		for (var i = 0; i < list.length; i++) {
			list[i].update(candidates[i]);
			wordLength += candidates[i].length;
			list[i].removeClassName("tabSelectA");
			list[i].removeClassName("tabSelectB");
			if(i == this.activeCandidateIndex) {
				if(this.studyMode) {
					list[i].addClassName("tabSelectB");
				}else {
					list[i].addClassName("tabSelectA");
				}
			}
		}
		var minLength;
		if(wordLength > 5)	{
			minLength = 170 + (wordLength - 5) * 16;
		}else {
			minLength = 170;
		}
		this.canvas.setStyle({"min-width" : minLength + "px"});
		if(this.isBrowser) {
			var left;
			if(minLength > 310) {
				left = 310 - minLength;
			}else {
				left = 10;
			}
			this.canvas.setStyle({top : "120px", left : left + "px"});
		}else {
			this.setPosition();
			this.setCursorStatusPos();
		}
		
		this.canvas.show();
	},
	setCursorStatusPos : function() {
		var cursorPos = window.caretRect();
		var left = cursorPos.x - 7;
		var top = cursorPos.y + 27;
		this.status.setStyle({top : top + "px", left : left + "px"});
		this.status.show();
	},
	setPosition : function() {
		var top;
		var left;
		var cursorPos = window.caretRect();
		var pickerDims;
		var viewDims;
		var maxWidth, minWidth;
		var HI_PADDING_TOP = 5;
		var HI_PADDING_BOTTOM = 20;
		var HI_PADDING_LEFT = 10;
		var HI_PADDING_RIGHT = 10;
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

			left = cursorPos.x;
			maxWidth = viewDims.width - HI_PADDING_RIGHT;
			minWidth = HI_PADDING_LEFT;

			if(pickerDims.width < 170) {
				// can't get the correct dimension width, hack here
				pickerDims.width = 170;
			}
			if ((pickerDims.width + cursorPos.x) > maxWidth) {
				left = maxWidth - pickerDims.width;
			} else if ((cursorPos.x - pickerDims.width) < minWidth) {
				left = minWidth;
			}

			left += 'px';
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