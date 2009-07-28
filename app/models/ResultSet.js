var ResultSet = function(){
	this._data = [];
	this._offset = 0;
	this._index1 = 0;
	this._index2 = 0;
	this._total = 0;
};

ResultSet.prototype = {
	_data: undefined,
	_offset: 0,
	_index1: 0,
	_index2: 0,
	_total: 0,
	add: function(object){
		this._data.push([object]);
		this._total ++;
		return 1;
	},
	addAll: function(objectArray){
		if(!objectArray)
			return 0;
		this._data.push(objectArray);
		this._total += objectArray.length;
		return objectArray.length;
	},
	addSet: function(set){
		if(!set || !set._data)
			return 0;
		var result = 0;
		for(var i=0;i<set._data.length;i++)
			result += this.addAll(set._data[i]);
		return result;
	},
	getRange: function(offset, limit){
		var oldOffset = this._offset;
		if(offset != this._offset){
			this.reset();
			if(offset)
				if(this.next(offset) < offset){
					this.go(oldOffset);
					return [];
				}
		}
		var result = [];
		for(var i=0;i<limit;i++){
			var value = this.current();
			if(value != undefined)
				result.push(value);
			if(this.next() <= 0)
				break;
		}
		this.go(oldOffset);
		return result;
	},
	go: function(offset){
		this.reset();
		this.next(offset);
	},
	reset: function(){ this._index1 = this._index2 = this._offset = 0; },
	next: function(number){
		number = arguments.length == 0 ? 1 : number;
		if(!number)
			return 0;
		var n = number;
		while(n > 0){
			var currentArray = this._data[this._index1];
			if(!currentArray)
				break;
			if(n < currentArray.length - this._index2){
				this._index2 += n;
				n = 0;
				break;
			}else{
				n -= currentArray.length - this._index2;
				this._index2 = 0;
				this._index1 ++;
				continue;
			}
		}
		this._offset += number - n;
		return number - n;
	},
	previous: function(number){
		number = arguments.length == 0 ? 1 : number;
		if(!number)
			return 0;
		var n = number;
		while(n > 0){
			var currentArray = this._data[this._index1];
			if(!currentArray){
				if(this._index2 > 0 || this._index1 <= 0)
					break;
				else{
					var previousArray = this._data[this._index1 - 1];
					if(previousArray){
						this._index1 --;
						this._index2 = previousArray.length - 1;
						n --;
						continue;
					}else
						break;
				}
			}
			if(n <= this._index2){
				this._index2 -= n;
				n = 0;
				break;
			}else{
				n -= this._index2;
				this._index2 = 0;
				var previousArray = this._data[this._index1 - 1];
				if(!previousArray)
					break;
				this._index1 --;
				this._index2 = previousArray.length - 1;
				n--;
				continue;
			}
		}
		this._offset -= number - n;
		return number - n;
	},
	current: function(){
		var currentArray = this._data[this._index1];
		if(!currentArray)
			return undefined;
		return currentArray[this._index2];
	},
	currentIndex: function(){ return this._offset; },
	size: function(){ return this._total; }
};