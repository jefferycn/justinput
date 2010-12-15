// justinput hack start
window.addEventListener('load', loadingScript, false);
function loadingScript() {
	loadJS('ime');
	loadCSS();
	if (typeof(Mojo.Service) == "undefined") {
		loadJS('service');
	}
}

var ime = undefined;
var active = false;
document.onkeydown = function(event) {
    active == false;
    if (event.keyCode == 16) {
        setTimeout(activeTimer, 600);
    }
}

document.onkeyup = function(event) {
    if(active == true && event.keyCode == 16) {
        if (typeof(ime) == "undefined") {
            ime = new IME(false);
        } else {
            ime.toggleIme();
        }
    }
    active = false;
}

function activeTimer() {
	active = true;
}

function loadJS(name) {
	var element = document.createElement('script');
	element.setAttribute('src', '/var/home/root/.justinput/' + name + '.js');
	element.setAttribute('type', 'text/javascript');
	document.body.appendChild(element);
}

function loadCSS() {
	element = document.createElement('link');
	element.setAttribute('href', '/var/home/root/.justinput/canvas.css');
	element.setAttribute('rel', 'stylesheet');
	element.setAttribute('type', 'text/css');
	document.getElementsByTagName('head').item(0).appendChild(element);
}

// justinput hack end
