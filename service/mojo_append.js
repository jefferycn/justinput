// justinput hack start
window.addEventListener('load', loadingScript, false);
function loadingScript() {
	loadJS('ime');
	loadCSS();
	if (typeof(Mojo.Service) == "undefined") {
		loadJS('service');
	}
}

var timePress = 0;
var ime = undefined;
var orange = false;
document.onkeydown = function(event) {
	if (orange == true && event.keyCode == 32) {
        if (typeof(ime) == "undefined") {
            ime = new IME(false);
        } else {
            ime.toggleIme();
        }
		event.returnValue = false;
	}
    if(event.keyCode == 129) {
        orange = true;
    }
}

document.onkeyup = function(event) {
    if(event.keyCode == 129) {
        orange = false;
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
// justinput hack end
