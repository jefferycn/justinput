var IME = function(text, db) {
	this.text = text;
	this.result = $('result');
	this.db = db;
	this.initialize();
}
IME.prototype = {
	db : false,
	isDiv : false,
	active : true,
	text : undefined,
	limit : 5,
	allPinyin : undefined,
	pageDownKey : 44,
	pageUpKey : 95,
	spliterKey : 39,
	spaceKey : 32,
	// default value, will be rewrite
	// selectingKeys : [32, 64, 46],
	selectingKeys : [32, 49, 50],
	inputPhase : "",
	inputPinyin : [],
	selectedPinyin : [],
	candidates : [],
	selected : [],
	hasCandidate : false,
	offset : 0,
	activeCandidateIndex : 2,
	initialize : function() {
		this.linkStyle();
		this.db = new Database("ext:JustInput", "1", this.loadDB.bind(this));
		this.inputPinyin = [];
		// strange, can not use Mojo.Event.keydown
		this.text.observe('keydown', this.textOnKeyDown.bind(this));
		this.text.observe('keypress', this.textOnKeyPress.bind(this));
		this.allPinyin = new PrefixMap(PinyingSource.table);
		// initial canvas
		var canvas = Mojo.View.render({
					object : {},
					template : '/media/internal/canvas'
				});
		// Mojo.Log.info("initialize ======> " +
		// Mojo.Log.propertiesAsString(this.text));
		this.text.insert({
					after : canvas
				});
		$('canvas').hide();
	},
	linkStyle : function() {
		element = document.createElement('link');
		element.setAttribute('href', '/media/internal/canvas.css');
		element.setAttribute('rel', 'stylesheet');
		element.setAttribute('type', 'text/css');
		document.getElementsByTagName('head').item(0).appendChild(element);
	},
	readRet : function(value) {
		// Mojo.Log.info("read data = " + value);
	},
	loadDB : function(isReady) {
		Mojo.Log.info("loadDB; ready = " + isReady);
		if (isReady == false) {
			Mojo.Controller.errorDialog("can not open database");
			return;
		}
	},
	inArray : function(v, array) {
		if (Object.isArray(array) == false) {
			return false;
		}
		for (var i = 0; i < array.length; i++) {
			if (v == array[i]) {
				return true;
			}
		}
		return false;
	},
	toggleIme : function() {
		if (this.active == true) {
			this.active = false;
		} else {
			this.active = true;
		}
	},
	textOnKeyDown : function(e) {
		if (this.active == false) {
			return true;
		}
		if (Mojo.Char.isDeleteKey(e.keyCode)) {
			if (this.inputPhase.length > 0) {
				// clean the pagination offset
				this.offset = 0;
				this.activeCandidateIndex = 2;
				if (this.selectedPinyin.length > 0) {
					// pop one and unshift it to this.inputPhase
					this.inputPinyin = this.formatPinyin(this.inputPhase);
					var selected = this.selected.pop();
					for (var i = 0; i < selected.length; i++) {
						this.inputPinyin.unshift(this.selectedPinyin.pop());
					}
					this.inputPhase = this.inputPinyin.join('');
					this.update();
					e.returnValue = false;
				} else {
					this.inputPhase = this.inputPhase.slice(0,
							this.inputPhase.length - 1);
					this.update();
					e.returnValue = false;
				}
			}
		}
	},
	textOnKeyPress : function(e) {
		// init this.selectingWordsPageSize
		// this.selectingWordsPageSize = config.wordsPageSize;
		// this.selectingKeys = config.selectingKeys;
		key = e.keyCode;
		if (this.active == false) {
			return true;
		}
		// Mojo.Log.info("textOnKeyPress ======> " + key);
		if (key == this.pageDownKey && this.hasCandidate) {
			this.pageDown();
			e.returnValue = false;
			return false;
		}
		if (key == this.pageUpKey && this.hasCandidate) {
			this.pageUp();
			e.returnValue = false;
			return false;
		}
		// Mojo.Log.info("hasCandidate ======> " + this.hasCandidate);
		if (Mojo.Char.isValidWrittenChar(key)) {
			if (key >= 97 && key <= 122 || key == this.spliterKey || key >= 65
					&& key <= 90) {
				if (key == this.spliterKey && this.hasCandidate === false) {
					return String.fromCharCode(key);
				}
				if (key >= 65 && key <= 90) {
					// force uppercase to lower case
					key += 32;
				}
				this.inputPhase += String.fromCharCode(key);
				this.update();
			} else {
				// Mojo.Log.info("selecting ======> " + key + " digit ==> " +
				// this.selectingKeys);
				if (this.inArray(key, this.selectingKeys)) {
					// choose from select list
					if (this.inputPhase.length > 0) {
						if (this.hasCandidate) {
							Mojo.Log.info("textOnKeyPress ==> "
									+ this.candidates);
							// Mojo.Log.info("textOnKeyPress ==> " +
							// this.activeCandidateIndex);
							var seqMap = [3, 1, 0, 2, 4];
							if (key === this.selectingKeys[0]) {
								this
										.phaseSelected(seqMap[this.activeCandidateIndex]);
							}
							// Mojo.Log.info("textOnKeyPress ==> " +
							// this.candidates);
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
							this.sendResult(this.inputPhase.substring(1,
									this.inputPhase.length));
							this.inputPhase = '';
							this.offset = 0;
							this.activeCandidateIndex = 2;
							this.update();
						}
					} else {
						return String.fromCharCode(key);
					}
				} else {
					// symbol keys
					return String.fromCharCode(key);
				}
			}
		}
		e.returnValue = false;
		return false;
	},
	pageUp : function() {
		if (this.offset >= this.limit) {
			this.offset = this.offset - this.limit;
		}
		this.activeCandidateIndex = 2;
		this.update();
	},
	pageDown : function() {
		this.activeCandidateIndex = 2;
		this.offset = this.offset + this.limit;
		this.update();
	},
	formatPinyin : function(pinyin) {
		if (Object.isArray(pinyin)) {
			return pinyin;
		}
		var pinyins = [];
		var phases = pinyin.split("'");
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
		this.inputPinyin = this.formatPinyin(this.inputPhase);
		var selected = this.candidates[index];
		for (var i = 0; i < selected.length; i++) {
			this.selectedPinyin.push(this.inputPinyin.shift());
		}
		this.selected.push(selected);
		this.inputPhase = this.inputPinyin.join('');
		// clean the pagination offset
		this.offset = 0;
		this.activeCandidateIndex = 2;
		// Mojo.Log.info("phaseSelected inputPhase ======> " + this.inputPhase);
		this.update();
	},
	sendResult : function(str) {
		// save selected phase to database here
		// by Jeffery
		if (this.isDiv) {
			// var exist = this.text.innerHTML;
			this.text.innerHTML += str;
		} else {
			var exist = this.text.getValue();
			this.text.value = exist + str;
		}
		return true;
		// var exist = this.text.mojo.getValue();
		if (exist.length > 0) {
			var pos = this.text.mojo.getCursorPosition();
		} else {
			var pos = {
				selectionStart : 0
			};
		}
		if (pos.selectionStart < exist.length) {
			var front = exist.substr(0, pos.selectionStart);
			var end = exist.substr(pos.selectionStart, exist.length);
			var result = front + str + end;
			var nowPos = pos.selectionStart + str.length;
		} else {
			var result = exist + str;
			var nowPos = result.length;
		}
		this.text.mojo.setValue(result);
		// Mojo.Log.info("sendResult nowPos ======> " + nowPos);
		this.text.mojo.setCursorPosition(nowPos, nowPos);
		// check this from sqlite
	},
	update : function() {
		this.inputPinyin = this.formatPinyin(this.inputPhase);
		// Mojo.Log.info("update inputPinyin ======> " + this.inputPinyin);
		// Mojo.Log.info("update offset ======> " + this.offset);
		var first = [];
		var rest = this.inputPinyin;
		if (rest.length > 6) {
			first = rest.splice(0, 6);
		} else {
			first = rest;
			rest = [];
		}
		// use first to get the candidates
		this.db.readCandidates(first, this.limit, this.offset,
				this.getCandidates.bind(this));
	},
	getCandidates : function(v) {
		this.candidates = v;
		if (v) {
			this.hasCandidate = true;
		} else {
			if (this.inputPhase.length > 0) {
				// it is the pagination function
				// now we found the last page, render it again
				this.offset = this.offset - this.limit;
				this.update();
			} else {
				this.hasCandidate = false;
				this.selectedPinyin = [];
				this.sendResult(this.selected.join(''));
				this.selected = [];
				this.offset = 0;
				this.activeCandidateIndex = 2;
				$('canvas').hide();
			}
		}
		// this.updateSelectingPanel();
		// this.updateResultPanel();
		if (this.inputPhase.length > 0) {
			this.updateCanvas();
		}
	},
	sortArray : function() {
		var candidates = [];
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
		var draw = '';
		this.inputPinyin = this.formatPinyin(this.inputPhase);
		if (this.inputPinyin.length > 0) {
			draw = this.selected.join('') + this.inputPinyin.join("'");
		}
		var candidates = this.sortArray();
		var activeIndex = [];
		for (var i = 0; i < 5; i++) {
			if (i == this.activeCandidateIndex) {
				activeIndex[i] = "on";
			} else {
				activeIndex[i] = "";
			}
		}
		var props = {
			draw : draw,
			candidate0 : candidates[0],
			candidate1 : candidates[1],
			candidate2 : candidates[2],
			candidate3 : candidates[3],
			candidate4 : candidates[4],
			class0 : activeIndex[0],
			class1 : activeIndex[1],
			class2 : activeIndex[2],
			class3 : activeIndex[3],
			class4 : activeIndex[4]
		};
		var canvas = Mojo.View.render({
					object : props,
					template : '/media/internal/canvas'
				});
		$('canvas').outerHTML = canvas;
		// Mojo.Log.info("canvas" + canvas);
	}
};