// justinput hack start
var ime = undefined;
window.addEventListener('load', loadingScript, false);
window.addEventListener('click', refreshStatus, false);
function loadingScript() {
    loadJS('PinyingSource');
    loadJS('PreFixMap');
    loadJS('ime');
    loadCSS();
    if (typeof(Mojo.Service) == "undefined") {
        loadJS('service');
    }
    setTimeout(initIme, 900);
}

function refreshStatus() {
    if(ime.active) {
        $('statusType').update('<img src="/usr/palm/frameworks/mojo/justinput/cn.gif" />');
    }else {
        $('statusType').update('<img src="/usr/palm/frameworks/mojo/justinput/en.gif" />');
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

function initIme() {
    ime = new IME();
}

// justinput hack end
