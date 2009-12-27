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
	initialize: function() {
		this.inputSize = this.inputPhase.length;
		this.text.observe(Mojo.Event.propertyChange, this.textOnPropertyChange.bind(this));
		this.text.observe('keydown', this.textOnKeyDown.bind(this));
		this.text.observe('keypress', this.textOnKeyPress.bind(this));
	//this.controller.listen("text", Mojo.Event.propertyChange, this.textOnPropertyChange.bindAsEventListener(this));
		this.allPinyin = new PrefixMap(PinyingSource.table);
		this.characters = {};
		this.characterMap = new PrefixMultiMap([2,{},0]);
		
		var characters = PinyingSource.map;
		for(var py in characters){
			var chars = characters[py];
			var shengmu = this.getShengmu(py);
			var yunmu = py.substr(shengmu.length);
			for(var i = 0; i<chars.length; i++){
				var c = chars.charAt(i);
				this.characterMap.add([shengmu, yunmu], [c, 2]);
				var list = this.characters[c];
				if(!list){
					this.characters[c] = [py];
					continue;
				}
				list.push(py);
			}
		}
		
		this.loadWordLibrary();
		
		this.selectedWords = [];
		this.selectedWordIndexs = [];
		this.selectedResult = "";
		this.inputPinyin = [];
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
	getWordKey: function(word) {
		Mojo.Log.info("getWordKey ======> " + word);
		var wordKey = [];
		for(var i=0;i<word.length;i++){
			var charPinyinList = this.characters[word.charAt(i)];
			if(!charPinyinList)
				return ;
			var charPinyin = charPinyinList[0];
			var shengmu = this.getShengmu(charPinyin);
			var yunmu = charPinyin.substr(shengmu.length);
			wordKey.push(shengmu);
			wordKey.push(yunmu);
		}
		return wordKey;
	},
	loadWordLibrary: function(){
		this.wordMap = new PrefixMultiMap([1,{},0]);
		var self = this;
		WordLibrary.loadWords(
			// use database to get the words
			function(word, count){
				var wordKey = self.getWordKey(word);
				self.wordMap.add(wordKey, [word, wordKey.length]);
			}
		);
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
		for(var i=0;i<pinyin.length;i++){
			var c =pinyin.charAt(i);
			if(c=="'")
				continue;
			var t = this.allPinyin.search(pinyin.substr(i), true);
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
		var index = this.inputPinyin[pinyinIndex][1] + this.getLastSelectedIndex();
		this.selectedWords.push(word);
		this.selectedWordIndexs.push(index);
		if(this.inputCursorIndex != this.inputPhase.length){
			this.inputCursorIndex = this.inputPhase.length;
		}
		if(this.getLastSelectedIndex() >= this.inputPhase.length){
			this.sendResult(this.selectedWords.join(""));
			this.inputPhase = "";
			this.inputCursorIndex = 0;
			this.selectedWords.length = 0;
			this.selectedWordIndexs.length = 0;
			this.inputSize = 0;
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
		var wordKey = this.getWordKey(str);
		var element = this.wordMap.get(wordKey);
		if(element == undefined) {
			this.wordMap.add(wordKey, [str, wordKey.length]);
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
	},
	update: function(){
		var i = this.getLastSelectedIndex();
		Mojo.Log.info("update ======> " + i);
		this.inputPinyin = this.formatPinyin(this.inputPhase.substr(i));
		Mojo.Log.info("update ======> " + this.inputPinyin);
		var searchKey = [];
		for(var i=0;i<this.inputPinyin.length;i++) {
			searchKey.push(this.inputPinyin[i][0]);
		}
		if(searchKey.length > 0){
			if(searchKey.length > 2){
				this.selectingWordsResultSet = this.wordMap.search(searchKey, true, 512);
				this.selectingWordsResultSet.addSet(this.characterMap.search(searchKey, true, 512));			
			}else
				this.selectingWordsResultSet = this.characterMap.search(searchKey, true, 512);
		}else{
			this.selectingWordsResultSet = null;
		}
		this.selectingWordsPaged();
		this.refreshResultPanel();
	},
	selectingWordsPaged: function(){
		if(!this.selectingWordsResultSet)
			this.selectingWordsCurrentPage = [];
		else	
			this.selectingWordsCurrentPage = this.selectingWordsResultSet.getRange(this.selectingWordsResultSet.currentIndex(), this.selectingWordsPageSize);
		Mojo.Log.info("selectingWordsPaged ======> " + this.selectingWordsCurrentPage);
		this.refreshSelectingPanel();
	},
	refreshResultPanel: function(){
		this.result.update(this.selectedWords.join("") + this.inputPhase.substr(this.getLastSelectedIndex()));
	},
	getLastSelectedIndex: function(){
		if(this.selectedWordIndexs && this.selectedWordIndexs.length > 0) {
			return this.selectedWordIndexs[this.selectedWordIndexs.length - 1];
		}
		return 0;
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