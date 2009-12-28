var IME = function(panel) {
	this.text = panel.text;
	this.result = panel.result;
	this.select = panel.select;
	this.debug = panel.debug;
	this.initialize();
}
IME.prototype = {
	active: true,
	text: undefined,
	input: undefined,
	result: undefined,
	select: undefined,
	inputSize: 0,
	allPinyin: undefined,
	characters: undefined,
	characterMap: undefined,
	selectingWordsCurrentPage : [],
	// default value, will be rewrite
	selectingWordsPageSize: 3,
	pageDownKey: 44,
	pageUpKey: 95,
	spliterKey: 39,
	spaceKey: 32,
	// default value, will be rewrite
	selectingKeys: [32, 64, 46],
	inputPhase: "",
	inputCursorIndex: 0,
	searchedCandidate: [],
	initialize: function() {
		this.inputSize = this.inputPhase.length;
		//this.allPinyin = new PrefixMap(PinyingSource.table);
		this.selectedWords = [];
		this.selectedWordIndexs = [];
		this.selectedResult = "";
		this.inputPinyin = [];
		this.text.observe(Mojo.Event.propertyChange, this.textOnPropertyChange.bind(this));
		// strange, can not use Mojo.Event.keydown
		this.text.observe('keydown', this.textOnKeyDown.bind(this));
		this.text.observe('keypress', this.textOnKeyPress.bind(this));
		
		this.searchedCandidate = [];
	},
	textOnPropertyChange: function(e) {
		var text = this.text;
		var result = text.mojo.getValue();
		var pos = text.mojo.getCursorPosition();
		text.mojo.setCursorPosition(0, result.length);
		document.execCommand('copy');
		text.mojo.setCursorPosition(pos.selectionStart, pos.selectionStart);
	},
	setSelectingWordsPageSize: function(v) {
		this.selectingWordsPageSize = v;
	},
	setSelectingKeys: function(v) {
		this.selectingKeys = v;
	},
	inArray: function(v, array) {
		if(Object.isArray(array) == false) {
			return false;
		}
		for(var i = 0; i < array.length; i ++) {
			if(v == array[i]) {
				return true;
			}
		}
		return false;
	},
	toggleIme: function() {
		if(this.active == true) {
			this.active = false;
		}else {
			this.active = true;
		}
	},
	textOnKeyDown: function(e) {
		if(this.active == false) {
			return true;
		}
		if(Mojo.Char.isDeleteKey(e.keyCode)) {
			if(this.inputPhase.length > 0) {
				var oldString = this.inputPhase;
				this.inputPhase = oldString.substr(0, oldString.length - 1);
				this.inputSize = this.inputPhase.length;
				this.resetInputPhase(oldString);
				this.update();
				e.returnValue = false;
			}else {
				this.inputSize = 0;
			}
		}
	},
	textOnKeyPress: function(e) {
		// init this.selectingWordsPageSize
		this.selectingWordsPageSize = config.wordsPageSize;
		this.selectingKeys = config.selectingKeys;
		key = e.keyCode;
		if(this.active == false) {
			return true;
		}
		if(key == this.pageDownKey && this.selectingWordsCurrentPage && this.selectingWordsCurrentPage.length > 0) {
			this.selectingWordsPageDown();
			e.returnValue = false;
			return false;
		}
		if(key == this.pageUpKey && this.selectingWordsCurrentPage && this.selectingWordsCurrentPage.length > 0) {
			this.selectingWordsPageUp();
			e.returnValue = false;
			return false;
		}
		if(Mojo.Char.isValidWrittenChar(key)) {
			if(key >= 97 && key <= 122 || key == this.spliterKey || key >= 65 && key <= 90) {
				if(key == this.spliterKey && !(this.selectingWordsCurrentPage && this.selectingWordsCurrentPage.length > 0)){
					return String.fromCharCode(key);
				}
				if(key >= 65 && key <= 90) {
					// force uppercase to lower case
					key += 32;
				}
                this.inputPhase += String.fromCharCode(key)
				this.inputSize = this.inputPhase ? this.inputPhase.length : 0;
				this.update();
			}else {
                if(this.inArray(key, this.selectingKeys)) {
                    // choose from select list
					if(this.selectingWordsCurrentPage && this.selectingWordsCurrentPage.length > 0){
						var startingKeyCode = 49;
						var tmpSelectingKey = 0;
						var selectingKeys = this.selectingKeys.clone();
						for(var i = 0; i < this.selectingWordsPageSize; i ++) {
							tmpSelectingKey = selectingKeys.shift();
							if(key == tmpSelectingKey) {
								key = startingKeyCode + i;
							}
						}
						var digit = key - 48;
						digit = digit ? digit : 10;
						digit --;
						this.phaseSelected(digit);
					}else {
						return String.fromCharCode(key);
					}
                }else {
                	// symbol keys
                	return String.fromCharCode(key);
                }
			}
		}
		e.returnValue = false;
		return false;
	},
	getPyCandidate: function(search, pyTable) {
                        var current = search.splice(0, 1);
                        if(pyTable[1][current] === undefined) {
                            // not a valid start
                            search.unshift(current);
                            return search.join('');
                        }else {
                            if(pyTable[1][current][2] === 0 || search.size() === 0) {
                                if(pyTable[1][current][0]) {
                                    this.searchedCandidate.push(pyTable[1][current][0]);
                                }
                                if(pyTable[1][current][2] === 0) {
                                    // the end of the this node
                                    return this.getPyCandidate(search, PinyingSource.table);
                                }else {
                                    // the end of the search string, find all sons
                                    this.getAllPyChildCandidate(pyTable[1][current]);
                                    return '';
                                }
                            }else {
                                var notMatch = this.getPyCandidate(search, pyTable[1][current]);
                                if(notMatch && (current == 'a' || current == 'e' || current == 'o')) {
                                    this.searchedCandidate.push(current);
                                    return this.getPyCandidate(search, PinyingSource.table);
                                }else {
                                    return notMatch;
                                }
                            }
                        }
                },
getAllPyChildCandidate: function(pyTable) {
                            var json = pyTable[1];
                            for(var i in json) {
                                if(json[i][0]) {
                                    this.searchedCandidate.push(json[i][0]);
                                }
                                if(json[i][2] > 0) {
                                    this.getAllPyChildCandidate(json[i]);
                                }
                            }
                        },
	selectingWordsPageUp: function(){
		if(!this.selectingWordsResultSet)
			return ;
		if(this.selectingWordsResultSet.previous(this.selectingWordsPageSize))
			this.selectingWordsPaged();
	},
	selectingWordsPageDown: function(){
		if(!this.selectingWordsResultSet)
			return ;
		if(this.selectingWordsResultSet.size() - this.selectingWordsResultSet.currentIndex() < this.selectingWordsPageSize)
			return ;
		if(this.selectingWordsResultSet.next(this.selectingWordsPageSize))
			this.selectingWordsPaged();
	},
	resetInputPhase: function(oldPhase){
		var newPhase = this.inputPhase;
		var minLen = Math.min(newPhase.length, oldPhase.length);
		for(var i=0;i<minLen && newPhase.charAt(i) == oldPhase.charAt(i);i++);
		if(this.selectedWordIndexs && this.selectedWordIndexs.length > 0)
			for(var j=this.selectedWordIndexs.length - 1; j > -1 ;j--)
				if(this.selectedWordIndexs[j] <= i){
					this.selectedWordIndexs.length = this.selectedWords.length = j + 1;
					return;
				}
		this.selectedWordIndexs.length = this.selectedWords.length = 0;
	},
    getShengmu: function(str){
        for(var i=0;i<str.length;i++){
            var c = str.charAt(i);
            if(c == "a" || c == "o" || c == "e" || c == "i" || c == "u" || c == "v")
                return str.substr(0, i);
        }
        return str;
    },
	formatPinyin: function(pinyin){
		if(pinyin.join) {
			pinyin = pinyin.join("'");
		}
		var pinyins = [];
		this.searchedCandidate = [];
		for(var i=0;i<pinyin.length;i++){
			var c =pinyin.charAt(i);
			if(c=="'")
				continue;
			var t = this.getPyCandidate(pinyin.substr(i).toArray(), PinyingSource.table);
			Mojo.Log.info("formatPinyin: ==> " + this.searchedCandidate);
			if(t && t.length > 0){
				var r = t[0];
				pinyins.push([r, i+r.length]);
				i+= r.length - 1;
				continue;
			}else{
				pinyins.push([c, i+1]);
				continue;
			}
		}
		var result = [];
		for(var i=0;i<pinyins.length;i++){
			var p = pinyins[i];
			var s = this.getShengmu(p[0]);
			var y = undefined;
			if(s.length < p[0].length) {
				y = p[0].substr(s.length);
			}
			result.push([s, p[1] - p[0].length + s.length]);
			result.push([y, p[1]]);
		}
		return result;
	},
	phaseSelected: function(index){
		if(!this.selectingWordsCurrentPage || !this.selectingWordsCurrentPage[index])
			return;
		var word = this.selectingWordsCurrentPage[index][0];
		var pinyinIndex = this.selectingWordsCurrentPage[index][1] - 1;
		while(this.inputPinyin[pinyinIndex] == undefined)
			pinyinIndex --;
		var index = this.inputPinyin[pinyinIndex][1];
		this.selectedWords.push(word);
		this.selectedWordIndexs.push(index);
		if(this.inputCursorIndex != this.inputPhase.length){
			this.inputCursorIndex = this.inputPhase.length;
		}
		this.update();
	},
	sendResult: function(str) {
		// save selected phase to database here
		// by Jeffery
		var exist = this.text.mojo.getValue();
		if(exist.length > 0) {
			var pos = this.text.mojo.getCursorPosition();
		}else {
			var pos = {selectionStart: 0};
		}
		if(pos.selectionStart < exist.length) {
			var front = exist.substr(0, pos.selectionStart);
			var end = exist.substr(pos.selectionStart, exist.length);
			var result = front + str + end;
			var nowPos = pos.selectionStart + str.length;
		}else {
			var result = exist + str;
			var nowPos = result.length;
		}
		this.text.mojo.setValue(result);
		this.text.mojo.setCursorPosition(nowPos, nowPos);
		// check this from sqlite
		/**
		var wordKey = this.getWordKey(str);
		var element = this.wordMap.get(wordKey);
		if(element == undefined) {
			// 
		}else {
			if(element.length > 0) {
				var notfound = true;
				for(var i = 0; i < element.length; i ++) {
					if(str === element[i][0]) {
						notfound = false;
						break;
					}
				}
				if(notfound) {
					this.wordMap.add(wordKey, [str, wordKey.length]);
					config.words.push(str);
				}
			}
		}
		* **/
	},
	update: function(){
		this.inputPinyin = this.formatPinyin(this.inputPhase);
		Mojo.Log.info("update inputPinyin ======> " + this.inputPinyin);
		var searchKey = [];
		for(var i=0;i<this.inputPinyin.length;i++) {
			searchKey.push(this.inputPinyin[i][0]);
		}
		/**
		if(searchKey.length > 0){
			if(searchKey.length > 2){
				this.selectingWordsResultSet = this.wordMap.search(searchKey, true, 512);
				this.selectingWordsResultSet.addSet(this.characterMap.search(searchKey, true, 512));			
			}else
				this.selectingWordsResultSet = this.characterMap.search(searchKey, true, 512);
		}else{
			this.selectingWordsResultSet = null;
		}
		**/
		this.selectingWordsPaged();
		this.refreshResultPanel();
	},
	selectingWordsPaged: function(){
		if(!this.selectingWordsResultSet)
			this.selectingWordsCurrentPage = [];
		else	
			this.selectingWordsCurrentPage = this.selectingWordsResultSet.getRange(this.selectingWordsResultSet.currentIndex(), this.selectingWordsPageSize);
		this.refreshSelectingPanel();
	},
	refreshResultPanel: function(){
		this.result.update(this.selectedWords.join("") + this.inputPhase);
	},
	refreshSelectingPanel: function(){
		var words = [];
		for(var i=0;i<this.selectingWordsCurrentPage.length;i++) {
			words.push(this.selectingWordsCurrentPage[i][0]);
		}
		var html = '';
		for(var i=0;i<words.length;i++){
			html += ((i+1)%10) + '.' + words[i] + '';
		}
		this.select.update(html ? html : '');
	}
};