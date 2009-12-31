var IME = function(panel, db) {
	this.text = panel.text;
	this.result = panel.result;
	this.select = panel.select;
	this.debug = panel.debug;
	this.db = db;
	this.initialize();
}
IME.prototype = {
	db : false,
	active : true,
	text : undefined,
	input : undefined,
	result : undefined,
	select : undefined,
	limit : 5,
	allPinyin : undefined,
	pageDownKey : 44,
	pageUpKey : 95,
	spliterKey : 39,
	spaceKey : 32,
	// default value, will be rewrite
	// selectingKeys : [32, 64, 46],
	selectingKeys : [49, 50, 51, 52, 53],
	inputPhase : "",
	inputPinyin : [],
	selectedPinyin : [],
	candidates : [],
	selected : [],
	hasCandidate : false,
	offset : 0,
	initialize : function() {
		this.inputPinyin = [];
		this.text.observe(Mojo.Event.propertyChange, this.textOnPropertyChange
						.bind(this));
		// strange, can not use Mojo.Event.keydown
		this.text.observe('keydown', this.textOnKeyDown.bind(this));
		this.text.observe('keypress', this.textOnKeyPress.bind(this));
		this.allPinyin = new PrefixMap(PinyingSource.table);
	},
	textOnPropertyChange : function(e) {
		var text = this.text;
		var result = text.mojo.getValue();
		var pos = text.mojo.getCursorPosition();
		text.mojo.setCursorPosition(0, result.length);
		document.execCommand('copy');
		text.mojo.setCursorPosition(pos.selectionStart, pos.selectionStart);
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
			if (this.hasCandidate) {
				// clean the pagination offset
				this.offset = 0;
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
		Mojo.Log.info("textOnKeyPress ======> " + key);
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
					if (this.hasCandidate) {
						var startingKeyCode = 49;
						var tmpSelectingKey = 0;
						var selectingKeys = this.selectingKeys.clone();
						for (var i = 0; i < this.candidates.length; i++) {
							tmpSelectingKey = selectingKeys.shift();
							if (key == tmpSelectingKey) {
								key = startingKeyCode + i;
							}
						}
						var digit = key - 48;
						digit = digit ? digit : 10;
						digit--;
						// Mojo.Log.info("selecting ======> " + key + " digit
						// ==> " + digit);
						this.phaseSelected(digit);
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
		this.update();
	},
	pageDown : function() {
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
		//Mojo.Log.info("phaseSelected inputPhase ======> " + this.inputPhase);
		this.update();
	},
	sendResult : function(str) {
		// save selected phase to database here
		// by Jeffery
		var exist = this.text.mojo.getValue();
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
		this.updateResultPanel();
		Mojo.Log.info("update inputPinyin ======> " + this.inputPinyin);
		var ready = [];
		var first = [];
		var rest = this.inputPinyin;
		var candidates = [];
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
				this.offset = this.offset - this.limit;
			} else {
				this.hasCandidate = false;
				this.selectedPinyin = [];
				this.sendResult(this.selected.join(''));
				this.selected = [];
				this.offset = 0;
			}
		}
		this.updateSelectingPanel();
	},
	updateSelectingPanel : function() {
		if (this.hasCandidate) {
			var html = '';
			for (var i = 0; i < this.candidates.length; i++) {
				html += ((i + 1) % 10) + '.' + this.candidates[i] + ' ';
			}
			this.select.update(html);
		} else {
			this.select.update('');
		}
	},
	updateResultPanel : function() {
		if (this.inputPinyin.length > 0) {
			this.result.update(this.selected.join('')
					+ this.inputPinyin.join("'"));
		} else {
			this.result.update('');
		}
	}
};