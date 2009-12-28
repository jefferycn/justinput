var PrefixMap = function(serialized){
	this._rootState = serialized ? serialized : this._newState(1);
};

PrefixMap.toArray = function(str){
	if(typeof str == "string"){
		var result = [];
		for(var i = 0; i<str.length; i++)
			result.push(str.charAt(i));
		return result;
	}
	return str;
};

PrefixMap.Seeker = function(map, state, key, index){
	this.map = map;
	this.state = state;
	this.key = key;
	this.index= index;
};


PrefixMap.Seeker.prototype = {
	map: undefined,
	state: undefined,
	key: undefined,
	index: 0,
	findNextCompleted: function(){
		var state = this.state;
		var key = this.key;
		var index = this.index ? this.index : 0;
		for(;index < key.length;){
			state = this.map._getChild(state, key[index++]);
			if(state == undefined)
				break;
			if(this.map._isCompleted(state)){
				this.state = state;
				this.index = index;
				return 1;
			}
		}
		return 0;
	},
	getValue: function(){ return this.map._getValue(this.state); },
	getIndex: function(){ return this.index; },
	getState: function(){ return this.state; }
};

PrefixMap.prototype = {
	extend: function(object){
		for(var v in object)this[v] = object[v];
	},
	_rootState: undefined,
	_isCompleted: function(state){ return state ? (state[0] ? 1: 0): 0; },
	_getValue: function(state){ return state ? state[0] : undefined; },
	_setValue: function(state, value){ var oldValue = state[0] ; state[0] = value; return oldValue; },
	_getAllChildren: function(state, result){
		result = result ? result : [];
		if(!state)
			return result;
		var childrenMap = state[1];
		if(childrenMap)
			for(var k in childrenMap)
				result.push(childrenMap[k]);
		return result;
	},
	_getChildrenCount: function(state){ return state[2]; },
	_newState: function(value, children){
		value = value ? value : undefined;
		children = children ? children : {};
		var result = 
		[
			value,
			{},
			0
		];
		for(var k in children)
			this._setChild(result, k, children[k]);
		return result;
	},
	_getChild: function(state, key){
		if(!state)
			return undefined;
		var children = state[1];
		if(!children)
			return undefined;
		return children[key];
	},
	_setChild: function(state, key, newChild){
		if(!state)
			return undefined;
		var children = state[1];
		if(!children)
			return undefined;
		var oldChild = children[key];
		if(newChild == undefined && oldChild == undefined)
			return undefined;
		if(newChild == undefined){
			state[2] --;
			delete children[key];
		}else{
			if(oldChild == undefined)
				state[2] ++;
			children[key] = newChild;
		}
		return oldChild;
	},
	_removeChild: function(state, key){
		return this._setChild(state, key, undefined);
	},
	_find: function(state, key, startIndex, autoMake){
		state = state ? state : this._rootState;
		startIndex = startIndex ? startIndex : 0;
		autoMake = autoMake ? autoMake : 0;
		if(startIndex >= key.length)
			return null;
		var firstChar = key[startIndex];
		var childState = this._getChild(state, firstChar);
		if(!childState)
			if(autoMake){
				childState = this._newState();
				//add
				this._setChild(state, firstChar, childState); 
			}else
				return undefined;
		if(startIndex + 1 == key.length){
			return childState;
		}
		return this._find(childState, key, startIndex + 1, autoMake);
	},
	_getAllValue: function(state, limit, result){
		limit = limit ? limit : 65535;
		result = result ? result : [];
		var buffer = [state];
		while(buffer.length > 0 && limit > 0){
			var state = buffer.pop();
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
			if(v == undefined){
				for(var j=0;j<result.length;j++)
					this._getAllChildren(result[j], buffer);
			}else{
				for(var j=0;j<result.length;j++){
					var child = this._getChild(result[j], v);
					if(child)
						buffer.push(child);
				}
			}
			result = buffer;
			if(result.length ==0)
				break;
		}
		return result;
	},
	_getRelatedStates: function(startState, key, result){
		result = result ? result : [];
		var startIndex = result.length;
		var buffer = [];
		if(key[0] == undefined){
			this._getAllChildren(startState, buffer);
		}else{
			var child = this._getChild(startState, key[0]);
			if(child)
				buffer.push(child);
		}
		for(var k=buffer.length - 1; k> -1; k--)
			result.push(buffer[k]);
		var endIndex = result.length;
		
		for(var i=1;i<key.length - 1;i++){
			var v = key[i];
			if(startIndex == endIndex)
				break;
			var buffer = [];
			if(v == undefined){
				for(var j=startIndex;j<endIndex;j++)
					this._getAllChildren(result[j], buffer);
			}else{
				for(var j=startIndex;j<endIndex;j++){
					var child = this._getChild(result[j], v);
					if(child)
						buffer.push(child);
				}
			}
			for(var k=buffer.length - 1; k> -1; k--)
				result.push(buffer[k]);
			startIndex = endIndex;
			endIndex = result.length;
		}
		return result;
	},
	get: function(key){
		key = PrefixMap.toArray(key);
		var state = this._find(this._rootState, key);
		if(state && this._isCompleted(state))
			return this._getValue(state);
		return undefined;
	},
	getAll: function(key, limit, result){
		key = PrefixMap.toArray(key);
		var state = this._find(this._rootState, key);
		return this._getAllValue(state, limit, result);
	},
	search: function(key, blur, limit, result){
		key = PrefixMap.toArray(key);
		limit = limit ? limit : 65535;
		var resultStates = this._searchStates(this._rootState, key);
		result = result ? result : [];
		for(var j=0;j<resultStates.length;j++){
			if(result.length >= limit)
				break;
			this._getAllValue(resultStates[j], limit - result.length, result);
		}
		if(blur && result.length < limit){
			var relatedStates = this._getRelatedStates(this._rootState, key);
			for(var j=relatedStates.length - 1;result.length < limit && j>-1;j--){
				if(!this._isCompleted(relatedStates[j]))
					continue;
				result.push(this._getValue(relatedStates[j]));
			}
		}
		return result;
	},
	put: function(key, value){
		key = PrefixMap.toArray(key);
		var newState = this._find(this._rootState, key, 0, 1);
		return this._setValue(newState, value);
	},
	getSeeker: function(key, startIndex){
		key = PrefixMap.toArray(key);
		return new PrefixMap.Seeker(this, this._rootState, key, startIndex);
	},
	remove: function(key){
		key = PrefixMap.toArray(key);		
		var oldState = this._find(this._rootState, key);
		if(!oldState || !this._isCompleted(oldState))
			return undefined;
		var oldValue = this._setValue(oldState, undefined);
		if(this._getChildrenCount(oldState) > 0)
			return oldValue;
		var seeker = this.getSeeker(key, 0);
		while(seeker.findNextCompleted());
		
		var state = seeker.getState();
		for(var i = seeker.getIndex();i< key.length;i++){
			var character = key[i];
			var nextState = this._getChild(state, character);
			if(nextState == undefined)
				break;
			else{
				if(this._getChildrenCount(nextState) <= 1){
					this._removeChild(state, character);
					break;
				}
				state = nextState;
			}
		}
		return oldValue;
	},
	_toString: function(state, result){
		state = state ? state : this._rootState;
		if(result == undefined)
			result = {
				str: ""
			};
		var t = (typeof state[0]).charAt(0).toLowerCase();		
		result.str += "[" + (state[0]?(t == "s" ? "\""+state[0]+"\"" : ( t == "o" ? "object" : state[0])):"") + ",";
		var childrenCount = 0;
		result.str += "{";
		var children = state[1];
		var first = true;
		for(var k in children){
			if(first)
				first = false;
			else
				result.str += ",";
			
			result.str += "'" + k + "':";
			this._toString(children[k], result);
			childrenCount ++;
		}
		result.str += "}";
		result.str += "," + childrenCount + "]";
		return result.str;
	}
};
