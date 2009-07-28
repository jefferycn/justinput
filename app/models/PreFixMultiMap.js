var PrefixMultiMap = function(){
	PrefixMap.prototype.extend.apply(this, [new PrefixMap()]);
	this.extend(PrefixMultiMap.prototype);
};

PrefixMultiMap.prototype = {
	_getAllValue: function(state, limit, result){
		limit = limit ? limit : 65535;
		result = result ? result : new ResultSet();
		var buffer = [state];
		while(buffer.length > 0 && limit > 0){
			var state = buffer.pop();
			if(this._isCompleted(state)){
				var arr = this._getValue(state);
				if(arr){
					result.addAll(arr);
					limit -= arr.length;
				}
			}
			this._getAllChildren(state, buffer);
		}
		return result;
	},
	getAt: function(key, index){
		index = index ? index : 0;
		var arr = this.get(key);
		return arr ? arr[index] : undefined;
	},
	add: function(key, value){
		var arr = this.get(key);
		if(!arr)
			this.put(key, [value]);
		else
			arr.push(value);
	},
	getAll: function(key, limit, result){
		key = PrefixMap.toArray(key);
		var state = this._find(this._rootState, key);
		return this._getAllValue(state, limit, value);
	},
	search: function(key, blur, limit, result){
		key = PrefixMap.toArray(key);
		limit = limit ? limit : 65535;
		var resultStates = this._searchStates(this._rootState, key);
		result = result ? result : new ResultSet();
		for(var j=0;j<resultStates.length;j++){
			if(result.size() >= limit)
				break;
			this._getAllValue(resultStates[j], limit - result.length, result);
		}
		if(blur && result.size() < limit){
			var relatedStates = this._getRelatedStates(this._rootState, key);
			for(var j=relatedStates.length - 1;result.size() < limit && j>-1;j--){
				if(!this._isCompleted(relatedStates[j]))
					continue;
				result.addAll(this._getValue(relatedStates[j]));
			}
		}
		return result;
	}
};
