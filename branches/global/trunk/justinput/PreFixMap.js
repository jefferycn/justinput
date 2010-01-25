var PrefixMap = function(serialized){
	this._rootState = serialized ? serialized : this._newState(1);
};

PrefixMap.toArray = function(str){
	if(typeof str == "string"){
		var result = [];
		for(var i = 0; i<str.length; i++) {
			result.push(str.charAt(i));
		}
		return result;
	}
	return str;
};

PrefixMap.prototype = {
	extend: function(object){
		if(object) {
			for(var v in object) {
				this[v] = object[v];
			}
		}
	},
	_rootState: undefined,
	_isCompleted: function(state){ return state ? (state[0] ? 1: 0): 0; },
	_getValue: function(state){ return state ? state[0] : undefined; },
	_getAllChildren: function(state, result){
		result = result ? result : [];
		if(!state) {
			return result;
		}
		var childrenMap = state[1];
		if(childrenMap) {
			for(var k in childrenMap) {
				result.push(childrenMap[k]);
			}
		}
		return result;
	},
	_newState: function(value, children){
		value = value ? value : undefined;
		children = children ? children : {};
		var result = 
		[
			value,
			{},
			0
		];
		for(var k in children) {
			this._setChild(result, k, children[k]);
		}
		return result;
	},
	_getChild: function(state, key){
		if(!state) {
			return undefined;
		}
		var children = state[1];
		if(!children) {
			return undefined;
		}
		return children[key];
	},
	_setChild: function(state, key, newChild){
		if(!state) {
			return undefined;
		}
		var children = state[1];
		if(!children) {
			return undefined;
		}
		var oldChild = children[key];
		if(newChild === undefined && oldChild === undefined) {
			return undefined;
		}
		if(newChild === undefined){
			state[2] --;
			delete children[key];
		}else{
			if(oldChild === undefined) {
				state[2] ++;
			}
			children[key] = newChild;
		}
		return oldChild;
	},
	_getAllValue: function(state, limit, result){
		limit = limit ? limit : 65535;
		result = result ? result : [];
		var buffer = [state];
		while(buffer.length > 0 && limit > 0){
			state = buffer.pop();
			if(this._isCompleted(state)){
				result.push(this._getValue(state));
				limit --;
			}
			this._getAllChildren(state, buffer);
		}
		return result;
	},
	_searchStates: function(state, key){
		var result = [state];
		for(var i=0;i<key.length;i++){
			var v = key[i];
			var buffer = [];
			if(v === undefined){
				for(var j=0;j<result.length;j++) {
					this._getAllChildren(result[j], buffer);
				}
			}else{
				for(var j=0;j<result.length;j++){
					var child = this._getChild(result[j], v);
					if(child) {
						buffer.push(child);
					}
				}
			}
			result = buffer;
			if(result.length === 0) {
				break;
			}
		}
		return result;
	},
	_getRelatedStates: function(startState, key, result){
		result = result ? result : [];
		var startIndex = result.length;
		var buffer = [];
		if(key[0] === undefined){
			this._getAllChildren(startState, buffer);
		}else{
			var child = this._getChild(startState, key[0]);
			if(child) {
				buffer.push(child);
			}
		}
		for(var k=buffer.length - 1; k> -1; k--) {
			result.push(buffer[k]);
		}
		var endIndex = result.length;
		
		for(var i=1;i<key.length - 1;i++){
			var v = key[i];
			if(startIndex == endIndex) {
				break;
			}
			buffer = [];
			if(v === undefined){
				for(var j=startIndex;j<endIndex;j++) {
					this._getAllChildren(result[j], buffer);
				}
			}else{
				for(var j=startIndex;j<endIndex;j++){
					var child = this._getChild(result[j], v);
					if(child) {
						buffer.push(child);
					}
				}
			}
			for(var k=buffer.length - 1; k> -1; k--) {
				result.push(buffer[k]);
			}
			startIndex = endIndex;
			endIndex = result.length;
		}
		return result;
	},
	search: function(key, blur, limit, result){
		key = PrefixMap.toArray(key);
		limit = limit ? limit : 65535;
		var resultStates = this._searchStates(this._rootState, key);
		result = result ? result : [];
		for(var j=0;j<resultStates.length;j++){
			if(result.length >= limit) {
				break;
			}
			this._getAllValue(resultStates[j], limit - result.length, result);
		}
		if(blur && result.length < limit){
			var relatedStates = this._getRelatedStates(this._rootState, key);
			for(var j=relatedStates.length - 1;result.length < limit && j>-1;j--){
				if(!this._isCompleted(relatedStates[j])) {
					continue;
				}
				result.push(this._getValue(relatedStates[j]));
			}
		}
		return result;
	}
};
