window.addEventListener('load', loadingScript, false);
function loadingScript() {
	loadJS('PinyingSource');
	loadJS('PreFixMap');
	loadJS('ime');
	loadCSS();
	if (typeof(Mojo.Service) == "undefined") {
		loadJS('service');
	}
}

var timePress = 0;
var ime = undefined;
document.onkeydown = function(event) {
	if (event.keyCode == 231 || event.keyCode == 179) {
		if (timePress == 0) {
			timePress++;
			setTimeout(cleanTimer, 900);
		} else {
			if (typeof(ime) == "undefined") {
				ime = new IME();
			} else {
				ime.toggleIme();
			}
		}
		event.returnValue = false;
	}
}

function loadJS(name) {
	var element = document.createElement('script');
	element.setAttribute('src', '/usr/palm/frameworks/mojo/justinput/' + name + '.js');
	element.setAttribute('type', 'text/javascript');
	document.body.appendChild(element);
}

function loadCSS() {
	element = document.createElement('link');
	element.setAttribute('href', '/usr/palm/frameworks/mojo/justinput/canvas.css');
	element.setAttribute('rel', 'stylesheet');
	element.setAttribute('type', 'text/css');
	document.getElementsByTagName('head').item(0).appendChild(element);
}

function cleanTimer() {
	timePress = 0;
}
