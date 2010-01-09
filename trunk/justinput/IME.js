var IME = function() {
	this.initialize();
}
IME.prototype = {
	controller : false,
	targetType : 'textfield',
	active : true,
	template : '/usr/palm/frameworks/mojo/justinput/canvas',
	//template : 'canvas',
	text : undefined,
	limit : 5,
	allPinyin : undefined,
	pageDownKey : 44,
	pageUpKey : 95,
	spliterKey : 39,
	spaceKey : 32,
	selectingKeys : [32, 64, 46],
	// selectingKeys : [32, 49, 50],
	inputPhase : "",
	inputPinyin : [],
	selectedPinyin : [],
	candidates : [],
	selected : [],
	hasCandidate : false,
	offset : 0,
	candidatesNum : 0,
	activeCandidateIndex : 2,
	initialize : function() {
		var target = Mojo.View
				.getFocusedElement(Mojo.Controller.getAppController()
						.getActiveStageController().activeScene().sceneElement);
		var type = target.getAttribute('x-mojo-element');
		if (type === null) {
			this.text = target.parentElement;
			type = this.text.getAttribute('x-mojo-element');
			if (type != 'TextField') {
				this.text = target;
				this.targetType = 'input';
			}
		} else {
			// div
			this.text = target;
			this.targetType = 'div';
		}
		this.inputPinyin = [];
		// strange, can not use Mojo.Event.keydown
		this.fxTextOnKeyDown = this.textOnKeyDown.bind(this);
		this.fxTextOnKeyPress = this.textOnKeyPress.bind(this);
		this.text.observe('keydown', this.fxTextOnKeyDown);
		this.text.observe('keypress', this.fxTextOnKeyPress);
		// this.text.observe(Mojo.Event.propertyChange,
		// this.textOnPropertyChange.bind(this));
		this.allPinyin = new PrefixMap(PinyingSource.table);
		// initial canvas
		var canvas = Mojo.View.render({object:{},template:this.template});
		document.body.insert({after:canvas});
		$('board').hide();
	},
	uninstall : function() {
		this.text.stopObserving('keydown', this.fxTextOnKeyDown);
		this.text.stopObserving('keypress', this.fxTextOnKeyPress);
		$('canvas').remove();
	},
	textOnPropertyChange : function(e) {
		var text = this.text;
		var result = text.mojo.getValue();
		if (!result) {
			return false;
		}
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
							// Mojo.Log.info("textOnKeyPress ==> " +
							// this.candidates);
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
		if (this.offset + this.limit < this.candidatesNum) {
			this.offset = this.offset + this.limit;
		}
		this.activeCandidateIndex = 2;
		this.update();
	},
	formatPinyin : function() {
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
		if (this.targetType == 'div') {
			this.text.textContent += str;
			document.getSelection().setPosition(this.text, true);
			return true;
		}

		if (this.targetType == 'input') {
			this.text.value += str;
			return true;
		}

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
		this.inputPinyin = this.formatPinyin();
		// Mojo.Log.info("update ======> " + this.inputPinyin);

		var query = [];
		for (var i = 0; i < this.inputPinyin.length; i++) {
			var q = this.inputPinyin[i];
			var full = "true";
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

		new Mojo.Service.Request('palm://com.youjf.jisrv', {
					method : 'get',
					parameters : {
						query : query,
						offset : this.offset
					},
					onSuccess : this.getCandidates.bind(this),
					onFailure : this.getCandidatesFalse.bind(this)
				});
	},
	getCandidatesFalse : function(r) {
		this.hasCandidate = false;
		this.selectedPinyin = [];
		this.sendResult(this.selected.join(''));
		this.selected = [];
		this.offset = 0;
		this.activeCandidateIndex = 2;
		$('board').hide();
	},
	getCandidates : function(response) {
		// Mojo.Log.info("getCandidates ======> " + response.count);
		if (response.count > 0) {
			this.candidatesNum = response.count;
			this.candidates = response.words;
			this.hasCandidate = true;
			this.updateCanvas();
		} else {
			this.candidatesNum = 0;
			// if (this.inputPhase.length > 0) {
			// // check if start with i u v
			// var start = this.inputPhase.substring(0, 1);
			// if (this.inArray(start, ['i', 'u', 'v'])) {
			// // do nothing
			// } else {
			// // it is the pagination function
			// // now we found the last page, render it again
			// this.offset = this.offset - this.limit;
			// this.update();
			// }
			// } else {
			this.hasCandidate = false;
			this.selectedPinyin = [];
			this.sendResult(this.selected.join(''));
			this.selected = [];
			this.offset = 0;
			this.activeCandidateIndex = 2;
			$('board').hide();
			// }
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
		var draw = '';
		this.inputPinyin = this.formatPinyin();
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
					template : this.template
				});
		$('canvas').outerHTML = canvas;
		// set the new height
		var height = (this.text.offsetTop + this.text.offsetHeight + 47) + 'px';
		$('board').setStyle({
					top : height,
					left : '12px'
				});
		$('board').show();
	}
};