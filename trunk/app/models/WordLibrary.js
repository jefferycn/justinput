var WordLibrary = function(){
};

WordLibrary._receiveWordFunction = null;

WordLibrary.addWords = function(wordArray, count){
	if(!WordLibrary._receiveWordFunction) {
		return 0;
	}
	for(var i=0; i< wordArray.length; i++) {
		WordLibrary._receiveWordFunction(wordArray[i], count);
	}
	return wordArray.length;
};

WordLibrary.loadWords = function(receiveFunction){
	WordLibrary._receiveWordFunction = receiveFunction;
};