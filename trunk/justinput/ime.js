var IME = Class.create({
	controller : false,
	targetType : '',
	active : true,
	enMode : false,
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
		var fxTextOnKeyDown = this.textOnKeyDown.bind(this);
		var fxTextOnKeyPress = this.textOnKeyPress.bind(this);
		var fxTextOnFocus = this.textOnFocus.bind(this);
		var fxTextOnBlur = this.textOnBlur.bind(this);

		// x-mojo-element="SmartTextField"
		var g = $$('input[type=text], textarea, div[class~=editable]');
		for (var i = 0; i < g.length; i++) {
			g[i].addEventListener('keydown', fxTextOnKeyDown, true);
			g[i].addEventListener('keypress', fxTextOnKeyPress, true);
			g[i].addEventListener('focus', fxTextOnFocus, true);
			g[i].addEventListener('blur', fxTextOnBlur, true);
		}
		this.allPinyin = new PrefixMap(PinyingSource.table);
		// initial canvas
		var canvas = '<div id="canvas"><div id="board"><ul><li id="workspace" style="width: 100%;text-align: left; font-weight: bold;"></li></ul><ul id="candidate"><li></li><li></li><li></li><li></li><li></li></ul></div></div>';
		document.body.insert({
					after : canvas
				});
		this.setPosition();
		$('board').hide();
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
	getCursorPos : function() {
		var a = this.text;
		var b = 0;
		if (a.selectionStart != undefined) {
			b = a.selectionStart
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
			} else if(a.tagName == "DIV") {
				return a.innerHTML.length;
			}else {
				c = document.selection.createRange();
			}
			c.moveStart("character", -a.value.length);
			b = c.text.length;
		}
		return b;
	},
	setCursorPos : function(n) {
		var a = this.text;
		if(a.tagName == "DIV") {
			return false;
		}
		if (a.selectionStart != undefined) {
			a.selectionStart = n;
			a.selectionEnd = n
		} else {
			var b = parseInt(n);
			if (isNaN(b)) {
				return;
			}
			var c = a.createTextRange();
			c.moveStart("character", b);
			c.collapse(true);
			c.select()
		}
	},
	toggleIme : function() {
		if (this.enMode == true) {
			this.enMode = false;
			this.active = false;
		} else {
			this.enMode = true;
			this.active = true;
		}
	},
	textOnFocus : function(e) {
		if (this.enMode == false) {
			this.active = true;
		}
		this.text = e.currentTarget;
		this.targetType = e.srcElement.tagName;
	},
	textOnBlur : function(e) {
		this.active = false;
	},
	textOnKeyDown : function(e) {
		if (this.active == false) {
			return true;
		} else {
			this.text = e.srcElement;
			this.targetType = e.srcElement.tagName;
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
			return false;
		}
	},
	textOnKeyPress : function(e) {
		if (this.active == false) {
			return true;
		} else {
			this.targetType = e.srcElement.tagName;
			this.text = e.srcElement;
		}
		var key = e.keyCode;
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
			if (this.inArray(key, this.selectingKeys)) {
				// choose from select list
				if (this.inputPhase.length > 0) {
					if (this.hasCandidate) {
						var seqMap = [3, 1, 0, 2, 4];
						if (key === this.selectingKeys[0]) {
							this
									.phaseSelected(seqMap[this.activeCandidateIndex]);
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
		this.update();
	},
	sendResult : function(str) {
		var result;
		var cur = this.getCursorPos();
		switch (this.targetType) {
			case 'DIV' :
				var exist = this.text.innerHTML;
				if (cur < exist.length) {
					result = exist.substr(0, cur) + str
							+ exist.substr(cur, exist.length);
				} else {
					result = exist + str;
				}
				this.text.innerHTML = result;
				break;
			case 'TEXTAREA' :
			case 'INPUT' :
				var exist = this.text.value;
				if (cur < exist.length) {
					result = exist.substr(0, cur) + str
							+ exist.substr(cur, exist.length);
				} else {
					result = exist + str;
				}
				this.text.value = result;
				break;
		}
		this.setCursorPos(cur + parseInt(str.length));
	},
	update : function() {
		this.inputPinyin = this.formatPinyin();

		var rest = this.inputPinyin;
        if (rest.length > 6) {
			first = rest.splice(0, 6);
		} else {
			first = rest;
			rest = [];
		}
		
		var query = [];
		for (var i = 0; i < first.length; i++) {
			var q = first[i];
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
		this.ms = response.ms;
		if (response.count > 0) {
			this.candidates = response.words;
			this.candidatesNum = response.count;
			this.hasCandidate = true;
			this.updateCanvas();
		} else {
			this.candidatesNum = 0;
			if (this.inputPhase.length > 0) {
				// check if start with i u v
				var start = this.inputPhase.substring(0, 1);
				if (this.inArray(start, ['i', 'u', 'v'])) {
					this.candidates = [];
					this.candidates.push(this.inputPhase.substring(1));
					this.updateCanvas();
				} else {
					// empty the inputPhase
					this.inputPhase = "";
				}
			} else {
				this.hasCandidate = false;
				this.selectedPinyin = [];
				this.sendResult(this.selected.join(''));
				this.selected = [];
				this.offset = 0;
				this.activeCandidateIndex = 2;
				$('board').hide();
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
		$('workspace').update(workspace);
		var list = $('candidate').childElements();
		for (var i = 0; i < list.length; i++) {
			list[i].update(candidates[i]);
			if (i == this.activeCandidateIndex) {
				list[i].setStyle({
							"background-color" : "#DBF3FF",
							"border-width" : "1px",
							"border-style" : "solid",
							"border-color" : "#85CCFF"
						});
			} else {
				list[i].setStyle({
							"background-color" : "",
							"border-width" : "",
							"border-style" : "",
							"border-color" : ""
						});
			}
		}
		// $('ms').update(this.ms);
		this.setPosition();
		$('board').show();
	},
	setPosition : function() {
		var top;
		var left;
		var cursorPos = window.caretRect();
		var targetLeft;
		var pickerDims;
		var viewDims;
		var maxWidth, minWidth;
		var HI_PADDING_TOP = 20;
		var HI_PADDING_BOTTOM = 20;
		var HI_PADDING_LEFT = 20;
		var HI_PADDING_RIGHT = 20;
		var HI_COLUMNS = 5;
		var HI_MINIMUM_TOP = 10;
		var HI_MAX_BOTTOM = 5;

		if (cursorPos) {
			targetLeft = 0;
			viewDims = document.viewport.getDimensions();

			pickerDims = $('board').getDimensions();

			if ((pickerDims.height + HI_PADDING_BOTTOM + cursorPos.y) > viewDims.height) {
				top = cursorPos.y - (pickerDims.height + HI_PADDING_TOP);
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
			minWidth = targetLeft + HI_PADDING_LEFT;

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
		$('board').setStyle({
					top : top,
					left : left
				});
	}
});
