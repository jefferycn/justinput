function palmInitFramework200_72(window, document, navigator) {

with(window) {

Mojo.mode = 'production';
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */











Mojo.Config={};


Mojo.Config.MOJO_HOME="/usr/palm/frameworks/mojo";
Mojo.Config.MOJO_FRAMEWORK_HOME=Mojo.Config.MOJO_HOME+Mojo.generateFrameworkHome();

Mojo.Config.REQUIRED_PROTOTYPE='1.6.0';

Mojo.Config.COMPONENT_TYPES=["javascript","template","image","stylesheet"];
Mojo.Config.TEMPLATES_HOME=Mojo.Config.MOJO_HOME+Mojo.generateFrameworkHome()+'/templates';
Mojo.Config.IMAGES_HOME=Mojo.Config.MOJO_HOME+Mojo.generateFrameworkHome()+'/images';
Mojo.Config.ACCOUNT_IMAGES_HOME=Mojo.Config.IMAGES_HOME+'/accounts';
Mojo.Config.CSS_HOME=Mojo.Config.MOJO_HOME+Mojo.generateFrameworkHome()+'/stylesheets';
Mojo.Config.JS_HOME=Mojo.Config.MOJO_HOME+Mojo.generateFrameworkHome()+'/javascripts';

Mojo.Config.debuggingEnabled=false;
Mojo.Config.loadStylesWithLink=true;


Mojo.Environment={
};

Mojo.Environment.AZERTY='AZERTY';
Mojo.Environment.QWERTZ='QWERTZ';
Mojo.Environment.QWERTY='QWERTY';

Mojo.Environment.TOUCHABLE_ROW_HEIGHT=48;


Mojo.Environment.__defineGetter__("DeviceInfo",function(){
var height;
var bannerHeight=28;
var touchableHeight;

delete this.DeviceInfo;
this.DeviceInfo=Mojo.parseJSON(PalmSystem.deviceInfo);


if(!this.DeviceInfo.touchableRows){
height=this.DeviceInfo.maximumCardHeight-bannerHeight;
touchableHeight=Mojo.Environment.TOUCHABLE_ROW_HEIGHT;
this.DeviceInfo.touchableRows=Math.floor(height/touchableHeight);
}
return this.DeviceInfo;
});


Mojo.Environment.hasQuerySelector=function(){
var hasQuerySelector=HTMLElement.prototype.querySelector!==undefined;


if(!hasQuerySelector){
HTMLElement.prototype.querySelector=function(sel)
{
var results=this.select(sel);
return results&&results[0];
};

HTMLElement.prototype.querySelectorAll=function(sel)
{
return this.select(sel);
};
}

return hasQuerySelector;
}();


Mojo.relaunch=function(){
var result=false;
try{
Mojo.Log.info("Relaunch requested for application: "+Mojo.appName);
Mojo.requireDefined(Mojo.Controller,"Mojo.Controller must be defined.");
Mojo.requireFunction(Mojo.Controller.getAppController,"Mojo.Controller.getAppController must be a function.");
var appController=Mojo.Controller.getAppController();
Mojo.requireDefined(appController,"Mojo.Controller.getAppController() must return the application controller.");
Mojo.requireFunction(appController.handleRelaunch,"Mojo.Controller.getAppController().handleRelaunch must be a function.");
var params=Mojo.getLaunchParameters();
Mojo.Controller.getAppController().handleRelaunch(params);
result=true;

}catch(e){
Mojo.Log.error("Relaunch failed.");
Mojo.Log.logException(e,"Relaunch failed.");
if(params){
Mojo.Log.logProperties(params,"relaunchParams");
}
}
return result;
};


Mojo.imagePath=function(file){


var img=Mojo.Config.IMAGES_HOME+"/"+file;
var lastSlash=img.lastIndexOf('/',0);
if(img.indexOf('.',lastSlash)==-1){
img+=Mojo.Config.DEFAULT_IMAGE_EXT;
}
return img;
};


Mojo.templatePath=function(file){
return Mojo.Config.TEMPLATES_HOME+"/"+file+Mojo.Config.TEMPLATE_EXT;
};


Mojo.stylesheetPath=function(file){
return Mojo.Config.CSS_HOME+"/"+file+Mojo.Config.CSS_EXT;
};


Mojo.javascriptPath=function(file){
return Mojo.Config.JS_HOME+"/"+file+Mojo.Config.JS_EXT;
};


Mojo.convertLaunchParams=function(launchParams){
if(!Object.isString(launchParams)){
Mojo.Log.warn("Warning: launch parameters in any format but JSON is deprecated.");
return launchParams;
}
if(Object.isString(launchParams)&&launchParams.isJSON()){
try{

var params=launchParams.evalJSON();
return params;
}catch(error){
}
}
if(Object.isString(launchParams)){
if(launchParams.length>0){
Mojo.Log.warn("Warning: launch parameters in any format but JSON is deprecated.");
}
return launchParams;
}
throw"Error, launch parameters are not valid! Must be a string in JSON format.";
};


Mojo.getLaunchParameters=function(){
return Mojo.convertLaunchParams(PalmSystem.launchParams);
};


Mojo.Config.CORE_JS_FRAMEWORK_COMPONENTS=["controller","model","service","view"];

Mojo.Config.CORE_FRAMEWORK_COMPONENTS=Mojo.Config.CORE_JS_FRAMEWORK_COMPONENTS;

Mojo.Config.MOJO_PREFIX_PATTERN=/^mojo-.*/;

Mojo.Config.HTML_EXT=".html.ejs";
Mojo.Config.JS_EXT=".js";
Mojo.Config.CSS_EXT=".css";
Mojo.Config.TEMPLATE_EXT=".html";
Mojo.Config.DEFAULT_IMAGE_EXT=".png";


Mojo.generateFrameworkComponentPaths=function(name,componentType,localized,optionalVersion){
var paths=[];
var componentDir;
var fileExtension;
var cssVersion=optionalVersion||"";

var allowed;
var i=0;
while(!allowed&&i<Mojo.Config.COMPONENT_TYPES.length){
allowed=(Mojo.Config.COMPONENT_TYPES[i]==componentType);
i++;
}


if(allowed){

switch(componentType){
case"javascript":
componentDir="javascripts";
fileExtension=Mojo.Config.JS_EXT;
break;
case"template":
componentDir="templates";
fileExtension=Mojo.Config.TEMPLATE_EXT;
break;
case"images":
componentDir="images";
fileExtension=".png";
break;
case"stylesheet":
componentDir="stylesheets";
fileExtension=Mojo.Config.CSS_EXT;
if(cssVersion!==""){
fileExtension="-"+cssVersion+fileExtension;
}
break;
}

if(localized){
paths.push(Mojo.Locale.frameworkLocalizedResourcePath+"/"+componentDir+"/"+name+fileExtension);
paths.push(Mojo.Locale.frameworkLanguageResourcePath+"/"+componentDir+"/"+name+fileExtension);
paths.push(Mojo.Locale.frameworkRegionResourcePath+"/"+componentDir+"/"+name+fileExtension);
}else{
paths.push(Mojo.Config.MOJO_FRAMEWORK_HOME+"/"+componentDir+"/"+name+fileExtension);
}
return paths;
}
};


Mojo.loadJSONFile=function loadJSONFile(pathToFile,suppressWarning){
var resultingObject;
try{
var jsonText=palmGetResource(pathToFile,suppressWarning);
if(jsonText){
resultingObject=Mojo.parseJSON(jsonText);
}
}catch(e){
if(!suppressWarning&&Mojo.Log){
Mojo.Log.error("Failed to load json file from '%s'",pathToFile);
Mojo.Log.logException(e);
}
}
return resultingObject;
};


Mojo.loadAppInfo=function loadAppInfo(){
Mojo.appInfo={noWindow:false};
var loadedInfo=Mojo.loadJSONFile(Mojo.appPath+"appinfo.json");
Mojo.appInfo=Object.extend(Mojo.appInfo,loadedInfo);
};


Mojo.loadFrameworkConfigurationFrom=function(configSource){
var moreFrameworkConfig=Mojo.loadJSONFile(configSource+"framework_config.json",true);
Mojo.Environment.frameworkConfiguration=Object.extend(Mojo.Environment.frameworkConfiguration,moreFrameworkConfig);
};


Mojo.loadFrameworkConfiguration=function(){
var htmlEscapeOverride;
var placesToLook;
var defaultLoggingLevel=Mojo.Log.LOG_LEVEL_ERROR;
var loadAllWidgets=(Mojo.Host.current===Mojo.Host.browser);

if(Mojo.Host.current===Mojo.Host.browser){
defaultLoggingLevel=Mojo.Log.LOG_LEVEL_INFO;
}

Mojo.Environment.frameworkConfiguration={
logLevel:defaultLoggingLevel,
loadAllWidgets:loadAllWidgets
};



htmlEscapeOverride={
"net.likeme":true,
"com.zumobi.todayshow":true,
"com.zumobi.mlb":true,
"com.ulocate.app.where":true,
"com.splashdata.app.splashid":true,
"com.splashdata.app.mcraig":true,
"com.splashdata.app.infopedia":true,
"com.shortcovers.palm.pre":true,
"com.pivotallabs.webos.tweed":true,
"com.palm.pandora":true,
"com.nytimes.reader":true,
"com.match.mobile.palm":true,
"com.markspace.mybookmarks":true,
"com.markspace.missingsync":true,
"com.lumoslabs.speed-brain":true,
"com.linkedin.mobile":true,
"com.handmark.app.stocks":true,
"com.goodrec.app.goodfood":true,
"com.flixster.app.movies":true,
"com.flightview.palm":true,
"com.fandango.app.fandango":true,
"com.evernote.palm.app.evernote":true,
"com.ea.connect4":true,
"com.citysearch.mobile":true,
"com.chapura.pocketmirror":true,
"com.cakefight.sudoku":true,
"com.beeweeb.gopayment":true,
"com.apnews.webos":true,
"com.accuweather.palm":true,
"com.motionapps.app.classic":true,
"com.funkatron.app.spaz":true
};

if(htmlEscapeOverride[Mojo.appInfo.id]){
Mojo.Environment.frameworkConfiguration.escapeHTMLInTemplates=false;
Mojo.Config.compatibilityMode=true;
}

placesToLook=[Mojo.Config.MOJO_FRAMEWORK_HOME+"/",Mojo.appPath];
placesToLook.each(Mojo.loadFrameworkConfigurationFrom);
};


Mojo.loadFramework=function(){
var noSetInterval;

if(Mojo.Host.current===Mojo.Host.browser){
var queryParams=document.URL.toQueryParams();
PalmSystem.launchParams=queryParams.mojoHostLaunchParams||"{}";
if(PalmSystem.launchParams==="undefined"){
PalmSystem.launchParams="{}";
}
}

var match;
Mojo.appPath=Mojo._calculateAppRootPath();
Mojo.appName=Mojo._calculateAppName();

Mojo.loadAppInfo();

var re=/http:\/\/(.*:[0-9]+)/;
match=document.baseURI.match(re);
if(!match){
Mojo.hostingPrefix="file://";
}else{
Mojo.hostingPrefix=match[0];
}

match=Mojo.loadString&&Mojo.loadString.match(/mode=test/);
if(match){
console.log("Framework in test mode.");
Mojo.mode="test";
}

if(Mojo.mode!=="production"){
Mojo.Config.FRAMEWORK_COMPONENTS.each(function(c){

document.write('<script type="text/javascript" src="'+Mojo.generateFrameworkComponentPaths(c,"javascript")[0]+'"><\/script>');
});

if(!window.palmService&&!window.PalmServiceBridge){

document.write('<script type="text/javascript" src="'+Mojo.generateFrameworkComponentPaths("service_emulation","javascript")[0]+'"><\/script>');
}
}

if(Mojo.mode!=="test"){
Mojo.loadStylesheets();
}

if(Mojo.appInfo.noWindow&&Mojo.Host.current!==Mojo.Host.browser&&!window.opener){
noSetInterval=function(){
Mojo.Log.warn("Cannot use the global setInterval function from a hidden window. Use window.setInterval from a visible window.");
};
window.setInterval=noSetInterval;
}

};


Mojo.loadStylesheetsWithLink=function(stageDocument,localized){
var cssVersion=Mojo.appInfo["css-styling-version"];
var targetDocument=stageDocument||document;
var queryParams=targetDocument.URL.toQueryParams();
var stageType=queryParams.window;
var styleSheetList=["global","global-dev","global-dark"];
if(Mojo.appInfo.theme==='light'){
styleSheetList=["global","global-dev"];
}
if(!Mojo.appInfo.noDeprecatedStyles){
styleSheetList.push("global-deprecated");
}
switch(stageType){
case'popupalert':
case'banneralert':
case'activebanner':
case'dashboard':
styleSheetList=["global-base","global-notifications"];
break;
}
styleSheetList.each(function(cssFileName){
Mojo.generateFrameworkComponentPaths(cssFileName,"stylesheet",localized,cssVersion).each(function(path){
Mojo.loadStylesheet(targetDocument,Mojo.hostingPrefix+path);
});
});
};


Mojo.loadStylesheetsWithPalmGetResource=(function(){
var CACHE={};

function hash(files,localized){
return files.join('$')+!!localized;
}

return function(stageDocument,localized){
var cssVersion=Mojo.appInfo["css-styling-version"];
var targetDocument=stageDocument||document;
var queryParams=targetDocument.URL.toQueryParams();
var stageType=queryParams.window;
var styleSheetList=["global","global-dev","global-dark"];
if(Mojo.appInfo.theme==='light'){
styleSheetList=["global","global-dev"];
}
if(!Mojo.appInfo.noDeprecatedStyles){
styleSheetList.push("global-deprecated");
}
switch(stageType){
case'popupalert':
case'banneralert':
case'activebanner':
case'dashboard':
styleSheetList=["global-base","global-notifications"];
break;
}

var key=hash(styleSheetList,localized),css=CACHE[key];
if(css===undefined){
var sources=[];
styleSheetList.each(function(cssFileName){
Mojo.generateFrameworkComponentPaths(cssFileName,"stylesheet",localized,cssVersion).each(function(path){
var source=palmGetResource(path);
if(source){



var basepath=path.replace(/[^\/]+$/,'');
source=source.replace(/@import url\((.*?)\);/g,function(m,file){
return palmGetResource(basepath+file)||'';
});

source=source.replace(/url\((.*?)\)/g,function(m,file){
return"url("+basepath+file+")";
});

sources.push(source);
}
});
});
css=CACHE[key]=sources.join('');
}

var style=targetDocument.createElement("style");
style.type="text/css";
style.media="screen";
style.appendChild(targetDocument.createTextNode(css));
Mojo.addElementToHead(targetDocument,style);
};
})();


Mojo.loadStylesheets=function(stageDocument,localized){
if(Mojo.Host.current===Mojo.Host.browser||Mojo.Config.loadStylesWithLink){
Mojo.loadStylesheetsWithLink(stageDocument,localized);
}else{
Mojo.loadStylesheetsWithPalmGetResource(stageDocument,localized);
}
};


Mojo.cloneStylesheets=function cloneStylesheets(sourceDocument,destinationDocument){
var links=sourceDocument.querySelectorAll('link[type="text/css"]');
for(var i=0;i<links.length;i++){
var path=links[i].href;
Mojo.loadStylesheet(destinationDocument,path);
}
};


Mojo._calculateAppRootPath=function(){
var appRootPath;

var re=/file:\/\/\/.*\/(.*)\//;
var match=document.baseURI.match(re);
if(match){

appRootPath=match[0];
}else{
re=/http:\/\/.*\//;
match=document.baseURI.match(re);

appRootPath=match[0];
}

return appRootPath;
};


Mojo._calculateAppName=function(){
if(Mojo.appPath===undefined){
Mojo.appPath=Mojo._calculateAppRootPath();
}
var re=/\/+.*\/(.*)\/$/;
var match=Mojo.appPath.match(re);
var appName="unknown";
if(match){
appName=Mojo.appPath.match(re)[1];
}

return appName;
};


Mojo._injectScript=function(path){
document.write('<script type="text/javascript" src="'+path+'"><\/script>');
};


Mojo._loadScriptQueue=[];



Mojo._addToScriptQueue=function(scripts,onComplete,optionalDocument){
Mojo._loadScriptQueue.push({scripts:scripts,onComplete:onComplete,optionalDocument:optionalDocument});

if(Mojo._loadScriptQueue.length==1){
Mojo._executeNextInScriptQueue();
}
};


Mojo._removeFromScriptQueue=function(){
var first=Mojo._loadScriptQueue.shift();


if(first.onComplete){
first.onComplete();
}


if(Mojo._loadScriptQueue.length>0){
Mojo._executeNextInScriptQueue();
}
};


Mojo._executeNextInScriptQueue=function(){
var first=Mojo._loadScriptQueue[0];
if(first.scripts&&first.scripts.length>0){
Mojo.loadScripts(first.scripts,Mojo._removeFromScriptQueue,first.optionalDocument);
}else{
Mojo._removeFromScriptQueue();
}
};



Mojo.loadScript=function(path){
Mojo._injectScript(path);
};


Mojo.loadScriptWithCallback=function(path,callback,optionalDocument){
var scriptTag;

optionalDocument=optionalDocument||document;
scriptTag=optionalDocument.createElement("script");
scriptTag.src=path;
scriptTag.type="text/javascript";
if(callback){
var f=function(event){
if(event.type==='error'){
Mojo.Log.error("warning, script load failed for "+event.target.src+", either remove the script or fix the src path.");
}
callback(event);
Mojo.Event.stopListening(scriptTag,'load',arguments.callee);
Mojo.Event.stopListening(scriptTag,'error',arguments.callee);
};
Mojo.Event.listen(scriptTag,'load',f);
Mojo.Event.listen(scriptTag,'error',f);
}
Mojo.addElementToHead(optionalDocument,scriptTag);
};


Mojo.loadScripts=function loadScripts(collection,loadFinishedCallback,optionalDocument){
var sync,loadCallback;
var collectionCopy=$A(collection);
var syncCallback=loadFinishedCallback||Mojo.doNothing;
var inMojoHost=(Mojo.Host.current===Mojo.Host.browser);

optionalDocument=optionalDocument||document;

function loadOneFile(){
var sourceSpec=collectionCopy.shift();
if(sourceSpec){



if(!sourceSpec.scenes||inMojoHost){
Mojo.loadScriptWithCallback(sourceSpec.source,loadOneFile,optionalDocument);
collection.splice(collection.indexOf(sourceSpec),1);
}else{
loadOneFile();
}

}else{
syncCallback();
}
}

loadOneFile();
};


Mojo.addElementToHead=function(targetDocument,element){
var h=Element.select(targetDocument,'head')[0];
if(h===undefined||h===null){
var fc=targetDocument.firstChild;
h=targetDocument.createElement("head");
fc.insertBefore(h,fc.firstChild);
}
h.appendChild(element);
};


Mojo.loadStylesheet=function(targetDocument,path){
var link=targetDocument.createElement("link");
link.href=path;
link.type="text/css";
link.media="screen";
link.rel="stylesheet";
Mojo.addElementToHead(targetDocument,link);
};


Mojo.loadScriptSync=function(filename){
var sourcesText;
var loadedWidgets=arguments.callee.loadedWidgets;


if(!loadedWidgets){
loadedWidgets={};
arguments.callee.loadedWidgets=loadedWidgets;
}


if(loadedWidgets[filename]){
return;
}


loadedWidgets[filename]=true;


filename=Mojo.Config.MOJO_FRAMEWORK_HOME+"/javascripts/"+filename+'.js';
sourcesText=palmGetResource(filename,true);
if(sourcesText){
eval(sourcesText);
}else{
Mojo.Log.warn("warning, script load failed for "+filename+", either remove the script or fix the src path.");
}
};


Mojo.loadWidget=function(widgetName){
Mojo.applyToWidgetFiles(widgetName,Mojo.loadScriptSync);
};


Mojo.applyToWidgetFiles=function(widgetName,func){
var files=Mojo.Config.JS_FRAMEWORK_WIDGETS[widgetName];
var i;


if(files===undefined){
return;
}


delete Mojo.Config.JS_FRAMEWORK_WIDGETS[widgetName];


files=files||('widget_'+widgetName).toLowerCase();



if(typeof files==="string"){
func(files);
}
else{
for(i=0;i<files.length;i++){
func(files[i]);
}
}
};


Mojo.loadScriptsForScenes=function(scenes,onComplete){
var whichScene,i,source,sceneName;
var scripts=[];


if(!scenes||scenes.length===0||!Mojo.sourcesList){
onComplete();
return;
}




for(whichScene=0;whichScene<scenes.length;whichScene++){
sceneName=scenes[whichScene];

for(i=0;i<Mojo.sourcesList.length;i++){
source=Mojo.sourcesList[i];

if(source.scenes===sceneName||
(source.scenes&&!Object.isString(source.scenes)&&source.scenes.include&&source.scenes.include(sceneName))){

delete source.scenes;
scripts.push(source);


Mojo.sourcesList.splice(i,1);
i--;
}
}
}

Mojo._addToScriptQueue(scripts,onComplete);
};



Mojo.Config.JS_FRAMEWORK_COMPONENTS=[
"log","controller_app","controller_commander","controller_scene","controller_stage","cookie",
"animation","animation_generator","depot","widget_controller","widget",
"format","format_phonenumber",
"event","eval","assert","gesture","locale",
"dragndrop","noderef",
"widget_scroller","widget_menu",
"patternmatching","keycodes","filepicker",
"test","function","cross_app","transitions","keymatcher","container","activerecordlist",
"timing",
"scene"
];


Mojo.Config.JS_FRAMEWORK_WIDGETS={

ListSelector:null,
_AlertDialog:'widget_alert',
WebView:['widget_webview'],
AddressingWidget:['widget_addressing','addressingdatasource','mockaddressingdatasource'],
ExperimentalComboBox:'widget_combobox',
ToggleButton:null,
CheckBox:['widget_togglebutton','widget_checkbox'],
RadioButton:null,
PeoplePicker:['widget_peoplepicker','peoplepickermockdata'],
ContactsService:['widget_peoplepicker','peoplepickermockdata'],
ImageView:null,
ImageViewCrop:null,
TextField:null,
SmartTextField:['widget_smarttextfield'],
TruncTextField:['widget_textfield'],
RichTextEdit:null,
PasswordField:['widget_textfield','widget_passwordfield'],
FilterField:'widget_filterfield',
Spinner:null,
List:['bigarray','widget_list'],
_Dialog:'widget_dialog',
Pager:null,
Drawer:null,
CharSelector:null,
FilterList:null,
_Submenu:'widget_submenu',
ExperimentalGridList:'widget_grid',
Slider:null,
ProgressPill:null,
Button:null,
ProgressBar:['widget_progresspill','widget_progressbar'],
Progress:['widget_progresspill','widget_progressbar'],
ProgressSlider:['widget_progresspill','widget_progressslider'],
ExperimentalWrapAround:'widget_wrap_around',
_PickerPopup:'widget_pickerpopup',
TimePicker:['widget_pickerpopup','widget_datetimepicker'],
DatePicker:['widget_pickerpopup','widget_datetimepicker'],
IntegerPicker:['widget_pickerpopup','widget_datetimepicker'],
ExperimentalForm:['widget_form'],
ExperimentalDataDiv:['widget_datadiv']
};

Mojo.Config.JS_FRAMEWORK_SCENES={

};

Mojo.Config.FRAMEWORK_COMPONENTS=Mojo.Config.CORE_FRAMEWORK_COMPONENTS.concat(Mojo.Config.JS_FRAMEWORK_COMPONENTS);


function simulatePalmGetResource(pathToResource){
var uri=pathToResource;
var responseText=null;
var request=new Ajax.Request(uri,{
method:'get',
asynchronous:false,
evalJS:false,
parameters:{"palmGetResource":true},
onSuccess:function(transport){
responseText=transport.responseText;
}
});
return responseText;
}



Mojo.hasPalmGetResource=!!window.palmGetResource;
Mojo.Host={mojoHost:'mojo-host',browser:'mojo-host',palmSysMgr:'palm-sys-mgr'};
Mojo.Host.current=Mojo.hasPalmGetResource?Mojo.Host.palmSysMgr:Mojo.Host.browser;

if(window.palmGetResource===undefined){
window.palmGetResource=simulatePalmGetResource;
}

if(window.PalmSystem===undefined){

var simAddBanner=function simulateAddBannerMessage(){
Mojo.Log.info("Banner: %s",$A(arguments).join(","));
};
var simPlaySoundNotification=function simPlaySoundNotification(soundClass,soundFile){
Mojo.Log.info("playSoundNotification: ",soundClass,soundFile);
};
var paramsFromURI=document.baseURI.toQueryParams();
window.PalmSystem={
deviceInfo:'{"screenWidth": '+document.width+', "screenHeight": '+document.height+', "minimumCardWidth": '+document.width+', "minimumCardHeight": 188, "maximumCardWidth": '+document.width+', "maximumCardHeight": '+document.height+', "keyboardType": "QWERTY"}',
launchParams:paramsFromURI.launchParams||"{}",
addBannerMessage:simAddBanner,
removeBannerMessage:function(){},
clearBannerMessages:function(){},
simulateMouseClick:function(){},
stageReady:function(){},
playSoundNotification:simPlaySoundNotification,
runTextIndexer:function(a){return a;},
version:"mojo-host",
simulated:true,
timeFormat:"HH12",
locale:paramsFromURI.mojoLocale||"en_us",
localeRegion:paramsFromURI.mojoLocaleRegion||"en_us",
screenOrientation:'up',
windowOrientation:'up',
receivePageUpDownInLandscape:function(){},
enableFullScreenMode:function(){},
setWindowProperties:function(){},
identifier:Mojo._calculateAppName(),
isMinimal:false
};
}


Mojo.Environment.version=PalmSystem.version;



Mojo.Environment.build=Mojo.Version.use;


Mojo.loadAllWidgets=function loadAllWidgets(){
var widgets=Mojo.Config.JS_FRAMEWORK_WIDGETS;
var allFiles={};
var propName;
var filesToLoad=[];



var addToLoadList=function(filename){
if(!allFiles[filename]){
filename=Mojo.Config.MOJO_FRAMEWORK_HOME+"/javascripts/"+filename+'.js';
filesToLoad.push({source:filename});
allFiles[filename]=true;
}
};


for(propName in widgets){
if(widgets.hasOwnProperty(propName)){
Mojo.applyToWidgetFiles(propName,addToLoadList);
}
}
Mojo._addToScriptQueue(filesToLoad);
};





if(Mojo.mode!=='production'){
(function(){
var widgets=Mojo.Config.JS_FRAMEWORK_WIDGETS;
var allFiles={};
var propName,files,i;



var addToComponents=function(filename){
if(!allFiles[filename]){
Mojo.Config.FRAMEWORK_COMPONENTS.push(filename);
allFiles[filename]=true;
}
};


for(propName in widgets){
if(widgets.hasOwnProperty(propName)){
Mojo.applyToWidgetFiles(propName,addToComponents);
}
}
})();
}





Mojo.doNothing=function(){};


Mojo.createWithArgs=function(constructorFunction,constructorArguments){
var WrapperFunc=function(){constructorFunction.apply(this,constructorArguments);};
WrapperFunc.prototype=constructorFunction.prototype;
return new WrapperFunc();
};


Mojo.identifierToCreatorFunctionName=function(sceneName,suffix){
suffix=suffix||"Assistant";
var className=sceneName.camelize();
return className.charAt(0).toUpperCase()+className.substring(1)+suffix;
};


Mojo.findConstructorFunction=function(functionName){
if(!functionName){
return undefined;
}
var sourceObject=window;
var nameParts=functionName.split(".");
var lastPart=nameParts.pop();
var part=nameParts.shift();
while(part){
sourceObject=sourceObject[part];
if(sourceObject===undefined){
return sourceObject;
}
part=nameParts.shift();
}
var constructorFunction=sourceObject[lastPart];
if(constructorFunction){
Mojo.requireFunction(constructorFunction);
}
return constructorFunction;
};


Mojo.parseJSON=function(jsonText){
var result;
var nativeParserFailed=false;
if(window.JSON&&JSON.parse){
try{
result=JSON.parse(jsonText);
}catch(e){
Mojo.Log.error("ERROR: native parser didn't like '"+jsonText+"'");
Mojo.Log.logException(e,"JSON.parse");
nativeParserFailed=true;
}
if(nativeParserFailed){
result=jsonText.evalJSON(true);
}
}else{
result=jsonText.evalJSON(true);
}
return result;
};


Mojo.enhancePrototype=function(){
ObjectRange.addMethods({
length:function(){
return this.realEnd()-this.start;
},

realEnd:function(){
if(this.exclusive){
return this.end;
}
return this.end+1;
},

toString:function(){
if(this.exclusive){
return this.start+".."+this.end;
}
return this.start+"..."+this.end;
},

intersect:function(otherRange){
var newStart=Math.max(this.start,otherRange.start);
var newEnd=Math.min(this.realEnd(),otherRange.realEnd());
if(newEnd<newStart){
return $R(newStart,newStart);
}
return $R(newStart,newEnd);
}
});

Object.extend(String.prototype,{
constantize:function(){
return this.strip().gsub(" ","_").toUpperCase();
}
});

}();


Mojo.installExtensions=function(){
if(Date.now===undefined){
Date.now=function(){
return new Date().getTime();
};
}

};


Mojo.removeAllEventListenersRecursive=function(element){
if(element.removeAllEventListenersRecursive){
element.removeAllEventListenersRecursive();
}
};



Mojo.continueSetupFramework=function(){
Mojo.View.setup(document);
Mojo.Gesture.setup(document);
Mojo.Animation.setup(window);
Mojo.Controller.setup();
Mojo.Format.setup();
};


Mojo.loadApplicationSources=function(){
var sourcesText=palmGetResource(Mojo.appPath+"sources.json",true);
if(sourcesText){


if(Mojo.Config.compatibilityMode){
Mojo.sourcesList=sourcesText.evalJSON();
}else{
Mojo.sourcesList=Mojo.parseJSON(sourcesText);
}
Mojo._addToScriptQueue(Mojo.sourcesList,Mojo.continueSetupFramework);
}else{
Mojo.continueSetupFramework();
}
};


Mojo.Environment.applyConfiguration=function(configurationObject){
var propertyName;
for(propertyName in configurationObject){
if(configurationObject.hasOwnProperty(propertyName)){
switch(propertyName){
case"logLevel":
Mojo.Log.currentLogLevel=configurationObject.logLevel;
break;
case"logEvents":
Mojo.Event.logEvents=configurationObject.logEvents;
break;
case"timingEnabled":
Mojo.Timing.enabled=configurationObject.timingEnabled;
break;
case"escapeHTMLInTemplates":
Mojo.View.escapeHTMLInTemplates=configurationObject.escapeHTMLInTemplates;
break;
case"debuggingEnabled":
Mojo.Config.debuggingEnabled=configurationObject.debuggingEnabled;
break;
}
}
}
};


Mojo.setupFramework=function(){
Mojo.loadFrameworkConfiguration();
if(Mojo.Environment.frameworkConfiguration.loadAllWidgets){
Mojo.loadAllWidgets();
}
Mojo.Environment.applyConfiguration(Mojo.Environment.frameworkConfiguration);
Mojo.Log.info("Requested submission : "+Mojo.Version.use);
if(Mojo.Version.warnAboutSubmissionMethod){
Mojo.Log.warn("Using 'mojo.js?submission=n' is deprecated. Please use x-mojo-submission=n to specify a submission.");
}
if(Mojo.Version.use==='trunk'){
Mojo.Log.info("Using framework trunk. To avoid being broken by updates to the framework trunk please specify a submission.");
}
Mojo.installExtensions();
Mojo.Locale.set(PalmSystem.locale,PalmSystem.localeRegion);
Mojo.loadApplicationSources();
};



Mojo.loadFramework();


window.addEventListener('load',function(e){
Mojo.setupFramework();
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Controller={};


Mojo.Controller.setup=function(){
var paramsFromURI=document.baseURI.toQueryParams();
Mojo.Controller.appInfo=Mojo.appInfo;
if(Mojo.Host.current===Mojo.Host.browser&&paramsFromURI.mojoBrowserWindowMode==='single'){
Mojo.Controller.appController=new Mojo.Controller.AppController();
Mojo.requireDefined(Mojo.Controller.appController,"Mojo.Controller.appController must be defined.");
Mojo.Controller.appController.setupAppAssistant();
Mojo.relaunch();
Mojo.Controller.setupStageController(window);
}else if(Mojo.Controller.isChildWindow(window)){
Mojo.Controller.appController=Mojo.Controller.getAppController();
Mojo.Controller.setupStageController(window);
}else{
Mojo.Controller.appController=new Mojo.Controller.AppController();
Mojo.requireDefined(Mojo.Controller.appController,"Mojo.Controller.appController must be defined.");
Mojo.Controller.appController.setupAppAssistant();
if(Mojo.Controller.appInfo.noWindow){
if(Mojo.Host.current===Mojo.Host.browser){
var launchPage=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('emulated-launch')});
document.body.innerHTML=launchPage;
$('faceless_launch_button').observe(Mojo.Event.tap,Mojo.Controller.doRelaunch);
}
if(window.PalmSystem&&window.PalmSystem.stageReady){
window.PalmSystem.stageReady();
}
}else{
Mojo.Controller.setupStageController(window);
}
}

};


Mojo.Controller.setupStageController=function setupStageController(stageWindow){
var stageProxy,sc,scenes;


stageProxy=Mojo.Controller.appController._stageProxies[stageWindow.name];
sc=new Mojo.Controller.StageController(Mojo.Controller.appController,stageWindow,stageProxy);

if(stageWindow._mojoLightweightWindow&&!(Mojo.Host.current===Mojo.Host.browser&&sc.paramsFromURI.mojoBrowserWindowMode==='single')){
stageWindow.Mojo={Controller:{stageController:sc},
handleGesture:Mojo.handleGesture,
handleSingleTap:Mojo.handleSingleTapForDocument.curry(stageWindow.document)};

if(stageWindow.PalmSystem&&stageWindow.PalmSystem.stagePreparing){
stageWindow.PalmSystem.stagePreparing();
}

Mojo.View.setup(stageWindow.document);
}else{
Mojo.Controller.stageController=sc;
}
sc.setupStageAssistant();
Mojo.Controller.appController.callCreateStageCallback(stageWindow.name,sc);


if(!sc.hasPendingSceneOperations()){
sc._triggerStageReady();
sc.deleteProxy();
}
};


Mojo.Controller.doRelaunch=function doRelaunch(){
$('launch_params').blur();
var f=function(){
PalmSystem.launchParams=$('launch_params').value;
Mojo.relaunch();
};
f.defer();
};



Mojo.Controller.assistantFunctionName=function(functionName){
return"assistant"+functionName.charAt(0).toUpperCase()+functionName.substring(1);
};


Mojo.Controller.isChildWindow=function(theWindow){

if(!theWindow){
Mojo.Log.error("WARNING: Don't call Mojo.Controller.isChildWindow(), instead call isChildWindow() on the stage controller you're interested in.");
theWindow=window;
}
return(theWindow.opener&&theWindow.opener.Mojo!==undefined);
};


Mojo.Controller.getAppController=function(){
if(window.opener&&window.opener.Mojo&&window.opener.Mojo.Controller&&window.opener.Mojo.Controller.appController){
return window.opener.Mojo.Controller.appController;
}
Mojo.requireDefined(Mojo.Controller.appController);
return Mojo.Controller.appController;
};


Mojo.Controller.notYetImplemented=function(optionalWindow){
Mojo.Controller.errorDialog(Mojo.View.nyiMessages[Math.floor(Math.random()*Mojo.View.nyiMessages.length)],optionalWindow);
};



Mojo.Controller.errorDialog=function(message,optionalWindow){
var targetWindow=optionalWindow||window;
var targetStageController=targetWindow.Mojo&&targetWindow.Mojo.Controller.stageController;
var onChoose=Mojo.Controller._getAlertElem.bind(this,optionalWindow);
var topScene;
var widgetElem;

if(!targetStageController){return undefined;}

topScene=targetStageController.topScene();

if(!topScene){return undefined;}

widgetElem=topScene.showAlertDialog({
title:$LL("Error"),message:message,onChoose:onChoose,choices:[{label:$LL("OK")}]});

targetWindow.Mojo.Controller._openAlertDialog=widgetElem;

return widgetElem;
};

Mojo.Controller.closeDialogBox=function(optionalWindow){
var alertElem=Mojo.Controller._getAlertElem();
if(alertElem){
alertElem.mojo.close();
}
};



Mojo.Controller._getAlertElem=function(optionalWindow,calledFromOnChoose){
var targetWindow=optionalWindow||window;
var alertElem=targetWindow.Mojo&&targetWindow.Mojo.Controller._openAlertDialog;

delete targetWindow.Mojo.Controller._openAlertDialog;

if(!alertElem||calledFromOnChoose){
return undefined;
}else{
return alertElem;
}

};





Mojo.Controller.isGoBackKey=function(event){
return(event.keyCode==Event.KEY_ESC);
};



Mojo.Controller.StageType={
popupAlert:'popupalert',
bannerAlert:'banneralert',
activeBanner:'activebanner',
dashboard:'dashboard',
card:'card',
stackedCard:'childcard'
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Model={};





Mojo.Model._decoratorCtor=function(clone){
if(clone){
Object.extend(this,clone);
}
};





Mojo.Model.decorate=function(proto,clone){
this._decoratorCtor.prototype=proto;
return new this._decoratorCtor(clone);
};



Mojo.Model.format=function format(model,formatters,clone){
var newModel=this.decorate(model,clone);
var propValue;
var formattedValue;
var formattedName;

for(var propName in formatters){
if(formatters.hasOwnProperty(propName)){
propValue=newModel[propName];
formattedValue=formatters[propName].call(undefined,propValue,model);

if(typeof formattedValue=='string'){
newModel[propName+'Formatted']=formattedValue;
}else if(typeof formattedValue=='object'){
for(formattedName in formattedValue){
if(formattedValue.hasOwnProperty(formattedName)){
newModel[formattedName]=formattedValue[formattedName];
}
}
}
}
}

return newModel;
};



Mojo.Model.encrypt=function(){
if(window.PalmSystem.encrypt){
return window.PalmSystem.encrypt.apply(window.PalmSystem,arguments);
}
Mojo.Log.warn("Mojo.Model.encrypt() is not implemented on this platform.");
return undefined;
};



Mojo.Model.decrypt=function(){
if(window.PalmSystem.decrypt){
return window.PalmSystem.decrypt.apply(window.PalmSystem,arguments);
}
Mojo.Log.warn("Mojo.Model.decrypt() is not implemented on this platform.");
return undefined;
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Service={};



Mojo.Service.Request=function Request(url,options,requestOptions){
this.options=options;
Object.extend(this.options,options||{});
this.success=this.options.onSuccess||Mojo.doNothing;
this.complete=this.options.onComplete||Mojo.doNothing;
this.loggingEnabled=this.options.requestLoggingEnabled;
if(requestOptions!==undefined){
if(typeof requestOptions!=="object"){
requestOptions={
resubscribe:!!requestOptions
};
}
}else{
requestOptions={};
}
this.requestOptions=requestOptions;
this.onFailure=this.options.onFailure;
delete this.options.requestLoggingEnabled;
this.request(url,options);
this.cancelled=false;
};



Mojo.Service.Request.prototype.log=function log(){
if(this.loggingEnabled){
Mojo.Log.info.apply(Mojo,arguments);
}
};


Mojo.Service.Request.prototype.failed=function failed(data){
if(this.onFailure){
this.onFailure(data,this);
}
if(this.requestOptions.resubscribe&&!this.cancelled){
var that=this;
var f=function(){
that.doRequest();
};

f.delay(this.kResubscribeDelayMin+Math.random()*this.kResubscribeDelayRandom);
}
};


Mojo.Service.Request.prototype.doRequest=function request(){
this.reqObject=new PalmServiceBridge();
this.reqObject.onservicecallback=this.response;
this.reqObject.call(this.fullUrl,this.parameters);
};


Mojo.Service.Request.prototype.request=function request(url,options){

var fullUrl=url;


if(this.options.method){
if(url.charAt(url.length-1)!="/"){
fullUrl+="/";
}
fullUrl+=this.options.method;
}

if(options.parameters){
this.parameters=Object.toJSON(options.parameters);
}else{
this.parameters="{}";
}
this.response=this.response.bind(this);
this.fullUrl=fullUrl;
this.doRequest();
};


Mojo.Service.Request.prototype.cancel=function cancel(){
if(this.reqObject){
this.log("Canceling a request.");
this.cancelled=true;
this.log("was this cancelled "+this.cancelled);
this.reqObject.cancel();
delete this.reqObject;
}else{
this.log("Canceling a request a second time.");
}
};


Mojo.Service.Request.prototype.response=function response(respMsg){
var parsedMsg,error;
this.log("was this cancelled "+this.cancelled);
if(this.cancelled){
this.log("WARNING: this request was cancelled, so no data is returned.");
return;
}

try{
parsedMsg=Mojo.parseJSON(respMsg);
if(this.loggingEnabled){
this.log("::: respMsg "+respMsg);
}
}catch(err){
error={
errorCode:-1,
errorText:respMsg
};
this.failed(error);
return;
}


if(parsedMsg.errorCode||parsedMsg.returnValue===false){
this.failed(parsedMsg);
}else{
this.success(parsedMsg,this);
}
this.complete(parsedMsg,this);
};

Mojo.Service.Request.prototype.kResubscribeDelayMin=10;
Mojo.Service.Request.prototype.kResubscribeDelayRandom=10;

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.View={};


Mojo.View.escapeHTMLInTemplates=true;


Mojo.View.templates={};


Mojo.View.render=function render(renderParams)
{
Mojo.Timing.resume("scene#render");
var allText="";
var collection=renderParams.collection;
var attributes=renderParams.attributes;
var formatters=renderParams.formatters;
var object;
if(collection){
var separator=renderParams.separator;
for(var i=0,l=collection.length,lastIndex=l-1;i<l;i++){

if(collection[i]!==null)
{


object=Mojo.Model.format(collection[i],formatters,attributes);

if(l==1){
object.currentElementClass='single';
}else{
if(i===0){
object.currentElementClass='first';
}else if(i==lastIndex){
object.currentElementClass='last';
}
}
var s=Mojo.View._doRender(object,renderParams);
allText+=s;
if(separator&&i!=lastIndex){
allText+=Mojo.View._renderNamedTemplate(Mojo.View._calculateTemplateFileName(renderParams.separator,object),object);
}
}
}
}else{
object=renderParams.object||{};
if(attributes||formatters){
object=Mojo.Model.format(object,formatters,attributes);
}
allText=Mojo.View._doRender(object,renderParams);
}
Mojo.Timing.pause("scene#render");
return allText;
};



Mojo.View.applyGesture=function(viewOrViews,gesture){
Mojo.log("WARNING: Mojo.Gesture.Select has been deprecated. Observe the Mojo.Event family of events, or use Mojo.View.applySelectionAttribute for highlighting.");
};


Mojo.View.applySelectionAttribute=function applySelectionAttribute(viewOrViews,selectionMode,optionalWindow){
var targetWindow;
if(Object.isArray(viewOrViews)){
viewOrViews.each(function(view){Mojo.View.applySelectionAttribute(view,selectionMode);});
return;
}
targetWindow=optionalWindow||window;
var targetDocument=targetWindow.document;
targetDocument.getElementById(viewOrViews).setAttribute(Mojo.Gesture.selectionHighlightAttribute,selectionMode);
};



Mojo.View.toString=function(){return"[Object Mojo.View]";};



Mojo.View.requiresProperties=function(){
var element=arguments[0];
var target=arguments[1];
if(element&&target){
for(var i=2;i<arguments.length;++i){
var prop=arguments[i];
if(!target[prop]){
element.hide();
return;
}
}
}
};


Mojo.View.applyListStylesToChildren=function applyListStylesToChildren(parentElement,firstChildIndex,totalElements,callback){
var index=0;
var offset=firstChildIndex;
var lastIndex=totalElements-1;
parentElement.childElements().each(function(element){
element.addClassName('row');
if(offset===0){
element.addClassName('first');
}
if(offset==lastIndex){
element.addClassName('last');
}
if(callback){
callback(element,index);
}
index+=1;
offset+=1;
});
};



Mojo.View.convertToNode=function convertToNode(htmlContent,targetDocument){
Mojo.requireDefined(targetDocument,"Mojo.View.convertToNode now requires a target document");
var renderingDiv=targetDocument._renderingDiv;
renderingDiv.innerHTML=htmlContent;
var node=renderingDiv.firstChild;
while(node.nodeType!=node.ELEMENT_NODE){
node=node.nextSibling;
}
renderingDiv.removeChild(node);
return node;
};


Mojo.View.convertToNodeList=function(htmlContent,targetDocument){
Mojo.requireDefined(targetDocument,"Mojo.View.convertToNodeList now requires a target document");
targetDocument._renderingDiv.innerHTML=htmlContent;
return targetDocument._renderingDiv.childNodes;
};


Mojo.View.convertToDocFragment=function(htmlContent,targetDocument){
Mojo.requireDefined(targetDocument,"Mojo.View.convertToDocFragment now requires a target document");
targetDocument._renderingDocFrag.innerHTML=htmlContent;
return targetDocument._renderingDocFrag;
};


Mojo.View.wrapMultipleNodes=function wrapMultipleNodes(nodeList,targetDocument,forceWrap){
var node,i,nodeCount,nodeType,lastNode,wrapperNode;
var nodesLength=nodeList.length;
nodeList=$A(nodeList);

if(!forceWrap){
nodeCount=0;
for(i=0;i<nodesLength;i++){
node=nodeList[i];
nodeType=node.nodeType;
if(nodeType===node.ELEMENT_NODE||nodeType===node.TEXT_NODE){
lastNode=node;
nodeCount+=1;
}
}
if(nodeCount===1){
return lastNode;
}
}

wrapperNode=targetDocument.createElement('div');
for(i=0;i<nodesLength;i++){
node=nodeList[i];
wrapperNode.appendChild(node);
}
return wrapperNode;
};


Mojo.View.setup=function(targetDocument){
Mojo.View.addTemplateLocation(Mojo.Widget.sysTemplatePath,Mojo.Locale.frameworkResourcePath,"views");
targetDocument._renderingDiv=targetDocument.createElement('div');
targetDocument._renderingDocFrag=targetDocument.createDocumentFragment();
};


Mojo.View.getFocusableList=function(containingElement){
Mojo.requireElement(containingElement,"Mojo.View.getFocusableList requires a containing element.");
var focusableElements=[];
var potentials=containingElement.querySelectorAll('input[type=text],input[type=password],textarea,*[tabindex]');
var potentialsLength=potentials.length;
for(var i=0;i<potentialsLength;i++){
var potentialElement=potentials[i];
if(Mojo.View.visible(potentialElement)){
focusableElements.push(potentialElement);
}
}
return focusableElements;
};


Mojo.View.getFocusedElement=function(containingElement){
Mojo.requireElement(containingElement,"Mojo.View.getFocusedElement requires a containing element.");
return containingElement.querySelector('*:focus');
};


Mojo.View.advanceFocus=function advanceFocus(containingElement,optionalSelection){
Mojo.requireElement(containingElement,"Mojo.View.advanceFocus requires a containing element.");
var selection=optionalSelection||Mojo.View.getFocusedElement(containingElement);
var selectable=Mojo.View.getFocusableList(containingElement);
if(selectable.length===0){
return;
}
var selectableCount=selectable.length;
if(selection){
for(var i=0;selection&&i<selectableCount;i++){
var oneSelectable=selectable[i];
if(oneSelectable===selection){
break;
}
}
i+=1;
}else{
i=0;
}
if(i>=selectableCount){
i=0;
}
var newSelection=selectable[i];
if(newSelection.mojo&&newSelection.mojo.focus){
newSelection.mojo.focus();
}else if(newSelection.parentNode.mojo&&newSelection.parentNode.mojo.focus){
newSelection.parentNode.mojo.focus();
}else{
newSelection.focus();
}
};


Mojo.View.clearTouchFeedback=function(root){
if(root){
Mojo.View.removeTouchFeedback(root.querySelector('.'+Mojo.Gesture.kSelectedClassName));
}
};


Mojo.View.addTouchFeedback=function(target){
if(target){
Mojo.View.clearTouchFeedback(target.ownerDocument.body);
target.addClassName(Mojo.Gesture.kSelectedClassName);
}
};


Mojo.View.removeTouchFeedback=function(target){
if(target){
target.removeClassName(Mojo.Gesture.kSelectedClassName);
}
};


Mojo.View.makeFocusable=function(targetElement){
Mojo.requireElement(targetElement,"Mojo.View.makeFocusable requires an element.");
targetElement.setAttribute("tabindex","0");
};


Mojo.View.makeNotFocusable=function(targetElement){
Mojo.requireElement(targetElement,"Mojo.View.makeNotFocusable requires an element.");
targetElement.removeAttribute("tabindex");
};

Mojo.View._templateLocations=[];


Mojo.View.addTemplateLocation=function addTemplateLocation(basePath,localizedPath,viewFolderName){
function assureEndsWithSlash(path){
if(path.endsWith("/")){
return path;
}
return path+"/";
}
var currentLocale=Mojo.Locale.current;
localizedPath=assureEndsWithSlash(localizedPath);
var newLocation={
basePath:assureEndsWithSlash(basePath),
localizedPath:localizedPath,
viewFolderName:viewFolderName,
currentLocalePath:localizedPath+currentLocale+"/"+viewFolderName+"/",
currentLanguagePath:localizedPath+Mojo.Locale.language+"/"+viewFolderName+"/",
currentRegionPath:localizedPath+Mojo.Locale.language+"/"+Mojo.Locale.region+"/"+viewFolderName+"/"
};
Mojo.View._templateLocations.push(newLocation);
};








Mojo.View._loadTemplateFromBase=function _loadTemplateFromBase(baseOfTemplates,templateBaseName,suppressWarning){
var templatePath=templateBaseName;
if(!templateBaseName.startsWith("/")){
templatePath=baseOfTemplates+templateBaseName;
}
return palmGetResource(templatePath,suppressWarning);
};


Mojo.View._loadTemplate=function _loadTemplate(templateFullName){
var foundTemplate=false,templateLocation;
if(!Mojo.View._appPath){
Mojo.View._appPath=Mojo.appPath+"/app/views/";
}
var templateBaseName,templatePath,templateLocalePath,templateLanguagePath,templateRegionPath;
var locations=Mojo.View._templateLocations;
var locationsCount=locations.length;
for(var i=0;i<locationsCount;i++){
templateLocation=locations[i];
templatePath=templateLocation.basePath;
if(templateFullName.startsWith(templatePath)){
templateBaseName=templateFullName.gsub(templatePath,"");
templateLocalePath=templateLocation.currentLocalePath;
templateLanguagePath=templateLocation.currentLanguagePath;
templateRegionPath=templateLocation.currentRegionPath;
foundTemplate=true;
break;
}
}
if(!foundTemplate){
templateBaseName=templateFullName;
templatePath=Mojo.View._appPath;
templateLocalePath=Mojo.Locale.appTemplatePath;
templateLanguagePath=Mojo.Locale.appLanguageTemplatePath;
templateRegionPath=Mojo.Locale.appRegionTemplatePath;
}
var templateText=
(templateLocalePath&&Mojo.View._loadTemplateFromBase(templateLocalePath,templateBaseName,true))||
(templateRegionPath&&Mojo.View._loadTemplateFromBase(templateRegionPath,templateBaseName,true))||
(templateLanguagePath&&Mojo.View._loadTemplateFromBase(templateLanguagePath,templateBaseName,true))||
Mojo.View._loadTemplateFromBase(templatePath,templateBaseName);

return templateText;
};


Mojo.View._renderNamedTemplate=function _renderNamedTemplate(templateName,object){
var template;
var loadedTemplateText;

template=Mojo.View.templates[templateName];
if(!template){
loadedTemplateText=Mojo.View._loadTemplate(templateName);
if(loadedTemplateText===null||loadedTemplateText===undefined){
return"template load failed: "+templateName;
}

template=new Mojo.View.Template(loadedTemplateText,templateName,Mojo.View.escapeHTMLInTemplates);
Mojo.View.templates[templateName]=template;
}
return template.evaluate(object);
};


function extractTargetObject(template,object){
if(object.object){
return object.object;
}
return object;
}


function maybeWrapInDiv(markupText,renderParams){
if(renderParams.wrapInDiv){
return"<div>"+markupText+"</div>";
}
return markupText;
}


Mojo.View._doRender=function _doRender(object,renderParams){
var template=null;
var loadedTemplateText=renderParams.inline;
var targetObject;
if(loadedTemplateText){
template=new Mojo.View.Template(loadedTemplateText,"<inline>",Mojo.View.escapeHTMLInTemplates);
return maybeWrapInDiv(template.evaluate(object),renderParams);
}
targetObject=extractTargetObject(renderParams.template,object);
return maybeWrapInDiv(Mojo.View._renderNamedTemplate(Mojo.View._calculateTemplateFileName(renderParams.template,object),targetObject,renderParams.useNew),renderParams);
};


Mojo.View._generateFilename=function(baseName,fileType){
var fileTypeCompare=function(s){return s==fileType;};
if(this.FILETYPES.find(fileTypeCompare)){
if(this._isMojoComponent(baseName)){
return console.info(Mojo.Config[fileType.toUpperCase()+"_PREFIX"]+"-"+baseName+"_"+Mojo.Version.use+
Mojo.Config.HTML_EXT);
}else{
return console.info(Mojo.Config[fileType.toUpperCase()+"_PREFIX"]+"-"+baseName+Mojo.Config.HTML_EXT);
}
}else{
throw new Error("Filetype not recognized. Must be one of: "+this.FILETYPES.join(", "));
}
};


Mojo.View._calculateTemplateFullPath=function(templateName,currentControllerName){
if(templateName.startsWith("/")){
return templateName;
}

if(Object.isUndefined(currentControllerName)||templateName.include("/")){
return templateName;
}

return currentControllerName+"/"+templateName;
};


Mojo.View._isMojoComponent=function(templateBaseName){
return Mojo.MOJO_PREFIX_PATTERN.test(templateBaseName);
};


Mojo.View._calculateTemplateFileName=function(templateName,object){
if(Object.isString(templateName)){
return Mojo.View._calculateTemplateFullPath(templateName)+".html";
}

var propName=templateName.templateSelector;
var propValue=object[propName];
var selectedName=templateName.templates[propValue];
return Mojo.View._calculateTemplateFullPath(selectedName)+".html";
};


Mojo.View.getBorderWidth=function getBorderWidth(element,border){
var width=0;
var styleName="border-"+border+"-width";
var theStyle=element.getStyle(styleName);
if(theStyle){
width=parseInt(theStyle,10);
if(!width){
width=0;
}
}
return width;
};


Mojo.View.getViewportDimensions=function(targetDocument){
return{width:targetDocument.defaultView.innerWidth,height:targetDocument.defaultView.innerHeight};
};


Mojo.View.getParentWithAttribute=function getParentWithAttribute(targetElement,attributeName,attributeValue){
return Mojo.View.findParentByAttribute(targetElement,document,attributeName,attributeValue);
};




Mojo.View.findParent=function(testFunc,child,searchRoot){
var node=child;
var args=$A(arguments);
args.splice(0,2);


while(node&&node!==searchRoot)
{
args[0]=node;
if(testFunc.apply(undefined,args)){
return node;
}
node=node.parentNode;
}

return undefined;
};


Mojo.View.findParentByAttribute=Mojo.View.findParent.curry(function(node,attr,value){
return node.hasAttribute&&node.hasAttribute(attr)&&
(value===undefined||node.getAttribute(attr)===value);
});




Mojo.View.findParentByProperty=Mojo.View.findParent.curry(function(node,propName){
return(node[propName]!==undefined);
});




Mojo.View.getScrollerForElement=function getScrollerForElement(targetElement){
return Mojo.View.getParentWithAttribute(targetElement,"x-mojo-element","Scroller");
};


Mojo.View.getUsableDimensions=function getUsableDimensions(element,avoidPrototype){
var getBorderWidth=Mojo.View.getBorderWidth;
var dimensions;
if(avoidPrototype){
dimensions=Mojo.View.getDimensions(element);
}else{
dimensions=element.getDimensions();
}
dimensions.width-=getBorderWidth(element,"left");
dimensions.width-=getBorderWidth(element,"right");
dimensions.height-=getBorderWidth(element,"top");
dimensions.height-=getBorderWidth(element,"bottom");
return dimensions;
};


Mojo.View.visible=function visible(element){
if(!element.visible()){
return false;
}

var ancestors=element.ancestors();
var ancestorsLength=ancestors.length;
for(var i=0;i<ancestorsLength;i++){
var e=ancestors[i];
if(!e.visible()){
return false;
}
}

return true;
};



Mojo.View.nyiMessages=[
"It is with a feeling of regret almost reaching remorse that I must tell you that this feature is not yet implemented.",
"Life is full of small disappointments. The fact that this feature isn't implemented yet is among them.",
"Although this feature isn't implemented yet, you have to admit that the button is very pretty.",
"I feel obliged to mention that the piece of hardware in your hand cannot be blamed for the fact that this feature is not yet implemented.",
"I was afraid you'd want to do that. Sadly, it's not working yet."
];



Mojo.View.makeUniqueId=function(optionalWindow){
var targetWindow=optionalWindow||window;
var targetDocument=targetWindow.document;
var id;
var func=arguments.callee;
if(typeof func.counter=='undefined'){
func.counter=0;
}

do{id='palm_anon_element_'+func.counter++;}while(targetDocument.getElementById(id)!==null);
return id;
};


Mojo.View.isTextField=function(element){
var tagName=element.tagName.toUpperCase();
if(tagName==="OBJECT"){
return false;
}
if(element.getStyle("-webkit-user-modify")==="read-write"){
return true;
}
if(tagName==="INPUT"){
var tagType=element.type.toUpperCase();
return(tagType=="TEXT"||tagType==="PASSWORD");
}
return(tagName==="TEXTAREA");
};


Mojo.View.isRichTextField=function(element){
return(element.getAttribute('x-mojo-element')==="RichTextEdit");

};


Mojo.View.serializeMojo=function(form,options){
return Mojo.View.serializeMojoElements(Form.getElements(form),options);
};

Mojo.View.serializeMojoElements=function(elements,options){
if(typeof options!='object'){
options={hash:!!options};
}else if(Object.isUndefined(options.hash)){
options.hash=true;
}
var isArray,key,value,submitted=false,submit=options.submit,mojoFormat=null;

var data=elements.inject({},function(result,element){
if(!element.disabled&&element.name){
key=element.name;value=element.value;mojoFormat=element.getAttribute('x-mojo-format');
if(key){
isArray=(key.substring(key.length-2,key.length)=='$A');
}

if(mojoFormat=='json'){
value=value.evalJSON();
}

if(value!==null&&(element.type!='submit'||(!submitted&&
submit!==false&&(!submit||key==submit)&&(submitted=true)))){
if(isArray){

if(!Object.isArray(result[key])&&isArray){
result[key]=[];
}
result[key].push(value);
}else if(key in result){
console.log("WARNING: There are multiple results for element with name "+key+" but it is not specified as an array by including $A at the end of the element name. The last value found will replace all previous values.");
result[key]=value;
}
else{
result[key]=value;
}
}
}
return result;
});

return options.hash?data:Object.toQueryString(data);
};

Mojo.View.Template=function Template(templateString,templatePath,escape){
this.templatePath=templatePath;
this.templateString=templateString;
this.escape=escape;
};

Mojo.View.Template.prototype.evaluate=function evaluate(propertiesSource){
var that=this;
var replacer=function(matchedString,propertyName){
var escape=that.escape;
var value;
var firstCharacter=matchedString.charAt(0);
if(firstCharacter==="\\"){
return matchedString.slice(1);
}

var firstPropertyNameCharacter=propertyName.charAt(0);
if(firstPropertyNameCharacter==='-'){
escape=false;
propertyName=propertyName.slice(1);
}

if(propertyName.indexOf(".")!==-1){
value=propertiesSource;
var propertyNames=propertyName.split(".");
var propertyNamesLength=propertyNames.length;
for(var i=0;value!==undefined&&i<propertyNamesLength;i++){
var currentPropertyName=propertyNames[i];
value=value[currentPropertyName];
}
}else{
value=propertiesSource[propertyName];
}

if(value===undefined||value===null){
value="";
}



if(escape){
value=value.toString();
if(value.indexOf('<')!==-1||value.indexOf('&')!==-1){
var renderingDiv=document._renderingDiv;
renderingDiv.innerText=value;
var escapedValue=renderingDiv.innerHTML;
value=escapedValue;
}
}
return value;
};
return this.templateString.replace(/\\*#\{(-?[\w.]+)\}/g,replacer);
};


Mojo.View.getDimensions=function(element){
return{width:element.offsetWidth,height:element.offsetHeight};
};


Mojo.View.getCursorPosition=function(optionalWindow){
var targetWindow=optionalWindow||window;
if(Mojo.Host.current===Mojo.Host.browser){
return undefined;
}else{
return targetWindow.caretRect();
}
};


Mojo.View.createScrim=function(targetDocument,options){
var scrim=Mojo.View.convertToNode("<div class='palm-scrim'></div>",targetDocument);

if(options&&options.scrimClass){
scrim.addClassName(options.scrimClass);
}

Mojo.listen(scrim,'mousedown',function(ev){
ev.stop();
if(options&&options.onMouseDown){
options.onMouseDown(ev);
}
});

return scrim;
};


Mojo.View.viewportOffset=function(element){
var curElement=element;
var top=0,left=0;
var fixedParent;
var ownerDocument=element.ownerDocument;


while(curElement){
top+=curElement.offsetTop;
left+=curElement.offsetLeft;


if(curElement!==element){
top+=curElement.clientTop;
left+=curElement.clientLeft;
}


if(curElement.getStyle('position')==='fixed'){
fixedParent=curElement;
break;
}

curElement=curElement.offsetParent;
}



curElement=element;
while(curElement&&curElement!==ownerDocument){
left-=curElement.scrollLeft;
top-=curElement.scrollTop;

if(curElement===fixedParent){
break;
}

curElement=curElement.parentNode;
}

return{left:left,top:top};
};

Mojo.View.removeDOMReferences=function removeDOMReferences(targetObject){
var propertyName,propertyValue,nodeType;
for(propertyName in targetObject){
if(targetObject.hasOwnProperty(propertyName)){
propertyValue=targetObject[propertyName];
nodeType=propertyValue&&propertyValue.nodeType;
if(nodeType>=1&&nodeType<=13){
Mojo.Log.info("removing",propertyValue,"from",propertyName);
targetObject[propertyName]=null;
}
}
}
};/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Log={};


Mojo.log=function(message,values){
if(console&&console.log){
if(message.match(/#\{.*?\}/)){
Mojo.Log.warn("Mojo.log() with template evaluation is deprecated. Please use %%s-style format strings instead.");
if(values){
var template=new Template(message);
message=template.evaluate(values);
}
Mojo.Log.warn(message);
}else{
Mojo.Log._logImplementation(Mojo.Log.LOG_LEVEL_INFO,$A(arguments));
}
}
};


Mojo.Log.conditionalLogger=function(){
if(this.loggingEnabled){
Mojo.Log.info.apply(Mojo,arguments);
}
};



Mojo.Log.logProperties=function(obj,name,includePrototype){
name=name||'obj';

Mojo.Log.info("Properties in object "+obj+':');
if(console.dir){
console.dir(obj);
}else{
for(var propName in obj){
if(includePrototype||obj.hasOwnProperty(propName)){
Mojo.Log.info(name+"."+propName+" = "+obj[propName]);
}
}
}
};


Mojo.Log.propertiesAsString=function propertiesAsString(targetObject,includePrototype){
var props=[];
for(var propName in targetObject){
if(includePrototype||targetObject.hasOwnProperty(propName)){
var p=targetObject[propName];
if(p&&!Object.isFunction(p)){
props.push(propName+":"+p.toString());
}
}
}
return"{"+props.join(", ")+"}";
};


Mojo.Log.logException=function(e,msg){
var logMsg="EXCEPTION";
if(msg){
logMsg=logMsg+' ['+msg+']';
}
else{
logMsg=logMsg;
}
if(e){
logMsg=logMsg+', ('+e.name+'): "';

if(e.message){
logMsg=logMsg+e.message;
}
logMsg=logMsg+'"';

if(e.sourceURL){
logMsg=logMsg+', '+e.sourceURL;
}
if(e.line){
logMsg=logMsg+':'+e.line;
}
}
Mojo.Log.error(logMsg);
};


Mojo.Log._logImplementation=function _logImplementation(messageLevel,args){
var stringToLog;
if(Mojo.Log.currentLogLevel>=messageLevel){
var formatString=args.shift();
if(formatString){

formatString=""+formatString;
var nextArgument=function(stringToReplace){
var target;
if(stringToReplace==="%%"){
return"%";
}

target=args.shift();
switch(stringToReplace){
case"%o":
return Object.inspect(target);
case"%j":
return Object.toJSON(target);
}

return target;
};
var resultString=formatString.replace(/%[jsdfio%]/g,nextArgument);
stringToLog=[resultString].concat(args).join(" ");
var loggingFunction,banners={};
var makeBanners=function(label){
var appTitle=Mojo.appInfo.title||"foo";
var loggingPrefix=label+": ";
return{loggingPrefix:loggingPrefix};
};
if(messageLevel<=Mojo.Log.LOG_LEVEL_ERROR){
loggingFunction="error";
banners=makeBanners("Error");
}else if(messageLevel<=Mojo.Log.LOG_LEVEL_WARNING){
loggingFunction="warn";
banners=makeBanners("Warning");
}else{
loggingFunction="info";
banners=makeBanners("Info");
}
if(console[loggingFunction]){
if(Mojo.Host.current!==Mojo.Host.browser&&banners.loggingPrefix){
stringToLog=banners.loggingPrefix+stringToLog;
if(banners.loggingSuffix){
stringToLog+=banners.loggingSuffix;
}
}
console[loggingFunction](stringToLog);
}
}
}
return stringToLog;
};


Mojo.Log.error=function error(){
Mojo.Log._logImplementation(Mojo.Log.LOG_LEVEL_ERROR,$A(arguments));
};



Mojo.Log.warn=function warn(){
if(Mojo.Log.currentLogLevel>=Mojo.Log.LOG_LEVEL_WARNING){
Mojo.Log._logImplementation(Mojo.Log.LOG_LEVEL_WARNING,$A(arguments));
}
};


Mojo.Log.info=function info(){
if(Mojo.Log.currentLogLevel>=Mojo.Log.LOG_LEVEL_INFO){
Mojo.Log._logImplementation(Mojo.Log.LOG_LEVEL_INFO,$A(arguments));
}
};


Mojo.Log.LOG_LEVEL_ERROR=0;

Mojo.Log.LOG_LEVEL_WARNING=10;

Mojo.Log.LOG_LEVEL_INFO=20;
Mojo.Log.currentLogLevel=Mojo.Log.LOG_LEVEL_ERROR;


Mojo.Log.addLoggingMethodsToClass=function(targetClass){
targetClass.addMethods({log:Mojo.Log.conditionalLogger});
};


Mojo.Log.addLoggingMethodsToPrototype=function(targetObject){
var methods=["info","warn","error"];
var addToPrototype=function(functionName){
if(targetObject.prototype[functionName]!==undefined){
Mojo.Log.warn("Overwriting existing method with logging method ",functionName);
}
targetObject.prototype[functionName]=Mojo.Log[functionName];
};
methods.each(addToPrototype);
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Controller.AppController=Class.create(

{


initialize:function(){
this._stages=[];
this._stageProxies={};
this._stageMgr=new Mojo.Controller.StageManager(this);
this.banners=$H();

if(!Mojo.Controller.appInfo.noWindow){
window._mojoStageType=Mojo.Controller.StageType.card;
this._stageMgr.setStageRef("_originalMojoCard",window);
}
},


setupAppAssistant:function(){
var launchParams;
this.body=window.document.body;
var assistantName="AppAssistant";
if(this.body){
assistantName=this.body["x-mojo-assistant"]||assistantName;
}

var ConstructorFunction=window[assistantName];
if(ConstructorFunction){
this.assistant=new ConstructorFunction(this);
this.assistant.controller=this;

if(this.assistant.setup){
this.assistant.setup();
}
else if(this.assistant.startup){
Mojo.Log.error("WARNING: AppAssistant.startup() has been deprecated, please implement 'setup()' instead.");
this.assistant.startup();
}

}
var that=this;
["handleLaunch"].each(function(functionName){
var delegateFunctionName=Mojo.Controller.assistantFunctionName(functionName);
if(that.assistant&&that.assistant[functionName]){
that[delegateFunctionName]=that.assistant[functionName].bind(that.assistant);
}else{
that[delegateFunctionName]=Mojo.doNothing;
}
});

launchParams=Mojo.getLaunchParameters();
if(!this.handledAsFrameworkLaunch(launchParams)){

this.assistantHandleLaunch(launchParams);
}

if(Mojo.Controller.appInfo.noWindow){
window.addEventListener('unload',
this._cleanup.bindAsEventListener(this),
false);
}

},


createStage:function(createStageParams){
Mojo.Log.error("WARNING: AppController.createStage() has been deprecated, please use createStageWithCallback().");
var stageParams={};
if(Object.isString(stageParams)){
stageParams.name=createStageParams;
}else{
stageParams=Object.extend(stageParams,createStageParams);
stageParams.name=stageParams.windowName;
}
var f=function(stageController){
stageController.pushScene(stageController.paramsFromURI.scene);
};
this.createStageWithCallback(stageParams,f);
return undefined;
},


createStageWithCallback:function(stageArguments,onCreate,optionalStageType){
this._stageMgr.createStage(stageArguments,onCreate,optionalStageType);
},


callCreateStageCallback:function(stageName,stageController){
this._stageMgr.callCreateStageCallback(stageName,stageController);
},


getStageController:function(stageName){
return this._getStageControllerOrMaybeProxy(stageName,false);
},



getStageProxy:function(stageName){
return this._getStageControllerOrMaybeProxy(stageName,true);
},


_getStageControllerOrMaybeProxy:function(stageName,useProxy){
var w,proxy,stageController,readyAndStageController;

Mojo.requireString(stageName,"getStageController/Proxy: stageName must be a string.");
if(stageName===window.name){
return Mojo.Controller.stageController;
}
w=this._stageMgr.getStageRef(stageName);

if(w){
readyAndStageController=Mojo.Controller.StageController.isReadyForDelegation(w);
if(useProxy){
if(!readyAndStageController.ready){
proxy=this._stageProxies[stageName];
if(proxy===undefined){
proxy=new Mojo.Controller.StageProxy(stageName);
stageController=readyAndStageController.stageController;
if(stageController){
stageController.setProxy(proxy);
}
this._stageProxies[stageName]=proxy;
}
return proxy;
}
}
return readyAndStageController.stageController;
}

return undefined;
},


closeStage:function(stageName){
Mojo.requireString(stageName,"closeStage: stageName must be a string.");
delete this._stageProxies[stageName];
this._stageMgr.closeStage(stageName);
},


closeAllStages:function(){
this._stageProxies={};
this._stageMgr.closeAllStages();
},


generateStageName:function(url){
this.windowIndex=(this.windowIndex+1)||1;
var baseName=this._extractStageNameFromUrl(url);
return baseName+"-"+this.windowIndex;
},


_extractStageNameFromUrl:function(url){
var re=/\/(.*)\.html/;
var match=url.match(re);
if(match===null){
match="index";
}
return match[1];
},


getStageMgr:function(){
return this._stageMgr;
},


isTestLaunch:function(){
var launchParams=Mojo.getLaunchParameters();
return launchParams.mojoTest!==undefined;
},


handleTestLaunch:function(){
var launchParams=Mojo.getLaunchParameters();
var f=function(stageController){
Mojo.Test.pushTestScene(stageController,{runAll:true,testId:launchParams.testId,resultsUrl:launchParams.resultsUrl});
};
this.createStageWithCallback({name:'test-stage',lightweight:true},f);
},


handleCrossLaunch:function(){
Mojo.Controller.handleCrossLaunch();
},


handleConfigLaunch:function(launchParameters){
Mojo.Environment.applyConfiguration(launchParameters.mojoConfig);
},


handleDebuggerLaunch:function(launchParameters){
var params=launchParameters.mojoDebugger;
var keys,stageController;
var that=this;

function openInspector(nameOrController){

var otherWindow,stageController;

if(Object.isString(nameOrController)){
otherWindow=that._stageMgr.getStageRef(nameOrController);
stageController=otherWindow&&otherWindow.Mojo.Controller.stageController;
}else{
stageController=nameOrController;
}

if(stageController){
stageController.openStageInspector();
}
}

if(params.openAll){
keys=this._stageMgr.allStageKeys();
for(var i=0;i<keys.length;i++){
openInspector(keys[i]);
}
}else if(params.windowToOpen){

openInspector(params.windowToOpen);
}else{

stageController=this.getActiveStageController(Mojo.Controller.StageType.card)||
this.getActiveStageController(Mojo.Controller.StageType.stackedCard);
openInspector(stageController);
}

},


handledAsFrameworkLaunch:function(launchParameters){
var launchMethodName,launchMethod,launchCodeIndex,launchCode,frameworkLaunchParams=this.kFrameworkLaunchParams;
for(launchCodeIndex=frameworkLaunchParams.length-1;launchCodeIndex>=0;launchCodeIndex--){
launchCode=frameworkLaunchParams[launchCodeIndex];
if(launchParameters[launchCode]!==undefined){
launchMethodName=launchCode.replace(/mojo(.*)/,"handle$1Launch");
launchMethod=this[launchMethodName];
Mojo.requireFunction(launchMethod,"Framework launch codes must match a launch method.");
launchMethod.call(this,launchParameters);
return true;
}
}
return false;
},


handleRelaunch:function(relaunchParameters){

if(this.handledAsFrameworkLaunch(relaunchParameters)){
return;
}



if(typeof relaunchParameters=='object'&&relaunchParameters['palm-command']=='open-app-menu'){
var stageController=this.getActiveStageController(Mojo.Controller.StageType.card)||
this.getActiveStageController(Mojo.Controller.StageType.stackedCard);
if(stageController){
stageController.sendEventToCommanders(Mojo.Event.make(Mojo.Event.command,{command:Mojo.Menu.showAppCmd}));
}
}else{
this.assistantHandleLaunch(relaunchParameters);
if(this.assistantHandleLaunch===Mojo.doNothing){
if(!Mojo.Controller.appInfo.noWindow){
Mojo.Log.info("AppAssistant didn't implement handleLaunch so giving focus to main window...");
PalmSystem.activate();
}
}
}

},



showBanner:function(bannerParams,launchArguments,category){
var bannerKey,bannerId,defaultsCopy;
if(Object.isString(bannerParams)){
bannerParams={messageText:bannerParams};
}
defaultsCopy=Object.extend({},this.kDefaultBannerParams);
bannerParams=Object.extend(defaultsCopy,bannerParams);
this.removeBanner(category);
try{
bannerId=PalmSystem.addBannerMessage(bannerParams.messageText,Object.toJSON(launchArguments),
bannerParams.icon,bannerParams.soundClass,bannerParams.soundFile,bannerParams.soundDuration);
bannerKey=category||'banner';
this.banners.set(bannerKey,bannerId);
}catch(addBannerMessageException){
Mojo.Log.error(addBannerMessageException.toString());
}
},


removeBanner:function(category){
var bannerKey=category||'banner';
var bannerId=this.banners.get(bannerKey);
if(bannerId){
try{
PalmSystem.removeBannerMessage(bannerId);
}catch(removeBannerException){
Mojo.Log.error(removeBannerException.toString());
}
}
},


removeAllBanners:function(){
this.banners=$H();
try{
PalmSystem.clearBannerMessages();
}catch(clearBannerMessagesException){
Mojo.Log.error(clearBannerMessagesException.toString());
}
},


playSoundNotification:function(soundClass,soundFile,soundDurationInMs){
PalmSystem.playSoundNotification(soundClass,soundFile,soundDurationInMs);
},


considerForNotification:function(notificationData){
Mojo.Log.error("Warning: AppController.considerForNotification is deprecated, used AppController.sendToNotificationChain");
this.sendToNotificationChain(notificationData);
},


sendToNotificationChain:function(notificationData){
var focusedStage=this.getActiveStageController(Mojo.Controller.StageType.card);
if(focusedStage){
notificationData=focusedStage.sendNotificationDataToCommanders(notificationData);
}
if(notificationData&&this.assistant&&this.assistant.considerForNotification){
this.assistant.considerForNotification(notificationData);
}
},



getActiveStageController:function(stageType){
return this._stageMgr.getActiveStageController(stageType);
},


getFocusedStageController:function(stageType){
return this.getActiveStageController(stageType);
},


launch:function(appId,params,onSuccess,onFailure){
if(Mojo.Host.current===Mojo.Host.browser){
window.opener.MojoHost.launch(appId,false,params);
if(onSuccess){
onSuccess.defer();
}
return;
}
return new Mojo.Service.Request('palm://com.palm.applicationManager',{
method:'launch',
onSuccess:onSuccess||Mojo.doNothing,
onFailure:onFailure||Mojo.doNothing,
parameters:{
id:appId,
params:params
}
});
},


open:function(params,onSuccess,onFailure){
if(Mojo.Host.current===Mojo.Host.browser){
window.opener.MojoHost.launch(params.id,false,params);
if(onSuccess){
onSuccess.defer();
}
return;
}
return new Mojo.Service.Request('palm://com.palm.applicationManager',{
method:'open',
onSuccess:onSuccess||Mojo.doNothing,
onFailure:onFailure||Mojo.doNothing,
parameters:params
});
},


getScreenOrientation:function(){
return PalmSystem.screenOrientation;
},

getIdentifier:function(){
return PalmSystem.identifier;
},

isMinimal:function(){
return PalmSystem.isMinimal;
},


finishOpenStage:function(w){
Mojo.Gesture.setup(w.document);
Mojo.Animation.setup(w);
Mojo.Controller.setupStageController(w);
w.Mojo.handleGesture=Mojo.doHandleGesture.bind(undefined,w);
},


getAssistantCleanup:function(){
return this.assistant&&this.assistant.cleanup&&this.assistant.cleanup.bind(this.assistant);
},


_cleanup:function(){
var assistantCleanup=this.assistant&&this.assistant.cleanup;
this._stageMgr.closeAllStages();

if(assistantCleanup){
assistantCleanup.bindAsEventListener(this.assistant)();
}
},

kDefaultBannerParams:{soundClass:'',soundFile:'',icon:'',messageText:''},

kFrameworkLaunchParams:["mojoTest","mojoCross","mojoConfig","mojoDebugger"]

});




Mojo.Controller.StageManager=Class.create(

{


initialize:function(appController){
this._windowHash=$H({});
this._callbacks=$H({});
this._appController=appController;
},


calculateUrl:function(stageArgumentsWithLocale){
var url;
var prefix;
var urlWithParameters;
var parts;
if(stageArgumentsWithLocale.lightweight&&!Mojo.sourcesList){
url="about:blank?"+Object.toQueryString(stageArgumentsWithLocale);
}else{
urlWithParameters=document.baseURI;
parts=urlWithParameters.split("?");
url=parts[0];
if(stageArgumentsWithLocale.htmlFileName){
prefix=stageArgumentsWithLocale.htmlFilePath||'$1';
url=url.replace(/(.*\/).*\.html/,prefix)+stageArgumentsWithLocale.htmlFileName+".html";
delete stageArgumentsWithLocale.htmlFileName;
delete stageArgumentsWithLocale.htmlFilePath;
}
url=url+'?'+Object.toQueryString(stageArgumentsWithLocale);
}
return url;
},


createStage:function(stageArguments,onCreate,optionalStageType){
var stageName,newlyCreatedWindow;
if(Object.isString(stageArguments)){
stageName=stageArguments;
stageArguments={name:stageName};
}else{
stageName=stageArguments.name;
}
Mojo.requireString(stageName,"createStageWithCallback: stageName must be a string");
Mojo.requireFunction(onCreate,"createStageWithCallback: onCreate must be a function.");
var existingStageController=this.getStageRef(stageName);
Mojo.require(existingStageController===undefined,"createStageWithCallback: cannot create two stages with the same name. "+stageName);

stageArguments.window=optionalStageType||Mojo.Controller.StageType.card;

var defaultStageHeight=432;
if(stageArguments.window===Mojo.Controller.StageType.dashboard){
defaultStageHeight=48;
}else if(stageArguments.window===Mojo.Controller.StageType.bannerAlert){
defaultStageHeight=48;
}else if(stageArguments.window===Mojo.Controller.StageType.popupAlert){
defaultStageHeight=200;
}
var stageHeight=stageArguments.height||defaultStageHeight;


var stageArgumentsWithLocale=Object.extend({mojoLocale:Mojo.Locale.current},stageArguments);
var url=this.calculateUrl(stageArgumentsWithLocale);


var strWindowFeatures="resizable=no,scrollbars=no,status=yes,width=320,height="+stageHeight;
var paramsFromURI=document.baseURI.toQueryParams();
if(Mojo.Host.current===Mojo.Host.browser&&paramsFromURI.mojoBrowserWindowMode==='single'){
newlyCreatedWindow=window;
newlyCreatedWindow.name=stageName;
newlyCreatedWindow.resizable=false;
newlyCreatedWindow.scrollbars=false;
newlyCreatedWindow.width=320;
newlyCreatedWindow.height=stageHeight;
Element.setStyle(newlyCreatedWindow.document.body,{width:'320px',height:stageHeight+'px'});
}else{
newlyCreatedWindow=window.open(url,stageName,strWindowFeatures);
}
if(newlyCreatedWindow){
newlyCreatedWindow._mojoStageType=stageArguments.window;
if(stageArguments.lightweight){
newlyCreatedWindow._mojoLightweightWindow=true;
}


this._callbacks.set(stageName,onCreate);
this._windowHash.set(stageName,newlyCreatedWindow);
if(stageArguments.lightweight){
if(!Mojo.sourcesList){
Mojo.cloneStylesheets(document,newlyCreatedWindow.document);
this._appController.finishOpenStage(newlyCreatedWindow);
}
}
}else{
Mojo.Log.warn("WARNING: window.open failed, often due to popup blockers in effect.");
}
},


callCreateStageCallback:function(stageName,stageController){
var cf=this._callbacks.get(stageName);
if(cf){
var paramsFromURI=document.baseURI.toQueryParams();
cf(stageController);
if(Mojo.Host.current!==Mojo.Host.browser||paramsFromURI.mojoBrowserWindowMode!=='single'){
this._callbacks.unset(stageName);
}
}
},


showScene:function(window,sceneName,argHash,dontReplaceExisting){
var i;
if(this.stageExists(window)){
if(dontReplaceExisting===true){
return;
}
this.closeStage(window);
}
var createStageArgs=Object.extend({scene:sceneName,
windowName:window},argHash);
this._appController.createStage(createStageArgs);
},


closeStage:function(windowName){
if(this.stageExists(windowName)){
var windowToClose=this._windowHash.get(windowName);
this.removeStageRef(windowName,windowToClose);
windowToClose.close();
}else{
Mojo.Log.warn("WARNING: WINDOW DIDNT EXIST AND ATTEMPTED TO CLOSE.\n\n\n");
}

},


closeAllStages:function(){
var stageKeys=this._windowHash.keys();
for(var i=0;i<stageKeys.length;i++){
if(stageKeys[i]!=="_originalMojoCard"){
this.closeStage(stageKeys[i]);
}
}
},


allStageKeys:function(){
return this._windowHash.keys();
},


stageExists:function(windowName){
var windowHandle=this._windowHash.get(windowName);
return(windowHandle!==undefined&&windowHandle!==null&&!windowHandle.closed);
},


setStageRef:function(windowName,windowReference){
this._windowHash.set(windowName,windowReference);
},


getStageRef:function(windowName){
var windowHandle=this._windowHash.get(windowName);
if(windowHandle&&windowHandle.closed){
this.removeStageRef(windowName,windowHandle);
return undefined;
}
return windowHandle;
},


removeStageRef:function(windowName,windowReference){
var windowHandle=this._windowHash.get(windowName);
if(windowHandle!==undefined&&windowHandle===windowReference){
this._windowHash.unset(windowName);
}
},


focusStage:function(windowName){
if(this.stageExists(windowName)){
this.getStageRef(windowName).focus();
}else{
Mojo.Log.warn("attempting to focus on window but didn't exist "+windowName);
}
},


getActiveStageController:function(stageType){
if(Mojo.Controller.stageController&&
(stageType===undefined||Mojo.Controller.stageController._mojoStageType===stageType)&&
Mojo.Controller.stageController.isActiveAndHasScenes()){
return Mojo.Controller.stageController;
}
var stageKeys=this._windowHash.keys();
var focusedChildStage;
for(var i=stageKeys.length-1;i>=0;i--){
var stageName=stageKeys[i];
var stage=this._windowHash.get(stageName);
if(stage&&stage.Mojo&&stage.Mojo.Controller&&stage.Mojo.Controller.stageController&&stage.Mojo.Controller.stageController.active&&(stageType===undefined||stage._mojoStageType===stageType)){
focusedChildStage=stage;
}
}
return focusedChildStage&&focusedChildStage.Mojo.Controller.stageController;
},


focusOrCreateStage:function(windowName,scene,args){
Mojo.Log.error("DEPRECATED: focusOrCreateStage. Use getStageController & focus or createStageWithCallback instead.");
if(this.stageExists(windowName)){
this.focusStage(windowName);
}else{
this.showScene(windowName,scene,args,false);
}
}
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.CommanderStack=Class.create({
initialize:function(){
this._commanderStack=[];
},


removeCommander:function(commander){
this._commanderStack=this._commanderStack.filter(function(e){return e!==commander;});


},


pushCommander:function(commander){


this._commanderStack.push(commander);
},



sendEventToCommanders:function(event){

for(var i=this._commanderStack.length-1;i>=0;i--){
var cmdr=this._commanderStack[i];
if(cmdr.handleCommand){
cmdr.handleCommand(event);
if(event._mojoPropagationStopped){
break;
}
}
}

},


sendNotificationDataToCommanders:function(notificationData){
for(var i=this._commanderStack.length-1;i>=0;i--){
var cmdr=this._commanderStack[i];
if(cmdr.considerForNotification){
notificationData=cmdr.considerForNotification(notificationData);
if(!notificationData){
break;
}
}
}
return notificationData;
},


size:function(scene){
return this._commanderStack.size();
}

});


/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Controller.SceneController=Class.create(

{


sceneContainerLayer:0,
dialogContainerLayer:10,
submenuContainerLayer:20,



initialize:function(stageController,sceneElement,sceneArguments,remainingArguments){
var sceneName=sceneArguments.name;
this.stageController=stageController;
this.window=stageController.window;
this.document=this.window.document;
this.sceneName=sceneName;
this.sceneId=sceneArguments.id||sceneArguments.name;
this.scrollingEnabled=!sceneArguments.disableSceneScroller;
this.crossLaunchPush=sceneArguments.mojoCrossLaunchPush;
this.defaultTransition=sceneArguments.transition||Mojo.Transition.defaultTransition;
if(sceneArguments.automaticFocusAdvance!==undefined){
this.automaticFocusAdvance=sceneArguments.automaticFocusAdvance;
}else{
this.automaticFocusAdvance=Mojo.Controller.SceneController.automaticFocusAdvance;
}
this.sceneElement=sceneElement;
this._commanderStack=new Mojo.CommanderStack();
this._modelWatchers=[];
this._widgetSetups={};
this._menus={};
this._serviceRequestErrorHandler=this.serviceRequestError.bind(this);
this.activeServiceRequests=[];
this.activeSubscribedServiceRequests=[];
this.scrollbars=sceneArguments.scrollbars;
this._active=false;
this._useLandscapePageUpDown=false;
this._enableFullScreenMode=false;

this._containerStack=new Mojo.Controller.ContainerStack(this);
this.pushContainer(this.sceneElement,this.sceneContainerLayer);

this.keydownHandler=this.keydown.bindAsEventListener(this);
this.keyupHandler=this.keyup.bindAsEventListener(this);
this.updateSceneScrollerSizeHandler=this.updateSceneScrollerSize.bindAsEventListener(this);

if(remainingArguments){

var args=$A(remainingArguments);

}

var assistantName=sceneArguments.assistantName||Mojo.identifierToCreatorFunctionName(sceneName,"Assistant");
var constructorFunction=sceneArguments.assistantConstructor||window[assistantName];



Mojo.require(sceneArguments.allowUndefinedAssistant||constructorFunction,
"The scene assistant '"+assistantName+"' is not defined. Did you remember to include it in index.html?");

if(constructorFunction){
var assistant=Mojo.createWithArgs(constructorFunction,remainingArguments);
assistant.controller=this;
this.assistant=assistant;
}

var controller=this;
["setup","cleanup","activate","deactivate","orientationChanged"].each(function(functionName){
var delegateFunctionName=Mojo.Controller.assistantFunctionName(functionName);
if(assistant&&assistant[functionName]){
controller[delegateFunctionName]=assistant[functionName].bind(assistant);
}else{
controller[delegateFunctionName]=Mojo.doNothing;
}
});


this.unfocusOnTapHandler=this.unfocusOnTap.bindAsEventListener(this);
},


unfocusOnTap:function(event){


if(event.defaultPrevented){
return;
}



var focusedElement=this.getFocusedElement();
if(event.target!==focusedElement){
if(focusedElement){
focusedElement.blur();
}
}
},


setup:function(){
var timing=Mojo.Timing;

timing.resume("scene#setup");
if(this.scrollingEnabled){
this.sceneScroller=this.sceneElement.parentNode;
this.updateSceneScrollerSize();
this.scrollerController=new Mojo.Controller.WidgetController(this.sceneScroller,this,
{
establishWidth:true,scrollbars:this.scrollbars,pageUpDown:true
});
}

this.pushCommander(this);

if(this.assistant){
this.pushCommander(this.assistant);
}

timing.resume("scene#assistantSetup");
try{
this.assistantSetup();
}catch(e){
Mojo.Log.error("An exception occurred in the '"+this.sceneName+"' scene's setup() method.");
Mojo.Log.error("Error: %s, line %s, file %s",e.message,e.line,e.sourceURL);
}

timing.pause("scene#assistantSetup");


this.instantiateChildWidgets(this.sceneElement);

this._installMenus();


if(this.sceneScroller){
this.sceneScroller.mojo.validateScrollPosition();
}


if(this.assistant&&this.assistant.ready){
timing.resume("scene#assistantReady");
try{
this.assistant.ready();
}catch(e2){
Mojo.Log.error("An exception occurred in the '"+this.sceneName+"' scene's ready() method.");
Mojo.Log.error("Error: %s, line %s, file %s",e2.message,e2.line,e2.sourceURL);
}

timing.pause("scene#assistantReady");
}

this.focusFirstElement.bind(this).defer();
timing.pause("scene#setup");
},


cleanup:function(){


this._containerStack.cleanup();


try{
this.assistantCleanup();
}catch(e){
Mojo.Log.error("An exception occurred in the '"+this.sceneName+"' scene's cleanup() method.");
Mojo.Log.error("Error: %s, line %s, file %s",e.message,e.line,e.sourceURL);
}


this._modelWatchers=undefined;

this.activeServiceRequests.each(function(r){
r.originalCancel();
}.bind(this));
delete this.activeServiceRequests;

this.activeSubscribedServiceRequests.each(function(r){
r.originalCancel();
}.bind(this));
delete this.activeSubscribedServiceRequests;

if(this.scrollingEnabled){
this.sceneScroller.remove();
Mojo.removeAllEventListenersRecursive(this.sceneScroller);
}else{
this.sceneElement.remove();
Mojo.removeAllEventListenersRecursive(this.sceneElement);
}

if(this.assistant){
delete this.assistant.controller;
delete this.assistant;
}
},


aboutToActivate:function(synchronizer){
var timing=Mojo.Timing;
timing.resume("scene#aboutToActivate");

this.updateSceneScrollerSize();


Mojo.Event.listen(this.window,'resize',this.updateSceneScrollerSizeHandler);





if(this.assistant&&this.assistant.aboutToActivate){
try{
this.assistant.aboutToActivate(synchronizer.wrap(Mojo.doNothing));
}catch(e){
Mojo.Log.error("An exception occurred in the '"+this.sceneName+"' scene's aboutToActivate() method.");
Mojo.Log.error("Error: %s, line %s, file %s",e.message,e.line,e.sourceURL);
}
}








Mojo.Event.send(this.sceneElement,Mojo.Event.aboutToActivate,{synchronizer:synchronizer});




this._doEnableFullScreenMode();

timing.pause("scene#aboutToActivate");
timing.resume("scene#aboutToActivateLatency");
},


activate:function(returnValue){
var timing=Mojo.Timing,that=this;
timing.pause("scene#aboutToActivateLatency");
timing.resume("scene#activate");
this._active=true;


if(this.crossLaunchPush&&!this._didInitialActivate){
this._didInitialActivate=true;
if(this.window.PalmSystem.crossAppSceneActive){
this.window.PalmSystem.crossAppSceneActive();
}else{
Mojo.Log.error("crossAppSceneActive() not available, but we would have called it.");
}
}

this._doUseLandscapePageUpDown();

if(this.assistant){
try{
this.assistantActivate(returnValue);

}catch(e){
Mojo.Log.error("An exception occurred in the '"+this.sceneName+"' scene's activate() method.");
Mojo.Log.error("Error: %s, line %s, file %s",e.message,e.line,e.sourceURL);
}
}

Mojo.Event.send(this.sceneElement,Mojo.Event.activate,undefined,false);

if(this.automaticFocusAdvance){
this.document.addEventListener("keydown",this.keydownHandler,true);
this.document.addEventListener("keyup",this.keyupHandler,true);
}

Mojo.Event.listen(this.document,Mojo.Event.tap,this.unfocusOnTapHandler);
timing.pause("scene#activate");
var report=function(name){
timing.pause('scene#total');
timing.reportSceneTiming(name,that.window);
};
report.defer(this.sceneName);
},


deactivate:function(){
Mojo.Event.stopListening(this.window,'resize',this.updateSceneScrollerSizeHandler);
Mojo.Event.stopListening(this.document,Mojo.Event.tap,this.unfocusOnTapHandler);
this._active=false;

if(this.automaticFocusAdvance){
this.document.removeEventListener("keydown",this.keydownHandler,true);
this.document.removeEventListener("keyup",this.keyupHandler,true);
}



this._containerStack.cancelAll();

if(this.assistant){
try{
this.assistantDeactivate();
}catch(e){
Mojo.Log.error("An exception occurred in the '"+this.sceneName+"' scene's deactivate() method.");
Mojo.Log.error("Error: %s, line %s, file %s",e.message,e.line,e.sourceURL);
}
}

Mojo.Event.send(this.sceneElement,Mojo.Event.deactivate,undefined,false);
},



setDefaultTransition:function(transitionType){
this.defaultTransition=transitionType;
},


isActive:function(){
return this._active;
},




select:function(cssSelector){
return $A(this.sceneElement.querySelectorAll(cssSelector));
},


focusFirstElement:function(){
this.firstActivate=false;
var focusTarget=this.initialFocusedElement;
if(focusTarget!==null){
var currentFocusedElement=this.getFocusedElement();
if(currentFocusedElement!==null){
return;
}
if(focusTarget){
focusTarget=this.get(focusTarget);
if(focusTarget){
if(focusTarget.mojo&&focusTarget.mojo.focus){
focusTarget.mojo.focus();
}else if(focusTarget.focus){
focusTarget.focus();
}
}
}else{
this.advanceFocus();
}
}
},


advanceFocus:function(selection){
Mojo.View.advanceFocus(this.sceneElement,selection);
},



keyup:function(keyupEvent){
if(keyupEvent.keyCode===Mojo.Char.enter){
var selection=Mojo.View.getFocusedElement(this.sceneElement);
if(!Mojo.Gesture.handlesReturnKey(selection)||keyupEvent.shiftKey){
Event.stop(keyupEvent);
this.advanceFocus(selection);
}
}
},



keydown:function(keydownEvent){
if(keydownEvent.keyCode===Mojo.Char.enter){
var selection=Mojo.View.getFocusedElement(this.sceneElement);
if(!Mojo.Gesture.handlesReturnKey(selection)||keydownEvent.shiftKey){
Event.stop(keydownEvent);
}
}
},


setUserIdleTimeout:function(element,func,delay,watchMouse,watchKeys){
var timeoutID;
var resetFunc;

element=this.get(element);


if(watchMouse===undefined){
watchMouse=true;
}
if(watchKeys===undefined){
watchKeys=true;
}



var timeoutFunc=function(){
if(watchMouse){
Mojo.Event.stopListening(element,'mousedown',resetFunc);
Mojo.Event.stopListening(element,'mousemove',resetFunc);
Mojo.Event.stopListening(element,'mousedown',resetFunc);
}

if(watchKeys){
Mojo.Event.stopListening(element,'keydown',resetFunc);
Mojo.Event.stopListening(element,'keyup',resetFunc);
}

if(func){
func();
}
};




resetFunc=function(event){
window.clearTimeout(timeoutID);
timeoutID=window.setTimeout(timeoutFunc,delay);
};



var cancelFunc=function(){
window.clearTimeout(timeoutID);
func=undefined;
timeoutFunc();
};


if(watchMouse){
Mojo.Event.listen(element,'mousedown',resetFunc);
Mojo.Event.listen(element,'mousemove',resetFunc);
Mojo.Event.listen(element,'mousedown',resetFunc);
}

if(watchKeys){
Mojo.Event.listen(element,'keydown',resetFunc);
Mojo.Event.listen(element,'keyup',resetFunc);
}


resetFunc({type:'initial setup'});

return cancelFunc;
},


topContainer:function(){
return this._containerStack.topContainer();
},


pushContainer:function(container,layer,options){
return this._containerStack.pushContainer(container,layer,options);
},


removeContainer:function(container){
return this._containerStack.removeContainer(container);
},



pushCommander:function(cmdr){
this._commanderStack.pushCommander(cmdr);
},


removeCommander:function(cmdr){
this._commanderStack.removeCommander(cmdr);
},


getCommanderStack:function(){
return this._commanderStack;
},



setupWidgetModel:function(name,attributes,model){

Mojo.Log.warn("WARNING: setupWidgetModel() is the old name. Use setupWidget().");
this.setupWidget(name,attributes,model);
},


setupWidget:function(name,attributes,model){

this._widgetSetups[name]={attributes:attributes,model:model};
},




getWidgetModel:function(name){
Mojo.Log.warn("WARNING: getWidgetModel() has been deprecated. Use getWidgetSetup().");
return undefined;
},




getWidgetSetup:function(name){
return this._widgetSetups[name];
},



setWidgetModel:function(widget,model){
var elt=this.get(widget);




if(!elt._mojoController){
elt._mojoModel=model;
return;
}
else{
elt._mojoController.setModel(model);
}
},



modelChanged:function(model,who){
var changeInfo={model:model,who:who,what:arguments[2]};


if(this._deferredChangedModels){
this._deferredChangedModels.push(changeInfo);
Mojo.Log.info("INFO: modelChanged() was called while processing a previous model change. This is often unintended.");
}else{







this._deferredChangedModels=[changeInfo];

while(this._deferredChangedModels.length>0){
changeInfo=this._deferredChangedModels.shift();
this._notifyModelWatchers(changeInfo);
}

delete this._deferredChangedModels;
}

},


_notifyModelWatchers:function(changeInfo){
var watcher,count,i;



count=0;
for(i=0;i<this._modelWatchers.length;i++){
watcher=this._modelWatchers[i];
if(watcher.model===changeInfo.model){
if(watcher.who!==changeInfo.who){
watcher.onchange.call(watcher.who,changeInfo.model,changeInfo.what);
}
count++;
}
}

Mojo.assert(count>0,"WARNING: modelChanged() found no watchers. Did you call it with the ORIGINAL model object, and not a replacement?");

},


watchModel:function(model,who,changeFunc){
if(model&&who&&changeFunc){
this._modelWatchers.push({model:model,who:who,onchange:changeFunc});
}
},


removeWatcher:function(watcher,model){
if(!this._modelWatchers){
return;
}

if(model!==undefined){
var watch;
for(var i=0;i<this._modelWatchers.length;i++)
{
watch=this._modelWatchers[i];
if(watch.who===watcher&&watch.model===model){
this._modelWatchers.splice(i,1);
break;
}
}
}else{
this._modelWatchers=this._modelWatchers.reject(function(w){return w.who===watcher;});
}
},


handleOrientationChange:function(orientation){
this.assistantOrientationChanged(orientation);
Mojo.Event.send(this.sceneElement,Mojo.Event.orientationChange,{orientation:orientation},false);
},


useLandscapePageUpDown:function(yesNo){
if(this._useLandscapePageUpDown!==yesNo){
this._useLandscapePageUpDown=yesNo;
this._doUseLandscapePageUpDown();
}
},


enableFullScreenMode:function(yesNo){
if(this._enableFullScreenMode!==yesNo){
this._enableFullScreenMode=yesNo;
this._doEnableFullScreenMode();
}
},


_doUseLandscapePageUpDown:function(){
if(this.window.PalmSystem&&this.window.PalmSystem.receivePageUpDownInLandscape){
this.window.PalmSystem.receivePageUpDownInLandscape(this._useLandscapePageUpDown);
}
},


_doEnableFullScreenMode:function(){
if(this.window.PalmSystem&&this.window.PalmSystem.enableFullScreenMode){
this.window.PalmSystem.enableFullScreenMode(this._enableFullScreenMode);
}
},


handleShortcut:function(which){
return this._menu&&this._menu.assistant.handleShortcut(which);
},





setMenuVisible:function(which,visible){
if(this._menu===undefined){
Mojo.Log.warn("WARNING: Attempting to set visibility on menu '",which,"' which does not exist yet. You may want to set the 'visible' property of the menu's model.");
}else{
this._menu.assistant.setMenuVisible(which,visible);
}
},





getMenuVisible:function(which){
if(this._menu===undefined){
return false;
}
return this._menu.assistant.getMenuVisible(which);
},




toggleMenuVisible:function(which){
this._menu.assistant.toggleMenuVisible(which);
},


_installMenus:function(){
var viewMenu=this._widgetSetups[Mojo.Menu.viewMenu];
var cmdMenu=this._widgetSetups[Mojo.Menu.commandMenu];
var appMenu=this._widgetSetups[Mojo.Menu.appMenu];

Mojo.assert(!viewMenu||viewMenu.model,"WARNING: Mojo.Menu.viewMenu has an undefined model. Did you pass it as the attributes by mistake?");
Mojo.assert(!cmdMenu||cmdMenu.model,"WARNING: Mojo.Menu.commandMenu has an undefined model. Did you pass it as the attributes by mistake?");
Mojo.assert(!appMenu||appMenu.model,"WARNING: Mojo.Menu.appMenu has an undefined model. Did you pass it as the attributes by mistake?");

this._menu=this.createDynamicWidget('_Menu',
{viewModel:viewMenu&&viewMenu.model,
viewAttrs:viewMenu&&viewMenu.attributes,
commandModel:cmdMenu&&cmdMenu.model,
commandAttrs:cmdMenu&&cmdMenu.attributes,
appModel:appMenu&&appMenu.model,
appAttrs:appMenu&&appMenu.attributes});
},


doExecCommand:function(event,commandString){
this.document.execCommand(commandString);
event.stopPropagation();
},


handleCommand:function(event){
var cmd;
if(event.type===Mojo.Event.command){

switch(event.command){
case Mojo.Menu.showAppCmd:
if(this._menu){
this._menu.assistant.showAppMenu();
event.stop();
}
break;

case Mojo.Menu.cutCmd:
this.doExecCommand(event,'cut');
break;
case Mojo.Menu.copyCmd:
this.doExecCommand(event,'copy');
break;
case Mojo.Menu.pasteCmd:
if(PalmSystem&&PalmSystem.paste){
PalmSystem.paste();
}
break;
case Mojo.Menu.selectAllCmd:
this.doExecCommand(event,'selectall');
break;
}

}else if(event.type===Mojo.Event.commandEnable){
this.doCommandEnable(event);
}else if(event.type===Mojo.Event.renderChordedAltCharacters){
if(this.charSelector&&this.charSelector.element&&this.charSelector.element.mojo&&this.charSelector.element.mojo.isOpen()){
return;
}
this.charSelector=this.createDynamicWidget('CharSelector',{selectionTarget:event.selectionTarget,character:event.character});
}else if(event.type===Mojo.Event.renderAltCharacters){

if(this.charSelector&&this.charSelector.element&&this.charSelector.element.mojo&&this.charSelector.element.mojo.isOpen()){
return;
}
this.charSelector=this.createDynamicWidget('CharSelector',{selectionTarget:event.selectionTarget});
}
},


doCommandEnable:function(event){
var focusNode;
switch(event.command){
case Mojo.Menu.cutCmd:
case Mojo.Menu.copyCmd:
case Mojo.Menu.pasteCmd:
case Mojo.Menu.selectAllCmd:
focusNode=this.getFocusedElement();
if(!(focusNode&&Mojo.View.isTextField(focusNode))){
event.preventDefault();
}
event.stopPropagation();
break;

case Mojo.Menu.boldCmd:
case Mojo.Menu.italicCmd:
case Mojo.Menu.underlineCmd:
focusNode=this.getFocusedElement();
if(!focusNode||!Mojo.View.isRichTextField(focusNode)){
event.preventDefault();
}
event.stopPropagation();
break;

}
},


_completeRequest:function(r,data){
var i=-1;
var subscribed=data.subscriberId;
if(this.activeServiceRequests){
i=this.activeServiceRequests.indexOf(r);
if(i!==-1){
this.activeServiceRequests.splice(i,1);
if(data.subscriberId){
Mojo.Log.error("ERROR! We removed a subscribed request onComplete.");
}
}
}
},


onComplete:function(appOnComplete,data,activeReq){
if(!data.failed){
this._completeRequest(activeReq,data);

if(appOnComplete){
appOnComplete(data);
}
}
},


removeRequest:function(r){
var i=-1;
if(this.activeServiceRequests){
i=this.activeServiceRequests.indexOf(r);
if(i!==-1){
this.activeServiceRequests.splice(i,1);
}
}

if(i===-1&&this.activeSubscribedServiceRequests){
i=this.activeSubscribedServiceRequests.indexOf(r);
if(i!==-1){
this.activeSubscribedServiceRequests.splice(i,1);
}
}

if(i===-1){
Mojo.Log.warn("WARNING: scene controller was asked to remove a request object that wasn't in either the active requests or subscribed requests list.");
}
},


cancelServiceRequest:function(request){
this.removeRequest(request);
request.originalCancel();
},


serviceRequest:function(url,options,resubscribe){
var serviceRequestOptions;

if(!this.activeServiceRequests){
Mojo.Log.error(this.activeServiceRequests,"ActiveServiceRequests does not exist for this scene. Cleanup was called before this request was made.");
return undefined;
}

serviceRequestOptions={
onFailure:this._serviceRequestErrorHandler,
onComplete:this.onComplete.bind(this,options.onComplete)
};

delete options.onComplete;
Object.extend(serviceRequestOptions,options||{});

var request=new Mojo.Service.Request(url,serviceRequestOptions,resubscribe);
request.originalCancel=request.cancel;
request.cancel=this.cancelServiceRequest.bind(this,request);
if(options.parameters&&options.parameters.subscribe){
this.activeSubscribedServiceRequests.push(request);
}else{
this.activeServiceRequests.push(request);
}
return request;
},


serviceRequestError:function(response){
Mojo.Log.error("Error: service request: %s",response.errorText);
if(Mojo.Config.debuggingEnabled){
Mojo.Controller.errorDialog(response.errorText,this.window);
}
response.failed=true;
},


render:function(renderOptions){
var sceneRenderOptions={sceneName:this.controller.sceneName};
Object.extend(sceneRenderOptions,renderOptions||{});
return Mojo.View.render(sceneRenderOptions);
},


get:function(elementId){
var e=elementId;
if(Object.isString(elementId)){
e=this.window.document.getElementById(elementId);
}
return e;
},


listen:function(element,eventType,callback,onCapture){
if(Object.isString(element)){
element=this.get(element);
}
Mojo.Event.listen(element,eventType,callback,onCapture);
},


stopListening:function(element,eventType,callback,onCapture){
if(Object.isString(element)){
element=this.get(element);
}
Mojo.Event.stopListening(element,eventType,callback,onCapture);
},


setInitialFocusedElement:function(initialFocusedElement){
this.initialFocusedElement=initialFocusedElement;
},


getFocusedElement:function(){
return this.sceneElement.querySelector(':focus');
},


notify:function(message){
Mojo.Log.warn("Warning: notify is deprecated, use showBanner instead.");
this.showBanner(message);
},


showBanner:function(){
Mojo.Controller.appController.showBanner.apply(Mojo.Controller.appController,arguments);
},


getSceneScroller:function(){
return this.sceneScroller;
},


updateSceneScrollerSize:function(){
var dimensions,targetDocument,body;
if(this.sceneScroller){
targetDocument=this.document;
body=targetDocument.body;
dimensions=Mojo.View.getViewportDimensions(targetDocument);
this.sceneScroller.setStyle({height:dimensions.height+'px'});
if(body&&body.scrollTop!==0){
Mojo.Log.warn("body element had scroll top set, resetting.");
body.scrollTop=0;
}
if(targetDocument&&targetDocument.scrollTop!==0){
Mojo.Log.warn("document had scroll top set, resetting.");
targetDocument.scrollTop=0;
}
}
},



update:function(element,newContent){
var extendedElement=this.get(element);
Element.update(extendedElement,newContent);
this.instantiateChildWidgets(extendedElement);
this.showWidgetContainer(extendedElement);
},




remove:function(element){
var extendedElement=this.get(element);
Element.remove(extendedElement);
},


newContent:function(elementOrElements){
if(Object.isArray(elementOrElements)){
var that=this;
elementOrElements.each(function(element){that.newContent(element);});
return;
}

var extendedElement=this.get(elementOrElements);
this.instantiateChildWidgets(extendedElement);
this.showWidgetContainer(extendedElement);
},


revealBottom:function(){
if(this.sceneScroller){
this.sceneScroller.mojo.revealBottom();
}
},


revealElement:function(element){
if(this.sceneScroller){
this.sceneScroller.mojo.revealElement(element);
}
},


handleEdgeVisibility:function(edge,visible,marginAmount){
if(this.sceneScroller){
this.sceneScroller.mojo.handleEdgeVisibility(edge,visible,marginAmount);
}
},


commitChanges:function(){

Mojo.Event.send(this.sceneElement,Mojo.Event.commitChanges);
},


prepareTransition:function(transitionType,isPop){
var transition=new Mojo.Controller.Transition(this.window,isPop);
transition.setTransitionType(transitionType||Mojo.Transition.crossFade,isPop);

return transition;
}
});

Mojo.Controller.SceneController.automaticFocusAdvance=true;

Mojo.Log.addLoggingMethodsToPrototype(Mojo.Controller.SceneController);

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Controller.StageController=Class.create(

{


kDefaultSceneName:'main',
kSceneClassName:'palm-scene',
kBrowserObject:'application/x-palm-browser',
enableAltCharPicker:true,



initialize:function(appController,stageWindow,stageProxy){
var that=this,focusWrapper;
var bodyClassName='palm-default';
this.window=stageWindow||window;
this.document=this.window.document;
this.paramsFromURI=this.document.baseURI.toQueryParams();
this.stageType=this.paramsFromURI.window||"card";
this._stageProxy=stageProxy;

this._stagePreparing=true;

switch(this.stageType){
case Mojo.Controller.StageType.popupAlert:
bodyClassName='palm-popup-notification';
break;
case Mojo.Controller.StageType.bannerAlert:
bodyClassName='palm-banner-notification';
break;
case Mojo.Controller.StageType.dashboard:
bodyClassName='palm-dashboard-notification';
break;
}
Mojo.requireFunction(this.document.body.addClassName,"body element must be extended by prototype");
this.document.body.addClassName(bodyClassName);
this._sceneStack=new Mojo.SceneStack();
this._commanderStack=new Mojo.CommanderStack();

this._appController=appController;

this._deferredSceneOps=[];
this._deferredLoadingScenes=[];
this._deferredSceneOpLoader=this._deferredSceneOpLoader.bind(this);
this._deferredSceneOpExecutor=this._deferredSceneOpExecutor.bind(this);

this._endTransition=this._endTransition.bind(this);
this._useSceneTransitions=true;



this.pushCommander(this);


if(appController&&appController.assistant){
this.pushCommander(appController.assistant);
}



this._boundKeyHandler=this._keyHandler.bindAsEventListener(this);
this.document.addEventListener('keyup',this._boundKeyHandler,false);
this._boundKeyDownHandler=this._keyDownHandler.bindAsEventListener(this);
this.document.addEventListener('keydown',this._boundKeyDownHandler,false);
this._boundKeyPressHandler=this._keyPressHandler.bindAsEventListener(this);
this.document.addEventListener('keypress',this._boundKeyPressHandler,false);


this._cleanup=this._cleanup.bindAsEventListener(this);
this.window.addEventListener('unload',this._cleanup,false);



this.updateActive(true);

focusWrapper=function(){
Mojo.Log.warn("Calling window.focus() is deprecated. Use the stage controller activate() method.");
that.activate();
};

this.window.focus=focusWrapper;
if(this.window._mojoLightweightWindow){
Mojo.Locale.loadLocaleSpecificStylesheets(this.document);
}
},


_cleanup:function(){
var stageName;
var appAssistantCleanup=Mojo.Controller.appController.getAssistantCleanup();
this.window.removeEventListener('unload',this._cleanup,false);



this._sceneStack.deactivate();
this._sceneStack.popScenesTo();


this._cancelDeferredSceneOps();

try{

if(this.assistant&&this.assistant.cleanup){
this.assistant.cleanup();
}
}catch(e){
Mojo.Log.error("WARNING: Error cleaning up stage assitant.");
}

stageName=this.window.name;
Mojo.Gesture.cleanup(this.document);
Mojo.Animation.cleanup(this.window);
Mojo.Controller.appController._stageMgr.removeStageRef(stageName,this.window);

try{
if(!this.isChildWindow()){
Mojo.Controller.appController.closeAllStages();
if(appAssistantCleanup){
appAssistantCleanup();
}
}
}catch(e2){
Mojo.Log.error("WARNING: Error cleaning up app assistant.");
}

this.document.removeEventListener('keyup',this._boundKeyHandler,false);
this.document.removeEventListener('keydown',this._boundKeyDownHandler,false);
this.document.removeEventListener('keypress',this._boundKeyPressHandler,false);

this.indicateNewContent(false);

},


updateActive:function(isActive){
var stageEventTarget;

this.active=isActive;
this.focused=isActive;



stageEventTarget=this.topScene();
stageEventTarget=stageEventTarget&&stageEventTarget.sceneElement;
stageEventTarget=stageEventTarget||this.document;

if(this.active){
this.indicateNewContent(false);
Mojo.Event.send(this.document,Mojo.Event.activate,undefined,false);
Mojo.Event.send(stageEventTarget,Mojo.Event.stageActivate);
}else{
Mojo.Event.send(this.document,Mojo.Event.deactivate,undefined,false);
Mojo.Event.send(stageEventTarget,Mojo.Event.stageDeactivate);
}

},


getAppController:function(){
return this._appController;
},


isActiveAndHasScenes:function(){
if(!this.active){
return false;
}
return!!this.topScene();
},


isFocusedAndHasScenes:function(){
return this.isActiveAndHasScenes();
},


activate:function(){
this.window.PalmSystem.activate();
},


deactivate:function(){
this.window.PalmSystem.deactivate();
},



setProxy:function(stageProxy){
Mojo.assert(this._stageProxy===undefined,"Must not set the stage proxy more than once");
this._stageProxy=stageProxy;
},


deleteProxy:function(){
if(this._stageProxy){
delete this._stageProxy;
delete Mojo.Controller.appController._stageProxies[this.window.name];
}
},


hasPendingSceneOperations:function(){
var deferredSceneOps=this._deferredSceneOps;
return deferredSceneOps&&deferredSceneOps.length>0;
},


setSceneVisibility:function(sceneController,visible){
var targetElement;

if(sceneController.sceneScroller){
targetElement=sceneController.sceneScroller;
}else{
targetElement=sceneController.sceneElement;
}

if(visible){
if(!targetElement.visible()){
targetElement.show();
}
sceneController.showWidgetContainer(targetElement);
}

if(!visible&&targetElement.visible()){
sceneController.hideWidgetContainer(targetElement);
targetElement.hide();
}

},


delegateToSceneAssistant:function(functionName){
var scene=this.topScene();
if(scene&&scene.assistant){
var f=scene.assistant[functionName];
if(f){
var myArguments=$A(arguments);
myArguments.shift();
f.apply(scene.assistant,myArguments);
}
}
},



setupStageAssistant:function(){





this.window.Mojo.screenOrientationChanged=this.screenOrientationChanged.bind(this);
this.window.Mojo.sceneTransitionCompleted=Mojo.doNothing;


this.window.Mojo.stageActivated=this.updateActive.bind(this,true);
this.window.Mojo.stageDeactivated=this.updateActive.bind(this,false);

this.body=this.document.body;

var defaultStageAssistantName;
if(!this.isChildWindow()){
defaultStageAssistantName="StageAssistant";
}
var assistantName=this.paramsFromURI.assistantName||defaultStageAssistantName;

var ConstructorFunction=Mojo.findConstructorFunction(assistantName);
if(ConstructorFunction){
this.assistant=new ConstructorFunction(this);
this.assistant.controller=this;

if(this.assistant.setup){
this.assistant.setup();
}
else if(this.assistant.startup){

Mojo.Log.error("WARNING: StageAssistant.startup() has been deprecated, please implement 'setup()' instead.");
this.assistant.startup();
}

this.pushCommander(this.assistant);

}




if(!this.hasPendingSceneOperations()&&!this.isChildWindow()&&!this.assistant){
this.pushScene(this.kDefaultSceneName);
}


var queryParams=this.document.URL.toQueryParams();
var sceneName=queryParams.scene;
if(sceneName){
this.pushScene(sceneName);
}

},


isChildWindow:function(){
return Mojo.Controller.isChildWindow(this.window);
},



hasNewContent:function(){
return!!this._throbId;
},


setWindowProperties:function(props){


this.window.PalmSystem.setWindowProperties(props);
},


_triggerStageReady:function(){
if(this._stagePreparing){
if(this.window.PalmSystem&&this.window.PalmSystem.stageReady){
this.window.PalmSystem.stageReady();
}
delete this._stagePreparing;
}
},


indicateNewContent:function(hasNew){
if(this.window.PalmSystem&&this.window.PalmSystem.addNewContentIndicator){
if(hasNew){
if(this._throbId){
this.window.PalmSystem.removeNewContentIndicator(this._throbId);
Mojo.Log.warn("indicated new content, but potentially already active.");
}
this._throbId=this.window.PalmSystem.addNewContentIndicator();

}else{
if(this._throbId){
this.window.PalmSystem.removeNewContentIndicator(this._throbId);
delete this._throbId;
}else{
Mojo.Log.warn("indicated new content, but not active.");
}
}
}else{
Mojo.Log.warn("called throbber method, but no PalmSystem support.");
}
},



sendEventToCommanders:function(event){
var scene=this.activeScene();

if(!event._mojoPropagationStopped){

if(scene){
if(event.type===Mojo.Event.back){
scene.commitChanges();
}

scene.getCommanderStack().sendEventToCommanders(event);
}

if(!event._mojoPropagationStopped){
this._commanderStack.sendEventToCommanders(event);
}


}
},


sendNotificationDataToCommanders:function(notificationData){
var scene=this.activeScene();

if(scene&&notificationData){
notificationData=scene.getCommanderStack().sendNotificationDataToCommanders(notificationData);
}

if(notificationData){
notificationData=this._commanderStack.sendNotificationDataToCommanders(notificationData);
}

return notificationData;
},


pushCommander:function(cmdr){
this._commanderStack.pushCommander(cmdr);
},


removeCommander:function(cmdr){
this._commanderStack.removeCommander(cmdr);
},


getCommanderStack:function(){
return this._commanderStack;
},


topScene:function(){
return this._sceneStack.currentScene();
},


activeScene:function(){
var curScene=this.topScene();
if(curScene&&curScene.isActive()){
return curScene;
}
},


parentSceneAssistant:function(targetSceneAssistant){
return this._sceneStack.parentSceneAssistant(targetSceneAssistant);
},


setWindowOrientation:function(orientation){
if(this.window.PalmSystem&&this.window.PalmSystem.windowOrientation){
this.window.PalmSystem.windowOrientation=orientation;
}
},


getWindowOrientation:function(){
if(this.window.PalmSystem&&this.window.PalmSystem.windowOrientation){
return this.window.PalmSystem.windowOrientation;
}
return'up';
},


loadStylesheet:function(path){
Mojo.loadStylesheet(this.window.document,path);
Mojo.Locale._loadLocalizedStylesheet(this.window.document,path);
},


unloadStylesheet:function(path){
var i;
var theDocument=this.window.document;
var links=theDocument.querySelectorAll('link[type="text/css"][href$="'+path+'"]');
var head=Element.select(theDocument,'head')[0];
if(!head){
Mojo.Log.warn("No <head> element!");
return;
}

for(i=0;i<links.length;++i){
links[i].disabled=true;
head.removeChild(links[i]);
}
},


getScenes:function(){
return this._sceneStack.getScenes();
},


useSceneTransitions:function(enabled){
this._useSceneTransitions=enabled;
},


pushScene:function(sceneArguments){
Mojo.Timing.resetSceneTiming(this.window);
Mojo.Timing.resume('scene#total');
var myArguments;

myArguments=$A(arguments);
myArguments.shift();
this._deferSceneOperation(this._syncPushOperation.bind(this,'pushScene',sceneArguments,myArguments),false,sceneArguments);
},


swapScene:function(sceneArguments){
Mojo.Timing.resetSceneTiming(this.window);
Mojo.Timing.resume('scene#total');
var myArguments;

myArguments=$A(arguments);
myArguments.shift();
this._deferSceneOperation(this._syncPushOperation.bind(this,'swapScene',sceneArguments,myArguments),false,sceneArguments);
},






_syncPushOperation:function(opName,sceneArguments,myArguments,deferredOp){
var scene=this._prepareNewScene(sceneArguments,myArguments);
if(scene){
this._sceneStack[opName](scene);


deferredOp.transition=deferredOp.transition||scene.defaultTransition;
}
return;
},



popScene:function(returnValue,options){
Mojo.Timing.resetSceneTiming(this.window);
Mojo.Timing.resume('scene#total');
this._deferSceneOperation(this._sceneStack.popScene.bind(this._sceneStack,returnValue),true,options);
},


popScenesTo:function(targetScene,returnValue,options){
Mojo.Timing.resetSceneTiming(this.window);
Mojo.Timing.resume('scene#total');
var op=this._sceneStack.popScenesTo.bind(this._sceneStack,targetScene,returnValue);
this._deferSceneOperation(op,true,options);
},



_deferSceneOperation:function(op,isPop,options){
var sceneToLoad,curScene,transition;


if(op){

transition=options&&options.transition;


if(isPop===false){
sceneToLoad=options&&(options.name||options);
if(sceneToLoad){
this._deferredLoadingScenes.push(sceneToLoad);
}


if(options&&options.appId&&transition){
Mojo.Log.warn("You cannot specify a transition when pushing a cross-app scene ",options.name,", forcing to 'crossApp'.");
options.transition=Mojo.Transition.crossApp;
}
}


this._deferredSceneOps.push({op:op,isPop:isPop,transition:transition});
}

if(this.hasPendingSceneOperations()){






curScene=this._sceneStack.currentScene();
if(!this._sceneTransitionInProgress&&curScene&&this._useSceneTransitions&&!this._currentTransition&&
transition!==Mojo.Transition.none){
this._currentTransition=new Mojo.Controller.Transition(this.window,isPop);
}

}


if(this._deferredSceneOpID===undefined&&this.hasPendingSceneOperations()){
this._sceneTransitionInProgress=true;
this._deferredSceneOpID=this._deferredSceneOpLoader.defer();
}

},



_deferredSceneOpLoader:function(){
var i;
var scenes=[];

scenes=this._deferredLoadingScenes;


this._aboutToExecSceneOps=this._deferredSceneOps;
this._deferredSceneOps=[];



if(!this._aboutToExecSceneOps||this._aboutToExecSceneOps.length===0){
return;
}



if(scenes.length>0){
this._deferredLoadingScenes=[];
Mojo.loadScriptsForScenes(scenes,this._deferredSceneOpExecutor);
}else{
this._deferredSceneOpExecutor();
}

},


_deferredSceneOpExecutor:function(){
var sceneOps,curScene,synchronizer,continueTransition,timeSinceHighlight;
var syncCallback,amountToDelayToShowHightlight=0;
var timeBeforeSetup,scenePrepTimeout;
var op,lastOp,transitionName,poppedScene;
var defaultTransition;


sceneOps=this._aboutToExecSceneOps;
delete this._aboutToExecSceneOps;



if(!sceneOps||sceneOps.length<1){
return;
}



timeBeforeSetup=Date.now();


this._sceneStack.deactivate();


lastOp=sceneOps.last();





if(this._sceneStack.length>0){
defaultTransition=Mojo.Transition.defaultTransition;
}else{
defaultTransition=Mojo.Transition.none;
}





while(sceneOps.length>0){



poppedScene=this._sceneStack.currentScene();



op=sceneOps.shift();
op.op(op);
}



transitionName=lastOp.transition||(lastOp.isPop&&poppedScene&&poppedScene.defaultTransition)||defaultTransition;




curScene=this._sceneStack.currentScene();











if(curScene){

Mojo.Log.info("About to activate scene ",curScene.sceneName);
this._sceneStack.aboutToActivate(curScene);

if(this._currentTransition){
this._currentTransition.setTransitionType(transitionName,lastOp.isPop);
syncCallback=this._currentTransition.run.bind(this._currentTransition,this._endTransition);
}else{
syncCallback=this._endTransition;
}




scenePrepTimeout=0.5;
synchronizer=new Mojo.Function.Synchronize({
syncCallback:syncCallback,
timeout:scenePrepTimeout});








continueTransition=synchronizer.wrap(Mojo.doNothing);



this.setSceneVisibility(curScene,true);
curScene.aboutToActivate(synchronizer);



if(Mojo.Gesture.highlightTarget){
timeSinceHighlight=Date.now()-Mojo.Gesture.highlightTargetTime;
amountToDelayToShowHightlight=100-timeSinceHighlight;
}

if(amountToDelayToShowHightlight>0){
continueTransition.delay(amountToDelayToShowHightlight/1000);
}else{
continueTransition();
}
}
else{
if(this._currentTransition){
this._currentTransition.cleanup();
}
this._endTransition();
}

},


_cancelDeferredSceneOps:function(){



if(this._deferredSceneOpID!==undefined){
this.window.clearTimeout(this._deferredSceneOpID);
delete this._deferredSceneOpID;
}


if(this._currentTransition){
this._currentTransition.cleanup();
delete this._currentTransition;
}


if(this._deferredLoadingScenes&&this._deferredLoadingScenes.length>0){
this._deferredLoadingScenes.clear();
}


if(this.hasPendingSceneOperations()){
this._deferredSceneOps.clear();
}


if(this._aboutToExecSceneOps){
delete this._aboutToExecSceneOps;
}

this._sceneTransitionInProgress=false;

},


_endTransition:function(){

delete this._deferredSceneOpID;
delete this._currentTransition;
this._sceneTransitionInProgress=false;

this._sceneStack.activate();

this._triggerStageReady();



if(this._stageProxy){
this._stageProxy.applyToAssistant(this.activeScene().assistant);
this.deleteProxy();
}


this._deferSceneOperation();
Mojo.Log.info("Transition ended.");
},



_sceneIdFromName:function(sceneName){
return'mojo-scene-'+sceneName;
},


_prepareNewScene:function(sceneArguments,myArguments){
var sceneId,scrollerId,scrollerContent,scroller;
var setup,index,sceneName,sceneTemplateName;
var content,nodeList,contentDiv;
var sceneElement,sceneController;

if(Object.isString(sceneArguments)){
sceneId=sceneArguments;
if(this.get(sceneId)){
index=1;
while(this.get(sceneId)){
sceneId=sceneArguments+'-'+index;
index+=1;
}
}
sceneArguments={name:sceneArguments,id:this._sceneIdFromName(sceneId)};
}else if(sceneArguments.appId){
setup=Mojo.Controller.setupCrossAppPush(sceneArguments,myArguments);
sceneArguments=setup.sceneArguments;
myArguments=setup.additionalArguments;
}

sceneName=sceneArguments.name;

sceneTemplateName=sceneArguments.sceneTemplate||sceneName+"/"+sceneName+"-scene";


sceneId=sceneArguments.id||this._sceneIdFromName(sceneArguments.name);
content=Mojo.View.render({template:sceneTemplateName,object:this});
content=content.strip();
nodeList=Mojo.View.convertToNodeList(content,this.document);
contentDiv=Mojo.View.wrapMultipleNodes(nodeList,this.document,!this._hasPalmSceneClass(nodeList));
contentDiv.id=sceneId;
if(sceneArguments.disableSceneScroller){
this.body.insert({top:contentDiv});
}else{
scrollerId=sceneId+"-scene-scroller";
scrollerContent="<div id='"+scrollerId+"' x-mojo-element='Scroller'></div>";
this.body.insert({top:scrollerContent});
scroller=this.get(scrollerId);
scroller.appendChild(contentDiv);
}

sceneElement=this.get(sceneId);
Mojo.requireFunction(sceneElement.hide,"scene element must be extended by prototype");


sceneElement.addClassName(this.kSceneClassName);
sceneElement.addClassName(sceneName+'-scene');

try{
sceneController=new Mojo.Controller.SceneController(this,sceneElement,sceneArguments,myArguments);
sceneController.window=this.window;
}catch(e){
Mojo.Log.error("The scene '"+sceneArguments.name+"' could not be pushed because an exception occurred.");
Mojo.Log.error("Error: %s, line %s, file %s",e.message,e.line,e.sourceURL);
this.get(sceneId).remove();
sceneController=undefined;
}

return sceneController;
},


_hasPalmSceneClass:function(nodeList){
var i,length,node;
length=nodeList.length;
for(i=0;i<length;i++){
node=nodeList[i];
if(node.nodeType===node.ELEMENT_NODE){
return node.hasClassName(this.kSceneClassName);
}
}
},



setClipboard:function(text,escapeHTML){
var scene=this.topScene();
var tempTextarea;

if(scene){
tempTextarea=this.document.createElement('textarea');
tempTextarea.value=text;

scene.sceneElement.appendChild(tempTextarea);
tempTextarea.select();
this.document.execCommand('cut');
tempTextarea.remove();
}
},

paste:function(){
if(PalmSystem&&PalmSystem.paste){
PalmSystem.paste();
}
},

setAlertSound:function(soundClass,soundFile){
if(this.window.PalmSystem&&this.window.PalmSystem.setAlertSound){
this.window.PalmSystem.setAlertSound(soundClass,soundFile);
}
},


_keyHandler:function(event){
var scene=this.topScene();
var tempTextArea,msg,scriptNode;
var webView;

if(Mojo.Controller.isGoBackKey(event)){
var newEv=Mojo.Event.make(Mojo.Event.back,{originalEvent:event});
this.sendEventToCommanders(newEv);
if(newEv.defaultPrevented){
Event.stop(event);
}
}else if(event.altKey&&event.keyCode===Mojo.Char.f&&Mojo.Config.debuggingEnabled){
this.toggleFpsBox();
Event.stop(event);
}else if(Mojo.Host.current===Mojo.Host.browser&&event.altKey&&event.keyCode===Mojo.Char.m){
this.sendEventToCommanders(Mojo.Event.make(Mojo.Event.command,{command:Mojo.Menu.showAppCmd}));
}else if(this.enableAltCharPicker&&event.keyCode===Mojo.Char.sym){
if(this.doesTargetAcceptKeys(event.target)){
this._sendCharpickerEvent(Mojo.Event.renderAltCharacters,event.target,null);
}else{
webView=this._getWebview(event.target);
if(webView){
webView.mojo.isEditing(this._sendCharpickerEventCallback.bind(this,Mojo.Event.renderAltCharacters,webView,null));
}
}
}else if(event.keyCode===Mojo.Char.o&&event.ctrlKey&&event.shiftKey&&Mojo.Config.debuggingEnabled){


this.openStageInspector();
}else if(event.keyCode===Mojo.Char.v&&event.ctrlKey&&event.shiftKey&&Mojo.Config.debuggingEnabled){

scene=this.activeScene();
if(scene){
msg='Using submission '+Mojo.Version.use+", version 1 = #"+Mojo.Versions["1"]+", ";

scriptNode=Mojo.findScriptTag();
if(scriptNode&&scriptNode.hasAttribute('x-mojo-version')){
msg+='x-mojo-version='+scriptNode.getAttribute('x-mojo-version')+".";
}
if(scriptNode&&scriptNode.hasAttribute('x-mojo-submission')){
msg+='x-mojo-submission='+scriptNode.getAttribute('x-mojo-submission')+".";
}

scene.showAlertDialog({
onChoose:Mojo.doNothing,
title:'Framework Info',
message:msg,
choices:[{label:"OK",value:1}]
});
}
}else if(event.keyCode===Mojo.Char.l&&event.ctrlKey&&event.shiftKey&&Mojo.Config.debuggingEnabled){



if(scene){
tempTextArea=this.document.createElement('textarea');
console.log("HTML for scene '"+scene.sceneName+"':\n"+scene.sceneElement.innerHTML);
tempTextArea.value=scene.sceneElement.innerHTML;
scene.sceneElement.appendChild(tempTextArea);
tempTextArea.select();
this.document.execCommand('cut');
tempTextArea.remove();
}

}else{



scene=this.activeScene();
if(event.metaKey&&scene&&scene.handleShortcut(String.fromCharCode(event.which),event)){
Event.stop(event);
}
}

this._forwardEventToTopContainer(Mojo.Event.keyup,event);
},



_keyDownHandler:function(event){
var webView;

if(this.enableAltCharPicker&&event.keyCode!==Mojo.Char.sym&&event.ctrlKey){
if(this.doesTargetAcceptKeys(event.target)){
this._sendCharpickerEvent(Mojo.Event.renderChordedAltCharacters,event.target,event.keyCode);
}else{
webView=this._getWebview(event.target);
if(webView){
webView.mojo.isEditing(this._sendCharpickerEventCallback.bind(this,Mojo.Event.renderChordedAltCharacters,webView,event.keyCode));
}
}
}

this._forwardEventToTopContainer(Mojo.Event.keydown,event);
},


_keyPressHandler:function(event){
if(event.metaKey){
if(Mojo.Host.current!==Mojo.Host.mojoHost){
event.stop();
}
}else{
this._forwardEventToTopContainer(Mojo.Event.keypress,event);
}
},



_getWebview:function(target){
if(target.type===this.kBrowserObject){

return Mojo.View.getParentWithAttribute(target,'x-mojo-element','WebView');
}
return null;
},


_sendCharpickerEventCallback:function(type,target,character,isEditing){
if(isEditing){
this._sendCharpickerEvent(type,target,character);
}
},


_sendCharpickerEvent:function(type,target,character){
this.sendEventToCommanders(Mojo.Event.make(type,{selectionTarget:target,character:character}));
},



_forwardEventToTopContainer:function(type,originalEvent){
var scene=this.topScene();
var container=scene&&scene.topContainer();

if(container){
Mojo.Event.send(container,type,{originalEvent:originalEvent},false,true);
}
},



doesTargetAcceptKeys:function(target){
return Mojo.View.isTextField(target);
},


handleCommand:function(event){
if(event.type==Mojo.Event.back){

var db=this.get('mojo-dialog');
if(db){
Event.stop(event);
Mojo.Controller.closeDialogBox();
}

else if(this._sceneStack.size()>1){
Event.stop(event);

if(!this._sceneTransitionInProgress){
this.popScene();
}
}
}

else if(event.type==Mojo.Event.commandEnable){




if(event.command==Mojo.Menu.prefsCmd||event.command==Mojo.Menu.helpCmd){
event.preventDefault();
event.stopPropagation();
}
}
},

toggleFpsBox:function(){
var fpsBox=this.get('mojo-fps-display-box');
if(fpsBox){
fpsBox.remove();
Mojo.Animation.showFPS=false;
}else{
this.document.body.insert({bottom:'<div id="mojo-fps-display-box"></div'});
Mojo.Animation.showFPS=true;
}
},

considerForNotification:function(params){
var scene=this.activeScene();
if(scene&&scene.assistant&&scene.assistant.considerForNotification){
params=scene.assistant.considerForNotification(params);
}
return params;
},

get:function(elementOrElementId){
if(!Object.isString(elementOrElementId)){
return elementOrElementId;
}
return this.document.getElementById(elementOrElementId);
},


screenOrientationChanged:function(orientation){
var f=function(sceneController){
sceneController.handleOrientationChange(orientation);
};
this._sceneStack.forEach(f);
},



openStageInspector:function(){
var that=this;
var firebugStage;
var initFirebugFunc;
var restoreConsoleFunc=function(){
window.console=window.realConsole;
};

var stageOpenedFunc=function(stageController){

firebugStage=stageController;


firebugStage.window.mojoStylesheet=Mojo.hostingPrefix+Mojo.Config.MOJO_FRAMEWORK_HOME+'/firebug-lite/firebug-lite.css';
firebugStage.window.mojoTargetDocument=that.document;
firebugStage.window.mojoTargetWindow=window;
firebugStage.window.Mojo.Event=window.Mojo.Event;


Mojo._addToScriptQueue([
{source:Mojo.hostingPrefix+Mojo.Config.MOJO_FRAMEWORK_HOME+'/javascripts/prototype.js'},
{source:Mojo.hostingPrefix+Mojo.Config.MOJO_FRAMEWORK_HOME+'/firebug-lite/pi.js'},
{source:Mojo.hostingPrefix+Mojo.Config.MOJO_FRAMEWORK_HOME+'/firebug-lite/firebug-lite.js'}
],initFirebugFunc,stageController.document);

};
window.realConsole=window.console;

initFirebugFunc=function(){



if(firebugStage.window.PalmSystem){
firebugStage.window.PalmSystem.setWindowOrientation("left");
}


firebugStage.pushScene({name:'firebug-lite',
sceneTemplate:Mojo.Config.MOJO_FRAMEWORK_HOME+'/firebug-lite/firebug-lite-scene',
automaticFocusAdvance:false,
assistantConstructor:Mojo.Controller._FirebugLiteAssistant});

firebugStage.window.addEventListener('unload',restoreConsoleFunc,false);


firebugStage.window.firebug.init();
};


Mojo.Controller.appController.createStageWithCallback({name:'firebug-lite',lightweight:true},stageOpenedFunc);
}


});


Mojo.Controller.StageController.isReadyForDelegation=function isReadyForDelegation(w){
var readyAndStageController={ready:false};
var otherMojo,stageController,topScene,mojoController;
if(w===undefined){
return readyAndStageController;
}

otherMojo=w.Mojo;
if(otherMojo===undefined){
return readyAndStageController;
}

mojoController=otherMojo.Controller;
if(mojoController===undefined){
return readyAndStageController;
}

stageController=mojoController.stageController;
if(stageController===undefined){
return readyAndStageController;
}

readyAndStageController.stageController=stageController;
topScene=stageController.topScene();
if(topScene===undefined){


readyAndStageController.ready=!stageController.hasPendingSceneOperations();
}else{
readyAndStageController.ready=true;
}
return readyAndStageController;
};


Mojo.Controller._FirebugLiteAssistant=function(){};
Mojo.Controller._FirebugLiteAssistant.prototype.kFirebugWidth='800px';
Mojo.Controller._FirebugLiteAssistant.prototype.kFirebugHeight='600px';


Mojo.Controller._FirebugLiteAssistant.prototype.setup=function(){
var container=this.controller.get('fblite-container');
var fbElementIDs=['Firebug','FirebugBorderInspector','FirebugBGInspector'];
var that=this;
var firebug=this.controller.get('Firebug');


fbElementIDs.each(function(elem){
elem=that.controller.get(elem);
elem.parentNode.removeChild(elem);
container.appendChild(elem);
});

this.controller.sceneElement.style.width=this.kFirebugWidth;
container.style.width=this.kFirebugWidth;
container.style.height=this.kFirebugHeight;
firebug.style.width=this.kFirebugWidth;
firebug.style.height=this.kFirebugHeight;

this.controller.sceneScroller.mojo.setMode('free');

};


Mojo.SceneStack=Class.create(


{


initialize:function(){
this._sceneStack=[];
this._pendingHides=[];
},


getScenes:function(){
return this._sceneStack.slice(0);
},


deactivate:function(){
var currentScene=this._sceneStack.last();
if(currentScene&&currentScene.isActive()){
currentScene.deactivate();
currentScene.stageController.setSceneVisibility(currentScene,false);
}
},


activate:function(){
var currentScene=this._sceneStack.last();
var returnVal=this._returnValue;

delete this._returnValue;

if(currentScene&&!currentScene.isActive()){

currentScene.activate(returnVal);
}
},


aboutToActivate:function(activatingScene){
var i,scene;

for(i=0;i<this._pendingHides.length;i++){
scene=this._pendingHides[i];
if(scene!==activatingScene){
scene.stageController.setSceneVisibility(scene,false);
}
}
this._pendingHides.clear();
},


popScene:function(returnValue){
this._returnValue=returnValue;
this._removeTopScene();
},


pushScene:function(sceneController){
this._addScene(sceneController);
},


swapScene:function(sceneController){
this._removeTopScene();
this._addScene(sceneController);
},


popScenesTo:function(scene,returnValue){
var curScene=this._sceneStack.last();

this._returnValue=returnValue;

while(curScene&&curScene!==scene&&curScene.sceneName!==scene&&curScene.sceneId!==scene){


this._removeTopScene();


curScene=this._sceneStack.last();
}
},

currentScene:function(){
return this._sceneStack.last();
},


parentSceneAssistant:function(targetScene){
var targetSceneController=targetScene.controller;
var targetSceneIndex=this._sceneStack.indexOf(targetSceneController);
if(targetSceneIndex<=0){
return undefined;
}
var sceneController=this._sceneStack[targetSceneIndex-1];
return sceneController&&sceneController.assistant;
},

size:function(scene){
return this._sceneStack.size();
},


_removeTopScene:function(){
var currentScene=this._sceneStack.last();
if(currentScene){
currentScene.cleanup();
}
this._sceneStack.pop();
},


_addScene:function(sceneController){
sceneController.setup();
this._sceneStack.push(sceneController);
this._pendingHides.push(sceneController);
},


forEach:function(f){
this._sceneStack.each(f);
}

});




Mojo.Controller.StageProxy=function(stageName){
this._delegatedCalls=[];
};


Mojo.Controller.StageProxy.prototype.delegateToSceneAssistant=function(){

this._delegatedCalls.push($A(arguments));

};


Mojo.Controller.StageProxy.prototype.applyToAssistant=function(assistant){

this._delegatedCalls.each(function(savedArgs){
var methodName=savedArgs.shift();
assistant[methodName].apply(assistant,savedArgs);
});
this._delegatedCalls.push($A(arguments));
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Model.Cookie=function Cookie(cookieName,optionalDocument){
Mojo.requireString(cookieName);
this.document=optionalDocument||document;
this.name=cookieName;
this.prefixedName=this.MOJO_COOKIE_PREFIX+this.name;
};

Mojo.Model.Cookie.prototype.MOJO_COOKIE_PREFIX="mojo_cookie_";


Mojo.Model.Cookie.prototype.get=function get(){
var prefixedName=this.prefixedName;
var result;
var cookie=this.document.cookie;
if(cookie){
var cookies=cookie.split(/; */);
var matchingCookie=cookies.find(function(oneCookie){
var matches=oneCookie.startsWith(prefixedName);
return matches;
});
if(matchingCookie){
var cookieParts=matchingCookie.split("=");
Mojo.assert(cookieParts.length===2,"cookies should have two values separated by an equals sign.");
var matchingCookieValue=cookieParts.last();
var jsonString=decodeURIComponent(matchingCookieValue);
if(jsonString.length>0){
result=Mojo.parseJSON(decodeURIComponent(matchingCookieValue));
}
}
}
return result;
};


Mojo.Model.Cookie.prototype.put=function put(objectToStore,expirationDate){
var objectData=encodeURIComponent(Object.toJSON(objectToStore));
var terms=[];
terms.push(objectData);
if(expirationDate!==undefined){
terms.push('expires='+expirationDate.toGMTString());
}
var cookieText=terms.join("; ");
var cookieTotal=this.prefixedName+'='+cookieText;
this.document.cookie=cookieTotal;
};


Mojo.Model.Cookie.prototype.remove=function remove(){
this.put("",new Date());
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Animation={};

Mojo.Animation.kAnimationDuration=0.15;
Mojo.Animation.kAppMenuAnimationDuration=0.12;
Mojo.Animation.kScrimAnimationDuration=Mojo.Animation.kAppMenuAnimationDuration*0.8;

Mojo.Animation.targetFPS=40;
Mojo.Animation.stepRate=(1/Mojo.Animation.targetFPS)*1000;
Mojo.Animation.showFPS=false;
Mojo.Animation.showFPSUpdate=1000;
Mojo.Animation.maxExtraFrames=1;

Mojo.Animation.NullQueue={add:Mojo.doNothing,remove:Mojo.doNothing};



Mojo.Animation.easeInOut='ease-in-out';


Mojo.Animation.easeIn='ease-in';


Mojo.Animation.easeOut='ease-out';



Mojo.Animation.setup=function(targetWindow){
targetWindow._mojoAnimationQueue=new Mojo.Animation.Queue(targetWindow);
if(targetWindow.Mojo&&targetWindow.Mojo.Animation){
targetWindow.Mojo.Animation.queue=targetWindow._mojoAnimationQueue;
}
};


Mojo.Animation.cleanup=function(targetWindow){
if(targetWindow._mojoAnimationQueue){
targetWindow._mojoAnimationQueue.cleanup();
}
};


Mojo.Animation.queueForElement=function(element){
var q=Mojo.Animation.NullQueue;
var oDoc=element.ownerDocument;
if(oDoc){
var w=oDoc.defaultView;
if(w){
q=w._mojoAnimationQueue;
}
}
return q;
};



Mojo.Animation.Queue=Class.create(


{

initialize:function(targetWindow){
var timeNow;
this.window=targetWindow||window;
this.animations=[];
this.frameTimeStamps=[];
this.stepRate=Mojo.Animation.stepRate;
this.nextFPSUpdate=new Date().getTime()+Mojo.Animation.showFPSUpdate;


timeNow=Date.now();
if(!Object.isNumber(timeNow)){
Mojo.Log.error("Date.now() isn't returning a number, please remove the JavaScript library date.js.");
this._millisecondsNow=this._slowMillisecondsNow;
}
},


cleanup:function(){
if(this.timer){
this.window.clearInterval(this.timer);
delete this.timer;
}
delete this.animations;
delete this.window._mojoAnimationQueue;
delete this.window;
},


add:function(animation){
var index=this.animations.indexOf(animation);
if(index===-1){
this.animations.push(animation);
if(this.animations.length==1){
this.timer=this.window.setInterval(this.step.bind(this),Mojo.Animation.stepRate);
this.frameTimeStamps=[];
this.renderTime=this._millisecondsNow()+Mojo.Animation.stepRate;


}
}
},


remove:function(animation){
var index=this.animations.indexOf(animation);
if(index!==-1){
this.animations.splice(index,1);
if(this.animations.length===0){
this.window.clearInterval(this.timer);
delete this.timer;
if(Mojo.Animation.showFPS){
this.reportFPS();
}



}
}
},


step:function(){
var animations,tardy,i,count;
var framesToRun;


framesToRun=Math.max(0,this._millisecondsNow()-this.renderTime);
framesToRun/=Mojo.Animation.stepRate;
framesToRun=Math.floor(framesToRun+1);
framesToRun=Math.min(framesToRun,Mojo.Animation.maxExtraFrames);




animations=this.animations;
while(framesToRun>0){

if(Mojo.Animation.showFPS){
this.frameTimeStamps.push(this._millisecondsNow());
if(this.frameTimeStamps.length>10){
this.frameTimeStamps.shift();
}
}



for(i=animations.length-1;i>=0;i--){
this._invokeAnimator(animations[i],(framesToRun>1));
}

framesToRun--;
this.renderTime+=Mojo.Animation.stepRate;
}





if(Mojo.Animation.showFPS){
var now=this._millisecondsNow();
if(this.frameTimeStamps.length>1&&now>this.nextFPSUpdate){
this.window.document.getElementById('mojo-fps-display-box').innerHTML=this.reportFPS();
this.nextFPSUpdate=this._millisecondsNow()+Mojo.Animation.showFPSUpdate;
}
}
},


_invokeAnimator:function(a,catchingUp){
var failed;

try{
a.animate(this,catchingUp);
}catch(e){
failed=true;
this.remove(a);
Mojo.Log.logException(e,"exception during animation");
}




if(failed&&a.handleError&&Object.isFunction(a.handleError)){
try{
a.handleError();
}catch(e2){
Mojo.Log.logException(e,"exception during animator error handler");
}
}
},


_millisecondsNow:function(){
return Date.now();
},


_slowMillisecondsNow:function(){
return new Date().getTime();
},


reportFPS:function(){
var delta,averageTime,fps;
var totalTime=0;
var frameTimeStamps=this.frameTimeStamps;
for(var i=1;i<frameTimeStamps.length;i++){
delta=frameTimeStamps[i]-frameTimeStamps[i-1];
totalTime+=delta;
}
averageTime=totalTime/(frameTimeStamps.length-1);
fps=Math.round(1000/averageTime);
return fps;
}
});



Mojo.Animation.animateValue=function(q,animationType,callback,details){
return new this.ValueAnimator(q,animationType,callback,details);
};



Mojo.Animation.animateStyle=function(element,attr,animationType,details){
return new this.StyleAnimator(element,attr,animationType,details);
};



Mojo.Animation.animateClip=function(element,side,animationType,details){
return new this.ClipStyleAnimator(element,side,animationType,details);
};









Mojo.Animation.StyleAnimator=function(element,attr,animationType,details){
var animator;
var currentValue;


details=details||{};
this.details=details;
this.element=element;
this.attr=attr;


if(!element._mojoStyleAnimators){
element._mojoStyleAnimators={};
}


animator=element._mojoStyleAnimators[attr];
if(animator){
animator.cancel();
}


element._mojoStyleAnimators[attr]=this;



if(details.currentValue!==undefined){
currentValue=details.currentValue;
}else{
currentValue=parseInt(Element.getStyle(element,attr)||'0',10);
}


details=Mojo.Model.decorate(details,{onComplete:this.completeWrapper.bind(this),currentValue:currentValue});




if(currentValue<Math.min(details.from,details.to)||
currentValue>Math.max(details.from,details.to)){
details.from=currentValue;

}


this.animateCallback=details.styleSetter||this.animateCallback.bind(this);
var q=Mojo.Animation.queueForElement(element);

this.animator=Mojo.Animation.animateValue(q,animationType,this.animateCallback,details);
};


Mojo.Animation.StyleAnimator.prototype.animateCallback=function(value){
this.element.style[this.attr]=Math.round(value)+'px';
};


Mojo.Animation.StyleAnimator.prototype.completeWrapper=function(cancelled){
this.element._mojoStyleAnimators[this.attr]=undefined;
if(this.details.onComplete){
this.details.onComplete(this.element,cancelled);
}
};


Mojo.Animation.StyleAnimator.prototype.cancel=function(){
this.animator.cancel();
};



Mojo.Animation.StyleAnimator.prototype.complete=function(){
this.animator.complete();
};







Mojo.Animation.ClipStyleAnimator=function(element,side,animateType,details){
var currentValue;

Mojo.assert(details&&details.clip,"WARNING: ClipStyleAnimator: details must be defined and contain a 'clip' property.");

this.details=details;
this.element=element;
this.side=side;

currentValue=this.details.clip[side]||0;
details=Mojo.Model.decorate(details,{currentValue:currentValue,styleSetter:this.clipStyleSetter.bind(this)});

this.animator=Mojo.Animation.animateStyle(element,'clip',animateType,details);

};


Mojo.Animation.ClipStyleAnimator.prototype.clipStyleSetter=function(value){
this.details.clip[this.side]=Math.round(value);
this.element.style.clip='rect('+this.details.clip.top+'px, '+this.details.clip.left+'px, '+this.details.clip.bottom+'px, '+this.details.clip.right+'px)';
};


Mojo.Animation.ClipStyleAnimator.prototype.cancel=function(){
this.animator.cancel();
};


Mojo.Animation.ClipStyleAnimator.prototype.complete=function(){
this.animator.complete();
};






Mojo.Animation.ValueAnimator=function(queue,animationType,callback,details){
var delta=details.to-details.from;
var newCurPos,detailsHadCurrentValue=false;


this.queue=queue;
this.details=details;
this.callback=callback;

Mojo.assert(typeof callback=='function',"WARNING: ValueAnimator callback must be a function.");

details.from=(details.from===undefined?details.currentValue:details.from);
if(details.currentValue===undefined){
if(details.reverse){
details.currentValue=details.to;
}else{
details.currentValue=details.from;
}
}else{
detailsHadCurrentValue=true;

if(details.currentValue<Math.min(details.from,details.to)||
details.currentValue>Math.max(details.from,details.to)){
if(details.reverse){
details.currentValue=details.to;
}else{
details.currentValue=details.from;
}
}
}


Mojo.assert(this.details.from!==undefined,"WARNING: A starting point and/or currentValue must be specified");


if(delta===0){
this.complete();
return;
}



animationType=animationType[0].toUpperCase()+animationType.substring(1);

if(Mojo.Animation.Generator[animationType]){
this.valueGenerator=new Mojo.Animation.Generator[animationType](details);
}else{
this.valueGenerator=new Mojo.Animation.Generator.Linear(details);
}





this.percentDone=(details.currentValue-details.from)/delta;

if(this.valueGenerator.getTimeFromPosition){
this.percentDone=this.valueGenerator.getTimeFromPosition(this.percentDone);
}


if(detailsHadCurrentValue){
if(details.reverse){
details.duration*=this.percentDone;
}else{
details.duration*=1-this.percentDone;
}
}



if(this.valueGenerator.getNumberFrames){
this.framesRemaining=this.valueGenerator.getNumberFrames();
}else{
this.framesRemaining=Math.ceil((details.duration*Mojo.Animation.targetFPS));
}
if(details.reverse){
this.stepValue=-this.percentDone/this.framesRemaining;
}else{
this.stepValue=(1-this.percentDone)/this.framesRemaining;
}




if(this.framesRemaining<1){
this.complete();
}else{

this.animate=this.animate.bind(this);
this.queue.add(this);
}

};






Mojo.Animation.ValueAnimator.prototype.animate=function animate(queue,catchingUp){
var value;

Mojo.assert(this.framesRemaining>0,"Mojo.Animation.ValueAnimator: animate() should never be called with no frames remaining!");

if(this.framesRemaining>1){
this.percentDone+=this.stepValue;


if(!catchingUp){
value=this.valueGenerator.getPositionFromTime(this.percentDone);
if(value!==undefined){
this.currentPosition=value*(this.details.to-this.details.from)+this.details.from;
try{
this.callback(this.currentPosition);
}catch(e){
Mojo.Log.error("WARNING: ValueAnimator caught exception in value callback(): "+e);
}
}
}

this.framesRemaining--;
}else{
this.complete();
}
};



Mojo.Animation.ValueAnimator.prototype.cancel=function(){
this.complete(true);
};



Mojo.Animation.ValueAnimator.prototype.complete=function(cancelled){


if(this.completed){
return;
}


if(!cancelled){
try{
this.callback(this.details.reverse?this.details.from:this.details.to);
}catch(e){
Mojo.Log.error("WARNING: ValueAnimator caught exception in value callback(): "+e);
}
}


if(this.details.onComplete){
try{
this.details.onComplete(!!cancelled);
}catch(e2){
Mojo.Log.error("WARNING: ValueAnimator caught exception in onComplete(): "+e2);
}
}


this.queue.remove(this);

this.completed=true;
};




Mojo.Animation.Submenu={};


Mojo.Animation.Submenu.animate=function(popup,popupContent,cornersFrom,cornersTo,callback){
Mojo.Animation.animateStyle(popup,'top','bezier',{
from:cornersFrom.top,
to:cornersTo.top,
duration:Mojo.Animation.kAnimationDuration,
curve:'ease-out'
}
);
Mojo.Animation.animateStyle(popup,'left','bezier',{
from:cornersFrom.left,
to:cornersTo.left,
duration:Mojo.Animation.kAnimationDuration,
curve:'ease-out'
}
);
Mojo.Animation.animateStyle(popup,'width','bezier',{
from:cornersFrom.width,
to:cornersTo.width,
duration:Mojo.Animation.kAnimationDuration,
curve:'ease-out'
}
);
Mojo.Animation.animateStyle(popupContent,'height','bezier',{
from:cornersFrom.height,
to:cornersTo.height,
duration:Mojo.Animation.kAnimationDuration,
curve:'ease-out',
onComplete:callback
}
);
};


Mojo.Animation.Appmenu={};


Mojo.Animation.Appmenu.animate=function(popup,fromTop,toTop,callback){
Mojo.Animation.animateStyle(popup,'top','bezier',{
from:fromTop,
to:toTop,
duration:Mojo.Animation.kAppMenuAnimationDuration,
curve:'ease-out',
onComplete:callback
}
);
};




Mojo.Animation.Dialog={};


Mojo.Animation.Scrim={};


Mojo.Animation.Scrim._opacitySetter=function(element,value){
element.style.opacity=value;
};


Mojo.Animation.Dialog.animateDialogOpen=function(box,scrim,callback){
var animateDialog;
var boxHeight=box.offsetHeight;
box.style.bottom=(-boxHeight)+'px';
scrim.style.opacity=0;

Mojo.Animation.Scrim.animate(scrim,0,1,Mojo.Animation.Dialog.animateDialog.curry(box,-boxHeight,0,Mojo.Animation.easeOut,callback));
};


Mojo.Animation.Dialog.animateDialogClose=function(box,scrim,callback){
var boxHeight=box.offsetHeight;

Mojo.Animation.Dialog.animateDialog(box,0,-boxHeight,Mojo.Animation.easeIn,Mojo.Animation.Scrim.animate.curry(scrim,1,0,callback));
};


Mojo.Animation.Scrim.animate=function(scrim,fromOpacity,toOpacity,callback){
Mojo.Animation.animateStyle(scrim,'opacity','bezier',{
from:fromOpacity,
to:toOpacity,
duration:Mojo.Animation.kScrimAnimationDuration,
curve:'over-easy',
styleSetter:Mojo.Animation.Scrim._opacitySetter.bind(this,scrim),
onComplete:callback
}
);
};


Mojo.Animation.Dialog.animateDialog=function(box,fromTop,toTop,animation,callback){
Mojo.Animation.animateStyle(box,'bottom','bezier',{
from:fromTop,
to:toTop,
duration:Mojo.Animation.kAnimationDuration,
curve:animation,
onComplete:callback
}
);
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Animation.Generator={};


Mojo.Animation.Generator.Linear=Class.create({
initialize:function(details){
this.details=details;
},

getPositionFromTime:function(time){
return time;
},

getTimeFromPosition:function(value){
return value;
}


});


Mojo.Animation.Generator.Zeno=Class.create({
initialize:function(details){
var delta;

details=details||{};

this.from=details.from;
this.to=details.to;

this.coefficient=details.coefficient||0.4;
this.details=details;

this.spread=details.to-details.from;
this.goingUp=(this.spread>0);

if(this.goingUp){
this.fakeToValue=this.spread+1/this.coefficient;
}else{
this.fakeToValue=this.spread-1/this.coefficient;
}

this.overshoot=1/(this.coefficient*this.spread);
this.numFrames=Math.ceil(Math.log(this.spread)/Math.log(1/(1-this.coefficient)));
},

getPositionFromTime:function(time){
var position;

if(this.details.reverse){
time=1-time;
}

position=Math.min(1,(1-Math.pow(1-this.coefficient,(time*this.numFrames)))+this.overshoot);

return(this.details.reverse?1-position:position);
},

getTimeFromPosition:function(position){
if(this.details.reverse){
position=1-position;
}
var time=Math.log(1+this.overshoot-position)/Math.log(1-this.coefficient)/this.numFrames;
return(this.details.reverse?1-time:time);
},


getNumberFrames:function(value){
return this.numFrames;
}
});




Mojo.Animation.Generator.Bezier=Class.create({

initialize:function(details){
this.curve=details.curve;
if(!this.curve){
this.curve=this.bezierCurves["over-easy"];
}
this.details=details;

if(typeof details.curve=="string"&&this.bezierCurves[details.curve]){
this.curve=this.bezierCurves[details.curve];
this.bezierMemoizeCoefficients(this.curve.x);
this.bezierMemoizeCoefficients(this.curve.y);
}

else if(details.curve[0]!==undefined&&details.curve.length==4){
this.curve={x:[details.curve[0],details.curve[2]],y:[details.curve[1],details.curve[3]]};
this.bezierMemoizeCoefficients(this.curve.x);
this.bezierMemoizeCoefficients(this.curve.y);
}




this.epsilon=0.5/Math.abs(details.to-details.from);


},



bezierCalcPoint:function(t,curveArgs){
if(t===undefined){
return undefined;
}
return((curveArgs.a*t+curveArgs.b)*t+curveArgs.c)*t;
},




getPositionFromTime:function(t){
var realT=this.getTFromAxis(t,this.curve.x);
if(realT===undefined){
return undefined;
}
return this.bezierCalcPoint(realT,this.curve.y);
},


getTimeFromPosition:function(p){
var t=this.getTFromAxis(p,this.curve.y);
var xCoordinate=this.bezierCalcPoint(t,this.curve.x);
return xCoordinate;
},




getTFromAxis:function(p,curveArgs){
var curT=p;
var error;
var slope;
var i=0;
while(i<20){

error=p-this.bezierCalcPoint(curT,curveArgs);

if(Math.abs(error)<this.epsilon){
return curT;
}



slope=1/(3*curveArgs.a*curT*curT+2*curveArgs.b*curT+curveArgs.c);
curT+=error*slope;
i++;
}


Mojo.Log.warn("WARNING: StyleAnimator exceeded max iterations, error="+error);

return undefined;
},





bezierCurves:{
'ease':{x:[0.25,0.25],y:[0.1,1]},
'ease-in':{x:[0.42,1],y:[0,1]},
'ease-out':{x:[0,0.58],y:[0,1]},
'ease-in-out':{x:[0.42,0.58],y:[0,1]},
'over-easy':{x:[0.6,0.4],y:[0.1,0.9]},
'linear':{x:[0,1],y:[0,1]}
},








bezierMemoizeCoefficients:function(points){
var a,b,c;


if(points.a!==undefined){
return;
}

c=3*points[0];
b=3*(points[1]-points[0])-c;
a=1-c-b;

points.c=c;
points.b=b;
points.a=a;
}




});


/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */







Mojo.Depot=Class.create(

{


initialize:function(options,onSuccess,onFailure){
try{
this.sqlBuilder=new Mojo.Depot.SqlBuilder(options,onSuccess,onFailure);
}catch(e){
this.handleFailure(onFailure,e);
}
},




removeAll:function(onSuccess,onFailure){
try{
var sqlStrings=this.sqlBuilder._resetAllSql();
this.sqlBuilder.execSqlList(sqlStrings,onSuccess,onFailure);
}catch(e){
this.handleFailure(onFailure,e);
return;
}
},



add:function(key,value,onSuccess,onFailure){
this.addSingle(null,key,value,null,onSuccess,onFailure);
},


addSingle:function(bucket,key,value,filters,onSuccess,onFailure){
try{
var sqlStrings=this.sqlBuilder._addSingleSql(bucket,key,value,filters);
this.sqlBuilder.execSqlList(sqlStrings,onSuccess,onFailure);
}catch(e){
this.handleFailure(onFailure,e);
}
},


addIdentifiers:function(identifiers){
this.sqlBuilder.addIdentifiers(identifiers);
},


removeIdentifiers:function(identifiers){
this.sqlBuilder.removeIdentifiers(identifiers);
},


addMultiple:function(assorted,onSuccess,onFailure){
if(!assorted||!assorted.length){
if(onSuccess){
onSuccess.defer();
}
return;
}
try{
var sqlStrings=this.sqlBuilder._addMultipleSql(assorted);
this.sqlBuilder.execSqlList(sqlStrings,onSuccess,onFailure);
}catch(e){
this.handleFailure(onFailure,e);
}

},



removeBucket:function(bucket,onSuccess,onFailure){
try{
var sqlStrings=this.sqlBuilder._removeBucketSql(bucket);
this.sqlBuilder.execSqlList(sqlStrings,onSuccess,onFailure);
}catch(e){
this.handleFailure(onFailure,e);
}
},


remove:function(bucket,key,onSuccess,onFailure){
try{
var sqlStrings=this.sqlBuilder._removeObjectSql(bucket,key);
this.sqlBuilder.execSqlList(sqlStrings,onSuccess,onFailure);
}catch(e){
this.handleFailure(onFailure,e);
}
},


discard:function(key,onSuccess,onFailure){
this.remove(undefined,key,onSuccess,onFailure);
},



get:function(key,onSuccess,onFailure){
this.getSingle(null,key,onSuccess,onFailure);
},



getSingle:function(bucket,key,onSuccess,onFailure){
try{
var sqlStrings=this.sqlBuilder._getSingleSql(bucket,key,onSuccess,onFailure);
this.sqlBuilder.execSqlList(sqlStrings,this._rsIgnoreSuccessCb,this._rsIgnoreFailureCb);
}catch(e){
this.handleFailure(onFailure,e);
}
},


getMultiple:function(bucket,filters,limit,offset,onSuccess,onFailure){
try{

var sqlStrings=this.sqlBuilder._getMultipleSql(bucket,filters,limit,offset,onSuccess,onFailure);
this.sqlBuilder.execSqlList(sqlStrings,this._ignoreSuccessCb,this._ignoreFailureCb);
}catch(e){
this.handleFailure(onFailure,e);
}
},


getBucketSize:function(bucket,onSuccess,onFailure){
try{
var sqlStrings=this.sqlBuilder._getBucketSizeSql(bucket,onSuccess,onFailure);
this.sqlBuilder.execSqlList(sqlStrings,this._ignoreSuccessCb,this._ignoreFailureCb);
}catch(e){
this.handleFailure(onFailure,e);
}
},

handleFailure:function(onFailure,e){
if(onFailure){
onFailure.defer(e.message);
}
}






});


Mojo.Depot.prototype.simpleAdd=Mojo.Depot.prototype.add;

Mojo.Depot.prototype.removeSingle=Mojo.Depot.prototype.remove;

Mojo.Depot.prototype.simpleGet=Mojo.Depot.prototype.get;



Mojo.Depot.SqlBuilder=Class.create({
initialize:function(options,onSuccess,onFailure){
var sqlStrings;

this.name=options.name;
this.displayName=options.displayName||this.name;
this.version=(options.version===undefined)?1:options.version;
this.estimatedSize=options.estimatedSize;
this.replace=options.replace;
this.filters=options.filters||[];



this.identifiers={};
this.identifiers.object=Object;
this.identifiers.array=Array;


this.addIdentifiers(options.identifiers);


this._filters={};
for(var i=0;i<this.filters.length;i++){
this._filters[this.filters[i].toLowerCase()]=true;
}

this.badSqlError={code:-1,message:"error: bad arg passed in. accepts [a-zA-Z0-9_]"};
this.badFilterError={code:-1,message:"error: bad filter."};
this.noKeyError={code:-1,message:"error: no key specified."};


this.db=openDatabase(this.name,this.version,this.displayName,this.estimatedSize);
if(this.replace){
sqlStrings=this._resetAllSql();
}else{
sqlStrings=this._createTablesSql();
}

this.execSqlList(sqlStrings,onSuccess,onFailure);
},

_isValidFilter:function(filter){
return!!this._filters[filter.toLowerCase()];
},

execSql:function(sqlString,valuesList,onSuccess,onFailure){
var sqlStrings=[[sqlString,valuesList]];
var transCb=this._genTransSteps(sqlStrings);
this._execTrans(transCb,onSuccess,onFailure);
},


execSqlList:function(sqlStrings,onSuccess,onFailure){
var transCb=this._genTransSteps(sqlStrings,true);
this._execTrans(transCb,onSuccess,onFailure);
},


_idPrepend:"USER_TYPE_",


addIdentifiers:function(identifiers){
var i;
var internalId;

if(!identifiers){
return;
}

for(i in identifiers){
internalId=this._idPrepend+i;
if(typeof identifiers[i]=='function'){

this.identifiers[internalId]=identifiers[i];
}else{

this.identifiers[internalId]=identifiers[i].constructor;
}
}
},

removeIdentifiers:function(identifiers){
if(!identifiers){
return;
}

if(Object.isArray(identifiers)){
for(var i=0;i<identifiers.length;i++){
delete this.identifiers[this._idPrepend+identifiers[i]];
}
}else{
delete this.identifiers[this._idPrepend+identifiers];
}
},


constructNewObj:function(identifier,value){
switch(identifier){
case"undefined":
return undefined;
case"null":
return null;
case"boolean":
return(value==="true"?true:false);
case"string":
return value;
case"number":
return Number(value).valueOf();
}

if(this.identifiers[identifier]){
return new this.identifiers[identifier]();
}

return{};

},






typeIdentifier:function(obj){
var i;

if(obj===null){
return"null";
}

for(i in this.identifiers){
if(this.identifiers[i]===obj.constructor){
return i;
}
}
return"object";
},



_failureWrap:function(onFailure,e1,e2){
if(onFailure){
if(e2&&e2.message&&e2.code){
onFailure("Result Set Failure (code "+e2.code+"): "+e2.message);
}else if(e1&&e1.message&&e1.code){
onFailure("Transaction Failure (code "+e1.code+"): "+e1.message);
}else{
onFailure("Unknown Failure");
}
}
},


_genTransSteps:function(argList,rsMode){
if(rsMode){

return this._execRsSqlStmts.bind(this,argList);
}else{

return this._execSqlStmts.bind(this,argList);
}
},

_execTrans:function(transactionCb,successCb,errorCb){
if(errorCb||successCb){
successCb=successCb||this._ignoreSuccessCb.bind(this,"exec trans");
errorCb=this._failureWrap.bind(this,(errorCb?errorCb:Mojo.Log.error));
this.db.transaction(transactionCb,errorCb,successCb);
}else{
this.db.transaction(transactionCb);
}

},


_execSqlStmts:function(sqlValuePairs,transaction){

if(!sqlValuePairs||!sqlValuePairs.length){
return;
}





for(var i=0;i<sqlValuePairs.length-1;i++){

transaction.executeSql(sqlValuePairs[i][0],sqlValuePairs[i][1]||[]);
}


transaction.executeSql(sqlValuePairs[sqlValuePairs.length-1][0],
sqlValuePairs[sqlValuePairs.length-1][1]||[],
sqlValuePairs[sqlValuePairs.length-1][2]);



},

_execRsSqlStmts:function(sqlExecArgs,transaction){
if(!sqlExecArgs){
return;
}

for(var i=0;i<sqlExecArgs.length;i++){
var sqlString=sqlExecArgs[i][0];
var valuesList=sqlExecArgs[i][1]||[];
var rsSuccess=sqlExecArgs[i][2];
var rsFailure=sqlExecArgs[i][3];


if(rsFailure){
rsFailure=this._failureWrap.bind(this,rsFailure);
transaction.executeSql(sqlString,valuesList,rsSuccess,rsFailure);
}else if(rsSuccess){
transaction.executeSql(sqlString,valuesList,rsSuccess);
}else{
transaction.executeSql(sqlString,valuesList);
}
}
},


_filterString:function(filters){

var len;
if(filters&&filters.length){
len=filters.length;
}else{
return"";
}

var acc="";

for(var i=0;i<len;i++){
this._validateSql(filters[i]);
acc+="'"+filters[i].toLowerCase()+"' text UNIQUE ON CONFLICT REPLACE, ";
}
return acc;
},



_nodeInsertionSql:function(nodeList,bucket,key,value,filters){
if(!nodeList||!nodeList.length||!key){
return[];
}

if(!bucket){
bucket=this._defaultBucketName;
}
var i;
var acc=[];
var filterVals=[];
var filterUnknowns="";
var filterCols="";
var subVals=[bucket,key];

if(filters&&filters.length){
for(i=0;i<filters.length;i++){
var filter=filters[i].toLowerCase();
if(this._isValidFilter(filter)){
var filterVal=value[filter];
var filterValType=typeof filterVal;
switch(filterValType){
case"boolean":
filterVals.push(""+filterVal);
break;
case"number":
case"string":
filterVals.push(filterVal);
break;
default:
filterVals.push("");
}

filterUnknowns+=", ?";
filterCols+=", "+filter;
}else{
throw this.badFilterError;
}

}
subVals=[bucket,key].concat(filterVals);
}



acc.push(["DELETE FROM 'properties' WHERE frowid IN (SELECT id FROM 'toc' WHERE bucket=? AND key=?)",
[bucket,key]]);


acc.push(["INSERT OR REPLACE INTO 'toc' (bucket, key"+
filterCols+") VALUES(?, ?"+filterUnknowns+")",subVals]);
acc.push(["INSERT OR REPLACE INTO 'insinfo' (name, value) VALUES('tocidx', last_insert_rowid())"]);



for(i=0;i<nodeList.length;i++){
var node=nodeList[i];

acc.push(["INSERT OR REPLACE INTO 'properties' (frowid, left, right, type, name, value) VALUES((SELECT value FROM 'insinfo' WHERE name='tocidx'), ?, ?, ?, ?, ?)",
[node.left,node.right,node.type,node.name,""+node.value]]);

}

return acc;

},


_removeBucketSql:function(bucket){
if(!bucket){
return[];
}

var acc=[];


acc.push(["DELETE FROM 'properties' WHERE frowid IN (SELECT id FROM 'toc' WHERE bucket=?)",[bucket]]);
acc.push(["DELETE FROM 'toc' WHERE bucket=?",[bucket]]);

return acc;

},


_removeObjectSql:function(bucket,key){
if(!key){
return[];
}
if(!bucket){
bucket=this._defaultBucketName;
}



var acc=[];
acc.push(["DELETE FROM 'properties' WHERE frowid = (SELECT id FROM 'toc' WHERE bucket=? AND key=?)",[bucket,key]]);
acc.push(["DELETE FROM 'toc' WHERE bucket=? AND key=?",[bucket,key]]);

return acc;

},

_resetAllSql:function(){
var sqlStrings=[["DROP TABLE IF EXISTS 'toc';"],
["DROP TABLE IF EXISTS 'insinfo';"],
["DROP TABLE IF EXISTS 'properties';"]];
return sqlStrings.concat(this._createTablesSql());
},

_createTablesSql:function(){
return[["CREATE TABLE IF NOT EXISTS 'toc' "+
"('id' INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, "+
this._filterString(this.filters)+
"'bucket' text NOT NULL DEFAULT '', 'key' text NOT NULL ON CONFLICT REPLACE DEFAULT '', UNIQUE ('bucket', 'key'))"],
["CREATE TABLE IF NOT EXISTS 'properties' "+
"('frowid' integer, "+
"'value' text DEFAULT '', 'left' integer default 0, 'right' integer default 0,"+
" 'name' text DEFAULT '', 'type' text DEFAULT '', "+
"Foreign Key(frowid) references toc(id), Primary key(frowid, left, right));"],
["CREATE TABLE IF NOT EXISTS 'insinfo' "+
"('name' text UNIQUE NOT NULL ON CONFLICT REPLACE, "+
"'value' integer)"]];
},

_filtersSqlClause:function(filters){
if(!filters){
return"";
}

switch(typeof filters)
{
case"string":
case"number":
case"boolean":
filters=[filters];
break;
case"object":

if(!filters.length){
return"";
}
break;
default:
return"";
}


var notNullAcc="";
var orderByAcc=" ORDER BY ";

for(var i=0;i<filters.length;i++){

var filter;
var orderby;

if(typeof filters[i]=="object"){

filter=filters[i][0].toLowerCase();
orderby=filters[i][1];
}else{
filter=filters[i];
}

this._validateSql(filter);

notNullAcc+=" AND "+filter+" IS NOT NULL";

orderByAcc+=" "+filter+((orderby=="descending")?" DESC,":" ASC,");
}


orderByAcc=orderByAcc.substring(0,orderByAcc.length-1);

return notNullAcc+orderByAcc;
},


_filtersNotNullSqlClause:function(filters){
if(!filters){
return"";
}

switch(typeof filters)
{
case"string":
case"number":
case"boolean":
filters=[filters];
break;
case"object":

if(!filters.length){
return"";
}
break;
default:
return"";
}


var notNullAcc="";

for(var i=0;i<filters.length;i++){

var filter;

if(typeof filters[i]=="object"){

filter=filters[i][0].toLowerCase();
}else{
filter=filters[i].toLowerCase();
}
this._validateSql(filter);
notNullAcc+=" AND "+filter+" IS NOT NULL";
}

return notNullAcc;
},

_addSingleSql:function(bucket,key,value,filters){
var walker=new Mojo.Depot.GraphWalker(value,this.typeIdentifier.bind(this));
var nodes=walker.walk();

var sqlStrings=this._nodeInsertionSql(nodes,bucket,key,value,filters);

return sqlStrings;
},

_addMultipleSql:function(assorted){
var sqlStrings=[];

for(var i=0;i<assorted.length;i++){
var bucket=assorted[i].bucket;
var key=assorted[i].key;
var value=assorted[i].value;
var filters=assorted[i].filters;


var walker=new Mojo.Depot.GraphWalker(value,this.typeIdentifier.bind(this));
var nodes=walker.walk();

sqlStrings=sqlStrings.concat(this._nodeInsertionSql(nodes,bucket,key,value,filters));

}

return sqlStrings;
},

_getSingleSql:function(bucket,key,onSuccess,onFailure){
if(!bucket){
bucket=this._defaultBucketName;
}

if(!key){
throw this.noKeyError;
}

return[["SELECT * from 'properties' where frowid = (SELECT id FROM 'toc' WHERE bucket=? AND key=?)",[bucket,key],this._getSingleRs.bind(this,onSuccess,onFailure)]];
},

_getMultipleSql:function(bucket,filters,limit,offset,onSuccess,onFailure){
var sqlStrings;
if(filters){


var bucketClause=(bucket?"bucket=? ":"");
var filterClause=this._filtersSqlClause(filters);
if(!bucketClause&&filterClause){
filterClause=filterClause.substring(4,filterClause.length);
}

this._validateSql(limit);
this._validateSql(offset);


sqlStrings=[["SELECT id FROM 'toc' WHERE "+bucketClause+
filterClause+
((limit)?" LIMIT "+limit+(offset?" OFFSET "+offset:""):""),
(bucket?[bucket]:[]),this._sortedSetIds.bind(this,onSuccess,onFailure,filters,bucket),onFailure]];

}else{
sqlStrings=[["SELECT * from 'properties' where frowid IN (SELECT id FROM 'toc' WHERE bucket=? )",[bucket],this._getSetRsCb.bind(this,onSuccess,onFailure,null)]];
}

return sqlStrings;

},



_getBucketSizeSql:function(bucket,onSuccess,onFailure){
var sqlStrings=[["SELECT COUNT(id) FROM 'toc' WHERE bucket=? ",
[bucket],
this._getRsWrapper.bind(this,onSuccess,function(x){return x[0]["COUNT(id)"];}),
onFailure]];
return sqlStrings;

},




_sortedSetIds:function(onSuccess,onFailure,filters,bucket,transaction,resultSet){
var order=[];
var rows=resultSet.rows;

for(var i=0;i<rows.length;i++){
order[i]=rows.item(i).id;
}

var bucketClause=(bucket?"bucket=? ":"");
var filterClause=this._filtersNotNullSqlClause(filters);
if(!bucketClause&&filterClause){
filterClause=filterClause.substring(4,filterClause.length);
}
var sqlStrings=[["SELECT * from 'properties' where frowid IN (SELECT id FROM 'toc' WHERE "+
bucketClause+
filterClause+")",(bucket?[bucket]:[]),
this._getSetRsCb.bind(this,onSuccess,onFailure,order)]];

this.execSqlList(sqlStrings,this._ignoreSuccessCb.bind(this,"sorted bucket ids"),this._ignoreFailureCb);

},





_validSqlRegex:/^\w*$/,

_validateSql:function(sqlString){
if(!this._validSqlRegex.match(sqlString)){
throw this.badSqlError;
}
},


_getSingleRs:function(onSuccess,onFailure,transaction,resultSet){
var rows=resultSet.rows;
var objParts=[];


for(var i=0;i<rows.length;i++){
objParts[i]=rows.item(i);
}

var builder=new Mojo.Depot.ObjectBuilder(objParts,this.constructNewObj.bind(this));

var result=builder.rebuild();



if(onSuccess){
onSuccess(result);
}
},



_rsIgnoreFailureCb:function(result,result2){

return false;
},

_getRsWrapper:function(onSuccess,preprocessor,transaction,resultSet){
var rows=resultSet.rows;
var ret=[];

preprocessor=preprocessor||this._identity;

for(var i=0;i<rows.length;i++){
ret[i]=rows.item(i);
}

onSuccess(preprocessor(ret));
},

_rsIgnoreSuccessCb:function(){

},

_ignoreSuccessCb:function(message){


},

_ignoreFailureCb:function(result,result2){

},


_getSetRsCb:function(onSuccess,onFailure,order,transaction,resultSet){
try{
var rows=resultSet.rows;
var objParts=[];


for(var i=0;i<rows.length;i++){
objParts[i]=rows.item(i);
}


var builder=new Mojo.Depot.SetBuilder(objParts,order,this.constructNewObj.bind(this));
var result=builder.rebuild();


if(onSuccess){
onSuccess(result);
}
}catch(e){
if(onFailure){
onFailure(e);
}

}
},

_identity:function(x){
return x;
},


_defaultBucketName:"defaultbucket",


_dumpTables:function(){
this.execSqlList([["SELECT * FROM 'toc'",null,this._dumpTablesSuccess.bind(this,"TOC"),Mojo.Log.error]]);
this.execSqlList([["SELECT * FROM 'properties'",null,this._dumpTablesSuccess.bind(this,"PROPS"),Mojo.Log.error]],this._dumpTablesSuccess.bind(this,"PROPERTIES"),Mojo.Log.error);
},


_dumpTablesSuccess:function(name,transaction,resultSet){
var output=("\n\n\n"+name+"\n");

if(resultSet){
var rows=resultSet.rows;
for(var i=0;i<rows.length;i++){
output+=(Object.toJSON(rows.item(i))+"\n");
}
}
Mojo.Log.info(output);

}



});










Mojo.Depot.SetBuilder=Class.create({
initialize:function(nodes,order,objectConstructor){
this.nodes=nodes;
this.order=order;
this.objBuilder=new Mojo.Depot.ObjectBuilder([],objectConstructor);
},

setNodes:function(nodes,order){
this.nodes=nodes;
this.order=order;
},


rebuild:function(){
var i;
var nodeIdHash={};
var resultArr=[];
var nodes=this.nodes;
var rowidList=[];
var orderByArray;

if(!nodes||!nodes.length){
return[];
}



for(i=0;i<nodes.length;i++){
if(!nodeIdHash[nodes[i].frowid]){
nodeIdHash[nodes[i].frowid]=[];
rowidList.push(nodes[i].frowid);
}

nodeIdHash[nodes[i].frowid].push(nodes[i]);
}





if(this.order){
orderByArray=this.order;
}else{


rowidList.sort();
orderByArray=rowidList;
}

for(i=0;i<orderByArray.length;i++){
this.objBuilder.setNodes(nodeIdHash[orderByArray[i]]);
resultArr.push(this.objBuilder.rebuild());
}

return resultArr;
}
});









Mojo.Depot.ObjectBuilder=Class.create({
initialize:function(nodes,objectConstructor){
this.nodes=nodes&&nodes.sort(this._sortFunction);
this.parentStack=[];
this.constructNewObj=objectConstructor;
},


setNodes:function(nodes){
this.nodes=nodes&&nodes.sort(this._sortFunction);
this.parentStack=[];
},



_sortFunction:function(x,y){
return(x.left-y.left);
},


rebuild:function(){
if(this.nodes.length===0){
return null;
}


switch(this.nodes[0].type){
case"reference":


break;
case"number":
case"boolean":
case"string":
case"undefined":
case"null":
return this.constructNewObj(this.nodes[0].type,this.nodes[0].value);
default:
this._reduceAndPushParent(this.nodes[0]);

}

for(var i=1;i<this.nodes.length;i++){
var node=this.nodes[i];
this._addToObject(node);
}

return this.reconstructed;
},


_setObjProperty:function(key,val){
this.parentStack.last().reconstructed[key]=val;
return this.parentStack.last().reconstructed[key];
},


_getRef:function(ref){
var upper=this.nodes.length-1;
var lower=0;
var middle;

while(upper>=lower){
middle=Math.floor((upper+lower)/2);
if(this.nodes[middle].left>ref.value){
upper=middle-1;
}else if(this.nodes[middle].left<ref.value){
lower=middle+1;
}else{
return this.nodes[middle].reconstructed;
}
}

return null;


},


_addToObject:function(node){
var newObj;
switch(node.type){

case"reference":
this._reduceParentCount(1);
node.reconstructed=this._setObjProperty(node.name,this._getRef(node));
break;

case"number":
case"boolean":
case"string":
case"null":
case"undefined":
newObj=this.constructNewObj(node.type,node.value);
node.reconstructed=this._setObjProperty(node.name,newObj);
this._reduceParentCount(1);
break;
default:
newObj=this.constructNewObj(node.type,node.value);
node.reconstructed=this._setObjProperty(node.name,newObj);
this._reduceAndPushParent(node);
}

this._popParentPotentially();

},


_reduceParentCount:function(delta){
var curParent=this.parentStack.last();
if(curParent&&curParent.childrenLeft){
curParent.childrenLeft-=delta;
}
},


_reduceAndPushParent:function(node){
var numChildren=this._getNumChildren(node);
var sizeSubtree=numChildren+1;

if(this.parentStack.last()){
this._reduceParentCount(sizeSubtree);
}else{
this._startNewObject(node);
node.reconstructed=this.reconstructed;
}

node.childrenLeft=numChildren;
this.parentStack.push(node);

},

_startNewObject:function(node){
this.reconstructed=this.constructNewObj(node.type,node.value);
},


_popParentPotentially:function(node){
while(this.parentStack.last()&&this.parentStack.last().childrenLeft===0){
this.parentStack.pop();
}
},

_getNumChildren:function(node){
return(node.right-node.left-1)/2;
}


});








Mojo.Depot.GraphWalker=Class.create({

initialize:function(graph,typeIdentifier){
this.graph=graph;
this.records=[];
this.index=1;
this.typeIdentifier=typeIdentifier;
},


walk:function(){
if(this.graph===null){

return[{"left":1,"right":2,"name":"","type":"null","value":"null"}];
}

this._walk("",this.graph);

this._removeMarkers(this.graph);

return this.records;
},

_walk:function(propName,node){


if(this._isMarked(node)){



this._addRecord(this._wrapReference(propName,node));

}else{
if(this.canHoldProperties(node)){



this._enterNode(node);

for(var i in node){
if(i!=this._markKey&&node.hasOwnProperty(i)){
this._walk(i,node[i]);
}
}

this._exitNode(node);
this._addRecord(this._wrapContainer(propName,node));

}else{


this._addRecord(this._wrapValue(propName,node));
}


}

},


canHoldProperties:function(node){
switch(typeof node){
case"object":
return node!==null&&node!==undefined;
case"function":
return true;
default:
return false;
}

},

_isMarked:function(node){
return(node&&node[this._markKey]);
},



_markNode:function(node){
node[this._markKey]={};
},

_removeMarkers:function(root){
if(!root){
return;
}

if(root[this._markKey]){
delete root[this._markKey];
for(var i in root){
this._removeMarkers(root[i]);
}
}else{
return;
}
},

_enterNode:function(node){
this._markNode(node);
node[this._markKey].left=this.index++;
},

_exitNode:function(node){

node[this._markKey].right=this.index++;

},

_wrap:function(propName,toWrap){
if(this.canHoldProperties(toWrap)){
if(this._isMarked(toWrap)){
return this._wrapReference(propName,toWrap);
}else{
return this._wrapContainer(propName,toWrap);
}
}else{
return this._wrapValue(propName,toWrap);
}
},

_wrapReference:function(propName,orig){

var wrap={left:this.index++,
right:this.index++,
name:propName,
type:"reference",
value:orig[this._markKey].left};

return wrap;

},

_wrapValue:function(propName,val){

var wrap={left:this.index++,
right:this.index++,
name:propName,
type:(val!==null?(typeof val):'null'),
value:val};
return wrap;
},

_wrapContainer:function(propName,container){

var wrap={left:container[this._markKey].left,
right:container[this._markKey].right,
name:propName,
type:this.typeIdentifier(container),
value:"(container)"};


return wrap;
},



_addRecord:function(wrapped){





this.records.push(wrapped);
},

_addUnwrappedRecord:function(propName,unwrapped){
this._addRecord(this._wrap(propName,unwrapped));
},



_markKey:"_depotMarkerString"




});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.NodeRefGenerator={};


Mojo.NodeRefGenerator._createNodeRefAccessors=function(proto,prop){
Mojo.NodeRefGenerator._createNodeRefGetter(proto,prop);
Mojo.NodeRefGenerator._createNodeRefSetter(proto,prop);
};



Mojo.NodeRefGenerator._createNodeRefGetter=function(proto,prop){


proto.__defineGetter__(prop,
function(){
return this._ref[prop];
});
};


Mojo.NodeRefGenerator._createNodeRefSetter=function(proto,prop){

proto.__defineSetter__(prop,
function(newVal){
this._ref[prop]=newVal;
});
};


Mojo.NodeRefGenerator._createNodeRefWrapper=function(proto,prop){

var wrapperFunc=function(){

return this._ref[prop].apply(this._ref,arguments);
};

proto[prop]=wrapperFunc;
};


Mojo.NodeRefGenerator._generateNodeRefProto=function(){
var prop;
var sampleElement=new Element('div');
var proto={};

for(prop in sampleElement){
if(!proto[prop]){
if(Object.isFunction(sampleElement[prop])){
Mojo.NodeRefGenerator._createNodeRefWrapper(proto,prop);
}else{
Mojo.NodeRefGenerator._createNodeRefAccessors(proto,prop);
}
}
}

proto.removalHandler=function(event){
if(this._ref===undefined){
Mojo.Log.warn("Removing non-existant node ref instance due to dom node removal event!!");
}
delete this._ref;
};

proto.insertionHandler=function(event){
if(this._ref!==undefined){
Mojo.Log.warn("REPLACING node ref instance due to dom node insertion event!!");
}
this._ref=event.target;
};

proto.addHandlers=function(){
this._ref.addEventListener('DOMNodeRemovedFromDocument',this.removalHandler,false);
this._ref.addEventListener('DOMNodeInsertedIntoDocument',this.insertionHandler,false);
};

proto.removeHandlers=function(){
this._ref.removeEventListener('DOMNodeRemovedFromDocument',this.removalHandler,false);
this._ref.removeEventListener('DOMNodeInsertedIntoDocument',this.insertionHandler,false);
};

proto.getActualNode=function(){
return this._ref;
};

return proto;
};



Mojo.NodeRef=function(element){
Mojo.require(element,"NodeRef: must create noderef around element");
this._ref=element;
this.removalHandler=this.removalHandler.bind(this);
this.insertionHandler=this.insertionHandler.bind(this);
this.removeHandlers=this.removeHandlers.bind(this);
this.addHandlers=this.addHandlers.bind(this);
this.addHandlers();
};
Mojo.NodeRef.prototype=Mojo.NodeRefGenerator._generateNodeRefProto();

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Controller.WidgetController=Class.create({





setModel:function setModel(newModel){

if(!this.assistant)
{return;}

this.scene.removeWatcher(this.assistant,this.model);
if(this.assistant.setModel){
this.assistant.setModel(newModel);
}else{
this.model=newModel;

if(this.assistant.handleModelChanged){
this.assistant.handleModelChanged();
}
}

this.scene.watchModel(this.model,this.assistant,this.assistant.handleModelChanged);
},


modelChanged:function(inModel){
var model=inModel||this.model;
this.scene.modelChanged(model,this.assistant);
},


remove:function(){
if(this.element.parentNode){
this.element.parentNode.removeChild(this.element);
}
},


reparent:function(newParent,beforeNode){
this.reparenting=true;
this.remove();
newParent.insertBefore(this.element,beforeNode||null);
delete this.reparenting;
},



instantiateChildWidgets:function instantiateChildWidgets(element,model){
element=element||this.element;
this.scene.instantiateChildWidgets(element,model);
},


cleanupChildWidgets:function(element){
Mojo.Log.warn("WARNING: WidgetController.cleanupChildWidgets() is no longer needed. Please stop calling it.");
},



valueFromModelOrAttributes:function(propertyName,defaultValue){
var value;
if(this.model){
value=this.model[propertyName];
}

if(value===undefined&&this.attributes){
value=this.attributes[propertyName];

}
if(value===undefined){
value=defaultValue;
}
return value;
},


get:function(elementId){
return this.scene.get(elementId);
},


select:function(selector){
return this.scene.select(selector);
},


listen:function(elementOrId,eventType,handlerFunction,onCapture){
return this.scene.listen(elementOrId,eventType,handlerFunction,onCapture);
},



stopListening:function(elementOrId,eventType,callback,onCapture){
return this.scene.stopListening(elementOrId,eventType,callback,onCapture);
},


exposeMethods:function(functionNames){





if(!this.element.mojo){
this.element.mojo={};
}


var that=this;
functionNames.each(function(name){
var func=that.assistant[name];
Mojo.assert(func,"WARNING: Could not find widget api '"+name+"'.");
that.element.mojo[name]=func&&func.bind(that.assistant);
});

},








initialize:function initialize(element,sceneController,model){
var timing=Mojo.Timing;
var widgetTimingName;
timing.resume('scene#widgetInitialize');
var widgetClass;
var Ctor;

Mojo.assert(element.hasAttribute('x-mojo-element'),"WidgetController: Can't instantiate element without 'x-mojo-element' attribute.");
Mojo.assert(element._mojoController===undefined,"WidgetController: element '"+element.id+"' already has a widget instantiated.");



widgetClass=element.getAttribute('x-mojo-element');


Ctor=Mojo.Widget[widgetClass];


if(Ctor===undefined){
timing.resume('scene#widgetLoad');
Mojo.loadWidget(widgetClass);
timing.pause('scene#widgetLoad');
Ctor=Mojo.Widget[widgetClass];
}

Mojo.assert(Ctor!==undefined,"WidgetController: Cannot instantiate widget '"+widgetClass+"'.");
if(Ctor===undefined){
return;
}


var setup=undefined;
if(element.hasAttribute('id')){
this.widgetName=element.getAttribute('id');
setup=sceneController.getWidgetSetup(this.widgetName);
}
if(setup===undefined&&element.hasAttribute('name')){
this.widgetName=element.getAttribute('name');
setup=sceneController.getWidgetSetup(this.widgetName);
}




if(model===undefined&&setup!==undefined){
model=setup.model;



if(element._mojoModel){
model=element._mojoModel;
element._mojoModel=undefined;
}
}

if(timing.enabled){
widgetTimingName='scene#'+widgetClass+'#widgetAssistantSetup';
}


this.scene=sceneController;
this.stageController=sceneController.stageController;
this.window=this.stageController.window;
this.document=this.window.document;
this.model=model||{};
this.element=element;
this.attributes=(setup&&setup.attributes)||{};

timing.resume('scene#widgetAssistantConstructor');
var widget=new Ctor();
timing.pause('scene#widgetAssistantConstructor');
this.assistant=widget;


if(this.assistant.setupOptional===undefined){
if(!(setup||model)){
Mojo.Log.warn("WidgetController: Could not instantiate widget '",this.widgetName,"', since it has not been set up.");
return;
}
}


element._mojoController=this;


widget.controller=this;


this.cleanupHandler=this.cleanup.bindAsEventListener(this);
this.element.addEventListener('DOMNodeRemovedFromDocument',this.cleanupHandler,false);





if(this.model&&widget.handleModelChanged){
sceneController.watchModel(this.model,widget,widget.handleModelChanged);
}



if(this.assistant.remeasure||this.assistant.subtreeShown){
this._maybeSubtreeShown=this._maybeSubtreeShown.bindAsEventListener(this);
this.scene.listen(this.scene.sceneElement,Mojo.Event.subtreeShown,this._maybeSubtreeShown);
}
if(this.assistant.remeasure||this.assistant.orientationChange){
this._maybeOrientationChange=this._maybeOrientationChange.bindAsEventListener(this);
this.scene.listen(this.scene.sceneElement,Mojo.Event.orientationChange,this._maybeOrientationChange);
}


if(this.assistant.subtreeHidden){
this._maybeSubtreeHidden=this._maybeSubtreeHidden.bindAsEventListener(this);
this.scene.listen(this.scene.sceneElement,Mojo.Event.subtreeHidden,this._maybeSubtreeHidden);
}






if(widget.setup){
timing.resume(widgetTimingName);
if(Mojo.Host.current===Mojo.Host.browser){
widget.setup();
}else{
try{
widget.setup();
}catch(e){
Mojo.Log.error("Error: Caught exception in "+widgetClass+" widget '"+this.widgetName+"' setup(): "+e);
}
}
timing.pause(widgetTimingName);
}
timing.pause('scene#widgetInitialize');
},


_subtreeEventMatters:function(subtreeEvent){
var container=subtreeEvent.container;
var widgetElement=this.element;
return container===widgetElement||widgetElement.descendantOf(container);
},






_maybeSubtreeShown:function(subtreeShownEvent){
if(this._subtreeEventMatters(subtreeShownEvent)){
if(this.assistant.subtreeShown){
this.assistant.subtreeShown(subtreeShownEvent);
}
if(this.assistant.remeasure){
this.assistant.remeasure(subtreeShownEvent);
}
}
},


_maybeSubtreeHidden:function(subtreeEvent){
if(this._subtreeEventMatters(subtreeEvent)){
this.assistant.subtreeHidden(subtreeEvent);
}
},


_maybeOrientationChange:function(e){
if(this.assistant.orientationChange){
this.assistant.orientationChange(e);
}
if(this.assistant.remeasure){
this.assistant.remeasure(e);
}
},


activate:function activate(){
if(this.assistant.activate){
this.assistant.activate();
}
},




cleanup:function cleanup(){
var disposal;

if(this.reparenting){
return;
}

this.scene.removeWatcher(this.assistant);
if(this.assistant.remeasure||this.assistant.subtreeShown){
this.stopListening(this.scene.sceneElement,Mojo.Event.subtreeShown,this._maybeSubtreeShown);
}
if(this.assistant.remeasure||this.assistant.orientationChange){
this.stopListening(this.scene.sceneElement,Mojo.Event.orientationChange,this._maybeOrientationChange);
}

if(this.assistant.subtreeHidden){
this.stopListening(this.scene.sceneElement,Mojo.Event.subtreeHidden,this._maybeSubtreeHidden);
}

if(this.assistant.cleanup){
this.assistant.cleanup();
}

this.element.removeEventListener('DOMNodeRemovedFromDocument',this.cleanupHandler,false);

disposal=this.scene.stageController._mojoWidgetDisposal;
if(!disposal){
disposal=new Mojo.Controller.WidgetController.WidgetDisposal();
this.scene.stageController._mojoWidgetDisposal=disposal;
}

disposal.add(this);
}

});


Mojo.Log.addLoggingMethodsToPrototype(Mojo.Controller.WidgetController);




Mojo.Controller.WidgetController.WidgetDisposal=function(){
this.dispose=this.dispose.bind(this);
};


Mojo.Controller.WidgetController.WidgetDisposal.prototype.DELAY=5;


Mojo.Controller.WidgetController.WidgetDisposal.prototype.add=function(widget){

this.waitingQueue=this.waitingQueue||[];
this.waitingQueue.push(widget);


if(!this.disposing){
this.disposing=true;
this.dispose.delay(this.DELAY);
}
};


Mojo.Controller.WidgetController.WidgetDisposal.prototype.dispose=function(){
var i,widget;
var disposalQueue=this.disposalQueue;




if(disposalQueue){
for(i=0;i<disposalQueue.length;i++){
widget=disposalQueue[i];
Mojo.removeAllEventListenersRecursive(widget.element);
widget.element=undefined;
}
}


this.disposalQueue=this.waitingQueue;
this.waitingQueue=undefined;



if(this.disposalQueue){
this.dispose.delay(this.DELAY);
}else{

this.disposing=false;
}

};




/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget={};

Mojo.Widget.defaultDisabledProperty='disabled';
Mojo.Widget.defaultModelProperty='value';


Mojo.Widget.sentenceCase="sentence-case";
Mojo.Widget.titleCase="title-case";
Mojo.Widget.numLock="num-lock";
Mojo.Widget.capsLock="caps-lock";
Mojo.Widget.shiftLock="shift-lock";
Mojo.Widget.shiftSingle="shift-single";
Mojo.Widget.numSingle="num-single";
Mojo.Widget.normal="normal";
Mojo.Widget.focusSelectMode="select";
Mojo.Widget.focusInsertMode="insert";
Mojo.Widget.focusAppendMode="append";
Mojo.Widget.focusAttribute='x-mojo-focus-highlight';
Mojo.Widget.steModeSentenceCase="cap-sentence";
Mojo.Widget.steModeTitleCase="cap-title";
Mojo.Widget.steModeLowerCase="cap-lowercase";
Mojo.Widget.steModeEmoticonsOn="emoticons-on";
Mojo.Widget.steModeEmoticonsOff="emoticons-off";
Mojo.Widget.steModeReplaceOff="replace-off";
Mojo.Widget.steModeReplaceOn="replace-on";
Mojo.Widget.textLinkerOn='textlinker-on';
Mojo.Widget.textLinkerOff='textlinker-off';




Mojo.Widget.sortLastFirst='LAST_FIRST';

Mojo.Widget.sortFirstLast='FIRST_LAST';

Mojo.Widget.sortCompanyLastFirst='COMPANY_LAST_FIRST';

Mojo.Widget.sortCompanyFirstLast='COMPANY_FIRST_LAST';



Mojo.Widget.spinnerSmall='small';
Mojo.Widget.spinnerLarge='large';



Mojo.Widget.defaultButton='default';
Mojo.Widget.activityButton='activity';


Mojo.Widget.labelPlacementRight='right';
Mojo.Widget.labelPlacementLeft='left';



Mojo.Widget.numericValidation=function(charCode){
if(charCode>=Mojo.Char.asciiZero&&charCode<=Mojo.Char.asciiNine){
return true;
}
return false;
};




Mojo.Widget.sysTemplatePath=Mojo.Config.TEMPLATES_HOME+"/";


Mojo.Widget.getSystemTemplatePath=function getSystemTemplatePath(partialPath){
var path=Mojo.Config.TEMPLATES_HOME;
if(!partialPath.startsWith("/")){
path+="/";
}
return path+partialPath;
};










Mojo.Controller.SceneController.prototype.showAlertDialog=function(model){
return this.showFrameworkDialog('_AlertDialog',"alert",model);
};



Mojo.Controller.SceneController.prototype.showDialog=function(model){
return this.showFrameworkDialog('_Dialog',"dialog",model);
};





Mojo.Controller.SceneController.prototype.showFrameworkDialog=function(type,attr,model){
var widgetController=this.createDynamicWidget(type,model);
if(widgetController&&widgetController.element){
widgetController.element.setAttribute('x-mojo-dialog',attr);


if(!Mojo.View.getFocusedElement(widgetController.element)){
Mojo.View.advanceFocus(widgetController.element);
}
return widgetController.element;
}
return undefined;
};


Mojo.Controller.SceneController.prototype.popupSubmenu=function(model){




var widgetController=this.createDynamicWidget('_Submenu',model);
return widgetController&&widgetController.element;
};


Mojo.Controller.SceneController.prototype.showPickerPopup=function(model){
var widgetController=this.createDynamicWidget('_PickerPopup',model);
return widgetController&&widgetController.element;
};




Mojo.Controller.SceneController.prototype.createDynamicWidget=function createDynamicWidget(widgetType,model,insertBefore){
if(insertBefore===undefined)
{insertBefore=null;}

var element=this.document.createElement('div');
element.setAttribute('x-mojo-element',widgetType);
this.sceneElement.insertBefore(element,insertBefore);

return new Mojo.Controller.WidgetController(element,this,model);
};



Mojo.Controller.SceneController.prototype.showWidgetContainer=function showWidgetContainer(elementOrId){


Mojo.Event.send(this.sceneElement,Mojo.Event.subtreeShown,{container:this.get(elementOrId)},false,true);
};


Mojo.Controller.SceneController.prototype.hideWidgetContainer=function hideWidgetContainer(elementOrId){



Mojo.Event.send(this.sceneElement,Mojo.Event.subtreeHidden,{container:this.get(elementOrId)},false,true);
};




Mojo.Controller.SceneController.prototype.instantiateChildWidgets=function instantiateChildWidgets(containingElement,overrideModel){
Mojo.Timing.resume('scene#widgetTotal');
var elements=Mojo.Widget.Util.findChildWidgets(containingElement);
var widget;
var element;

for(var i=0;i<elements.length;i++){
element=elements[i];
if(element._mojoController===undefined){
widget=new Mojo.Controller.WidgetController(element,this,overrideModel);
}
}
Mojo.Timing.pause('scene#widgetTotal');
};




Mojo.Widget.Util={};


Mojo.Widget.Util.applyListClassesToChildren=function applyListClassesToChildren(parent,singleClass,firstClass,lastClass)
{
var children=parent.childElements();

if(!children.length){
return;
}

if(children.length==1){
if(!singleClass){
singleClass='single';
}
children[0].addClassName(singleClass);
return;
}

if(!firstClass){
firstClass='first';
}

if(!lastClass){
lastClass='last';
}

children[0].addClassName(firstClass);
children[children.length-1].addClassName(lastClass);
};



Mojo.Widget.Util.renderListIntoDiv=function renderListIntoDiv(listParentDiv,listData,listTemplate,itemsData,itemsTemplate,formatters,extraItems){






var obj=Mojo.Model.format(listData,formatters);
obj.listElements="<div id='MojoListItemsParentMarker'></div>";

listParentDiv.innerHTML=Mojo.View.render({object:obj,template:listTemplate});


var listItemsParent=listParentDiv.querySelector('#MojoListItemsParentMarker').parentNode;


if(extraItems===undefined){
extraItems="";
}
listItemsParent.innerHTML=Mojo.View.render({collection:itemsData,formatters:formatters,template:itemsTemplate})+extraItems;



var itemElement=listItemsParent.firstChild;
for(var i=0;i<itemsData.length;i++){

while(itemElement&&itemElement.nodeType!=itemElement.ELEMENT_NODE){
itemElement=itemElement.nextSibling;
}

if(itemsData[i]!==null&&itemElement){
itemElement._mojoListIndex=i;
itemElement=itemElement.nextSibling;
}
}


Mojo.Widget.Util.applyListClassesToChildren(listItemsParent);

return listItemsParent;
};



Mojo.Widget.Util.findListItemNode=function findListItemNode(child,parentDiv){
return Mojo.View.findParent(Mojo.Widget.Util._listItemTester,child,parentDiv,parentDiv);
};


Mojo.Widget.Util._listItemTester=function(node,listItemsParent){
return(node._mojoListIndex!==undefined&&(node.parentNode===listItemsParent||listItemsParent===undefined));
};



Mojo.Widget.Util.findListItemIndex=function(event,parentDiv){

var node=this.findListItemNode(event.target,parentDiv);
return node&&node._mojoListIndex;
};




Mojo.Widget.Util.findChildWidgets=function findChildWidgets(element){
var widgets;
var widgetName;

if(Mojo.Environment.hasQuerySelector)
{
widgets=element.querySelectorAll('div[x-mojo-element]');
}
else
{



widgets=[];
for(widgetName in Mojo.Widget){
if(Mojo.Widget.hasOwnProperty(widgetName)){
widgets=widgets.concat($A(element.select('div[x-mojo-element='+widgetName+']')));
}
}
}

return $A(widgets);
};



Mojo.Widget.Util.dialogRefocusCb=function(event){
var focused=event.target;
var parentDialog=Mojo.View.findParent(
function(node){
return node.hasAttribute&&
node.hasAttribute("x-mojo-dialog");
},focused);
if(focused&&!parentDialog){
var blur=function(){
focused.blur();
};
blur.defer();
}
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Format={};



Mojo.Format._timezoneRequest={};



Mojo.Format.setup=function(){
if(Mojo.Host.current!==Mojo.Host.browser){
Mojo.Format._timezoneRequest=Mojo.Format._createTimezoneRequest();
}
};



Mojo.Format.formatDate=function(date,options){
var dateFormat;
var timeFormat;
var finalFormat;
var tokenized;
var result;
var formatType;

var cacheBucket='';
var cacheBucketKey='';
var cachedTokenized;
var dontCache=0;

if(typeof options==="string"){
formatType=options;
}else{
formatType=options&&options.format;
}


try{
if(!date){
return"";
}

if(options.countryCode){
dontCache++;
}else{
if(formatType){
cachedTokenized=Mojo.Format._formatCache.formatType[formatType];
}else{
if(options.date){
if(options.time){
cachedTokenized=Mojo.Format._formatCache.datetime[options.date+options.time];
}else{
cachedTokenized=Mojo.Format._formatCache.date[options.date];
}
}else if(options.time){
cachedTokenized=Mojo.Format._formatCache.time[options.time];
}
}
}

if(cachedTokenized){
return this._reconstructDate(date,cachedTokenized);
}else{
if(formatType){
switch(formatType){
case"short":
case"medium":
case"long":
case"full":
case"default":
finalFormat=this._finalDateTimeFormat(this._getDateFormat(formatType,options),
this._getTimeFormat(formatType,options),
options);
break;
default:
finalFormat=formatType;
}
cacheBucket='formatType';
cacheBucketKey=formatType;
}else{
dontCache++;
if(options.date){
dontCache--;
dateFormat=this._getDateFormat(options.date,options);
cacheBucket+='date';
cacheBucketKey+=options.date;
}
if(options.time){
dontCache--;
timeFormat=this._getTimeFormat(options.time,options);
cacheBucket+='time';
cacheBucketKey+=options.time;
}

finalFormat=this._finalDateTimeFormat(dateFormat,timeFormat,options);
}
tokenized=this._getDateTimeRegexp(finalFormat).exec(finalFormat);
if(!dontCache){
Mojo.Format._formatCache[cacheBucket][cacheBucketKey]=tokenized;
}
result=this._reconstructDate(date,tokenized);
}
return result;

}catch(e){
Mojo.Log.logException(e,"format date error");
return"";
}
};


Mojo.Format.formatRelativeDate=function(date,options){
try{
var nonRelative;
var formatType;
if(typeof options==="string"){
formatType=options;
}else{
formatType=options&&options.format;
}
var dateTimeHash=this.getDateTimeHash();
var now=new Date();
var offset=this._dayOffset(now,date);
switch(offset){
case"today":
case"tomorrow":
case"yesterday":
return dateTimeHash.relative[offset];
case"future":
case"past":
switch(formatType){
case"short":
case"medium":
case"long":
case"full":
return this.formatDate(date,{date:formatType,countryCode:options&&options.countryCode});
default:
return this.formatDate(date,{date:"default",countryCode:options&&options.countryCode});
}
break;
case"lastWeek":
switch(formatType){
case"full":
formatType="long";
return dateTimeHash[formatType].day[date.getDay()];
case"short":
case"medium":
case"long":
return dateTimeHash[formatType].day[date.getDay()];
default:
return dateTimeHash.medium.day[date.getDay()];
}
break;
}
}catch(e){
Mojo.Log.logException(e);
return this.formatDate(date,{date:"default",countryCode:options&&options.countryCode});
}
};


Mojo.Format.formatNumber=function formatNumber(number,options){
try{
var fractionDigits;
if(typeof options==="number"){
fractionDigits=options;
}else if(options){
fractionDigits=options.fractionDigits||0;
}
var formatHash=this.getFormatHash(options&&options.countryCode);
var decimal=formatHash.numberDecimal;
var tripleSpacer=formatHash.numberTripleDivider;
var rawFormat=number.toFixed(fractionDigits);
var parts=rawFormat.split(".");
var wholeNumberPart=parts[0];
var numberGroupRegex=/(\d+)(\d{3})/;
while(tripleSpacer&&numberGroupRegex.test(wholeNumberPart)){
wholeNumberPart=wholeNumberPart.replace(numberGroupRegex,'$1'+tripleSpacer+'$2');
}
parts[0]=wholeNumberPart;
return parts.join(decimal);
}catch(e){
Mojo.Log.error("formatNumber error : "+e.message);
return(number||"0")+"."+(fractionDigits||"");
}
};


Mojo.Format.formatCurrency=function(amount,options){
try{
var formatHash=this.getFormatHash(options&&options.countryCode);
return formatHash.currencyPrepend+Mojo.Format.formatNumber(amount,options)+formatHash.currencyAppend;
}catch(e){
Mojo.Log.error("formatCurrency error : "+e.message);
return(amount||"0")+"."+(options.fractionDigits||options||"");
}
};


Mojo.Format.formatPercent=function formatPercent(percent,options){
try{
var formatHash=this.getFormatHash(options&&options.countryCode);
return Math.round(percent)+(formatHash.percentageSpace?" %":"%");
}catch(e){
Mojo.Log.error("formatPercent error : "+e.message);
return Math.round(percent)+"%";
}
};


Mojo.Format.runTextIndexer=function(text){
if(window.PalmSystem&&window.PalmSystem.runTextIndexer){
return window.PalmSystem.runTextIndexer(text);
}
Mojo.Log.warn("Mojo.Model.runTextIndexer() is not implemented on this platform.");
return text;
};


Mojo.Format.isAmPmDefault=function(options){
try{
var format=this.getFormatHash(options&&options.countryCode);
return format.is12HourDefault;
}catch(e){
Mojo.Log.error("Could not determine default AM/PM setting");
return true;
}
};


Mojo.Format.using12HrTime=function(){
return PalmSystem.timeFormat==="HH12";
};



Mojo.Format.getFirstDayOfWeek=function(options){
var formatHash=this.getFormatHash(options&&options.countryCode);
return formatHash.firstDayOfWeek;
};



Mojo.Format.getCurrentTimeZone=function(){
return Mojo.Format._TZ;
};



Mojo.Format.formatChoice=function(value,choiceString,model){
try{

var choices=choiceString.split('|');
var limits=[];
var strings=[];
var defaultChoice='';
var temp;
var i;

model=model||{};




for(i=0;i<choices.length;i++){


var index=choices[i].indexOf('#');
if(index!=-1){
limits[i]=choices[i].substring(0,index);
strings[i]=choices[i].substring(index+1);
if(value==limits[i]){


temp=new Template(strings[i]);
return temp.evaluate(model);
}
if(limits[i]===''){
defaultChoice=strings[i];
}
}


}


for(i=0;i<choices.length;i++){
var lastChar=limits[i].charAt(limits[i].length-1);
var num=parseFloat(limits[i]);
if((lastChar=='<'&&value<num)||(lastChar=='>'&&value>num)){

temp=new Template(strings[i]);
return temp.evaluate(model);
}
}


temp=new Template(defaultChoice);
return temp.evaluate(model);
}catch(e){
Mojo.Log.error("formatChoice error : "+e.message);
return'';
}
};


Mojo.Format._roundToMidnight=function(date){
var numMs=date.getTime();
var rounded=new Date();
rounded.setTime(numMs);
rounded.setHours(0);
rounded.setMinutes(0);
rounded.setSeconds(0);
rounded.setMilliseconds(0);
return rounded;
};


Mojo.Format._dayOffset=function(now,date){
var diff;

date=this._roundToMidnight(date);
now=this._roundToMidnight(now);

diff=(now.getTime()-date.getTime())/864e5;

switch(diff){
case 0:
return"today";
case 1:
return"yesterday";
case-1:
return"tomorrow";
default:
if(diff<-1){
return"future";
}else if(diff<7){
return"lastWeek";
}else{
return"past";
}
}
};



Mojo.Format._reconstructDate=function(date,parsedArray){
var hr;
var dateTimeHash=this.getDateTimeHash();
var acc=[];
var dateTimeVerbosity;
var dateTimeType;
var dateTimeIdx;
var tokenized;
var tz;
for(var i=1;i<parsedArray.length;i++){
if(parsedArray[i]===undefined){
break;
}

switch(parsedArray[i])
{
case'yy':
dateTimeVerbosity='';
acc.push((date.getFullYear()+"").substring(2));
break;
case'yyyy':
dateTimeVerbosity='';
acc.push(date.getFullYear());
break;
case'MMMM':
dateTimeVerbosity='long';
dateTimeType='month';
dateTimeIdx=date.getMonth();
break;
case'MMM':
dateTimeVerbosity='medium';
dateTimeType='month';
dateTimeIdx=date.getMonth();
break;
case'MM':
dateTimeVerbosity='short';
dateTimeType='month';
dateTimeIdx=date.getMonth();
break;
case'M':
dateTimeVerbosity='single';
dateTimeType='month';
dateTimeIdx=date.getMonth();
break;
case'dd':
dateTimeVerbosity='short';
dateTimeType='date';
dateTimeIdx=date.getDate()-1;
break;
case'd':
dateTimeVerbosity='single';
dateTimeType='date';
dateTimeIdx=date.getDate()-1;
break;

case'zzz':
dateTimeVerbosity='';
tz=Mojo.Format.getCurrentTimeZone();
acc.push(tz);
break;
case'a':
dateTimeVerbosity='';
if(date.getHours()>11){
acc.push(dateTimeHash.pm);
}else{
acc.push(dateTimeHash.am);
}
break;
case'K':
dateTimeVerbosity='';
acc.push(date.getHours()%12);
break;
case'KK':
dateTimeVerbosity='';
hr=date.getHours()%12;

acc.push((hr<10)?"0"+(""+hr):hr);
break;
case'h':
dateTimeVerbosity='';
hr=(date.getHours()%12);
acc.push(hr===0?12:hr);
break;
case'hh':
dateTimeVerbosity='';
hr=(date.getHours()%12);

acc.push(hr===0?12:(hr<10?"0"+(""+hr):hr));
break;
case'H':
dateTimeVerbosity='';
acc.push(date.getHours());
break;
case'HH':
dateTimeVerbosity='';
hr=date.getHours();

acc.push(hr<10?"0"+(""+hr):hr);
break;
case'k':
dateTimeVerbosity='';
hr=(date.getHours()%12);
acc.push(hr===0?12:hr);
break;
case'kk':
dateTimeVerbosity='';
hr=(date.getHours()%12);

acc.push(hr===0?12:(hr<10?"0"+(""+hr):hr));
break;

case'EEEE':
dateTimeVerbosity='long';
dateTimeType='day';
dateTimeIdx=date.getDay();
break;
case'EEE':
dateTimeVerbosity='medium';
dateTimeType='day';
dateTimeIdx=date.getDay();
break;
case'EE':
dateTimeVerbosity='short';
dateTimeType='day';
dateTimeIdx=date.getDay();
break;
case'mm':
case'm':

dateTimeVerbosity='';
var mins=date.getMinutes();
acc.push(mins<10?"0"+(""+mins):mins);
break;
case'ss':
case's':

dateTimeVerbosity='';
var secs=date.getSeconds();
acc.push(secs<10?"0"+(""+secs):secs);
break;
default:
tokenized=/'([A-Za-z]+)'/.exec(parsedArray[i]);
dateTimeVerbosity='';
if(tokenized){
acc.push(tokenized[1]);
}else{
acc.push(parsedArray[i]);
}
}

if(dateTimeVerbosity){
acc.push(dateTimeHash[dateTimeVerbosity][dateTimeType][dateTimeIdx]);
}

}

return acc.join("");


};




Mojo.Format.defaultDateTimeFormat="DATE TIME";





Mojo.Format._finalDateTimeFormat=function(dateFormat,timeFormat,options){
var i;
var acc=[];
var tokenized;
var escapedText;
var result;
var formatHash=this.getFormatHash(options&&options.countryCode);
var dateTimeFormat=formatHash.dateTimeFormat||Mojo.Format.defaultDateTimeFormat;

if(dateFormat&&timeFormat){
tokenized=this._getDateTimeRegexp(dateTimeFormat,true).exec(dateTimeFormat)||[];
for(i=1;i<tokenized.length&&tokenized[i]!==undefined;i++){
switch(tokenized[i]){
case"TIME":
acc.push(timeFormat);
break;
case"DATE":
acc.push(dateFormat);
break;
default:
escapedText=/'([A-Za-z]+)'/.exec(tokenized[i]);
if(escapedText){
acc.push(escapedText[1]);
}else{
acc.push(tokenized[i]);
}
}
}
return acc.join("");
}else{
return timeFormat||dateFormat||"M/d/yy h:mm a";
}
};




Mojo.Format.dateParserChunk="('[A-Za-z]+'|y{2,4}|M{1,4}|d{1,2}|z{1,3}|a|h{1,2}|H{1,2}|k{1,2}|K{1,2}|EEEE|EEE|EE|m{1,2}|s{1,2}|[^A-Za-z]+)?";

Mojo.Format.comboParserChunk="(DATE|TIME|[^A-Za-z]+|'[A-Za-z]+')?";


Mojo.Format._getDateTimeRegexp=function(format,combo){
var acc=["^"];
var regexFragment=(combo?Mojo.Format.comboParserChunk:Mojo.Format.dateParserChunk);
for(var i=0;i<format.length;i++){
acc.push(regexFragment);
}
acc.push("$");
return new RegExp(acc.join(""));
};





Mojo.Format._formatFetch=function(dateLen,type,options){
var formatHash=Mojo.Format.getFormatHash(options&&options.countryCode);
switch(dateLen)
{
case'short':
case'medium':
case'long':
case'full':
case'default':
return formatHash[dateLen+type];
default:

return dateLen;
}
};


Mojo.Format._getDateFormat=function(dateLen,options){
return this._formatFetch(dateLen,"Date",options);
};


Mojo.Format._getTimeFormat=function(dateLen,options){
return this._formatFetch(dateLen,this.using12HrTime()?"Time12":"Time24",options);
};



Mojo.Format.getDateTimeHash=function(){
return Mojo.Locale.DateTimeStrings||{};
};


Mojo.Format.getFormatHash=function(countryCode){
if(!countryCode||countryCode===Mojo.Locale.formatRegion){
return Mojo.Locale.formats||{};
}
if(Mojo.Format._formatsByCountry===undefined){
Mojo.Format._formatsByCountry={};
}
var formatHash;
formatHash=Mojo.Format._formatsByCountry[countryCode];
if(!formatHash){
formatHash=Mojo.Locale.readFormatsTable(countryCode);
Mojo.Format._formatsByCountry[countryCode]=formatHash;
}
return formatHash||{};
};





Mojo.Format._timezoneCallback=function(response){
if(!response.TZ){
return;
}
this._setCurrentTimeZone(response.TZ);
};


Mojo.Format._TZ='';
Mojo.Format._createTimezoneRequest=function(){
var request=new Mojo.Service.Request('palm://com.palm.systemservice/time',{
method:'getSystemTime',
parameters:{
subscribe:true
},
onSuccess:Mojo.Format._timezoneCallback.bind(Mojo.Format)
});
return request;
};


Mojo.Format._setCurrentTimeZone=function(timeZone){
Mojo.Format._TZ=timeZone;
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.Format._PhoneNumberFormatter=Class.create({
initialize:function(number){
this.originalNumber=number;
this.inputNumber=number.replace(/[^\d\+A-Za-z#\*]/g,'');
this.number="";
this.prefix="";
this.international=false;
this.longDistance=false;
this.currentState=this.startState;
},

format:function(){
var count=this.inputNumber.length;
var r=new RegExp(



"(^[1-9A-Za-z][\\dA-Za-z]{6}$)|"+

"(^[1-9A-Za-z][\\dA-Za-z]{9}$)|"+

"(^1[\\dA-Za-z]{10}$)|"+

"(^\\+1[\\dA-Za-z]{10}$)");
if(r.test(this.inputNumber)){
for(var i=0;i<count;++i){
var c=this.inputNumber.charAt(i);
if(c=='0'){
this.currentState=this.currentState.handleZero(this);
}else if(c=='1'){
this.currentState=this.currentState.handleOne(this);
}else{
this.currentState=this.currentState.handleOther(this,c);
}
}
this.currentState.handleEnd(this);
this.extractParts();
return this.formatParts();
}



return this.originalNumber;
},

appendToNumber:function(value){
this.number+=value;
},

extractParts:function(){
if(!this.international){
if(this.longDistance||this.number.length>7){
this.areaCode=this.number.slice(0,3);
this.exchange=this.number.slice(3,6);
this.numberPart=this.number.slice(6,10);
}else{
this.areaCode="";
this.exchange=this.number.slice(0,3);
this.numberPart=this.number.slice(3,7);
}
}
},


appendWithDelimeters:function(b,value,preDelim,postDelim){
if(value&&value.length>0){
if(preDelim&&(b.length>0||!preDelim==" ")){
b=b+preDelim;
}
b=b+value;
if(postDelim){
b=b+postDelim;
}
}
return b;
},

formatParts:function(){
var b="";
if(this.international){
if(this.prefix=="+"){
b=this.appendWithDelimeters(b,this.prefix,null,null);
b=this.appendWithDelimeters(b,this.number,null,null);
}else{
b=this.appendWithDelimeters(b,this.prefix,null,null);
b=this.appendWithDelimeters(b,this.number," ",null);
}
}else{
if(this.number.length>10){
b=b+this.prefix+this.number;
}else{
if(this.longDistance){
b=this.appendWithDelimeters(b,this.prefix,null,null);
b=this.appendWithDelimeters(b,this.areaCode," (",") ");
}else{
b=this.appendWithDelimeters(b,this.areaCode," (",") ");
}
b=this.appendWithDelimeters(b,this.exchange,null,null);
b=this.appendWithDelimeters(b,this.numberPart,"-",null);
}
}
return b;
}

});


(function(){

var AbstractState=Class.create({
handleZero:function(formatter){
return this.handleOther(formatter,"0");
},

handleOne:function(formatter){
return this.handleOther(formatter,"1");
},

handleOther:function(formatter,character){
formatter.appendToNumber(character);
return this;
},

handleEnd:function(formatter){
return formatter.endState;
}
});

var StartState=Class.create(AbstractState,{
handleZero:function(formatter){
formatter.appendToNumber("0");
return formatter.zeroState;
},

handleOne:function(formatter){
formatter.longDistance=true;
formatter.prefix="1";
return formatter.collectNumberState;
},

handleOther:function(formatter,character){
if(character=='+'){
return formatter.plusState;
}
formatter.appendToNumber(character);
return formatter.collectNumberState;
}
});

var EndState=Class.create(AbstractState,{
handleOther:function(formatter,character){
return this;
},

handleEnd:function(formatter,character){
return this;
}
});

var ZeroState=Class.create(AbstractState,{
handleOne:function(formatter){
formatter.appendToNumber("1");
return formatter.zeroOneState;
},

handleOther:function(formatter,character){


formatter.appendToNumber(character);
return formatter.collectNumberState;
}
});

var ZeroOneState=Class.create(AbstractState,{
handleEnd:function(formatter){


return formatter.endState;
},

handleOne:function(formatter){
formatter.appendToNumber("1");

formatter.international=true;
return formatter.collectNumberState;
},

handleZero:function(formatter){
formatter.appendToNumber("0");
return formatter.collectNumberState;
},

handleOther:function(formatter,character){


formatter.appendToNumber(character);
return formatter.collectNumberState;
}
});

var PlusState=Class.create(AbstractState,{
handleEnd:function(formatter){
formatter.appendToNumber("+");
return formatter.endState;
},

handleOne:function(formatter){
formatter.longDistance=true;
formatter.prefix="+1";
return formatter.collectNumberState;
},

handleOther:function(formatter,character){
formatter.international=true;
formatter.prefix="+";
formatter.appendToNumber(character);
return formatter.collectNumberState;
}
});

var CollectNumberState=Class.create(AbstractState,{
handleOther:function(formatter,character){
formatter.appendToNumber(character);
return this;
}
});

Mojo.Format._PhoneNumberFormatter.prototype.collectNumberState=new CollectNumberState();
Mojo.Format._PhoneNumberFormatter.prototype.endState=new EndState();
Mojo.Format._PhoneNumberFormatter.prototype.startState=new StartState();
Mojo.Format._PhoneNumberFormatter.prototype.plusState=new PlusState();
Mojo.Format._PhoneNumberFormatter.prototype.zeroState=new ZeroState();
Mojo.Format._PhoneNumberFormatter.prototype.zeroOneState=new ZeroOneState();

})();




Mojo.Format.formatPhoneNumber=function(number){
var digits;



var region=Mojo.Locale.getCurrentFormatRegion().toLocaleLowerCase().slice(-2);
switch(region){
case'ca':
case'us':
break;
default:
return number;
}

if(number.length===0||typeof number!=="string"){

return"";
}
digits='0123456789';




if((digits.include(number.charAt(0))&&number.length>=7)||
(number.charAt(0)==='+'&&number.charAt(1)==='1'&&number.length===12)){
return new Mojo.Format._PhoneNumberFormatter(number).format();
}
return number;
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Event={};




Mojo.Event.make=function(name,details,optionalDocument,optionalBubbles,optionalCancel){


var bubbles=(optionalBubbles!==undefined)?optionalBubbles:true;
var cancel=(optionalCancel!==undefined)?optionalCancel:true;

var targetDocument=optionalDocument||document;
var newEvent=targetDocument.createEvent("HTMLEvents");
newEvent.initEvent(name,bubbles,cancel);
Object.extend(newEvent,details);


var oldPreventDefault=newEvent.preventDefault;


newEvent.preventDefault=function(){oldPreventDefault.call(this);this.defaultPrevented=true;};




var oldStopProp=newEvent.stopPropagation;

newEvent.stopPropagation=function(){
oldStopProp.call(this);
this._mojoPropagationStopped=true;
};

return newEvent;
};

Mojo.Event._logEvent=function _logEvent(prefix,event,targetElement,mojoDetails){
if(Mojo.Event.logEvents){
var detailsString="";
if(mojoDetails){
detailsString="and details "+Mojo.Log.propertiesAsString(mojoDetails);
}
Mojo.Log.info("%s event '%s' targeting element '%s#%s' %s",prefix,
event.type,targetElement.tagName,targetElement.id||"<no id>",detailsString);
}
};


Mojo.Event.send=function(element,name,mojoDetails,optionalBubbles,optionalCancel){
var newEvent=Mojo.Event.make(name,mojoDetails,element.ownerDocument,optionalBubbles,optionalCancel);
if(element){
this._logEvent("sending",newEvent,element,mojoDetails);
element.dispatchEvent(newEvent);
}
return newEvent;
};


Mojo.Event.sendPropertyChangeEvent=function(element,model,property,value,oldValue,originalEvent){
Mojo.Event.send(element,Mojo.Event.propertyChange,{model:model,
property:property,
value:value,
oldValue:oldValue,
originalEvent:originalEvent});
};


Mojo.Event.sendKeyEvent=function sendKeyEvent(keyDescription,optionalEventType,optionalDocument){
var targetDocument=optionalDocument||document;
var eventType=optionalEventType||'keydown';
var e=targetDocument.createEvent("KeyboardEvent");
e.initKeyboardEvent(eventType,true,true,window,keyDescription,0,false,false,false,false);
targetDocument.dispatchEvent(e);
};


Mojo.Event.sendKeyDownAndUpEvents=function sendKeyEvent(keyDescription,optionalDocument){
Mojo.Event.sendKeyEvent(keyDescription,'keydown',optionalDocument);
Mojo.Event.sendKeyEvent.defer(keyDescription,'keyup',optionalDocument);
};



Mojo.Event.listenForHoldEvent=function(node,downEvent,upEvent,handler,timeout){
return new Mojo.Event._HoldEventListener(node,downEvent,upEvent,handler,timeout);
};



Mojo.Event.listenForFocusChanges=function listenForFocusChanges(node,handler){
return new Mojo.Event._FocusListener(node,handler);
};



Mojo.Event.listen=function listen(target,type,handlerFunction,useCapture){
Mojo.requireDefined(target,"Mojo.Event.listen: 'target' parameter must be defined.");
Mojo.requireString(type,"Mojo.Event.listen: 'type' parameter must be a string.");
Mojo.requireFunction(handlerFunction,"Mojo.Event.listen: 'handlerFunction' parameter must be a function.");
target.addEventListener(type,handlerFunction,!!useCapture);
};

Mojo.listen=Mojo.Event.listen;


Mojo.Event.stopListening=function stopListening(target,type,handlerFunction,useCapture){
Mojo.requireDefined(target,"Mojo.Event.stopListening: 'target' parameter must be defined.");
Mojo.requireString(type,"Mojo.Event.stopListening: 'type' parameter must be a string.");
Mojo.requireFunction(handlerFunction,"Mojo.Event.stopListening: 'handlerFunction' parameter must be a function.");
target.removeEventListener(type,handlerFunction,!!useCapture);
};

Mojo.stopListening=Mojo.Event.stopListening;



Mojo.Event.sliderDragStart='mojo-slider-dragstart';


Mojo.Event.sliderDragEnd='mojo-slider-dragend';



Mojo.Event.scrolled='mojo-scrolled';


Mojo.Event.scrollStarting='mojo-scroll-starting';


Mojo.Event.hold='mojo-hold';


Mojo.Event.holdEnd='mojo-hold-end';


Mojo.Event.tap='mojo-tap';


Mojo.Event.singleTap='mojo-single-tap';




Mojo.Event.keyup='mojo-keyup';


Mojo.Event.keydown='mojo-keydown';


Mojo.Event.keypress='mojo-keypress';


Mojo.Event.back='mojo-back';


Mojo.Event.forward='mojo-forward';


Mojo.Event.up='mojo-up';


Mojo.Event.down='mojo-down';


Mojo.Event.command='mojo-command';


Mojo.Event.commandEnable='mojo-command-enable';


Mojo.Event.dragStart='mojo-drag-start';


Mojo.Event.dragging='mojo-dragging';


Mojo.Event.dragEnd='mojo-drag-end';


Mojo.Event.listChange='mojo-list-change';


Mojo.Event.listTap='mojo-list-tap';


Mojo.Event.listAdd='mojo-list-add';


Mojo.Event.listDelete='mojo-list-delete';


Mojo.Event.listReorder='mojo-list-reorder';


Mojo.Event.propertyChange='mojo-property-change';


Mojo.Event.revealBottom='mojo-reveal-bottom';



Mojo.Event.aboutToActivate='mojo-about-to-activate';



Mojo.Event.activate='mojo-event-activate';


Mojo.Event.stageDeactivate='mojo-stage-deactivate';



Mojo.Event.stageActivate='mojo-stage-activate';


Mojo.Event.deactivate='mojo-event-deactivate';




Mojo.Event.subtreeHidden='mojo-subtree-hidden';


Mojo.Event.subtreeShown='mojo-subtree-shown';


Mojo.Event.commitChanges='mojo-commit-changes';


Mojo.Event.flick='mojo-flick';


Mojo.Event.filter='mojo-filterfield-filter';


Mojo.Event.filterImmediate='mojo-filterfield-filterimmediate';


Mojo.Event.bigListSelected='mojo-bigfilterlist-selected';


Mojo.Event.peoplePickerSelected='mojo-peoplepicker-selected';


Mojo.Event.comboBoxSearch='mojo-combobox-search';


Mojo.Event.comboBoxSelected='mojo-combobox-selected';


Mojo.Event.comboBoxEntered='mojo-combobox-entered';


Mojo.Event.webViewLoadProgress='mojo-webview-load-progress';


Mojo.Event.webViewLoadStarted='mojo-webview-load-started';


Mojo.Event.webViewLoadStopped='mojo-webview-load-stopped';


Mojo.Event.webViewLoadFailed='mojo-webview-load-failed';


Mojo.Event.webViewPluginSpotlightStart='mojo-webview-plugin-spotlight-start';


Mojo.Event.webViewPluginSpotlightEnd='mojo-webview-plugin-spotlight-end';


Mojo.Event.webViewUrlRedirect='mojo-webview-url-redirect';


Mojo.Event.webViewServerConnect='mojo-webview-server-connect';


Mojo.Event.webViewServerDisconnect='mojo-webview-server-disconnect';


Mojo.Event.webViewSetMainDocumentError='mojo-webview-main-doc-error';


Mojo.Event.webViewDidFinishDocumentLoad='mojo-webview-did-finish-doc-load';


Mojo.Event.webViewDownloadFinished='mojo-webview-download-finished';


Mojo.Event.webViewUpdateHistory='mojo-webview-update-history';



Mojo.Event.webViewTitleUrlChanged='mojo-webview-title-url-changed';


Mojo.Event.webViewTitleChanged='mojo-webview-title-changed';


Mojo.Event.webViewUrlChanged='mojo-webview-url-changed';


Mojo.Event.webViewLinkClicked='mojo-webview-link-clicked';


Mojo.Event.webViewActionData='mojo-webview-action-data';


Mojo.Event.webViewPageSubmission='mojo-webview-page-submission';


Mojo.Event.webViewCreatePage='mojo-webview-create-page';


Mojo.Event.webViewTapRejected='mojo-webview-tap-rejected';


Mojo.Event.webViewScrollAndScaleChanged='mojo-webview-scroll-scale-changed';


Mojo.Event.webViewEditorFocused='mojo-webview-editor-focused';




Mojo.Event.webViewMimeNotSupported='mojo-webview-mime-not-supported';


Mojo.Event.webViewMimeHandoff='mojo-webview-mime-handoff';


Mojo.Event.webViewModifierTap='mojo-webview-modifier-tap';


Mojo.Event.webViewImageSaved='mojo-webview-image-saved';


Mojo.Event.imageViewChanged='mojo-imageview-changed';




Mojo.Event.propertyChanged='mojo-property-change';


Mojo.Event.cancel='mojo-progress-cancelled';


Mojo.Event.progressComplete='mojo-progress-complete';


Mojo.Event.progressIconTap="mojo-progress-icontapped";



Mojo.Event.renderAltCharacters='mojo-altchars';


Mojo.Event.renderChordedAltCharacters='mojo-altchars-chorded';


Mojo.Event.orientationChange='mojo-orientation';


Mojo.Event.orientation='mojo-orientation';





Mojo.Event.addressingRecipientAdded='mojo-addressingwidget-added';

Mojo.Event.addressingRecipientDeleted='mojo-addressingwidget-deleted';


Mojo.Event._addressingWidgetBlur='mojo-addressingwidget-blur';




Mojo.Event._HoldEventListener=function(node,downEventName,upEventName,handler,timeout){
this._node=node;
this._downEventName=downEventName;
this._upEventName=upEventName;
this._handler=handler;

timeout=timeout||1;
this._timeout=Math.round(timeout*1000);


this._handleDown=this._handleDown.bindAsEventListener(this);
this._handleUp=this._handleUp.bindAsEventListener(this);
this._handleTimeout=this._handleTimeout.bind(this);


Mojo.Event.listen(node,downEventName,this._handleDown);
Mojo.Event.listen(node,upEventName,this._handleUp);
};


Mojo.Event._HoldEventListener.prototype._handleDown=function(event){

if(this._timeoutID===undefined){
this._timeoutID=window.setTimeout(this._handleTimeout,this._timeout);
this._savedDownEvent=event;
}

};

Mojo.Event._HoldEventListener.prototype._handleUp=function(event){

if(this._timeoutID!==undefined){
window.clearTimeout(this._timeoutID);
delete this._timeoutID;
}
};

Mojo.Event._HoldEventListener.prototype._handleTimeout=function(){

if(this._handler(this._savedDownEvent)===true){
this.stopListening();
}
};


Mojo.Event._HoldEventListener.prototype.stopListening=function(){

this._handleUp();
Mojo.Event.stopListening(this._node,this._downEventName,this._handleDown);
Mojo.Event.stopListening(this._node,this._upEventName,this._handleUp);
};


Mojo.Event._FocusListener=function _FocusListener(node,handler){
this._currentlyFocusedElement=null;
this._node=node;
this._handler=handler;
this._focusHandler=this.focusChanged.bindAsEventListener(this);
Mojo.Event.listen(node,'DOMFocusIn',this._focusHandler);
Mojo.Event.listen(node,'DOMFocusOut',this._focusHandler);
};


Mojo.Event._FocusListener.prototype.stopListening=function stopListening(){
Mojo.Event.stopListening(this._node,'DOMFocusIn',this._focusHandler);
Mojo.Event.stopListening(this._node,'DOMFocusOut',this._focusHandler);
};


Mojo.Event._FocusListener.prototype.focusChanged=function focusChanged(focusEvent){
var targetElement=null;
if(focusEvent.type==='DOMFocusIn'){
targetElement=focusEvent.target;
}
this._currentlyFocusedElement=targetElement;
this._handler(targetElement);
};




/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */







Mojo.evalText=function(textToEval){
return eval(textToEval);
};/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo._assertLog=function(message,warnOrError){
warnOrError=warnOrError||"warn";
Mojo.Log[warnOrError](message);
};






Mojo._assertInternal=function(logLevel,expression,message,messageProperties){
if(!expression){
if(messageProperties){
var template=new Template(message);
message=template.evaluate(messageProperties);
}else if(!message){
message="assertion failed";
}
Mojo._assertLog(message,logLevel);
return message;
}
return"";
};

Mojo._assert=function(expression,message,messageProperties){
return Mojo._assertInternal(arguments.callee.__logLevel,expression,message,messageProperties);
};




Mojo._assertFalse=function(value,message,messageProperties){
return Mojo._assertInternal(arguments.callee.__logLevel,!value,message,messageProperties);
};





Mojo._assertEqual=function(expected,actual,message,messageProperties){
if(!message){
message="'#{expected}' was expected, but it was '#{actual}' instead.";
messageProperties={actual:actual,expected:expected};
}
return Mojo._assertInternal(arguments.callee.__logLevel,expected===actual,message,messageProperties);
};





Mojo._assertMatch=function(regex,testValue,message,messageProperties){
if(!message){
message="'#{regex}' was expected to match #{testValue}, but didn't";
messageProperties={regex:regex,testValue:testValue};
}
return Mojo._assertInternal(arguments.callee.__logLevel,testValue.match(regex),message,messageProperties);
};





Mojo._assertDefined=function(value,message,messageProperties){
if(!message){
message="value was expected to be defined, but wasn't";
}
return Mojo._assertInternal(arguments.callee.__logLevel,value,message,messageProperties);
};

Mojo._assertImpl=function(logLevel,expected,testFunction,defaultMessage,message,messageProperties){
if(!message){
message=defaultMessage;
messageProperties={target:Object.inspect(expected),actualType:typeof expected};
}
return Mojo._assertInternal(logLevel,testFunction(expected),message,messageProperties);
};




Mojo._assertString=function(expectedString,message,messageProperties){
return Mojo._assertImpl(arguments.callee.__logLevel,expectedString,Object.isString,
"string was expected, but instead got '#{target}' of type '#{actualType}'",
message,messageProperties);
};




Mojo._assertArray=function(expectedArray,message,messageProperties){
return Mojo._assertImpl(arguments.callee.__logLevel,expectedArray,Object.isArray,
"array was expected, but instead got '#{target}' of type '#{actualType}'",
message,messageProperties);
};




Mojo._assertElement=function(expectedElement,message,messageProperties){
return Mojo._assertImpl(arguments.callee.__logLevel,expectedElement,Object.isElement,
"element was expected, but instead got '#{target}' of type '#{actualType}'",
message,messageProperties);
};




Mojo._assertFunction=function(expectedFunction,message,messageProperties){
return Mojo._assertImpl(arguments.callee.__logLevel,expectedFunction,Object.isFunction,
"function was expected, but instead got '#{target}' of type '#{actualType}'",
message,messageProperties);
};




Mojo._assertNumber=function(expectedNumber,message,messageProperties){
return Mojo._assertImpl(arguments.callee.__logLevel,expectedNumber,Object.isNumber,
"number was expected, but instead got '#{target}' of type '#{actualType}'",
message,messageProperties);
};




Mojo._assertProperty=function(targetObject,properties,message,messageProperties){
if(!Object.isArray(properties)){
properties=$A([properties]);
}
var missingProperties=[];
properties.each(function(p){
if(targetObject[p]===undefined){
missingProperties.push("'"+p+"'");
}
});

if(missingProperties.length>0){
if(!message){
message='object #{object} was missing expected properties #{properties}';
messageProperties={object:Object.inspect(targetObject),properties:missingProperties};
}
return Mojo._assertInternal(arguments.callee.__logLevel,false,message,messageProperties);
}
return"";
};

Mojo._assertProperties=Mojo._assertProperty;




Mojo._assertClass=function(object,constructorFunction,message,messageProperties){
if(!(object.constructor===constructorFunction)){
if(!message){
message='object #{object} was expected to have constructor #{constructorFunction}, but had constructor #{actualConstructor}.';
messageProperties={object:Object.inspect(object),constructorFunction:constructorFunction,actualConstructor:object.constructor};
}
return Mojo._assertInternal(arguments.callee.__logLevel,false,message,messageProperties);
}
return"";
};



["Number","Function","String","Array","","False","Equal","Defined","Match","Property","Properties","Class","Element"].each(function(assertPartialName){
var requireName="require"+assertPartialName;
var assertName="assert"+assertPartialName;
var privateName="_assert"+assertPartialName;
var requireFunc,assertFunc;

requireFunc=function(){
var result;

result=Mojo[privateName].apply(null,arguments);
if(result){
throw new Error(requireName+" Failed: "+result);
}
};
requireFunc.__logLevel="error";
Mojo[requireName]=requireFunc;

assertFunc=function(){
var result;
result=Mojo[privateName].apply(null,arguments);
return result;
};
assertFunc.__logLevel="warn";
Mojo[assertName]=assertFunc;
});


/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Gesture={};

Mojo.Gesture.index=0;
Mojo.Gesture.PASS_EVENT_ATTRIBUTE='x-palm-pass-event';


Mojo.Gesture.gestureAttribute='x-mojo-gesture';

Mojo.Gesture.selectionHighlightAttribute='x-mojo-tap-highlight';

Mojo.Gesture.selectionHighlightFeedbackAttribute='x-mojo-touch-feedback';

Mojo.Gesture.consumesEnterAttribute='x-mojo-consumes-enter';

Mojo.Gesture.momentarySelection='momentary';

Mojo.Gesture.immediateSelection='immediate';

Mojo.Gesture.persistentSelection='persistent';

Mojo.Gesture.immediateFeedback='immediate';

Mojo.Gesture.spontaneousFeedback='spontaneous';

Mojo.Gesture.delayedFeedback='delayed';

Mojo.Gesture.immediatePersistentFeedback='immediatePersistent';

Mojo.Gesture.delayedPersistentFeedback='delayedPersistent';

Mojo.Gesture.delimiter=/ +/;

Mojo.Gesture._newSelectionFeedback='new';

Mojo.Gesture._oldSelectionFeedback='deprecated';

Mojo.Gesture.delimeter=/ +/;

Mojo.Gesture.CONSUMED_EVENT='consume';

Mojo.Gesture.ALLOW_EVENT='allow';

Mojo.Gesture.IGNORED_EVENT=false;


Mojo.Gesture.gestureTypeFlick='flick';

Mojo.Gesture.gestureTypeForward='forward';

Mojo.Gesture.gestureTypeUp='up';

Mojo.Gesture.gestureTypeDown='down';



Mojo.Gesture.setup=function(targetDocument){
targetDocument.addEventListener("mousedown",Mojo.Gesture.mouseDownHandler,false);
targetDocument.addEventListener("mousemove",Mojo.Gesture.mouseMoveHandler,false);
targetDocument.addEventListener("mouseup",Mojo.Gesture.mouseUpHandler,false);
if(Mojo.Gesture.translateReturnKey){
targetDocument.addEventListener("keydown",Mojo.Gesture.keydownHandler,true);
targetDocument.addEventListener("keyup",Mojo.Gesture.keyupHandler,true);
}
};


Mojo.Gesture.cleanup=function(targetDocument){
var currentGesture;
targetDocument.removeEventListener("mousedown",Mojo.Gesture.mouseDownHandler,false);
targetDocument.removeEventListener("mousemove",Mojo.Gesture.mouseMoveHandler,false);
targetDocument.removeEventListener("mouseup",Mojo.Gesture.mouseUpHandler,false);
if(Mojo.Gesture.translateReturnKey){
targetDocument.removeEventListener("keydown",Mojo.Gesture.keydownHandler,true);
targetDocument.removeEventListener("keyup",Mojo.Gesture.keyupHandler,true);
}
currentGesture=Mojo.Gesture.gestureForWindow(targetDocument.defaultView);
if(currentGesture){
Mojo.Gesture.saveGesture(targetDocument.defaultView,undefined);
currentGesture.finish();
}
};


Mojo.Gesture.windowForEvent=function windowForEvent(uiEvent){
var targetWindow;
if(!uiEvent){
return;
}
targetWindow=uiEvent.view;
if(!targetWindow.Mojo){
targetWindow=undefined;
}
return targetWindow;
};


Mojo.Gesture.gestureForWindow=function gestureForWindow(targetWindow){
var gesture;
if(targetWindow){
gesture=targetWindow.Mojo._mojoCurrentGesture;
}
return gesture;
};


Mojo.Gesture.gestureForEvent=function gestureForEvent(uiEvent){
return Mojo.Gesture.gestureForWindow(Mojo.Gesture.windowForEvent(uiEvent));
};


Mojo.Gesture.saveGesture=function saveGesture(targetWindow,gesture){
if(targetWindow){
targetWindow.Mojo._mojoCurrentGesture=gesture;
}
};


Mojo.Gesture.mouseDownHandler=function(event){
Mojo.Event._logEvent("got",event,event&&event.target);
var currentGesture=Mojo.Gesture.gestureForEvent(event);
if(event&&!Mojo.Gesture.disableEventHandling&&!currentGesture&&event.button===0){
currentGesture=new Mojo.Gesture.Recognizer(event);
Mojo.Gesture.saveGesture(Mojo.Gesture.windowForEvent(event),currentGesture);
}
};


Mojo.Gesture.mouseMoveHandler=function(event){
var currentGesture=Mojo.Gesture.gestureForEvent(event);
if(event&&!Mojo.Gesture.disableEventHandling&&currentGesture&&event.button===0){
Mojo.Event._logEvent("got",event,event.target);
currentGesture.mouseMove(event);
}
};


Mojo.Gesture.mouseUpHandler=function(event){
Mojo.Event._logEvent("got",event,event&&event.target);
var currentGesture=Mojo.Gesture.gestureForEvent(event);
if(event&&!Mojo.Gesture.disableEventHandling&&currentGesture&&event.button===0){
currentGesture.mouseUp(event);
Mojo.Gesture.saveGesture(event.view,undefined);
}
};


Mojo.Gesture.keydownHandler=function(event){
if(event&&(event.keyCode===Mojo.Char.enter)){
var selection=document.querySelector(':focus');
if(!Mojo.Gesture.handlesReturnKey(selection)){
Event.stop(event);
}
}
};


Mojo.Gesture.keyupHandler=function(event){
if(event&&(event.keyCode===Mojo.Char.enter)){
var selection=document.querySelector(':focus');
if(!Mojo.Gesture.handlesReturnKey(selection)){
Event.stop(event);
Mojo.Event.sendKeyDownAndUpEvents("U+0009");
}
}
};


Mojo.Gesture.restoreEventHandling=function(){
Mojo.Gesture.disableEventHandling=false;
};


Mojo.Gesture.withMouseEventHandlingDisabled=function(thingToDo){
var wasDisabled=Mojo.Gesture.disableEventHandling;
if(wasDisabled){
thingToDo();
return;
}
try{
Mojo.Gesture.disableEventHandling=true;
thingToDo();
}catch(e){
Mojo.Gesture.disableEventHandling=wasDisabled;
throw(e);
}
Mojo.Gesture.restoreEventHandling.defer();
};


Mojo.Gesture.preventNextTap=function(){
Mojo.Gesture.doPreventNextTap=true;
};


Mojo.Gesture.recordEvents=function(record){
Mojo.Gesture.doRecordEvents=record;
if(record){
Mojo.Gesture.eventList=[];
}else{
delete Mojo.Gesture.eventList;
}
};


Mojo.Gesture.calculateDistance=function(pt1,pt2){
return{x:pt1.x-pt2.x,y:pt1.y-pt2.y};
};


Mojo.Gesture.calculateAbsDistance=function(pt1,pt2){
return{x:Math.abs(pt1.x-pt2.x),y:Math.abs(pt1.y-pt2.y)};
};


Mojo.Gesture.dragDirection=function(originalPt,currentPt){
var deltaX=Math.abs(currentPt.x-originalPt.x);
var deltaY=Math.abs(currentPt.y-originalPt.y);
return{horizontal:(deltaX>0),vertical:(deltaY>0)};
};

Mojo.Gesture.shouldStopEventOnElement=function(element){
var nativeEvent=element.getAttribute(Mojo.Gesture.PASS_EVENT_ATTRIBUTE);
return nativeEvent===null;
};

Mojo.Gesture.simulateClick=function simulateClick(element,screenX,screenY){
if(!PalmSystem.simulated){
var targetWindow=element.ownerDocument.defaultView;
Mojo.Gesture.withMouseEventHandlingDisabled(function(){
targetWindow.PalmSystem.simulateMouseClick(screenX,screenY,true);
targetWindow.PalmSystem.simulateMouseClick(screenX,screenY,false);
});
}
};

Mojo.Gesture.handlesReturnKey=function handlesReturnKey(node){
if(node===undefined||node===null){
return false;
}

if(node.hasAttribute(Mojo.Gesture.consumesEnterAttribute)){
return true;
}

if(node.tagName!=="TEXTAREA"){
return node.getStyle("-webkit-user-modify")==="read-write";
}

return true;
};


Mojo.Gesture.Recognizer=Class.create({

initialize:function(event){
var tagName,downHighlightTarget,downHighlightMode,applySelectHighlightTimerHandler;
this.downTarget=event.target;
this.document=event.target&&event.target.ownerDocument;
this.downShift=event.shiftKey;
this.userModify=PalmSystem.simulated&&(this.downTarget.getStyle("-webkit-user-modify")=="read-write");
if(this.userModify){
return;
}
if(Mojo.Gesture.doRecordEvents){
Mojo.Gesture.eventList=[event];
}
this.originalPointer=Event.pointer(event);
this.lastPointer=this.originalPointer;
this.filter={x:true,y:true};
this.index=Mojo.Gesture.index;
Mojo.Gesture.index+=1;
this.holdTimer=this.mouseHeld.bind(this).delay(this.kHoldTime);
this.downEvent=Object.extend({},event);
this.velocityHistory=[];
this.velocity={x:0,y:0};
this.simulateFlick=PalmSystem.simulated;
tagName=this.downTarget.tagName;
this.preventTap=Mojo.Gesture.doPreventNextTap;
Mojo.Gesture.doPreventNextTap=false;
if(!PalmSystem.simulated){
this.maybeStopEvent(event);
}else if(tagName!=="INPUT"&&tagName!=="TEXTAREA"&&tagName!=="OBJECT"){
this.maybeStopEvent(event);
}

downHighlightTarget=Mojo.View.findParentByAttribute(this.downTarget,this.document,Mojo.Gesture.selectionHighlightFeedbackAttribute);
if(downHighlightTarget){
this.downHighlightVersion=Mojo.Gesture._newSelectionFeedback;
downHighlightMode=downHighlightTarget.getAttribute(Mojo.Gesture.selectionHighlightFeedbackAttribute);
this.downHightlightMode=downHighlightMode;
if(downHighlightMode===Mojo.Gesture.immediateFeedback||downHighlightMode===Mojo.Gesture.spontaneousFeedback||downHighlightMode===Mojo.Gesture.immediatePersistentFeedback){
this.applySelectHighlight(downHighlightTarget);
}
applySelectHighlightTimerHandler=this.applySelectHighlightFromTimer.bind(this);
this.selectTimer=applySelectHighlightTimerHandler.delay(this.kSelectTime);
this.clearSelected=this.clearSelected.bind(this);
}else{
downHighlightTarget=Mojo.View.findParentByAttribute(this.downTarget,this.document,Mojo.Gesture.selectionHighlightAttribute);
if(downHighlightTarget){
this.downHighlightVersion=Mojo.Gesture._oldSelectionFeedback;
downHighlightMode=downHighlightTarget.getAttribute(Mojo.Gesture.selectionHighlightAttribute);
if(downHighlightMode===Mojo.Gesture.immediateSelection){
this.applySelectHighlight(downHighlightTarget);
}
}
applySelectHighlightTimerHandler=this.applySelectHighlightFromTimer.bind(this);
this.selectTimer=applySelectHighlightTimerHandler.delay(this.kSelectTime);
this.clearSelected=this.clearSelected.bind(this);
}

},



setDownTarget:function(node){
this.downTarget=node;
},


kFilterDistance:12,

kHoldTime:0.5,

kSelectTime:0.15,

kFlickThreshold:300,


filterMousePosition:function(event,currentPointer){
var dist=Mojo.Gesture.calculateAbsDistance(this.originalPointer,currentPointer);
if(this.simulateFlick){
if(!this.filter.x||dist.x>=this.kFilterDistance){
event.filteredX=currentPointer.x;
this.filter.x=false;
}else{
event.filteredX=this.originalPointer.x;
}

if(!this.filter.y||dist.y>=this.kFilterDistance){
this.filter.y=false;
event.filteredY=currentPointer.y;
}else{
event.filteredY=this.originalPointer.y;
}
event.filteredPointer={x:event.filteredX,y:event.filteredY};
}else{
event.filteredPointer=currentPointer;
}
return dist;
},


calculateVelocity:function(event,currentPointer){
var delta,deltaT,currentVelocity,aveX,aveY;
if(this.lastPointer){
this.lastDelta=Mojo.Gesture.calculateDistance(currentPointer,this.lastPointer);
deltaT=event.timeStamp-this.lastTimeStamp;
if(deltaT>0){
currentVelocity={x:Math.round((1000*this.lastDelta.x)/deltaT),y:Math.round((1000*this.lastDelta.y)/deltaT)};
}else{
currentVelocity={x:0,y:0};
}
if(this.velocityHistory.length>=2){
this.velocityHistory.shift();
}
this.velocityHistory.push(currentVelocity);
if(this.velocityHistory.length>=2){
aveX=Math.round(this.velocityHistory[1].x*0.7+this.velocityHistory[0].x*0.3);
aveY=Math.round(this.velocityHistory[1].y*0.7+this.velocityHistory[0].y*0.3);
this.velocity={x:aveX,y:aveY};
}else{
this.velocity=currentVelocity;
}
event.distance=this.lastDelta;
}
this.lastPointer=currentPointer;
this.lastTimeStamp=event.timeStamp;
},


mouseDown:function(event){
},


stopSelectTimer:function(){
if(this.selectTimer){
window.clearTimeout(this.selectTimer);
delete this.selectTimer;
}
},


applySelectHighlight:function(hitTarget){
var currentTarget=Mojo.View.findParentByAttribute(hitTarget,this.document,Mojo.Gesture.selectionHighlightFeedbackAttribute);
var prevTarget;

if(currentTarget){
this.downHighlightVersion=Mojo.Gesture._newSelectionFeedback;
if(currentTarget&&currentTarget!==document&&!this.preventTap){
this.highlightedElement=currentTarget;
this.highlightTargetTime=Date.now();
Mojo.Gesture.highlightTarget=currentTarget;
Mojo.Gesture.highlightTargetTime=this.highlightTargetTime;
Mojo.View.clearTouchFeedback(hitTarget.ownerDocument.body);
currentTarget.addClassName(Mojo.Gesture.kSelectedClassName);


if(currentTarget===this.document||currentTarget===null){
return undefined;
}
}
}else{
currentTarget=Mojo.View.findParentByAttribute(hitTarget,this.document,Mojo.Gesture.selectionHighlightAttribute);
if(currentTarget&&currentTarget!==document&&currentTarget!==null&&!this.preventTap){
this.downHighlightVersion=Mojo.Gesture._oldSelectionFeedback;
this.highlightedElement=currentTarget;
this.highlightTargetTime=Date.now();
Mojo.Gesture.highlightTarget=currentTarget;
Mojo.Gesture.highlightTargetTime=this.highlightTargetTime;
currentTarget.addClassName(Mojo.Gesture.kSelectedClassName);
}
if(currentTarget===document||currentTarget===null){
return undefined;
}
}
return currentTarget;
},


applySelectHighlightFromTimer:function(event){
if(this.selectTimer){
delete this.selectTimer;
this.applySelectHighlight(this.downTarget);
}
},


mouseHeld:function(){
var holdEvent;
delete this.holdTimer;
if(!this.moved&&!this.preventTap){
holdEvent=Mojo.Event.send(this.downTarget,Mojo.Event.hold,{down:this.downEvent,count:this.downEvent.detail});
this.held=!!holdEvent.defaultPrevented;
this.holdTimerFired=true;
}
},


handleFirstMove:function(){
if(this.dragSentButNotHandled){
this.applySelectHighlight(this.downTarget);
if(this.highlightedElement){
var nonScrollingHighlight=new Mojo.Gesture.NonScrollingHighlight(this.highlightedElement);
}
}else{
this.stopSelectTimer();
this.clearSelected(true);
}

this.moved=true;
if(this.holdTimer){
window.clearTimeout(this.holdTimer);
delete this.holdTimer;
}
},

maybeStopEvent:function(event){
if(Mojo.Gesture.shouldStopEventOnElement(this.downTarget)){
Event.stop(event);
}
},


mouseMove:function(event){
if(Mojo.Gesture.eventList){
Mojo.Gesture.eventList.push(event);
}
if(this.userModify){
return;
}
var filteredDist;
var mojoEvent;
var currentPointer=Event.pointer(event);
if(currentPointer.y<0){
return;
}
if(Mojo.Host.current===Mojo.Host.browser&&currentPointer.y>document.viewport.getHeight()){
currentPointer.y=document.viewport.getHeight();
}
var dist=this.filterMousePosition(event,currentPointer);
if(this.simulateFlick&&!this.moved){
if(Math.abs(dist.x)<this.kFilterDistance&&Math.abs(dist.y)<this.kFilterDistance){
this.maybeStopEvent(event);
return;
}
}
filteredDist=Mojo.Gesture.calculateAbsDistance(this.originalPointer,event.filteredPointer);
if(this.simulateFlick){
this.calculateVelocity(event,currentPointer);
}
if(!this.moved){
mojoEvent=Mojo.Event.send(this.downTarget,Mojo.Event.dragStart,{distance:dist,filteredDistance:filteredDist,down:this.downEvent,move:event});
this.dragSentButNotHandled=!mojoEvent.defaultPrevented;
this.handleFirstMove();
}

mojoEvent=Mojo.Event.send(this.downTarget,Mojo.Event.dragging,{distance:dist,down:this.downEvent,move:event});
this.maybeStopEvent(event);
},


clearSelected:function(force){
var downHighlightMode;
var highlightedElement=this.highlightedElement||Mojo.Gesture.highlightTarget;
if(highlightedElement){
downHighlightMode=highlightedElement.getAttribute(Mojo.Gesture.selectionHighlightFeedbackAttribute);
if(downHighlightMode){
this.downHiglightVersion=Mojo.Gesture._newSelectionFeedback;
downHighlightMode=highlightedElement.getAttribute(Mojo.Gesture.selectionHighlightFeedbackAttribute);
if(force||(downHighlightMode!==Mojo.Gesture.immediatePersistentFeedback&&
downHighlightMode!==Mojo.Gesture.delayedPersistentFeedback)){
highlightedElement.removeClassName(Mojo.Gesture.kSelectedClassName);
}
delete this.highlightedElement;
delete this.highlightTargetTime;
delete Mojo.Gesture.highlightTarget;
delete Mojo.Gesture.highlightTargetTime;
}else{
downHighlightMode=highlightedElement.getAttribute(Mojo.Gesture.selectionHighlightAttribute);
this.downHighlightVersion=Mojo.Gesture._oldSelectionFeedback;
if(force||downHighlightMode!==Mojo.Gesture.persistentSelection){
highlightedElement.removeClassName(Mojo.Gesture.kSelectedClassName);
}
delete this.highlightedElement;
delete this.highlightTargetTime;
delete Mojo.Gesture.highlightTarget;
delete Mojo.Gesture.highlightTargetTime;
}
}
},


clearSelectedDelayed:function(){
var win;
if(this.downHightlightMode===Mojo.Gesture.spontaneousFeedback){
win=Mojo.Gesture.windowForEvent(this.downEvent);
if(win){
win.setTimeout(this.clearSelected,100);
return;
}
}

this.clearSelected.delay(0.2);
},



makeFocusedWidgetSendChanges:function(focusedElement,triggeringEvent){
var widgetController,widgetAssistant,sendChangesFunction;
var enclosingWidget=Mojo.View.findParentByAttribute(focusedElement,focusedElement.ownerDocument,"x-mojo-element");
if(enclosingWidget){
widgetController=enclosingWidget._mojoController;
if(widgetController){
widgetAssistant=widgetController.assistant;
if(widgetAssistant&&widgetAssistant.sendChanges){
widgetAssistant.sendChanges(triggeringEvent);
}
}
}
},


sendTap:function(triggeringEvent){
var tapEvent,focusedElement;
focusedElement=Mojo.View.getFocusedElement(this.downTarget.ownerDocument.body);
if(focusedElement){
this.makeFocusedWidgetSendChanges(focusedElement,triggeringEvent);
}
tapEvent=Mojo.Event.send(this.downTarget,Mojo.Event.tap,{down:this.downEvent,count:this.downEvent.detail,up:triggeringEvent});
if(!tapEvent.defaultPrevented&&Mojo.View.isTextField(this.downTarget)){
Mojo.Gesture.simulateClick(this.downTarget,this.downEvent.pageX,this.downEvent.pageY);
}
},


simulateMouseDown:function(screenX,screenY){
if(!PalmSystem.simulated){
Mojo.Gesture.withMouseEventHandlingDisabled(function(){
PalmSystem.simulateMouseClick(screenX,screenY,true);
});
}
},

notDraggingAndInSameTarget:function(uiEvent){
var downHighlightTarget,upHighlightTarget;
if(this.dragSentButNotHandled){
downHighlightTarget=Mojo.View.findParentByAttribute(this.downTarget,this.document,Mojo.Gesture.selectionHighlightFeedbackAttribute);
if(downHighlightTarget||this.downHighlightVersion===Mojo.Gesture._newSelectionFeedback){
upHighlightTarget=Mojo.View.findParentByAttribute(uiEvent.target,this.document,Mojo.Gesture.selectionHighlightFeedbackAttribute)||uiEvent.target;
}else{
downHighlightTarget=Mojo.View.findParentByAttribute(this.downTarget,this.document,Mojo.Gesture.selectionHighlightAttribute)||this.downTarget;
upHighlightTarget=Mojo.View.findParentByAttribute(uiEvent.target,this.document,Mojo.Gesture.selectionHighlightAttribute)||uiEvent.target;
}
if(downHighlightTarget===upHighlightTarget){
return true;
}
}
return false;
},


finish:function(event){
var mojoEvent,sendFlick,currentPointer;
this.stopSelectTimer();
this.clearSelectedDelayed();
window.clearTimeout(this.holdTimer);

if(!event){
return;
}

currentPointer=Event.pointer(event);
sendFlick=this.sendFlick;
if(!sendFlick&&this.simulateFlick){
sendFlick=Math.abs(this.velocity.x)>this.kFlickThreshold||Math.abs(this.velocity.y)>this.kFlickThreshold;
}

if(sendFlick){
mojoEvent=Mojo.Event.send(this.downTarget,Mojo.Event.flick,{velocity:this.velocity,shiftKey:event.shiftKey});
this.dragSentButNotHandled=this.dragSentButNotHandled&&!mojoEvent.defaultPrevented;
}

if(this.moved){
if(this.notDraggingAndInSameTarget(event)){
this.sendTap(event);
return;
}
mojoEvent=Mojo.Event.send(this.downTarget,Mojo.Event.dragEnd,{down:this.downEvent,up:event});
}else{
if(this.holdTimerFired){
mojoEvent=Mojo.Event.send(this.downTarget,Mojo.Event.holdEnd,{down:this.downEvent,up:event});
if(!mojoEvent.defaultPrevented&&!this.held&&!this.preventTap&&currentPointer.y>=0){
this.sendTap(event);
}
}else{

if(!this.preventTap&&currentPointer.y>=0){
if(!this.highlightedElement){
var highlightTarget=this.applySelectHighlight(this.downTarget);
if(highlightTarget){

this.clearSelectedDelayed();
}
}




this.sendTap(event);
}
}
}
},


mouseUp:function(event){
if(this.userModify){
return;
}

if(Mojo.Gesture.eventList){
Mojo.Gesture.eventList.push(event);
}
var currentPointer=Event.pointer(event);
this.filterMousePosition(event,currentPointer);
this.finish(event);
this.maybeStopEvent(event);
},


dispatchGesture:function(gestureType,gestureProperties){
var mojoEvent;
if(gestureType==Mojo.Gesture.gestureTypeFlick){
if(Mojo.Gesture.eventList){
Mojo.Gesture.eventList.push({type:Mojo.Gesture.gestureTypeFlick,timestamp:new Date()});
}
this.sendFlick=true;
this.velocity={x:gestureProperties.xVel,y:gestureProperties.yVel};
}
}
});


Mojo.Gesture.Select=Class.create({

initialize:function(target,event){
Mojo.Log.warn("WARNING: Mojo.Gesture.Select has been deprecated. Use Mojo.View.applySelectionAttribute.");
}
});


Mojo.Gesture.Text=Class.create({

initialize:function(target,event){
Mojo.Log.warn("WARNING: Mojo.Gesture.Text has been deprecated, not that you had any reason to be using it earlier.");
}

});

Mojo.Log.addLoggingMethodsToClass(Mojo.Gesture.Recognizer);




Mojo.Gesture._dispatchNonMouseGesture=function(gestureType,gestureProperties){
var mojoEvent;
var stageController;
var newEv;

switch(gestureType){
case Mojo.Gesture.gestureTypeForward:
newEv=Mojo.Event.make(Mojo.Event.forward,{});
break;
case Mojo.Gesture.gestureTypeUp:
newEv=Mojo.Event.make(Mojo.Event.up,{});
break;
case Mojo.Gesture.gestureTypeDown:
newEv=Mojo.Event.make(Mojo.Event.down,{});
break;
default:
Mojo.Log.warn("No gesture to handle native gesture : "+gestureType);
return;
}
stageController=Mojo.Controller.appController.getActiveStageController();
if(stageController){
stageController.sendEventToCommanders(newEv);
}else{
Mojo.Log.warn("No stage controller for dispatching non-mouse gesture.");
}
};


Mojo.doHandleGesture=function(targetWindow,gestureType,gestureProperties){
var currentGesture=Mojo.Gesture.gestureForWindow(targetWindow);

if(currentGesture){
currentGesture.dispatchGesture(gestureType,gestureProperties);
}else{
Mojo.Gesture._dispatchNonMouseGesture(gestureType,gestureProperties);
}
};


Mojo.handleGesture=function(gestureType,gestureProperties){
Mojo.doHandleGesture(window,gestureType,gestureProperties);
};


Mojo.handleSingleTapForDocument=function(targetDocument,details){
Mojo.Event.send(targetDocument,Mojo.Event.singleTap,details);
};


Mojo.handleSingleTap=function(details){
Mojo.handleSingleTapForDocument(document,details);
};

Mojo.Gesture.kSelectedClassName='selected';

Mojo.Gesture.NonScrollingHighlight=function NonScrollingHighlight(targetElement){
this.targetElement=targetElement;
this.targetDocument=targetElement.ownerDocument;

this.downHighlightMode=targetElement.getAttribute(Mojo.Gesture.selectionHighlightFeedbackAttribute);
if(Mojo.Gesture.selectionHighlightFeedbackAttribute){
this.downHighlightVersion=Mojo.Gesture._newSelectionFeedback;
this.downHighlightMode=targetElement.getAttribute(Mojo.Gesture.selectionHighlightFeedbackAttribute);
this.mouseOver=this.mouseOver.bindAsEventListener(this);
this.mouseUp=this.mouseUp.bindAsEventListener(this);
Mojo.Event.listen(this.targetDocument,'mouseover',this.mouseOver);
Mojo.Event.listen(this.targetDocument,'mouseup',this.mouseUp);
}else{
this.downHighlightMode=targetElement.getAttribute(Mojo.Gesture.selectionHighlightAttribute);
this.downHighlightVersion=Mojo.Gesture._oldSelectionFeedback;
this.mouseOver=this.mouseOver.bindAsEventListener(this);
this.mouseUp=this.mouseUp.bindAsEventListener(this);
Mojo.Event.listen(this.targetDocument,'mouseover',this.mouseOver);
Mojo.Event.listen(this.targetDocument,'mouseup',this.mouseUp);
}
};

Mojo.Gesture.NonScrollingHighlight.prototype.mouseOver=function mouseOver(mouseEvent){
var target=mouseEvent.target;
if(target===this.targetElement||mouseEvent.target.descendantOf(this.targetElement)){
this.targetElement.addClassName(Mojo.Gesture.kSelectedClassName);
}else{
this.targetElement.removeClassName(Mojo.Gesture.kSelectedClassName);
}
};

Mojo.Gesture.NonScrollingHighlight.prototype.mouseUp=function mouseUp(mouseEvent){
var f;
var targetElement=this.targetElement;
var targetDocument=this.targetDocument;
this.targetElement=null;
this.targetDocument=null;

if(this.downHighlightVersion===Mojo.Gesture._newSelectionFeedback){
if(this.downHighlightMode!==Mojo.Gesture.immediatePersistentFeedback&&
this.downHighlightMode!==Mojo.Gesture.delayedPersistentFeedback){
f=function(){
targetElement.removeClassName(Mojo.Gesture.kSelectedClassName);
};
f.defer();
}
Mojo.Event.stopListening(targetDocument,'mouseover',this.mouseOver);
Mojo.Event.stopListening(targetDocument,'mouseup',this.mouseUp);
}else{
if(this.downHighlightMode!==Mojo.Gesture.persistentSelection){
f=function(){
targetElement.removeClassName(Mojo.Gesture.kSelectedClassName);
};
f.defer();
}
Mojo.Event.stopListening(targetDocument,'mouseover',this.mouseOver);
Mojo.Event.stopListening(targetDocument,'mouseup',this.mouseUp);
}
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Locale={};



Mojo.Locale.readStringTable=function(fileName,locale,pathToResourcesDir,mergeFunc){
if(typeof locale==='string'&&locale.length===5){
locale={
base:locale,
language:locale.slice(0,2),
region:locale.slice(-2)
};
}else if(locale===''){
locale={base:locale};
}else{
locale={
base:Mojo.Locale.current,
language:Mojo.Locale.language,
region:Mojo.Locale.region
};
}

pathToResourcesDir=pathToResourcesDir||Mojo.Locale.resourcePath;

var table=Mojo.Locale._stringTableLoader(fileName,locale.base,pathToResourcesDir);
if(!table&&locale.language&&locale.region){
table=Mojo.Locale._readMergingStringTables(fileName,pathToResourcesDir,locale.language,locale.region,mergeFunc||Mojo.Locale.mergeObjectStringTables);
}

return table||{};
};


Mojo.Locale.getCurrentLocale=function(){
return Mojo.Locale.current;
};


Mojo.Locale.getCurrentFormatRegion=function(){
return Mojo.Locale.formatRegion;
};


Mojo.Locale._getDateNamesHelper=function(type,length){
length=length||'long';
var hash=Mojo.Locale.DateTimeStrings;
return hash&&hash[length]&&hash[length][type];
};


Mojo.Locale.getMonthNames=Mojo.Locale._getDateNamesHelper.curry('month');


Mojo.Locale.getDayNames=Mojo.Locale._getDateNamesHelper.curry('day');


Mojo.Locale.mergeArrays=function(base,overlay,compare){
Mojo.requireFunction(compare,"Mojo.Locale.mergeArrays requires a valid compare function");


if(!base){
return overlay||[];
}
if(!overlay){
return base||[];
}
if(!base.length){
return overlay;
}
if(!overlay.length){
return base;
}

var result=[];
var bi=0;
var oi=0;
var diff;

while(bi<base.length&&oi<overlay.length){
diff=compare(base[bi],overlay[oi]);
if(diff<0){
result.push(base[bi]);
++bi;
}else if(diff>0){
result.push(overlay[oi]);
++oi;
}else{
result.push(overlay[oi]);
++bi;
++oi;
}
}


for(;bi<base.length;++bi){
result.push(base[bi]);
}

for(;oi<overlay.length;++oi){
result.push(overlay[oi]);
}

return result;
};


Mojo.Locale.mergeObjectStringTables=function(tables){
var mergedTable=tables.shift()||{};
tables.each(function(t){
Object.extend(mergedTable,t);
});
return mergedTable;
};


Mojo.Locale.mergeArrayStringTables=function(compareFunc,tables){
var mergedTable=tables.shift()||[];
tables.each(function(t){
if(Object.isArray(t)){
t.sort(compareFunc);
mergedTable=Mojo.Locale.mergeArrays(mergedTable,t,compareFunc);
}
});
return mergedTable;
};


Mojo.Locale.alternateCharactersCompare=function(a,b){
var result=a.keyCode-b.keyCode;
if(result===0){
result=a.letter.localeCompare(b.letter);
}
return result;
};


Mojo.Locale._readMergingStringTables=function(fileName,pathToResourcesDir,language,region,mergeFunc){
var unlocalizedStrings=Mojo.Locale._stringTableLoader(fileName,'',pathToResourcesDir);
var languageStrings=Mojo.Locale._stringTableLoader(fileName,language,pathToResourcesDir);
var regionStrings=Mojo.Locale._stringTableLoader(fileName,language+'/'+region,pathToResourcesDir);

return mergeFunc([unlocalizedStrings,languageStrings,regionStrings]);
};


Mojo.Locale._stringTableLoader=function(fileName,locale,pathToStringTable,mergeFunc){
var stringTable;
var stringsAsJson;

if(locale){
pathToStringTable+="/"+locale;
}
fileName=fileName||"strings.json";

pathToStringTable+="/"+fileName;

stringsAsJson=palmGetResource(pathToStringTable,true);

if(stringsAsJson){
stringTable=Mojo.parseJSON(stringsAsJson);
}
return stringTable;
};


Mojo.Locale.set=function(currentLocale,formatRegion){
var deviceInfo=Mojo.Environment.DeviceInfo;
var altCharFullTable,altCharTable;

if(Mojo.Locale.current!=currentLocale){
Mojo.Locale.current=currentLocale;
Mojo.Log.info("Current locale is "+Mojo.Locale.current);
Mojo.Locale.strings={};
Mojo.Locale.frameworkStrings={};
Mojo.View.templates={};
if(Mojo.Locale.current){
Mojo.Locale.language=Mojo.Locale.current.slice(0,2);
Mojo.Locale.region=Mojo.Locale.current.slice(-2).toLocaleLowerCase();

Mojo.Locale.resourcePath=Mojo.appPath+"resources";
Mojo.Locale.localizedResourcePath=Mojo.Locale.resourcePath+"/"+Mojo.Locale.current;
Mojo.Locale.languageResourcePath=Mojo.Locale.resourcePath+"/"+Mojo.Locale.language;
Mojo.Locale.regionResourcePath=Mojo.Locale.languageResourcePath+"/"+Mojo.Locale.region;

Mojo.Locale.frameworkResourcePath=Mojo.Config.MOJO_FRAMEWORK_HOME+"/resources";
Mojo.Locale.frameworkLocalizedResourcePath=Mojo.Locale.frameworkResourcePath+"/"+Mojo.Locale.current;
Mojo.Locale.frameworkLanguageResourcePath=Mojo.Locale.frameworkResourcePath+"/"+Mojo.Locale.language;
Mojo.Locale.frameworkRegionResourcePath=Mojo.Locale.frameworkLanguageResourcePath+"/"+Mojo.Locale.region;

Mojo.Locale.appTemplatePath=Mojo.Locale.localizedResourcePath+"/views/";
Mojo.Locale.appLanguageTemplatePath=Mojo.Locale.languageResourcePath+"/views/";
Mojo.Locale.appRegionTemplatePath=Mojo.Locale.regionResourcePath+"/views/";

Mojo.Locale.frameworkTemplatePath=Mojo.Locale.frameworkLocalizedResourcePath+"/views/";
Mojo.Locale.frameworkLanguageTemplatePath=Mojo.Locale.frameworkLanguageResourcePath+"/views/";
Mojo.Locale.frameworkRegionTemplatePath=Mojo.Locale.frameworkRegionResourcePath+"/views/";

var altCharArrayMerge=Mojo.Locale.mergeArrayStringTables.curry(Mojo.Locale.alternateCharactersCompare);




Mojo.Locale.strings=Mojo.Locale.readStringTable("strings.json",Mojo.Locale.current,Mojo.Locale.resourcePath);
Mojo.Locale.frameworkStrings=Mojo.Locale.readStringTable("strings.json",Mojo.Locale.current,Mojo.Locale.frameworkResourcePath);

if(deviceInfo.keyboardType===Mojo.Environment.AZERTY){
altCharTable="alternatechars_table_azerty.json";
altCharFullTable="alternatechars_fulltable_azerty.json";
}else if(deviceInfo.keyboardType===Mojo.Environment.QWERTZ){
altCharTable="alternatechars_table_qwertz.json";
altCharFullTable="alternatechars_fulltable_qwertz.json";
}else{
altCharTable="alternatechars_table.json";
altCharFullTable="alternatechars_fulltable.json";
}
Mojo.Locale.alternateCharacters=Mojo.Locale.readStringTable(altCharTable,Mojo.Locale.current,Mojo.Locale.frameworkResourcePath,altCharArrayMerge);
Mojo.Locale.alternateCharactersFull=Mojo.Locale.readStringTable(altCharFullTable,Mojo.Locale.current,Mojo.Locale.frameworkResourcePath,altCharArrayMerge);
Mojo.Locale.DateTimeStrings=Mojo.Locale.readStringTable("datetime_table.json",Mojo.Locale.current,Mojo.Locale.frameworkResourcePath);



Mojo.loadStylesheets(document,true);
Mojo.Locale.loadLocaleSpecificStylesheets(document);
}else{
delete Mojo.Locale.language;
delete Mojo.Locale.region;
delete Mojo.Locale.formatRegion;

delete Mojo.Locale.resourcePath;
delete Mojo.Locale.localizedResourcePath;
delete Mojo.Locale.languageResourcePath;
delete Mojo.Locale.regionResourcePath;

delete Mojo.Locale.frameworkResourcePath;
delete Mojo.Locale.frameworkLocalizedResourcePath;
delete Mojo.Locale.frameworkLanguageResourcePath;
delete Mojo.Locale.frameworkRegionResourcePath;

delete Mojo.Locale.appTemplatePath;
delete Mojo.Locale.appLanguageTemplatePath;
delete Mojo.Locale.appRegionTemplatePath;

delete Mojo.Locale.frameworkTemplatePath;
delete Mojo.Locale.frameworkLanguageTemplatePath;
delete Mojo.Locale.frameworkRegionTemplatePath;
}
}

formatRegion=formatRegion||Mojo.Locale.region;
if(currentLocale&&formatRegion&&formatRegion!=Mojo.Locale.formatRegion){
Mojo.Locale.formatRegion=formatRegion.slice(-2).toLocaleLowerCase();
Mojo.Locale.formatsPath=Mojo.Config.MOJO_FRAMEWORK_HOME+"/formats";
Mojo.Locale.formats=Mojo.Locale.readFormatsTable();
Mojo.Format._formatCache={datetime:{},date:{},time:{},formatType:{}};
}
};


Mojo.Locale._objectIsEmpty=function(object){
var property;
for(property in object){
if(true){
return false;
}
}
return true;
};


Mojo.Locale.readFormatsTable=function(region,path){
region=(region&&region.slice(-2).toLocaleLowerCase())||Mojo.Locale.formatRegion;
path=path||Mojo.Locale.formatsPath;
var formats=Mojo.Locale.readStringTable(Mojo.Locale.language+'_'+region+'.json','',path);
if(!formats||Mojo.Locale._objectIsEmpty(formats)){

formats=Mojo.Locale.readStringTable(region+'.json','',path);
}
return formats;
};


Mojo.Locale._loadLocalizedStylesheet=function loadLocalizedStylesheet(theDocument,path){
var localizedSheet=Mojo.Locale.localizedResourcePath+"/"+path;
var languageSheet=Mojo.Locale.languageResourcePath+"/"+path;
var regionSheet=Mojo.Locale.regionResourcePath+"/"+path;
Mojo.loadStylesheet(theDocument,localizedSheet);
Mojo.loadStylesheet(theDocument,languageSheet);
Mojo.loadStylesheet(theDocument,regionSheet);
};


Mojo.Locale.loadLocaleSpecificStylesheets=function loadLocaleSpecificStylesheet(theDocument){
var links=theDocument.querySelectorAll('link[type="text/css"]');
for(var i=0;i<links.length;i++){
var path=links[i].href;
if(path.startsWith(Mojo.appPath)){
Mojo.Locale._loadLocalizedStylesheet(theDocument,path.gsub(Mojo.appPath,""));
}
}
};

Mojo.Locale.localizeString=function localizeString(stringToLocalize,stringTable){
var translatedValue;
if(Object.isString(stringToLocalize)){
var key=stringToLocalize;
var value=stringToLocalize;
}else{
key=stringToLocalize.key;
value=stringToLocalize.value;
}

return(stringTable&&stringTable[key])||value;
};


Mojo.Locale.StringProxy=function StringProxy(useFramework,stringToLocalize){
this.useFramework=useFramework;
this.stringToLocalize=(stringToLocalize===undefined)?"":(""+stringToLocalize);
};


Mojo.Locale.StringProxy.prototype.toString=function(){

if(this.localized){
return this.localized;
}


var stringTable;
if(this.useFramework){
stringTable=Mojo.Locale.frameworkStrings;
}else{
stringTable=Mojo.Locale.strings;
}


if(stringTable){
this.localized=Mojo.Locale.localizeString(this.stringToLocalize,stringTable);
return this.localized;
}


return this.stringToLocalize;
};


Mojo.Locale.StringProxy.prototype.toJSON=function(){
return this.toString().toJSON();
};


window.$L=function(stringToLocalize){
if(Mojo.Locale.strings){
return Mojo.Locale.localizeString(stringToLocalize,Mojo.Locale.strings);
}
return new Mojo.Locale.StringProxy(false,stringToLocalize);
};


window.$LL=function(stringToLocalize){
if(Mojo.Locale.frameworkStrings){
return Mojo.Locale.localizeString(stringToLocalize,Mojo.Locale.frameworkStrings);
}
return new Mojo.Locale.StringProxy(true,stringToLocalize);
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Drag={};


Mojo.Drag.kDropAttribute='x-mojo-drop-container';



Mojo.Drag.elementClass="palm-drag-element";


Mojo.Drag.containerClass="palm-drag-container";





Mojo.Drag.startDragging=function(sceneController,element,startEvent,options){
return new Mojo.Drag._Dragger(sceneController,element,startEvent,options);
};



Mojo.Drag.setupDropContainer=function(element,dropClient){
element.setAttribute(Mojo.Drag.kDropAttribute,"");
element._mojoDropTarget=dropClient;
};



Mojo.Drag.kElementClass="palm-drag-element";

Mojo.Drag.kSpacerClass="palm-drag-spacer";

Mojo.Drag.kContainerClass="palm-drag-container";

Mojo.Drag.kContainerOriginalClass="original";

Mojo.Drag.kContainerTargetClass="target";

Mojo.Drag._Dragger=Class.create({


initialize:function(sceneController,element,startEvent,options){
var offset,dims,i,initialContainer;


this.element=element;
this.scene=sceneController;
this.options=options||{};

this.queue=Mojo.Animation.queueForElement(element);


this.dragStart=this.dragStart.bindAsEventListener(this);
this.tapEvent=this.tapEvent.bindAsEventListener(this);
this.dragging=this.dragging.bindAsEventListener(this);
this.dragEnd=this.dragEnd.bindAsEventListener(this);
this.clickAfterDrag=this.clickAfterDrag.bindAsEventListener(this);

element.observe(Mojo.Event.dragStart,this.dragStart);
element.observe(Mojo.Event.tap,this.tapEvent);
element.observe(Mojo.Event.dragging,this.dragging);
element.observe(Mojo.Event.dragEnd,this.dragEnd);


this.origPosition=element.style.position;
this.origStyleCSSText=element.style.cssText;


element.absolutize();
this.draggingClass=(this.options&&this.options.draggingClass)||Mojo.Drag.kElementClass;
element.addClassName(this.draggingClass);


this.startTop=this.element.offsetTop;
this.startLeft=this.element.offsetLeft;




this.containers=$A(this.scene.sceneElement.querySelectorAll('div['+Mojo.Drag.kDropAttribute+']'));


Mojo.assert(this.containers.length>0,"Can't drag element "+(this.element.id||this.element.name)+" since there are no drag containers.");


this.containers=this.containers.map(this.collectContainerInfo);


initialContainer=Mojo.View.findParentByAttribute(element,undefined,Mojo.Drag.kDropAttribute);
for(i=0;i<this.containers.length;i++){
if(this.containers[i].element===initialContainer){
this.initialContainer=this.containers[i];
this.startHovering(this.initialContainer);
break;
}
}



this.hitStartX=startEvent.pageX;
this.hitStartY=startEvent.pageY;


this.scroller=Mojo.View.getScrollerForElement(element);


if(this.scroller){
this.scrollerPos=this.scroller.cumulativeOffset();
this.scrollerSize=this.scroller.mojo.scrollerSize();
this.scrollDeltas={x:0,y:0};
}
},





dragStart:function(event){

this.gotDragStart=true;
event.stop();

if(this.options.autoscroll){
this.scrollAnimating=true;
this.queue.add(this);
}
},



dragging:function(event){

var topDelta=0;
var leftDelta=0;

event.stop();







this.scrollDeltas=this.calcScrollDeltas(event);



if(!this.options.preventVertical){
topDelta=event.move.y-event.down.y;

if((this.options.maxVerticalPixel!==undefined)&&((topDelta+this.startTop)>this.options.maxVerticalPixel)){
this.element.style.top=this.options.maxVerticalPixel+'px';
}else if((this.options.minVerticalPixel!==undefined)&&((topDelta+this.startTop)<this.options.minVerticalPixel)){
this.element.style.top=this.options.minVerticalPixel+'px';
}else{
this.element.style.top=this.startTop+topDelta+'px';
}
}


if(!this.options.preventHorizontal){
leftDelta=event.move.x-event.down.x;

if((this.options.maxHorizontalPixel!==undefined)&&((leftDelta+this.startLeft)>this.options.maxHorizontalPixel)){
this.element.style.left=this.options.maxHorizontalPixel+'px';
}else if((this.options.minHorizontalPixel!==undefined)&&((leftDelta+this.startLeft)<this.options.minHorizontalPixel)){
this.element.style.left=this.options.minHorizontalPixel+'px';
}else{
this.element.style.left=this.startLeft+leftDelta+'px';
}
}

this.topDelta=topDelta;
this.leftDelta=leftDelta;

this.checkContainer();

this.element.observe('click',this.clickAfterDrag,true);
},


dragEnd:function(event){
var dt,changedContainers;

if(this.gotDragStart){
event.stop();
this.gotDragStart=false;
}



this.cleanup();

if(this.currentContainer){
dt=this.currentContainer.element._mojoDropTarget;
changedContainers=this.currentContainer!==this.initialContainer;


if(changedContainers&&this.initialContainer){
this.initialContainer.element._mojoDropTarget.dragRemove(this.element);
}


this.stopHovering(true);
try{
dt.dragDrop(this.element,changedContainers);
}catch(e){
Mojo.Log.error("WARNING: Caught exception in dragndrop container.dragDrop(): "+e);
}
}
},

clickAfterDrag:function clickAfterDrag(clickEvent){

clickEvent.stop();
},


checkContainer:function(){
var checkForNewContainer;
var dt;


if(this.currentContainer)
{


if(!this.options.allowExit||this.hitTestContainer(this.leftDelta,this.topDelta,this.currentContainer))
{

dt=this.currentContainer.element._mojoDropTarget;
if(dt.dragHover){
dt.dragHover(this.element);
}
}
else{


checkForNewContainer=true;
}

}


if(checkForNewContainer||!this.currentContainer){
this.findNewContainer(this.leftDelta,this.topDelta);
}
},


animate:function(){
var pos,newPos;


if(!this.scroller){
return;
}

if(this.scrollDeltas.x||this.scrollDeltas.y){


pos=this.scroller.mojo.getState();
this.scroller.mojo.scrollTo(pos.left+this.scrollDeltas.x,pos.top+this.scrollDeltas.y);
newPos=this.scroller.mojo.getState();



if(!this.options.preventVertical){
this.startTop+=(pos.top-newPos.top);
this.hitStartY+=(pos.top-newPos.top);
this.element.style.top=(parseInt(this.element.style.top,10)+(pos.top-newPos.top))+'px';
}

if(!this.options.preventHorizontal){
this.startLeft+=(pos.left-newPos.left);
this.hitStartX+=(pos.left-newPos.left);
this.element.style.left=(parseInt(this.element.style.left,10)+(pos.left-newPos.left))+'px';
}


this.checkContainer();
}


},




findNewContainer:function(leftDelta,topDelta){
var i;
for(i=0;i<this.containers.length;i++){
if(this.containers[i].dragDatatype==this.options.dragDatatype&&
this.hitTestContainer(leftDelta,topDelta,this.containers[i])){
this.startHovering(this.containers[i]);
break;
}
}
},



startHovering:function(container){
var dt=container.element._mojoDropTarget;




if(this.currentContainer!==undefined){
this.stopHovering();
}

this.currentContainer=container;
container.element.addClassName(Mojo.Drag.kContainerClass);


if(dt.dragEnter){
try{
dt.dragEnter(this.element);
}catch(e){
Mojo.Log.error("WARNING: Caught exception in dragndrop container.dragEnter(): "+e);
}
}

},



stopHovering:function(dontLeave){
var dt=this.currentContainer.element._mojoDropTarget;

this.currentContainer.element.removeClassName(Mojo.Drag.kContainerClass);
this.currentContainer=undefined;


if(dt.dragLeave&&!dontLeave){
try{
dt.dragLeave(this.element);
}catch(e){
Mojo.Log.error("WARNING: Caught exception in dragndrop container.dragLeave(): "+e);
}
}

},



tapEvent:function(event){
this.dragEnd(event);
},



cleanup:function(){
var element=this.element;
var self=this;
element.stopObserving(Mojo.Event.dragging,this.dragging);
element.stopObserving(Mojo.Event.dragEnd,this.dragEnd);
element.stopObserving(Mojo.Event.dragStart,this.dragStart);
element.stopObserving(Mojo.Event.tap,this.tapEvent);


var f=function(){
element.stopObserving('click',self.clickAfterDrag,true);
};

f.defer();


if(this.scrollAnimating){
this.queue.remove(this);
this.scrollAnimating=false;
}


if(!this.options.preventDropReset){
this.resetElement();
}
},



resetElement:function(){
this.element.removeClassName(this.draggingClass);
this.element.style.position=this.origPosition;
this.element.style.cssText=this.origStyleCSSText;
},



collectContainerInfo:function(container){


var position=container.viewportOffset();
var containerInfo=container.getDimensions();

containerInfo.element=container;
containerInfo.top=position.top;
containerInfo.left=position.left;
containerInfo.dragDatatype=container._mojoDropTarget.dragDatatype;

return containerInfo;
},




hitTestContainer:function(leftDelta,topDelta,container){
var left=this.hitStartX+leftDelta;
var top=this.hitStartY+topDelta;

if(left<container.left||left>container.left+container.width||
top<container.top||top>container.top+container.height){
return false;
}

return true;
},



scrollCurve:[40,20,10,5,0,0,0,0,0,0,0,0,0,0,0,0,-5,-10,-20,-40],

calcScrollDeltas:function(event){
var yDelta=0;
var xDelta=0;


if(this.scroller){
if(!this.options.preventVertical){
yDelta=(event.move.y-this.scrollerPos.top)/(this.scrollerSize.height-this.scrollerPos.top);
yDelta=Math.round(this.interpolate(yDelta,this.scrollCurve));
}

if(!this.options.preventHorizontal){
xDelta=(event.move.x-this.scrollerPos.left)/(this.scrollerSize.width-this.scrollerPos.left);
xDelta=Math.round(this.interpolate(xDelta,this.scrollCurve));
}
}


return{x:xDelta,y:yDelta};
},



interpolate:function(value,curve){
var curveLen=curve.length;
var floored,frac;

value*=curveLen;
if(value<0){
value=0;
}else if(value>curveLen-1){
value=curveLen-1;
}

floored=Math.floor(value);
frac=value-floored;
value=(curve[floored]*(1-frac))+(curve[Math.ceil(value)]*frac);
return value;
}
});



/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.Scroller=Class.create(

{
setupOptional:true,


setup:function(){
var scrollContainer=this.controller.element;
this.snapIndex=0;
this.hasPalmOverflow=(Mojo.Host.current!==Mojo.Host.browser);
this.bindHandlers();
this.setupChildElements();
this.handleModelChanged();

this.controller.exposeMethods(['revealTop','revealBottom','revealElement','scrollTo',
'getState','setState','adjustBy','scrollerSize','setMode',
'getScrollPosition','setScrollPosition','setSnapIndex',
'handleEdgeVisibility','validateScrollPosition',
'updatePhysicsParameters']);

this.controller.listen(scrollContainer,Mojo.Event.dragStart,this.dragStartHandler);
this.controller.listen(scrollContainer,Mojo.Event.flick,this.flickHandler);
var sceneElement=this.controller.scene.sceneElement;
Mojo.assert(sceneElement!==undefined,"didn't find a scene element");
if(sceneElement){
this.controller.listen(sceneElement,Mojo.Event.subtreeHidden,this.subtreeHidden);
if(this.pageUpDown){
this.controller.listen(sceneElement,Mojo.Event.keydown,this.keyHandler);
}
}

this.moveLimit=1;

this.updateStylesForMode();

if(Mojo.Host.current===Mojo.Host.browser){
this.kFlickRatio=0.3;
}
},


cleanup:function(){
var sceneElement=this.controller.scene.sceneElement;
this.stopAnimating();
this.controller.stopListening(sceneElement,Mojo.Event.subtreeHidden,this.subtreeHidden);
if(this.pageUpDown){
this.controller.stopListening(sceneElement,Mojo.Event.keydown,this.keyHandler);
}
this.clearCorrectOverscrollTimer();
this.removeContinueOverscrollHandler();
},


fastMakePositioned:function(targetElement){
if(!targetElement.style.position){
targetElement.style.position='relative';
}else{
targetElement.makePositioned();
}
},


setupChildElements:function(){
var target;
var scrollContainer=this.controller.element;


Mojo.assert(scrollContainer,"Mojo.Widget.Scroller requires an element");
if(this.hasPalmOverflow){
scrollContainer.style.overflow="-webkit-palm-overflow";
}else{
scrollContainer.style.overflow="hidden";
}
this.fastMakePositioned(scrollContainer);
var children=Element.childElements(scrollContainer);
if(children.length!=1){
var wrapperId=scrollContainer.id+'-scroll-wrapper';
var div=this.controller.document.createElement('div');
div.id=wrapperId;
children.each(function(element){div.appendChild(element);});
scrollContainer.appendChild(div);
target=this.controller.get(wrapperId);
}else{
target=children.first();
}
this.target=target;
target.style.overflow='visible';
this.fastMakePositioned(target);
if(scrollContainer!==this.controller.scene.getSceneScroller()){
this.controller.instantiateChildWidgets(scrollContainer);
}
},


setupIndicators:function(){
var indicatorElement,checkerFunction,side,possibleComponents;
var component,limitName,indicators,indicatorsCount,indicator,lessThan;
var scrollerParent=this.controller.element.parentNode;
var indicatorElements=scrollerParent.querySelectorAll(this.FADE_ELEMENT_SELECTOR);
var indicatorElementsLength=indicatorElements.length;
if(indicatorElementsLength>0){
possibleComponents=this.calculatePossibleComponents();
indicatorsCount=0;
component=undefined;
indicators={};
for(var i=indicatorElementsLength-1;i>=0;i--){
indicatorElement=indicatorElements[i];
side=indicatorElement.getAttribute(this.FADE_ELEMENT_ATTRIBUTE);
switch(side){
case'top':
component='y';
limitName='maxLimit';
lessThan=true;
break;
case'bottom':
component='y';
limitName='minLimit';
lessThan=false;
break;
case'left':
component='x';
limitName='maxLimit';
lessThan=true;
break;
case'right':
component='x';
limitName='minLimit';
lessThan=false;
break;
}
if(component&&possibleComponents.include(component)){
checkerFunction=this.shouldShowIndicator.bind(this,component,limitName,lessThan);
indicator=new Mojo.Widget.Scroller.Indicator(indicatorElement,checkerFunction);
indicators[side]=indicator;
indicatorsCount+=1;
}
}
}
if(indicatorsCount>0){
this.indicators=indicators;
this.calculateSizesAndUpdateScrollIndicators();
}
},


calculateSizesAndUpdateScrollIndicators:function(){
if(!this.targetCoordinate){
this.setupCoordinates();
}
this.calculateSizes();
if(this.indicators){
this.updateScrollIndicators();
}
},


bindHandlers:function(){
this.dragStartHandler=this.dragStart.bindAsEventListener(this);
this.draggedHandler=this.dragged.bindAsEventListener(this);
this.dragEndHandler=this.dragEnd.bindAsEventListener(this);
this.flickHandler=this.flick.bindAsEventListener(this);
this.flickStopHandler=this.flickStop.bindAsEventListener(this);
this.finishFlickStopHandler=this.finishFlickStop.bind(this);
this.continueOverscrollHandler=this.continueOverscroll.bindAsEventListener(this);
this.subtreeHidden=this.subtreeHidden.bindAsEventListener(this);
this.keyHandler=this.key.bindAsEventListener(this);
this.correctOverscrollHandler=this.correctOverscroll.bind(this);
},


subtreeShown:function(){
if(this.savedState!==undefined){
this.setState(this.savedState);
delete this.savedState;
}
},


subtreeHidden:function(e){
if(this.savedState===undefined){
this.finishScroll();
this.savedState=this.getState();
}
},


key:function(keyPressEvent){
switch(keyPressEvent.originalEvent.keyIdentifier){
case"PageUp":
this.scrollPages(-1);
keyPressEvent.stop();
break;
case"PageDown":
this.scrollPages(1);
keyPressEvent.stop();
break;
}
},


maybeCollectListeners:function(force){
var listeners;

if(force){
delete this.listeners;
}
listeners=this.listeners;
if(!listeners){
listeners=[];
var addListeners=function(listener){
listeners.push(listener);
};
var fakeScroller={addListener:addListeners};
Mojo.Event.send(this.controller.element,Mojo.Event.scrollStarting,{scroller:fakeScroller,addListener:addListeners},false);
this.listeners=listeners;
}
return listeners;
},


notifyListeners:function(scrollEnding,position){
var listeners,l;
this.maybeCollectListeners();
listeners=this.listeners;

for(var i=listeners.length-1;i>=0;i--){
l=listeners[i];
try{
l.moved(scrollEnding,position);
}catch(e){
if(!this.whinedAboutException){
this.whinedAboutException=true;
Mojo.Log.logException(e,"Exception occurred while scroller was calling 'moved' callbacks.");
}
}

}

},


getTarget:function(){
return Element.firstDescendant(this.controller.element);
},


getContentSize:function(){
var scrollerElement=this.controller.element;
return{width:scrollerElement.scrollWidth,height:scrollerElement.scrollHeight};
},


updateStylesForMode:function(){
if(this.establishWidth){
var possibleComponents=this.calculatePossibleComponents();
if(possibleComponents.x){
this.target.style.width='';
}else{
this.target.style.width='100%';
}
}
},


setMode:function(newMode){
this.mode=newMode;
this.updateStylesForMode();
},


handleModelChanged:function(){
this.stopAnimating();
this.mode=this.controller.valueFromModelOrAttributes("mode","vertical");
this.snap=false;
this.establishWidth=this.controller.valueFromModelOrAttributes("establishWidth");
this.sizeToWindow=this.controller.valueFromModelOrAttributes("sizeToWindow");
this.pageUpDown=this.controller.valueFromModelOrAttributes("pageUpDown");
if(this.controller.model&&this.controller.model.snapIndex!==0){
var snapIndex=this.controller.model.snapIndex;
this.snapIndex=snapIndex;
if(snapIndex!==undefined){
this.scrollToSnapIndex();
}
}
this.setupIndicators();

},


calculatePossibleComponents:function calculatePossibleComponents(){
var possibleComponents=[];
switch(this.mode){
case"free":
case"dominant":
possibleComponents=["x","y"];
possibleComponents.x=true;
possibleComponents.y=true;
break;
case"horizontal":
case"horizontal-snap":
possibleComponents=["x"];
possibleComponents.x=true;
break;
case"vertical":
case"vertical-snap":
possibleComponents=["y"];
possibleComponents.y=true;
}
return possibleComponents;
},


calculateSnapPoints:function(components){
var containerExtent,component,snapElements;
this.snapElements={};
this.snapOffsets={};
function makeSnapOffset(element){
var extent,value;
var elementOffset=element.positionedOffset();
if(component==="x"){
value=elementOffset.left;
extent=Element.getWidth(element);
}else{
value=elementOffset.top;
extent=Element.getHeight(element);
}
value+=Math.round(extent/2);
return value;
}
for(var i=components.length-1;i>=0;i--){
component=components[i];
snapElements=this.controller.model&&this.controller.model.snapElements&&this.controller.model.snapElements[component];
if(snapElements===undefined){
continue;
}
if(component==="x"){
containerExtent=Element.getWidth(this.controller.element);
}else{
containerExtent=Element.getHeight(this.controller.element);
}
this.snapElements[component]=snapElements;
this.snapOffsets[component]=snapElements.collect(makeSnapOffset);
}
},


setupAxisTargetAreas:function setupAxisTargetAreas(){
var pt=this.firstPointer;
var x=pt.x;
var y=pt.y;
var r=this.LOCK_RADIUS;
var axisTargets={
left:x-r,
right:x+r,
top:y-r,
bottom:y+r
};
this.axisTargets=axisTargets;
},


calculateAxis:function(){
var components,originalComponents,component,delta,distance,absDistance,x,y,axisTargets;
var lockRadius=this.LOCK_RADIUS;
var lastPointer=this.lastPointer;
components=originalComponents=this.components;
if(this.mode!=='dominant'||components.length==2){
return;
}
absDistance=Mojo.Gesture.calculateAbsDistance(this.firstPointer,lastPointer);
if(absDistance.x<lockRadius&&absDistance.y<lockRadius){
if(absDistance.x<=absDistance.y){
components=["y"];
}else{
components=["x"];
}
}else{
axisTargets=this.axisTargets;
x=lastPointer.x;
y=lastPointer.y;
if(y<axisTargets.top||y>axisTargets.bottom){
if(x<axisTargets.left||x>axisTargets.right){
components=["x","y"];
}
}
}
if(components.length==2){
this.components=components;
if(this.mouseTracker){
this.mouseTracker.components=components;
}
this.calculateSizes();
for(var i=components.length-1;i>=0;i--){
component=components[i];
if(!this.componentsAtStart[component]){
delta=this.lastPointer[component]-this.firstPointer[component];
this.targetCoordinate[component]=this.originalCoordinate[component]+delta;
}
}
this.setFrameDistanceRatio(this.kOverScrollSpeed,"animating to pointer");
this.animatingToPointer=true;
this.startAnimating();
}
},


startCorrectOverscrollTimer:function(){
this.clearCorrectOverscrollTimer();
this.correctOverscrollTimer=this.controller.window.setTimeout(this.correctOverscrollHandler,this.correctOverscrollTimeMs);
},


clearCorrectOverscrollTimer:function(){
if(this.correctOverscrollTimer){
this.controller.window.clearTimeout(this.correctOverscrollTimer);
delete this.correctOverscrollTimer;
}
},


calculateScrollInfo:function(distance){
var components=["y"];
var startScrolling=true;
this.snap=false;
switch(this.mode){
case"free":
components=["x","y"];
break;
case"horizontal":
components=["x"];
startScrolling=(Math.abs(distance.x)>Math.abs(distance.y));
break;
case"horizontal-snap":
components=["x"];
this.snap=true;
startScrolling=(Math.abs(distance.x)>Math.abs(distance.y));
break;
case"vertical-snap":
components=["y"];
this.snap=true;
startScrolling=(Math.abs(distance.x)<=Math.abs(distance.y));
break;
case"vertical":
components=["y"];
startScrolling=(Math.abs(distance.x)<=Math.abs(distance.y));
break;
case"dominant":
this.setupAxisTargetAreas();
if(Math.abs(distance.x)<=Math.abs(distance.y)){
components=["y"];
}else{
components=["x"];
}
break;
}
if(this.snap){
this.calculateSnapPoints(components);
}
return{components:components,startScrolling:startScrolling};
},


dragStart:function(dragStartEvent){


this.maybeCancelDelayedStop();

this.removeContinueOverscrollHandler();
var scrollInfo;
this.correctOverscrollTimeMs=this.CORRECT_OVERSCROLL_TIME_MS;
this.flicked=false;
this.firstPointer=Event.pointer(dragStartEvent.down);
var eventTarget=dragStartEvent.down.target;
var scrollerElement=this.controller.element;
var nonScrollingContainer=Mojo.View.findParentByAttribute(eventTarget,scrollerElement,'x-mojo-non-scrolling');
if(!nonScrollingContainer){
scrollInfo=this.calculateScrollInfo(dragStartEvent.filteredDistance);
if(scrollInfo.startScrolling){
this.startScrolling(dragStartEvent,scrollInfo.components);
dragStartEvent.stop();
}
}
},


dragged:function(event){
if(this.mouseTracker){
this.mouseTracker.dragged(event);
event.stop();
}
},


updateSnapIndex:function(snapIndex){
var oldIndex=this.snapIndex;
if(oldIndex!==snapIndex){
this.snapIndex=snapIndex;
var model=this.controller.model;
if(model){
model.snapIndex=snapIndex;
}
Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,
{property:"snapIndex",
value:this.snapIndex,
oldValue:oldIndex,
model:this
});
}
},


adjustTargetForSnapPoints:function(){
var targetCoord,edge,scrollerExtent,scrollerSize;
var components,component,snapOffsets;
var minDist,minIndex,p,dist,i,snapIndex;
scrollerSize=this.scrollerSize();
components=this.components;
component=components.first();
if(!component){
return;
}
snapOffsets=this.snapOffsets[component];
if(component==='y'){
edge='top';
scrollerExtent=scrollerSize.height;
}else{
edge='left';
scrollerExtent=scrollerSize.width;
}
targetCoord=this.targetCoordinate;
for(i=snapOffsets.length-1;i>=0;i--){
p=snapOffsets[i];
dist=Math.abs(p+targetCoord[component]-scrollerExtent/2);
if(minDist===undefined||dist<minDist){
minDist=dist;
minIndex=i;
}
}
this.updateSnapIndex(minIndex);
snapIndex=this.controller.model.snapIndex;
this.targetCoordinate[component]=this.scrollPositionForSnapIndex(snapIndex,scrollerExtent,component);
this.setFrameDistanceRatio(this.kNonFlickSpeed,"snapping to point");
},


adjustTargetForFlick:function(velocity){
var components=this.components;
var value;
for(var i=components.length-1;i>=0;i--){
var component=components[i];
var delta=0;
if(velocity[component]>0){
delta=-1;
}else if(velocity[component]<0){
delta=1;
}
var index=this.snapIndex+delta;
if(index>=0&&index<this.snapElements[component].length){
this.setFrameDistanceRatio(this.kNonFlickSpeed,"flicking to point");
this.updateSnapIndex(index);
value=this.scrollPositionForSnapIndex(index,undefined,component);
this.targetCoordinate[component]=value;
}
}
},


dragEndWork:function(){
var component,currentCoordinate,targetCoordinate,maxLimit,minLimit;
if(!this.flicked&&this.snap){
this.adjustTargetForSnapPoints();
}
var components=this.components;
var done={x:true,y:true};
if(this.targetCoordinate){
for(var i=components.length-1;i>=0;i--){
component=components[i];
currentCoordinate=this.currentCoordinate[component];
targetCoordinate=this.targetCoordinate[component];
minLimit=this.minLimit[component];
maxLimit=this.maxLimit[component];
if(targetCoordinate===currentCoordinate){
if(currentCoordinate>maxLimit){
this.targetCoordinate[component]=maxLimit;
done[component]=false;
}
if(currentCoordinate<minLimit){
this.targetCoordinate[component]=minLimit;
done[component]=false;
}
}
}
}

if(!done.x||!done.y){
if(!this.correctingOverscroll){
if(this.flicked){
if(this.snap){
this.setFrameDistanceRatio(this.kAnimateSnapSpeed,"snapping at end of drag");
}else{
this.setFrameDistanceRatio(this.kFlickSpeed,"animating flick");
}
}else{
this.setFrameDistanceRatio(this.kNonFlickSpeed,"animating non-flick");
}
}
this.startAnimating();
}
},


dragEnd:function(event){
this.dragEndWork();
delete this.mouseTracker;
Mojo.stopListening(this.controller.element,Mojo.Event.dragging,this.draggedHandler);
Mojo.stopListening(this.controller.element,Mojo.Event.dragEnd,this.dragEndHandler);
if(event){
event.stop();
}
},


handleMotion:function(motion,pointer){
var moved=false;
if(this.delayingFlickStop){

return;
}
if(!this.animatingToPointer&&!this.correctingOverscroll){
this.setFrameDistanceRatio(1,"motion from mouse");
}
this.lastPointer=pointer;
this.calculateAxis();
var components=this.components;
var motionForCoordinate,component,targetForComponent;
for(var i=components.length-1;i>=0;i--){
component=components[i];
targetForComponent=this.targetCoordinate[component];
if(targetForComponent>this.maxLimit[component]||targetForComponent<this.minLimit[component]){
motionForCoordinate=(0.5*motion[component]);
}else{
motionForCoordinate=motion[component];
}
this.targetCoordinate[component]+=motionForCoordinate;
if(motionForCoordinate!==0){
moved=true;
}
}
if(moved&&this.inOverscroll){
this.startCorrectOverscrollTimer();
}
},


flick:function(event){
var factor;
var i;
var component;

if(!this.mouseTracker){
return;
}
this.correctOverscrollTimeMs=this.CORRECT_OVERSCROLL_TIME_FLICK_MS;
if(this.inOverscroll){
this.startCorrectOverscrollTimer();
}

factor=this.kFlickRatio;
var components=this.components;
if(event.shiftKey){
for(i=components.length-1;i>=0;i--){
component=components[i];
if(event.velocity[component]>0){
this.targetCoordinate[component]=this.maxLimit[component]+200;
}else{
this.targetCoordinate[component]=this.minLimit[component]-200;
}
}
this.setFrameDistanceRatio(this.kOverScrollSpeed,"shift-flick scroll");
}else{
for(i=components.length-1;i>=0;i--){
component=components[i];
var v=event.velocity[component]*factor;
var tc=this.targetCoordinate[component]+v;
tc=Math.max(this.minOverLimit[component],tc);
tc=Math.min(this.maxOverLimit[component],tc);
this.targetCoordinate[component]=tc;
}
this.setFrameDistanceRatio(this.kFlickSpeed,"flick scroll");
}
if(this.snap){
this.adjustTargetForFlick(event.velocity);
}
this.flicked=true;
event.stop();
},


getAnimationQueue:function(){
return Mojo.Animation.queueForElement(this.controller.element);
},


stopAnimating:function(){
if(this.animating){
this.animating=false;
this.getAnimationQueue().remove(this);
}
},


handleError:function(){
this.stopAnimating();
},


startAnimating:function(){
var w,elementPos;
if(!this.animating&&this.targetCoordinate){
if(!this.currentCoordinate){
Mojo.Log.warn("currentCoordinate not set up before call to startAnimating");
elementPos=this.getScrollPosition();
this.currentCoordinate={y:elementPos.top,x:elementPos.left};
}
this.getAnimationQueue().add(this);
this.animating=true;
this.whinedAboutException=false;
}
},


finishFlickStop:function(){

if(this.delayingFlickStop){
delete this.delayingFlickStop;
this.stopAnimating();



if(!this.flicked){
this.setupCoordinates();
}
}
},


flickStop:function(mouseDownEvent){
if(this.animating){
var absDeltaDist;
var scrollerElement=this.controller.element;
var eventTarget=mouseDownEvent.target;
var nonScrollingContainer=Mojo.View.findParentByAttribute(eventTarget,this.controller.document,'x-mojo-non-scrolling');
if(eventTarget===scrollerElement||(!nonScrollingContainer&&eventTarget.descendantOf(scrollerElement))){

this.delayingFlickStop=this.controller.window.setTimeout(this.finishFlickStopHandler,this.DELAYED_FLICK_STOP_MS);

absDeltaDist=this.absDeltaDist;
if(absDeltaDist!==undefined&&absDeltaDist>=this.DELTA_DISTANCE_TO_PREVENT_TAP){
Mojo.Gesture.preventNextTap();
}

this.flicked=false;
this.installContinueOverscrollHandler();
}
}
},


maybeCancelDelayedStop:function(){
if(this.delayingFlickStop){
this.controller.window.clearTimeout(this.delayingFlickStop);
delete this.delayingFlickStop;
}
},


installContinueOverscrollHandler:function(){
if(!this.continueOverscrollHandlerInstalled){
this.controller.listen(this.controller.element,'mouseup',this.continueOverscrollHandler);
this.continueOverscrollHandlerInstalled=true;
}
},


removeContinueOverscrollHandler:function(){
if(this.continueOverscrollHandlerInstalled){
this.continueOverscrollHandlerInstalled=false;
this.controller.stopListening(this.controller.element,'mouseup',this.continueOverscrollHandler);
}
},


continueOverscroll:function(){
if(this.delayingFlickStop){

this.maybeCancelDelayedStop();
this.stopAnimating();
}

this.removeContinueOverscrollHandler();

if(this.snap||this.inOverscroll){
if(this.snap){
this.adjustTargetForSnapPoints();
}
this.startAnimating();
}else{
this.notifyListeners(true,this.currentCoordinate);
}
},


calculateSizes:function(){
var ratio=2;
var dimensions=this.getScrollerSize();
var yMargin=Math.floor(dimensions.height*ratio);
var xMargin=Math.floor(dimensions.width*ratio);
this.minLimit={x:this.calculateMinLeft(),y:this.calculateMinTop()};
this.maxLimit={x:0,y:0};
this.minOverLimit={x:this.minLimit.x-xMargin,y:this.minLimit.y-yMargin};
this.maxOverLimit={x:this.maxLimit.x+xMargin,y:this.maxLimit.y+yMargin};
},


canScroll:function canScroll(possibleComponents){
var target=this.target;
var elementPos=this.getScrollPosition();
elementPos.x=elementPos.left;
elementPos.y=elementPos.top;
this.calculateSizes();
var thisCanScroll=false;
for(var i=possibleComponents.length-1;i>=0&&!thisCanScroll;i--){
var component=possibleComponents[i];
var minLimit=this.minLimit[component];
if(minLimit<0||elementPos[component]<minLimit){
thisCanScroll=true;
}
}
return thisCanScroll;
},


setupCoordinates:function(){
var elementPos=this.getScrollPosition();
if(!this.animatingToPointer){
this.setFrameDistanceRatio(1,"setupCoordinates");
}
this.targetCoordinate={y:elementPos.top,x:elementPos.left};
this.currentCoordinate={y:elementPos.top,x:elementPos.left};
this.originalCoordinate={y:elementPos.top,x:elementPos.left};
},


startScrolling:function(event,components){
var i,component;
var canScroll=this.canScroll(components);
if(!canScroll){
return;
}
var target=this.target;
this.components=components;
this.componentsAtStart={};
for(i=0;i<components.length;i++){
component=components[i];
this.componentsAtStart[component]=true;
}
if(!this.animating){
this.maybeCollectListeners(true);
}
if(!this.delayingFlickStop){

this.setupCoordinates(target);
}
this.mouseTracker=new Mojo.Widget.Scroller.MouseTracker(this,event,components);
this.lastCurrent={};
this.startAnimating();
this.controller.listen(this.controller.element,Mojo.Event.dragging,this.draggedHandler);
this.controller.listen(this.controller.element,Mojo.Event.dragEnd,this.dragEndHandler);
this.controller.listen(this.controller.element,'mousedown',this.flickStopHandler);
},


rampUpDistanceRatioForOverscroll:function(){
if(this.frameDistanceRatio<this.kNonFlickSpeed){
this.frameDistanceRatio+=((this.kNonFlickSpeed-this.frameDistanceRatio)*this.kOverScrollDecay);
}
},


adjustTargetWithRatio:function(component,targetLimit,ratio){
this.inOverscroll=true;
var amountToMoveTarget=(targetLimit-this.targetCoordinate[component])*ratio;
if(Math.abs(amountToMoveTarget)<=0.5){
this.targetCoordinate[component]=targetLimit;
}else{
this.targetCoordinate[component]+=amountToMoveTarget;
}
},


animate:function(queue){
var components=this.components;
var currentCoordinate,minLimit,maxLimit,targetCoordinate,component,target,scrolled,absDeltaDist,maxAbsDeltaDist;
var oldCoordinate={x:this.currentCoordinate.x,y:this.currentCoordinate.y};
var done={x:true,y:true};

this.inOverscroll=false;
maxAbsDeltaDist=0;
for(var i=components.length-1;i>=0;i--){
component=components[i];
done[component]=false;
currentCoordinate=this.currentCoordinate[component];
targetCoordinate=this.targetCoordinate[component];

minLimit=this.minLimit[component];
maxLimit=this.maxLimit[component];
if(this.correctingOverscroll&&currentCoordinate>maxLimit&&targetCoordinate>maxLimit){
this.adjustTargetWithRatio(component,maxLimit,this.kOverScrollSpeed);
if(currentCoordinate>targetCoordinate){
this.rampUpDistanceRatioForOverscroll();
}
}
if(this.correctingOverscroll&&currentCoordinate<minLimit&&targetCoordinate<minLimit){
this.adjustTargetWithRatio(component,minLimit,this.kOverScrollSpeed);
if(currentCoordinate<targetCoordinate){
this.rampUpDistanceRatioForOverscroll();
}
}
var deltaDist=targetCoordinate-currentCoordinate;
var amountToMove=this.frameDistanceRatio*deltaDist;
if(!this.inOverscroll&&targetCoordinate>maxLimit||targetCoordinate<minLimit){
this.inOverscroll=true;
if(!this.correctOverscrollTimer){
this.startCorrectOverscrollTimer();
}
}

this.absDeltaDist=absDeltaDist=Math.abs(deltaDist);
if(absDeltaDist>0.5||(this.inOverscroll&&!this.mouseTracker)){
if(absDeltaDist>maxAbsDeltaDist){
maxAbsDeltaDist=absDeltaDist;
}
if(this.moveLimit){
if(amountToMove<0){
amountToMove=Math.min(-this.moveLimit,amountToMove);
}else{
amountToMove=Math.max(this.moveLimit,amountToMove);
}
}
this.currentCoordinate[component]+=amountToMove;
}else{
this.currentCoordinate[component]=targetCoordinate;
done[component]=true;
this.absDeltaDist=undefined;
}
}

if(this.absDeltaDist!==undefined){
this.absDeltaDist=maxAbsDeltaDist;
}



currentCoordinate=this.currentCoordinate;
scrolled=false;
var scrollPosition={};
if(currentCoordinate.x!=oldCoordinate.x){
scrollPosition.x=currentCoordinate.x;
scrolled=true;
}

if(currentCoordinate.y!=oldCoordinate.y){
scrollPosition.y=currentCoordinate.y;
scrolled=true;
}

if(scrolled){
this.setScrollPosition(scrollPosition);
this.notifyListeners(false,currentCoordinate);
}

if(done.x&&done.y){
this.correctingOverscroll=false;
this.animatingToPointer=false;
if(!this.mouseTracker){
this.stopAnimating();
this.controller.stopListening(this.controller.element,'mousedown',this.flickStopHandler);
this.lastCurrent={};
this.flicked=false;
this.notifyListeners(true,currentCoordinate);
this.setFrameDistanceRatio(1,"all done");
delete this.listeners;
delete this.targetCoordinate;
}
}
},


finishScroll:function(){
if(this.animating){
this.currentCoordinate=this.targetCoordinate;
this.animate();
}
},


correctOverscroll:function(){
delete this.correctOverscrollTimer;
if(this.inOverscroll){
this.correctingOverscroll=true;
this.setFrameDistanceRatio(this.kCorrectOverscrollSpeed,"correcting overscroll",true);
this.dragEndWork();
}
},


setFrameDistanceRatio:function(frameDistanceRatio,label,ramp){
if(this.frameDistanceAnimator){
this.frameDistanceAnimator.cancel();
this.frameDistanceAnimator=undefined;
}
if(frameDistanceRatio!==this.frameDistanceRatio){
if(frameDistanceRatio===1||this.frameDistanceRatio===1||!ramp){
this.frameDistanceRatio=frameDistanceRatio;
}else{
var details={
from:this.frameDistanceRatio,
to:frameDistanceRatio,
duration:0.5
};
this.frameDistanceAnimator=Mojo.Animation.animateValue(this.getAnimationQueue(),'linear',this.updateFrameDistanceRatio,details);
}
}
},


updateFrameDistanceRatio:function(currentValue){
this.frameDistanceRatio=currentValue;
},



scrollPages:function(pageCount){
var currentTop=-this.getScrollPosition().top;
currentTop+=(pageCount*this.scrollerSize().height+(pageCount>0?-50:50));
this.overscrollTo(undefined,-currentTop,true);
},


kFlickSpeed:0.06,
kOverScrollSpeed:0.3,
kCorrectOverscrollSpeed:0.3,
kAnimateSnapSpeed:0.3,
kOverScrollDecay:0.1,
kNonFlickSpeed:0.6,





scrollerSize:function(){
var scrollContainer=this.controller.element;
var targetDocument=scrollContainer.ownerDocument;
if(scrollContainer.parentNode===targetDocument.body){
return Mojo.View.getViewportDimensions(targetDocument);
}
return Element.getDimensions(scrollContainer);
},


scrollTo:function(x,y,animated,suppressNotification){
this._scrollTo(x,y,animated,suppressNotification,false);
},


overscrollTo:function(x,y,animated,suppressNotification){
this._scrollTo(x,y,animated,suppressNotification,true);
},


_scrollTo:function(x,y,animated,suppressNotification,overScroll){
var size,targetSize;
var target=this.target;
var currentPosition;


if(!animated){
overScroll=false;
}

if(target){
if(!animated){
this.stopAnimating();
}
this.maybeCollectListeners(true);

if(!this.targetCoordinate||!this.components){
this.components=[];
if(x!==undefined){
this.components.push("x");
}
if(y!==undefined){
this.components.push("y");
}
this.setupCoordinates(target);
this.calculateSizes();
}

size=this.scrollerSize();
targetSize=this.getContentSize();

if(x!==undefined){
if(overScroll){
x=this.looseClipHorizontal(x,size,targetSize);
}else{
x=this.clipHorizontal(x,size,targetSize);
}
if(!animated){
this.setScrollPosition({x:x});
}
}
if(y!==undefined){
if(overScroll){
y=this.looseClipVertical(y,size,targetSize);
}else{
y=this.clipVertical(y,size,targetSize);
}
if(!animated){
this.setScrollPosition({y:y});
}
}
if(animated){
this.setupCoordinates(target);
if(x!==undefined){
this.targetCoordinate.x=x;
}
if(y!==undefined){
this.targetCoordinate.y=y;
}
this.setFrameDistanceRatio(this.kAnimateSnapSpeed,"animating scroll to");
this.startAnimating();


}else{
currentPosition=this.getScrollPosition();
currentPosition={x:currentPosition.left,y:currentPosition.top};
if(!suppressNotification){
this.notifyListeners(true,currentPosition);
delete this.listeners;
}
}
}
},




adjustBy:function(dx,dy){
var size,targetSize,currentCoordinate;

if(!dx&&!dy){
return;
}

dx=dx?dx:undefined;
dy=dy?dy:undefined;

if(this.animating){
currentCoordinate={};
if(dx!==undefined){
this.currentCoordinate.x+=dx;
this.targetCoordinate.x+=dx;
currentCoordinate.x=Math.round(this.currentCoordinate.x);
}

if(dy!==undefined){
this.currentCoordinate.y+=dy;
this.targetCoordinate.y+=dy;
currentCoordinate.y=Math.round(this.currentCoordinate.y);
}

}else{
currentCoordinate=this.getState();
size=this.scrollerSize();
targetSize=this.getContentSize();

if(dx!==undefined){
currentCoordinate.x=this.clipHorizontal(currentCoordinate.left+dx,size,targetSize);
}

if(dy!==undefined){
currentCoordinate.y=this.clipVertical(currentCoordinate.top+dy,size,targetSize);
}

}

this.setScrollPosition(currentCoordinate);
},


revealTop:function(newTop){
var target=this.target;
if(target){
newTop=newTop||0;
var currentTop=-this.getScrollPosition().top;
var currentBottom=currentTop+this.scrollerSize().height;
var topOffset=-newTop;

if(topOffset>currentTop&&topOffset<currentBottom){
return;
}
this.scrollTo(undefined,newTop);
}
},


revealBottom:function(){
var newTop;
var target=this.target;
newTop=this.calculateMinTop();
this.scrollTo(undefined,newTop);
},


revealElement:function(element){
var elementToReveal=this.controller.get(element);
if(elementToReveal){
var currentTop=-this.getScrollPosition().top;
var currentBottom=currentTop+this.scrollerSize().height;
var elementHeight=elementToReveal.getHeight();
var elementOffset=Element.positionedOffset(elementToReveal);

var currentlyShowing=currentBottom-elementOffset.top;
var remainingToShow=elementHeight-currentlyShowing;
if(Math.abs(remainingToShow)>0){
this.adjustBy(0,-remainingToShow);
}
}
},


getState:function(){
var target=this.target;
return this.getScrollPosition();
},



setState:function(scrollState,animated){


this.scrollTo(scrollState.left,scrollState.top,animated);
},


clipHorizontal:function(x,size,targetSize){
if(x!==undefined){
x=Math.max(-(targetSize.width-size.width),x);
x=Math.min(x,0);
}
return x;
},


clipVertical:function(y,size,targetSize){
if(y!==undefined){
y=Math.max(-(targetSize.height-size.height),y);
y=Math.min(y,0);
}
return y;
},

kLooseClipAllowance:50,


looseClipHorizontal:function(x,size,targetSize){
if(x!==undefined){
x=Math.max(size.width-targetSize.width-this.kLooseClipAllowance,x);
x=Math.min(x,this.kLooseClipAllowance);
}
return x;
},


looseClipVertical:function(y,size,targetSize){
if(y!==undefined){
y=Math.max(size.height-targetSize.height-this.kLooseClipAllowance,y);
y=Math.min(y,this.kLooseClipAllowance);
}
return y;
},



getScrollPosition:function(){
var scrollElement=this.controller.element;
return{left:-scrollElement.scrollLeft,top:-scrollElement.scrollTop};
},


setScrollPosition:function(scrollPosition){
var scrollElement=this.controller.element;

if(!this.currentCoordinate){
this.currentCoordinate={};
}

var x=scrollPosition.x;
if(x!==undefined){
var scrollX=-x;
scrollElement.scrollLeft=scrollX;
this.currentCoordinate.x=x;
}

var y=scrollPosition.y;
if(y!==undefined){
var scrollY=-y;
scrollElement.scrollTop=scrollY;
this.currentCoordinate.y=y;
}
if(this.indicators){

this.updateScrollIndicators();
}
},


setSnapIndex:function(snapIndex,animate){
var model=this.controller.model;
if(model&&this.mode.match(/snap/)){
if(snapIndex!==model.snapIndex){
this.updateSnapIndex(snapIndex);
this.scrollToSnapIndex(animate);
}
}
},


validateScrollPosition:function(){
var scrollContainer;
var hasPalmOverflow=this.hasPalmOverflow;
if(hasPalmOverflow){
scrollContainer=this.controller.element;
scrollContainer.style.overflow='hidden';
}
this.calculateSizesAndUpdateScrollIndicators();
if(hasPalmOverflow){
scrollContainer.style.overflow='-webkit-palm-overflow';
}
},


updatePhysicsParameters:function(parameters){
var value;

value=parameters.flickSpeed;
if(value!==undefined){
this.kFlickSpeed=Number(value);
}

value=parameters.flickRatio;
if(value!==undefined){
this.kFlickRatio=Number(value);
}
},


handleEdgeVisibility:function(edge,visible,marginAmount){
var scrollElement=this.controller.element;
var styleName='-webkit-palm-scroll-margin-'+edge;
var amount;
if(visible){
amount=marginAmount;
}else{
amount=0;
}
scrollElement.style[styleName]=amount+'px';
},


scrollPositionForSnapIndex:function(snapIndex,scrollerExtent,component){
var scrollerSize;
var snapOffsets=this.snapOffsets[component];
var elementOffset=snapOffsets[snapIndex];
if(scrollerExtent===undefined){
scrollerSize=this.scrollerSize();
if(component==='y'){
scrollerExtent=scrollerSize.height;
}else{
scrollerExtent=scrollerSize.width;
}
}
return Math.round(-elementOffset+scrollerExtent/2);
},


scrollToSnapIndex:function(animate){
var left,top;
var components=this.calculatePossibleComponents();
var component=components.first();
if(component){
this.calculateSnapPoints(components);
var p=this.scrollPositionForSnapIndex(this.snapIndex,undefined,component);
if(components.x){
left=p;
}
if(components.y){
top=p;
}
this.scrollTo(left,top,animate);
}
},


shouldShowIndicator:function(component,limitName,checkLess){
var currentCoordinate,limitValue;
currentCoordinate=this.currentCoordinate[component];
limitValue=this[limitName][component];
if(checkLess){
return currentCoordinate<limitValue-this.kMinimumSizeDifferenceForScrolling;
}
return currentCoordinate>limitValue+this.kMinimumSizeDifferenceForScrolling;
},


updateIndicator:function(indicator){
if(indicator){
indicator.update();
}
},


updateScrollIndicators:function(){
var currentCoordinate=this.currentCoordinate;
var updateIndicator,indicator;
var indicators=this.indicators;
if(indicators){
updateIndicator=this.updateIndicator;
if(currentCoordinate.x!==undefined){
updateIndicator(indicators.left);
updateIndicator(indicators.right);
}
if(currentCoordinate.y!==undefined){
updateIndicator(indicators.top);
updateIndicator(indicators.bottom);
}
}
},

DELAYED_FLICK_STOP_MS:150,
CORRECT_OVERSCROLL_TIME_MS:250,
CORRECT_OVERSCROLL_TIME_FLICK_MS:50,
LOCK_RADIUS:50,
FADE_ELEMENT_ATTRIBUTE:'x-mojo-scroll-fade',

kMinimumSizeDifferenceForScrolling:3,
DELTA_DISTANCE_TO_PREVENT_TAP:25,
kFlickRatio:0.5

});


Mojo.Widget.Scroller.createThreshholder=function(functionToCall,element,inThreshhold){
var lastPosition;
var threshhold=inThreshhold||100;
var scroller=Mojo.View.getScrollerForElement(element);
var target=Element.firstDescendant(scroller);

return function(scrollEnding,position){
if(target){
var scrollStarting=false;
var delta;
if(lastPosition){
delta={x:Math.abs(position.x-lastPosition.x),y:Math.abs(position.y-lastPosition.y)};
}else{
scrollStarting=true;
lastPosition={};
}
if(scrollStarting||scrollEnding||lastPosition===undefined||(delta.x>threshhold)||(delta.y>threshhold)){
lastPosition.x=position.x;
lastPosition.y=position.y;
functionToCall(scrollEnding,position);
}
}
};
};


Mojo.Widget.Scroller.prototype.getScrollerSize=function getScrollerSize(){
var dimensions,parent;
if(this.sizeToWindow){
dimensions=Mojo.View.getViewportDimensions(this.controller.document);
}else{
parent=this.target.parentNode;
dimensions=Mojo.View.getUsableDimensions(parent,true);
}
return dimensions;
};


Mojo.Widget.Scroller.prototype.calculateMinTop=function calculateMinTop(){
var target=this.target;
var minTop,maxHeight;
var dimensions=this.getScrollerSize();
maxHeight=this.getContentSize().height;
minTop=dimensions.height-maxHeight;
if(minTop>-this.kMinimumSizeDifferenceForScrolling){
minTop=0;
}
return minTop;
};


Mojo.Widget.Scroller.prototype.calculateMinLeft=function calculateMinLeft(){
var target=this.target;
var minLeft,maxWidth;
var dimensions=this.getScrollerSize();
maxWidth=this.getContentSize().width;
minLeft=dimensions.width-maxWidth;
if(minLeft>-this.kMinimumSizeDifferenceForScrolling){
minLeft=0;
}
return minLeft;
};

Mojo.Widget.Scroller.validateScrollPositionForElement=function validateScrollPositionForElement(targetElement){
var scroller=Mojo.View.getScrollerForElement(targetElement);
while(scroller){
scroller.mojo.validateScrollPosition();
scroller=Mojo.View.getScrollerForElement(scroller.parentNode);
}
};


(function(){
var axisLimitDegrees=25;
Mojo.Widget.Scroller.prototype.kAxisLimitDegrees=axisLimitDegrees;
var pi180=Math.PI/180;
Mojo.Widget.Scroller.prototype.lowerAngle=(axisLimitDegrees*pi180);
Mojo.Widget.Scroller.prototype.upperAngle=((90-axisLimitDegrees)*pi180);
Mojo.Widget.Scroller.prototype.FADE_ELEMENT_SELECTOR='*['+Mojo.Widget.Scroller.prototype.FADE_ELEMENT_ATTRIBUTE+']';
})();


Mojo.Widget.Scroller.MouseTracker=Class.create({

initialize:function(widget,dragStartEvent,components){
this.widget=widget;
var downEvent=dragStartEvent.down;
this.components=components;
this.lastPointer=Event.pointer(downEvent);
},


dragged:function(draggedEvent){
var moveEvent=draggedEvent.move;
var component;
var pointer=moveEvent.filteredPointer;
var motion={x:0,y:0};
var componentIndex;
for(componentIndex=0;componentIndex<this.components.length;componentIndex++){
component=this.components[componentIndex];
if(this.lastPointer[component]!=pointer[component]){
motion[component]=pointer[component]-this.lastPointer[component];
}
}
this.lastPointer=pointer;
this.widget.handleMotion(motion,pointer);
}
});


Mojo.Widget.Scroller.Indicator=function Indicator(indicatorElement,checkShouldShow){
this.indicatorElement=indicatorElement;
this.isVisible=indicatorElement.visible();
this.checkShouldShow=checkShouldShow;
};


Mojo.Widget.Scroller.Indicator.prototype.update=function update(){
var shouldShow=this.checkShouldShow();
if(shouldShow!=this.isVisible){
if(shouldShow){
this.indicatorElement.show();
}else{
this.indicatorElement.hide();
}
this.isVisible=shouldShow;
}
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Menu={};


Mojo.Menu.viewMenu='palm-view-menu';



Mojo.Menu.commandMenu='palm-command-menu';



Mojo.Menu.appMenu='palm-app-menu';



Mojo.Menu.showAppCmd='palm-show-app-menu';

Mojo.Menu.cutCmd='palm-cut-cmd';
Mojo.Menu.copyCmd='palm-copy-cmd';
Mojo.Menu.pasteCmd='palm-paste-cmd';

Mojo.Menu.prefsCmd='palm-prefs-cmd';
Mojo.Menu.helpCmd='palm-help-cmd';

Mojo.Menu.boldCmd='palm-bold-cmd';
Mojo.Menu.italicCmd='palm-italic-cmd';
Mojo.Menu.underlineCmd='palm-underline-cmd';
Mojo.Menu.selectAllCmd='palm-selectall-cmd';


Mojo.Menu.cutItem={label:$LL('Cut'),command:Mojo.Menu.cutCmd,shortcut:'x',checkEnabled:true};
Mojo.Menu.copyItem={label:$LL('Copy'),command:Mojo.Menu.copyCmd,shortcut:'c',checkEnabled:true};
Mojo.Menu.pasteItem={label:$LL('Paste'),command:Mojo.Menu.pasteCmd,shortcut:'v',checkEnabled:true};
Mojo.Menu.boldItem={label:$LL('Bold'),command:Mojo.Menu.boldCmd,checkEnabled:true};
Mojo.Menu.italicItem={label:$LL('Italic'),command:Mojo.Menu.italicCmd,checkEnabled:true};
Mojo.Menu.underlineItem={label:$LL('Underline'),command:Mojo.Menu.underlineCmd,checkEnabled:true};

Mojo.Menu.selectAllItem={label:$LL('Select All'),command:Mojo.Menu.selectAllCmd,shortcut:'a',checkEnabled:true};


Mojo.Menu.prefsItem={label:$LL('Preferences'),command:Mojo.Menu.prefsCmd,checkEnabled:true};
Mojo.Menu.helpItem={label:$LL('Help'),command:Mojo.Menu.helpCmd,checkEnabled:true};


Mojo.Menu.editItem={label:$LL('Edit'),items:[
Mojo.Menu.selectAllItem,
Mojo.Menu.cutItem,
Mojo.Menu.copyItem,
Mojo.Menu.pasteItem
]};

Mojo.Menu.styleEditItem={label:$LL('Edit'),items:[
Mojo.Menu.selectAllItem,
Mojo.Menu.cutItem,
Mojo.Menu.copyItem,
Mojo.Menu.pasteItem,
Mojo.Menu.boldItem,
Mojo.Menu.italicItem,
Mojo.Menu.underlineItem
]};



Mojo.Widget._Menu=Class.create({

kMenuLeftMargin:0,

kMenuHeight:60,
kMenuSpacerHeight:50,

kAppPopupClass:'capitalize',
kSubmenuPopupClass:'palm-submenu',

kAppPopupScrimClass:'app-menu',

kAppPopupId:'palm-app-menu',

kDontDisplayHiddenMenus:false,




setup:function setup(){
var sceneDiv=this.controller.scene.sceneElement;


this.trackedChildNodes=[];


this.viewModel=this.controller.model.viewModel||{};
this.viewAttrs=this.controller.model.viewAttrs||{};
this.commandModel=this.controller.model.commandModel||{};
this.commandAttrs=this.controller.model.commandAttrs||{};
this.appModel=this.controller.model.appModel||{};
this.appAttrs=this.controller.model.appAttrs||{};

if(this.appAttrs.richTextEditMenu){
this.defaultAppMenuPrefixItems=[Mojo.Menu.styleEditItem];
}else{
this.defaultAppMenuPrefixItems=[Mojo.Menu.editItem];
}

this.commandSpacerHeight=(this.commandAttrs.spacerHeight===undefined)?this.kMenuSpacerHeight:this.commandAttrs.spacerHeight;
this.viewSpacerHeight=(this.viewAttrs.spacerHeight===undefined)?this.kMenuSpacerHeight:this.viewAttrs.spacerHeight;

this.window=this.controller.scene.window;
this.document=this.controller.scene.document;

if(this.viewModel.items){
this.controller.scene.watchModel(this.viewModel,this,this.handleModelChanged);


this.checkItemEnables(this.viewModel.items);



this.viewDiv=this.controller.document.createElement('div');
this.viewDiv.addClassName('palm-menu-spacer');
sceneDiv.insertBefore(this.viewDiv,sceneDiv.firstChild);

this.viewTapHandler=this.tapHandler.bindAsEventListener(this,this.viewDiv);
this.controller.listen(this.viewDiv,Mojo.Event.tap,this.viewTapHandler);
this.viewMenuVisible=this.viewModel.visible===undefined||!!this.viewModel.visible;
this.renderFromModel(this.viewDiv,this.viewModel);




sceneDiv.addClassName('palm-hasheader');

this.controller.scene.handleEdgeVisibility('top',true,this.viewDiv.getDimensions().height);
}

if(this.commandModel.items){
this.controller.scene.watchModel(this.commandModel,this,this.handleModelChanged);


this.checkItemEnables(this.commandModel.items);

this.cmdDiv=this.controller.element;
this.cmdDiv.addClassName('palm-menu-spacer');

this.cmdTapHandler=this.tapHandler.bindAsEventListener(this,this.cmdDiv);
this.controller.listen(this.cmdDiv,Mojo.Event.tap,this.cmdTapHandler);
this.cmdMenuVisible=this.commandModel.visible===undefined||!!this.commandModel.visible;
this.renderFromModel(this.cmdDiv,this.commandModel);

this.handleDocumentActivation=this.handleDocumentActivation.bindAsEventListener(this);
this.controller.listen(this.document,Mojo.Event.activate,this.handleDocumentActivation,false);
this.controller.listen(this.document,Mojo.Event.deactivate,this.handleDocumentActivation,false);

this.controller.scene.handleEdgeVisibility('bottom',true,this.cmdDiv.getDimensions().height);
}

this.handleWindowResize=this.handleWindowResize.bindAsEventListener(this);
this.controller.listen(this.window,'resize',this.handleWindowResize,false);



this.sceneActive=false;
this.handleSceneActivate=this.handleSceneActivate.bindAsEventListener(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.aboutToActivate,this.handleSceneActivate,false);
this.handleSceneDeactivate=this.handleSceneDeactivate.bindAsEventListener(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.handleSceneDeactivate,false);

},

cleanup:function(){
if(this.viewModel.items){
this.controller.stopListening(this.viewDiv,Mojo.Event.tap,this.viewTapHandler);
}
if(this.commandModel.items){
this.controller.stopListening(this.cmdDiv,Mojo.Event.tap,this.cmdTapHandler);
this.controller.stopListening(this.document,Mojo.Event.activate,this.handleDocumentActivation,false);
this.controller.stopListening(this.document,Mojo.Event.deactivate,this.handleDocumentActivation,false);
}

this.controller.stopListening(this.window,'resize',this.handleWindowResize,false);

this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.aboutToActivate,this.handleSceneActivate,false);
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.handleSceneDeactivate,false);
},


handleSceneActivate:function(){


this.sceneActive=true;


if(this.updateCommandMenuOnActivate&&this.commandModel.items){
this.updateCommandMenuOnActivate=false;
this.controller.scene.modelChanged(this.commandModel,undefined);
}
if(this.updateViewMenuOnActivate&&this.viewModel.items){
this.updateViewMenuOnActivate=false;
this.controller.scene.modelChanged(this.viewModel,undefined);
}

},

handleSceneDeactivate:function(){

this.sceneActive=false;
},


handleDocumentActivation:function(event){

this.handleMenuAutoHide.bind(this,(event.type===Mojo.Event.activate)).delay(0.5);
},


handleWindowResize:function(event){
if(this.menuWidth!==this.calcMenuWidth()){





if(this.commandModel.items){
this.controller.scene.modelChanged(this.commandModel,undefined);
}
if(this.viewModel.items){
this.controller.scene.modelChanged(this.viewModel,undefined);
}
}
},

handleMenuAutoHide:function(focused){
var vis=this.getMenuVisible(Mojo.Menu.commandMenu);




if(!focused&&vis){
this.setMenuVisible(Mojo.Menu.commandMenu,false);
this.cmdMenuAutoHidden=true;
}else if(focused&&this.cmdMenuAutoHidden){
this.setMenuVisible(Mojo.Menu.commandMenu,true);
delete this.cmdMenuAutoHidden;
}

},


tapHandler:function(event,widgetNode){
var itemNode=event.target;
var itemModel,itemCmd;
var groupNode,groupModel;

if(!this.controller.scene.isActive()){
return;
}


while(itemNode._mojoMenuItemModel===undefined&&itemNode!==widgetNode){
itemNode=itemNode.parentNode;
}


itemModel=itemNode._mojoMenuItemModel;
if(!itemModel){
return;
}


if(itemModel.disabled){
event.preventDefault();
return;
}


event.stopPropagation();


if(itemModel.submenu){
this.popupSubmenu(itemModel.submenu,event.target,this.kSubmenuPopupClass);
return;
}

itemCmd=itemModel.command;


groupNode=itemNode.parentNode;
while(groupNode&&groupNode._mojoMenuItemModel===undefined&&groupNode!==widgetNode){
groupNode=groupNode.parentNode;
}

if(groupNode&&groupNode!==widgetNode){
groupModel=groupNode._mojoMenuItemModel;
}


if(groupModel&&groupModel.toggleCmd!==undefined&&itemCmd){






if(groupModel.toggleCmd!=itemCmd){
groupModel.toggleCmd=itemCmd;
}else if(groupModel.items.length===1){
groupModel.toggleCmd='';
}
this.applyToggleStyles(groupNode,groupModel.toggleCmd);
}


this.sendCommandEvent(itemCmd,event);

},


showAppMenu:function(){
var popupModel,items;

if(this.appMenuPopup){
this.appMenuPopup.mojo.close();
}
else{





if(this.appAttrs.omitDefaultItems){
items=[];
}else{
items=[this.kDefaultAppMenuSuffixItems];
}


if(this.appModel&&this.appModel.items){
items.unshift(this.appModel.items,{});
}


if(this.appAttrs.omitDefaultItems){
items=items[0];
}else{
items=this.defaultAppMenuPrefixItems.concat.apply(this.defaultAppMenuPrefixItems,items);
}


this.checkItemEnables(items);

popupModel={
onChoose:this.popupChoose.bind(this),
items:items,
popupClass:this.kAppPopupClass,
scrimClass:this.kAppPopupScrimClass,
popupId:this.kAppPopupId,
manualPlacement:true,



_mojoContainerLayer:this.controller.scene.dialogContainerLayer
};

this.appMenuPopup=this.controller.scene.popupSubmenu(popupModel);
}
},


checkItemEnables:function(items){
var i;
var curItem,enableEvt;

for(i=0;i<items.length;i++){
curItem=items[i];

if(curItem.command&&curItem.checkEnabled){
enableEvt=Mojo.Event.make(Mojo.Event.commandEnable,{command:curItem.command});
this.controller.stageController.sendEventToCommanders(enableEvt);

curItem.disabled=enableEvt.defaultPrevented;
}else if(curItem.items){
this.checkItemEnables(curItem.items);
}
}

},



sendCommandEvent:function(cmdName,event){
if(cmdName&&this.controller.scene.isActive()){
this.controller.stageController.sendEventToCommanders(Mojo.Event.make(Mojo.Event.command,{command:cmdName,originalEvent:event}));
}
},


handleModelChanged:function handleModelChanged(model){
var div;
var node;


if(!this.sceneActive){
if(model===this.commandModel){
this.updateCommandMenuOnActivate=true;
}else if(model===this.viewModel){
this.updateViewMenuOnActivate=true;
}
return;
}


if(model===this.commandModel){
div=this.cmdDiv;
}else if(model===this.viewModel){
div=this.viewDiv;
}
else{
return;
}


if(div){
this.resetChildNodeTracking();
if(div.firstChild){
div.removeChild(div.firstChild);
}

node=this.renderFromModel(div,model);

this.resetChildNodeTracking();
}
},


toggleMenuVisible:function(which){
if(which==Mojo.Menu.viewMenu){
this.setMenuVisible(which,!this.viewMenuVisible);
}else if(which==Mojo.Menu.commandMenu){
this.setMenuVisible(which,!this.cmdMenuVisible);
}
},



getMenuVisible:function(which){
if(which==Mojo.Menu.viewMenu){
return this.viewMenuVisible;
}else if(which==Mojo.Menu.commandMenu){
return this.cmdMenuVisible;
}
},


setMenuVisible:function(which,visible){
var node;
var animator;
var onComplete;


if(!visible&&this.kDontDisplayHiddenMenus){
onComplete=this.applyDisplayNone;
}


if(which==Mojo.Menu.commandMenu){
delete this.cmdMenuAutoHidden;
}


if(which==Mojo.Menu.viewMenu&&this.viewDiv&&visible!=this.viewMenuVisible){
this.viewMenuVisible=visible;
if(this.viewModel.visible!==undefined){
this.viewModel.visible=visible;
}


if(visible&&this.kDontDisplayHiddenMenus){
this.viewDiv.style.display='';
this.controller.scene.showWidgetContainer(this.viewDiv);
}

animator=Mojo.Animation.animateStyle(this.viewDiv,'height','ease-in-out',{
from:0,
to:this.viewSpacerHeight,
duration:0.15,
reverse:!visible,
onComplete:onComplete});

animator=Mojo.Animation.animateStyle(this.viewDiv.firstChild,'top','ease-in-out',{
from:-1*this.kMenuHeight,
to:0,
duration:0.15,
reverse:!visible});
this.controller.scene.handleEdgeVisibility('top',visible,this.viewSpacerHeight);



}
else if(which==Mojo.Menu.commandMenu&&this.cmdDiv&&visible!=this.cmdMenuVisible){
this.cmdMenuVisible=visible;
if(this.commandModel.visible!==undefined){
this.commandModel.visible=visible;
}


if(visible&&this.kDontDisplayHiddenMenus){
this.cmdDiv.style.display='';
this.controller.scene.showWidgetContainer(this.cmdDiv);
}

animator=Mojo.Animation.animateStyle(this.cmdDiv,'height','ease-in-out',{
from:0,
to:this.commandSpacerHeight,
duration:0.15,
reverse:!visible,
onComplete:onComplete});

animator=Mojo.Animation.animateStyle(this.cmdDiv.firstChild,'bottom','ease-in-out',{
from:-1*this.kMenuHeight,
to:0,
duration:0.15,
reverse:!visible});

this.controller.scene.handleEdgeVisibility('bottom',visible,this.commandSpacerHeight);



}
},


applyDisplayNone:function(element,cancelled){
if(!cancelled){
this.controller.scene.hideWidgetContainer(element);
element.style.display='none';
}
},


calcMenuWidth:function(){

return this.window.innerWidth-(2*this.kMenuLeftMargin);
},

resetChildNodeTracking:function(){
this.trackedChildNodes.clear();
},


renderFromModel:function renderFromModel(element,model){

var node=this.renderItemList(Mojo.Widget.getSystemTemplatePath("menu/menu"),model.items);

this.menuWidth=this.calcMenuWidth();


element.appendChild(node);

this.controller.instantiateChildWidgets(node);
this.controller.scene.showWidgetContainer(node);

this.calculateMenuLayout(node,model.items);


if(model===this.commandModel){
node.addClassName('command-menu');
node.addClassName(this.commandAttrs.menuClass!==undefined?this.commandAttrs.menuClass:'palm-default');
}else if(model===this.viewModel){
node.addClassName('view-menu');
node.addClassName(this.viewAttrs.menuClass!==undefined?this.viewAttrs.menuClass:'palm-default');
}

if(element===this.cmdDiv){
element.style.height=this.cmdMenuVisible?(this.commandSpacerHeight+'px'):'0px';
element.firstChild.style.bottom=this.cmdMenuVisible?'0px':(-1*this.kMenuHeight+'px');
}else{
element.style.height=this.viewMenuVisible?(this.viewSpacerHeight+'px'):'0px';
element.firstChild.style.top=this.viewMenuVisible?'0px':(-1*this.kMenuHeight+'px');
}

return node;
},


renderItemList:function renderItemList(containerTemplate,itemList){

var i;
var obj={menuItems:"<div id='MojoMenuItemsParentMarker'></div>"};
var itemsHTML;
var node;


node=Mojo.View.convertToNode(Mojo.View.render({object:obj,template:containerTemplate}),this.controller.document);


var markerNode=node.querySelector('#MojoMenuItemsParentMarker');
var itemsParent=markerNode.parentNode;
itemsParent.removeChild(markerNode);
node._mojoMenuItemsParent=itemsParent;


for(i=0;i<itemList.length;i++){
this.renderItemInto(itemsParent,itemList[i]);
}

return node;
},


renderItemInto:function renderItemInto(parent,itemModel){
var content;
var node;




if(itemModel.template){
content=Mojo.View.render({object:itemModel,template:itemModel.template});
node=Mojo.View.convertToNode(content,this.controller.document);
}


else if(itemModel.items){
node=this.renderItemList(Mojo.Widget.getSystemTemplatePath("menu/group"),itemModel.items);
if(itemModel.toggleCmd){
this.applyToggleStyles(node,itemModel.toggleCmd);
}
}


else if(itemModel.command||itemModel.submenu){
if(itemModel.iconPath){
content=Mojo.View.render({object:{iconPath:"background-image: url("+itemModel.iconPath+");"},
template:Mojo.Widget.getSystemTemplatePath("menu/icon-choice")});
}else if(itemModel.icon){
content=Mojo.View.render({object:{icon:itemModel.icon},template:Mojo.Widget.getSystemTemplatePath("menu/icon-choice")});
}else{
content=Mojo.View.render({object:{label:itemModel.label},template:Mojo.Widget.getSystemTemplatePath("menu/text-choice")});
}
node=Mojo.View.convertToNode(content,this.controller.document);

if(itemModel.disabled){
node.addClassName('palm-disabled');
}
}


else if(itemModel.icon||itemModel.iconPath){
Mojo.Log.warn("WARNING: Icon labels are not supported in menus. Did you mean to specify a command?");
}else if(itemModel.label!==undefined){
node=Mojo.View.convertToNode(Mojo.View.render({object:{label:itemModel.label},template:Mojo.Widget.getSystemTemplatePath("menu/label")}),
this.controller.document);
}



if(node){
node._mojoMenuItemModel=itemModel;

if(itemModel.width&&!itemModel.items){
node._mojoMenuItemWidth=itemModel.width;
node.style.width=itemModel.width+'px';
}

this.trackedChildNodes.push(node);
parent.appendChild(node);
}

},

setModel:function setModel(newModel){
Mojo.Log.error("WARNING: Setting the model on a menu is not currently supported.");




},


calculateMenuLayout:function calculateMenuLayout(menuNode,models){
var dividerCount=0,itemCount=0;
var i;
var dividerWidth,interItemSpace;
var totalWidth,widthScaling;
var count;





count=this.countItems(models);
dividerCount=count.dividers;
itemCount=count.items;


totalWidth=this.calculateItemWidths(menuNode._mojoMenuItemsParent)+count.dividersWidth;



if(totalWidth>this.menuWidth){
widthScaling=this.menuWidth/totalWidth;
dividerWidth=0;
interItemSpace=0;
}
else{
widthScaling=1;
interItemSpace=this.menuWidth-totalWidth;


if(dividerCount>0){
dividerWidth=Math.floor(interItemSpace/dividerCount);
interItemSpace=0;
}else{
interItemSpace=Math.floor(interItemSpace/(itemCount-1));
}
}



this.assignItemPositions(menuNode,models,widthScaling,dividerWidth,interItemSpace);

},


countItems:function(items){
var subCounts;
var counts={dividers:0,items:0,dividersWidth:0};
var i,item;

for(i=0;i<items.length;i++){
item=items[i];
if(this.isDivider(item)){



if(item.width===undefined){
counts.dividers++;
}else{

counts.dividersWidth+=item.width;
}

}else{




if(item.expand){
counts.dividers++;
}else{
counts.items++;
}



if(item.items){
subCounts=this.countItems(item.items);
counts.dividers+=subCounts.dividers;
counts.dividersWidth+=subCounts.dividersWidth;
}
}
}

return counts;
},


assignItemPositions:function(node,itemModels,widthScaling,dividerWidth,interItemSpace){
var items=node._mojoMenuItemsParent.childNodes;
var item;
var currentLeft=this.kMenuLeftMargin;
var modelIndex=0;
var i;
for(i=0;i<items.length;i++){
item=items[i];


if(item._mojoMenuItemModel){
while(this.isDivider(itemModels[modelIndex])){
currentLeft+=(itemModels[modelIndex].width||dividerWidth);
modelIndex++;
}

item.style.left=currentLeft+'px';


if(item._mojoMenuItemModel.expand){
item._mojoMenuItemWidth+=dividerWidth;
item.style.width=item._mojoMenuItemWidth+'px';
}

currentLeft+=interItemSpace;




if(item._mojoMenuItemsParent){

item._mojoMenuItemWidth=this.assignItemPositions(item,item._mojoMenuItemModel.items,widthScaling,dividerWidth,0);
item._mojoMenuItemWidth/=widthScaling;
}

currentLeft+=Math.floor(item._mojoMenuItemWidth*widthScaling);

modelIndex++;
}
}
return currentLeft;
},


calculateItemWidths:function(node){
var items=node._mojoMenuItemsParent.childNodes;
var i,item;
var total=0;

for(i=0;i<items.length;i++){
item=items[i];


if(!item._mojoMenuItemModel){
continue;
}


if(item._mojoMenuItemWidth){
total+=item._mojoMenuItemWidth;
}
else if(item._mojoMenuItemModel.expand){

item._mojoMenuItemWidth=0;
}
else{




if(item._mojoMenuItemsParent){
total+=this.calculateItemWidths(item);
}else{
item._mojoMenuItemWidth=item.getWidth();
total+=item._mojoMenuItemWidth;
}
}

}

return total;
},


applyToggleStyles:function applyToggleStyles(groupNode,chosenCmd){
var node;
var itemsParent=groupNode._mojoMenuItemsParent;

for(var i=0;i<itemsParent.childNodes.length;i++){
node=itemsParent.childNodes[i];
if(node._mojoMenuItemModel){
if(node._mojoMenuItemModel.command==chosenCmd){
node.addClassName('palm-depressed');
}else{
node.removeClassName('palm-depressed');
}
}
}
},


isDivider:function(item){
return!((item.label!==undefined)||item.icon||item.iconPath||item.items||item.template);
},


popupSubmenu:function(submenuName,eventTarget,popupClass){


var menu=this.controller.scene.getWidgetSetup(submenuName);
menu=menu&&menu.model;

Mojo.assert(menu,"Submenu '"+submenuName+"' cannot be displayed, because it has not been set up or has no model. Check your call to setupWidget().");


this.checkItemEnables(menu.items);

menu=Mojo.Model.decorate(menu);
menu.onChoose=this.popupChoose.bind(this);
menu.placeNear=eventTarget;
menu.popupClass=popupClass;
return this.controller.scene.popupSubmenu(menu);

},


popupChoose:function(command){



this.sendCommandEvent(command);
delete this.appMenuPopup;
},

handleShortcut:function(which,event){





var result=false;
result=this.tryShortcut(this.commandModel.items,which,event);
result=result||this.tryShortcut(this.viewModel.items,which,event);
result=result||this.tryShortcut(this.appModel.items,which,event);

if(!result&&!this.appAttrs.omitDefaultItems){
result=this.tryShortcut(this.defaultAppMenuPrefixItems,which,event)||
this.tryShortcut(this.kDefaultAppMenuSuffixItems,which,event);
}

return result;
},




tryShortcut:function(items,which,event){
var i;
var item;
var result=false;

if(!items){
return false;
}

for(i=0;i<items.length;i++){
item=items[i];


if(item.command&&item.shortcut&&item.shortcut.toUpperCase()==which){



if(item.checkEnabled){
this.checkItemEnables([item]);
}


if(!item.disabled){
this.sendCommandEvent(item.command,event);
}
return true;
}

else if(item.items){
result=this.tryShortcut(item.items,which,event);
}

else if(item.submenu){
item=this.controller.scene.getWidgetSetup(item.submenu);
item=item&&item.model.items;
result=this.tryShortcut(item,which,event);
}

if(result){
return true;
}
}

return false;
}

});

Mojo.Widget._Menu.prototype.kDefaultAppMenuSuffixItems=[Mojo.Menu.prefsItem,Mojo.Menu.helpItem];












/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.PatternMatching={};


Mojo.PatternMatching.getContactPatternMatch=function(filter){


var strippedFilter=filter;
var first;
var last;
var flPatternStr;
var flPattern;

strippedFilter=filter.split(" ");

if(strippedFilter.length<2){
first=strippedFilter[0].charAt(0);
last=strippedFilter[0].substr(1);
}else{
first=strippedFilter[0];
last=strippedFilter[1];
}

flPatternStr="(^first)(.*\\s+)(last)";
flPatternStr=flPatternStr.replace(/first/,first);
flPatternStr=flPatternStr.replace(/last/,last);
flPattern=new RegExp(flPatternStr,'i');
return flPattern;
};



Mojo.PatternMatching.addContactMatchFormatting=function(input,filter,template){
var matchTemplateFile;
var formattedText;
var matchTemplate;
var patternStr;
var beginPattern;

if(!input){
return input;
}
if(!filter||filter.length===0){
return input;
}

matchTemplateFile=template||Mojo.Widget.getSystemTemplatePath('/matched');
matchTemplate=Mojo.View.render({object:{match:'ZZZZ'},template:matchTemplateFile});




patternStr="\\b("+filter+")";
beginPattern=new RegExp(patternStr,'ig');

if(filter.search(/\S\s*\S/)!=-1){

var flPattern=Mojo.PatternMatching.getContactPatternMatch(filter);
}


input=input.escapeHTML();
formattedText=input.replace(beginPattern,function(whole,match){
return matchTemplate.replace('ZZZZ',match);
});


if(flPattern&&formattedText==input){
formattedText=input.replace(flPattern,function(whole,first,other,last){
return matchTemplate.replace('ZZZZ',first)+other+matchTemplate.replace('ZZZZ',last);
});
}
return unescape(formattedText);
};

Mojo.PatternMatching.addContactNameFormatting=function(c,addr){
var firstLetter;
var display="";
if(c.firstName){
display=c.firstName;
}
if(c.lastName){
display+=" "+c.lastName;
firstLetter=c.lastName.slice(0,1).toLocaleUpperCase();
}
if(display.blank()){
display=c.companyName||"";
}
if(display.blank()){
display=c.displayText||"";
}

if(display.blank()&&addr){

var str=addr;
if(str){
var atSign=str.indexOf('@');
if(atSign>-1){
display=str.substring(0,atSign);
c.displayIsEmail=true;
}else{
display=str;
}
}
}

if(display.blank()&&c.contactDisplay){
display=c.contactDisplay;
}

return display;
};

Mojo.PatternMatching.addContactLabelFormatting=function(type,label,customLabel,serviceName){
var formattedLabel='';

label=parseInt(label,10);
if(type==='PHONE'){
switch(label){
case 0:
formattedLabel=$LL('home');
break;

case 1:
formattedLabel=$LL('work');
break;

case 2:
if(!customLabel||customLabel.blank()){
formattedLabel=$LL('other');
}else{
formattedLabel=customLabel;
}
break;

case 3:
formattedLabel=$LL('mobile');
break;

case 4:
formattedLabel=$LL('pager');
break;

case 5:
formattedLabel=$LL('personal fax');
break;

case 6:
formattedLabel=$LL('work fax');
break;

case 7:
formattedLabel=$LL('main');
break;

default:
break;
}
}else if(type==='EMAIL'){
switch(label){
case 0:
formattedLabel=$LL('home');
break;

case 1:
formattedLabel=$LL('work');
break;

case 2:
if(!customLabel||customLabel.blank()){
formattedLabel=$LL('other');
}else{
formattedLabel=customLabel;
}
break;

default:
break;
}
}else if(type==='IM'){
if(serviceName){
formattedLabel=Mojo.PatternMatching.IMNamelabels[serviceName.toLowerCase()]||'IM';
}else{
switch(label){
case 0:
case 1:
formattedLabel=$LL('IM');
break;

case 2:
if(!customLabel||customLabel.blank()){
formattedLabel=$LL('other');
}else{
formattedLabel=customLabel;
}
break;

default:
break;
}
}
}
return formattedLabel;
};


Mojo.PatternMatching.IMNamelabels={'aol':'AIM',
'yahoo':'Yahoo!',
'gmail':'Google',
'msn':'MSN',
'jabber':'Jabber',
'icq':'ICQ',
'irc':'IRC',
'qq':'QQ',
'skype':'Skype',
'noDomain':'IM'
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Char={};

Mojo.Char.backspace=8;
Mojo.Char.tab=9;
Mojo.Char.enter=13;
Mojo.Char.shift=16;
Mojo.Char.opt=17;
Mojo.Char.ctrl=17;
Mojo.Char.sym=17;
Mojo.Char.altKey=18;
Mojo.Char.pause=19;
Mojo.Char.breakKey=19;
Mojo.Char.capsLock=20;
Mojo.Char.escape=27;
Mojo.Char.spaceBar=32;
Mojo.Char.pageUp=33;
Mojo.Char.pageDown=34;
Mojo.Char.end=35;
Mojo.Char.home=36;
Mojo.Char.leftArrow=37;
Mojo.Char.upArrow=38;
Mojo.Char.rightArrow=39;
Mojo.Char.downArrow=40;
Mojo.Char.insert=45;
Mojo.Char.deleteKey=46;
Mojo.Char.zero=48;
Mojo.Char.one=49;
Mojo.Char.two=50;
Mojo.Char.three=51;
Mojo.Char.four=52;
Mojo.Char.five=53;
Mojo.Char.six=54;
Mojo.Char.seven=55;
Mojo.Char.eight=56;
Mojo.Char.nine=57;
Mojo.Char.a=65;
Mojo.Char.b=66;
Mojo.Char.c=67;
Mojo.Char.d=68;
Mojo.Char.e=69;
Mojo.Char.f=70;
Mojo.Char.g=71;
Mojo.Char.h=72;
Mojo.Char.i=73;
Mojo.Char.j=74;
Mojo.Char.k=75;
Mojo.Char.l=76;
Mojo.Char.m=77;
Mojo.Char.n=78;
Mojo.Char.o=79;
Mojo.Char.p=80;
Mojo.Char.q=81;
Mojo.Char.r=82;
Mojo.Char.s=83;
Mojo.Char.t=84;
Mojo.Char.u=85;
Mojo.Char.v=86;
Mojo.Char.w=87;
Mojo.Char.x=88;
Mojo.Char.y=89;
Mojo.Char.z=90;
Mojo.Char.leftWindowKey=91;
Mojo.Char.rightWindowKey=92;
Mojo.Char.selectKey=93;
Mojo.Char.numpad0=96;
Mojo.Char.numpad1=97;
Mojo.Char.numpad2=98;
Mojo.Char.numpad3=99;
Mojo.Char.numpad4=100;
Mojo.Char.numpad5=101;
Mojo.Char.numpad6=102;
Mojo.Char.numpad7=103;
Mojo.Char.numpad8=104;
Mojo.Char.numpad9=105;
Mojo.Char.multiply=106;
Mojo.Char.add=107;
Mojo.Char.subtract=109;
Mojo.Char.decimalPoint=110;
Mojo.Char.divide=111;
Mojo.Char.f1=112;
Mojo.Char.f2=113;
Mojo.Char.f3=114;
Mojo.Char.f4=115;
Mojo.Char.f5=116;
Mojo.Char.f6=117;
Mojo.Char.f7=118;
Mojo.Char.f8=119;
Mojo.Char.f9=120;
Mojo.Char.f10=121;
Mojo.Char.f11=122;
Mojo.Char.f12=123;
Mojo.Char.numLock=144;
Mojo.Char.scrollLock=145;
Mojo.Char.semiColon=186;
Mojo.Char.equalSign=187;
Mojo.Char.comma=188;
Mojo.Char.dash=189;
Mojo.Char.period=190;
Mojo.Char.forwardSlash=191;
Mojo.Char.graveAccent=192;
Mojo.Char.openBracket=219;
Mojo.Char.backSlash=220;
Mojo.Char.closeBracket=221;
Mojo.Char.singleQuote=222;

Mojo.Char.metaKey=231;


Mojo.Char.asciiZero=48;
Mojo.Char.asciiNine=57;




Mojo.Char.isEnterKey=function(key){
if(key==Mojo.Char.enter){
return true;
}
return false;
};


Mojo.Char.isDeleteKey=function(key){
if(key==Mojo.Char.deleteKey||key==Mojo.Char.backspace){
return true;
}
return false;
};



Mojo.Char.isCommitKey=function(key){

if(key==59||key==Mojo.Char.semiColon||key==Mojo.Char.comma||key==44){
return true;
}
return false;
};


Mojo.Char.isValidWrittenChar=function(keyCode){
var s=String.fromCharCode(keyCode);
var valid="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-+ !@#$%^&*()\"'/?><.,=_";
if(valid.indexOf(s)>=0){
return s;
}
return null;
};

Mojo.Char.isDigit=function(charCode){
return charCode>=Mojo.Char.zero&&charCode<=Mojo.Char.nine;
};


Mojo.Char.isValidWrittenAsciiChar=function(keyCode){
return(keyCode>=32&&keyCode<127);
};




Mojo.Char.isValid=function(keyCode){

if((keyCode===0x20)||(keyCode>=0x26&&keyCode<=0x5F)||

(keyCode>=0x6A&&keyCode<=0x6F)||

(keyCode>=0xBA&&keyCode<=0xC0)||

(keyCode>=0xDB&&keyCode<=0xDF)||


(keyCode===0xE2)||(keyCode===0x20AC)){
return true;
}
return false;
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.FilePicker={};


Mojo.FilePicker.pickFile=function(params,stageController){

Mojo.assert(params,"Mojo.Widget.pickFile requires params to be defined.");
Mojo.assert(stageController,"Mojo.Widget.pickFile requires a stage controller to be defined.");

var picker={
params:params,
_onSelect:params.onSelect,
_onCancel:params.onCancel,
_onCommand:params.onAppMenuCommand
};


params._hasCancelCallback=params.onCancel?true:undefined;
params._hasSelectCallback=params.onSelect?true:undefined;
params._hasCommandCallback=params.onAppMenuCommand?true:undefined;




if(Mojo.appInfo.id==Mojo.FilePicker.appId){

params._noCrossApp=true;
}
else{


params.onSelect=undefined;
params.onCancel=undefined;
params.onAppMenuCommand=undefined;

params.onValidate=undefined;
}

if(params._noCrossApp){

stageController.pushScene(Mojo.FilePicker.findDefaultView(params),picker);
}
else{
var args={
appId:Mojo.FilePicker.appId,
name:Mojo.FilePicker.findDefaultView(params),
callbackHandler:function(responseCallback,returnParams){

Mojo.Log.info('Mojo.FilePicker handling callback %j',returnParams);

if(returnParams.cancel){
if(picker._onCancel){
picker._onCancel();
}
}
else
if(returnParams.select){
if(picker._onSelect){
picker._onSelect(returnParams.select);
}
else{
Mojo.Log.error('Missing onSelect callback in FilePicker.pickFile');
}
}
else if(returnParams.command){
if(picker._onCommand){
picker._onCommand(returnParams.command);
}
}
}
};
stageController.pushScene(args,picker);
}
};


Mojo.FilePicker.pickRingtone=function(params,stageController){

Mojo.assert(params,"Mojo.Widget.pickRingtone requires params to be defined.");
Mojo.assert(stageController,"Mojo.Widget.pickRingtone requires a stage controller to be defined.");

params.kind='ringtone';
params.kinds=undefined;
params.defaultKind=undefined;

Mojo.FilePicker.pickFile(params,stageController);
};


Mojo.FilePicker.findDefaultView=function(params){
var views={};

views.image='imagealbum';
views.audio='audio';
views.video='video';
views.file='files';
views.ringtone='ringtone';

var defaultKind=params.defaultKind?params.defaultKind:(params.kind?params.kind:((params.kinds&&params.kinds.length>0)?params.kinds[0]:'file'));
var view=defaultKind?views[defaultKind]:undefined;
if(!view){
view=views.file;
}
return view;
};


Mojo.FilePicker.appId='com.palm.systemui';
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Test={};

Mojo.Test.passed={};
Mojo.Test.beforeFinished={};


Mojo.Test.CollectionRunner=function CollectionRunner(tests,options){
this.options=options||{};
this.tests=$A(tests);
this.listeners=[];
};


Mojo.Test.loadCollection=function loadCollection(pathToSpecification,loadFinishedCallback){
var collection=[];
var sync,loadCallback;
var specAsJSONText=palmGetResource(pathToSpecification);
var syncCallback=loadFinishedCallback||Mojo.doNothing;
if(specAsJSONText){
collection=Mojo.parseJSON(specAsJSONText);
for(var i=collection.length-1;i>=0;i--){
var testSpec=collection[i];
var f=Mojo.findConstructorFunction(testSpec.testFunction);
if(!f){
if(!sync){
sync=new Mojo.Function.Synchronize({syncCallback:syncCallback});
}
loadCallback=sync.wrap(Mojo.doNothing);
Mojo.loadScriptWithCallback(testSpec.source,loadCallback);
}
}
if(!sync&&loadFinishedCallback){
loadFinishedCallback();
}
}
return collection;
};


Mojo.Test.CollectionRunner.prototype.start=function start(callback){
this.results=[];
this.callback=callback;
this.runNextTest();
};


Mojo.Test.CollectionRunner.prototype.stop=function stop(){
this.stopRequested=true;
if(this.currentTestRunner){
this.currentTestRunner.stop();
}
};


Mojo.Test.CollectionRunner.prototype.runNextTest=function runNextTest(){
delete this.currentTestRunner;
if(this.stopRequested){
delete this.currentTest;
this.stopped=true;
}else{
this.currentTest=this.tests.shift();
}

if(this.currentTest){
this.runCurrentTest();
}else{
this.callback();
}
};


Mojo.Test.CollectionRunner.prototype.runCurrentTest=function runCurrentTest(){
this.currentTestRunner=new Mojo.Test.Runner(this,this.currentTest,{perf:this.options.perf});
this.currentTestRunner.start();
};



Mojo.Test.CollectionRunner.prototype.testFinished=function testFinished(test){
this.results=this.results.concat(test.results);
var that=this;
var deferNextText=function(){
that.runNextTest();
};
deferNextText.defer();
};


Mojo.Test.Runner=function Runner(parentRunner,testConstructorFunction,options){
this.options=options||{};
this.timeoutInterval=testConstructorFunction.timeoutInterval||1000;
this.timeoutFired={};
this.afterCalled={};
this.parentRunner=parentRunner;
this.testConstructorFunction=testConstructorFunction;
if(this.options.perf){
this.findMeasureFunctions();
}else{
this.findTestFunctions();
}
};

Mojo.Test.Runner.prototype.findFunctionsCommon=function findFunctionsCommon(arrayName,functionPrefix){
var names=this.testConstructorFunction[arrayName];
if(names!==undefined){
Mojo.requireArray(names,"testConstructorFunction."+arrayName+" must be undefined or an array.");
this.functionsToRun=$A(names);
return;
}
this.functionsToRun=[];
for(var propertyName in this.testConstructorFunction.prototype){
if(propertyName.startsWith(functionPrefix)){
var f=this.testConstructorFunction.prototype[propertyName];
if(Object.isFunction(f)){
this.functionsToRun.push(propertyName);
}
}
}
};


Mojo.Test.Runner.prototype.findTestFunctions=function findTestFunctions(){
this.findFunctionsCommon("testFunctionNames","test");
};


Mojo.Test.Runner.prototype.findMeasureFunctions=function findMeasureFunctions(){
this.findFunctionsCommon("measureFunctionNames","measure");
};


Mojo.Test.Runner.prototype.start=function start(){
if(this.running){
throw new Error("Can't start tests that are already running.");
}
this.running=true;
this.results=[];
this.runNextTest();
};


Mojo.Test.Runner.prototype.stop=function stop(){
if(!this.running){
throw new Error("Can't stop tests that are not already running.");
}
this.stopRequested=true;
};


Mojo.Test.Runner.prototype.tickle=function tickle(testMethodName){
this.stopTimeout();
this.startTimeout(testMethodName);
};


Mojo.Test.Runner.prototype.startTimeout=function startTimeout(testMethodName){
this.timeoutFired[testMethodName]=false;
this.testTimeout=window.setTimeout(this.timeoutHandler.bind(this,testMethodName),this.timeoutInterval);
};


Mojo.Test.Runner.prototype.stopTimeout=function stopTimeout(){
window.clearTimeout(this.testTimeout);
};


Mojo.Test.Runner.prototype.timeoutHandler=function timeoutHandler(testMethodName){
this.recordResult(testMethodName,"Timeout fired while waiting for test to finish.");
this.timeoutFired[testMethodName]=true;
};


Mojo.Test.Runner.prototype.runNextTest=function runNextTest(){
var testMethodName;
if(!this.stopRequested){
testMethodName=this.functionsToRun.shift();
}
if(testMethodName){
this.currentTest=new this.testConstructorFunction(this.tickle.bind(this,testMethodName));
if(this.options.perf){
this.currentTest.timing=Mojo.Timing;
}
this.startTimeout(testMethodName);
this.callBeforeMethod(testMethodName);
}else{
this.running=false;
this.parentRunner.testFinished(this);
}
};


Mojo.Test.Runner.prototype.makeResultFromException=function makeResultFromException(suitName,methodName,e){
return{
passed:false,
suite:suitName,
method:methodName,
message:e.toString()
};
};


Mojo.Test.Runner.prototype.makeResultMessage=function makeResultFromException(suitName,methodName,message,isMeasurement){
if(message===Mojo.Test.passed){
message=undefined;
}
return{
passed:isMeasurement||!message,
suite:suitName,
method:methodName,
message:message||"Passed."
};
};


Mojo.Test.Runner.prototype.callBeforeMethod=function callBeforeMethod(testMethodName){
var nextMethod;
if(this.options.perf){
nextMethod=this.executeMeasureMethod.bind(this,testMethodName);
}else{
nextMethod=this.executeTestMethod.bind(this,testMethodName);

}
if(this.currentTest.before){
try{
var r=this.currentTest.before(nextMethod);
if(r===Mojo.Test.beforeFinished){
this.executeTestMethod(testMethodName);
}
}catch(e){
this.results.push(this.makeResultFromException(this.testConstructorFunction.name,testMethodName,e));
this.runNextTest();
}
}else{
nextMethod();
}
};


Mojo.Test.Runner.prototype.afterCallback=function afterCallback(testMethodName){
this.stopTimeout();
this.runNextTest();
};


Mojo.Test.Runner.prototype.callAfterMethod=function callAfterMethod(testMethodName){
if(this.afterCalled[testMethodName]){
return;
}
if(this.currentTest.after){
this.currentTest.after(this.afterCallback.bind(this,testMethodName));
}else{
this.afterCallback(testMethodName);
}
this.afterCalled[testMethodName]=true;
};


Mojo.Test.Runner.prototype.recordResult=function recordResult(testMethodName,result){
if(!this.timeoutFired[testMethodName]){
this.results.push(this.makeResultMessage(this.testConstructorFunction.name,testMethodName,result));
}
this.callAfterMethod(testMethodName);
};


Mojo.Test.Runner.prototype.recordMeasurement=function recordMeasurement(measureMethodName,result){
this.results.push(this.makeResultMessage(this.testConstructorFunction.name,measureMethodName,result,true));
this.callAfterMethod(measureMethodName);
};


Mojo.Test.Runner.prototype.executeMethodCommon=function executeMethodCommon(methodName,handleResult){
if(this.timeoutFired[methodName]){
return;
}
this.tickle(methodName);
var f=this.currentTest[methodName];
if(f){
try{
var result=f.call(this.currentTest,handleResult);
if(result===Mojo.Test.passed||Object.isString(result)){
handleResult(result);
}
}catch(e){
this.results.push(this.makeResultFromException(this.testConstructorFunction.name,methodName,e));
this.callAfterMethod(methodName);
}
}else{
this.callAfterMethod(methodName);
}
};


Mojo.Test.Runner.prototype.executeTestMethod=function executeTestMethod(testMethodName){
var that=this;
var recordTestResult=function(result){
if(result===Mojo.Test.passed||Object.isString(result)||result===undefined){
that.recordResult(testMethodName,result);
}
};
this.executeMethodCommon(testMethodName,recordTestResult);
};


Mojo.Test.Runner.prototype.executeMeasureMethod=function executeMeasureMethod(measureMethodName){
var that=this;
var recordMeasurement=function(result){
that.recordMeasurement(measureMethodName,result);
};
this.executeMethodCommon(measureMethodName,recordMeasurement);
};



Mojo.Test.validate=function validate(recordResults,f){
try{
f();
recordResults(Mojo.Test.passed);
}catch(e){
recordResults(e.toString());
}
};

Mojo.Test.pushTestScene=function pushTestScene(stageController,testParams){
var sceneArgs={
name:'test',
assistantConstructor:Mojo.Test.TestAssistant,
sceneTemplate:Mojo.Widget.getSystemTemplatePath('test/test-scene')
};
stageController.pushScene(sceneArgs,testParams);
};


Mojo.Test.TestAssistant=function(testRunParams){
var preferredTest=this.ALL_TESTS;
var perf=false;
this.cookie=new Mojo.Model.Cookie("TestRunnerPrefs");
var prefs=this.cookie.get();
if(prefs){
preferredTest=prefs.preferredTest;
perf=prefs.perf;
}
this.testCollection=[];

this.createTestChoices();

this.testPrefsModel={
selectedTests:preferredTest,
choices:this.testChoices,
perf:perf
};

this.testSelectorAttributes={
label:'Test',
modelProperty:'selectedTests'
};

this.testsLoaded=this.testsLoaded.bind(this);
this.updatePrefs=this.updatePrefs.bind(this);

this.testRunParams=testRunParams;
};

Mojo.Test.TestAssistant.prototype.ALL_TESTS="ALL_TESTS";


Mojo.Test.TestAssistant.prototype.setup=function(){
var dividerFunc=function(testResult){
return testResult.suite;
};


this.testCollection=Mojo.Test.loadCollection(Mojo.appPath+"tests/all_tests.json",this.testsLoaded);

this.resultsModel={listTitle:'Waiting for Run',items:[]};

this.controller.setupWidget('test-results',
{itemTemplate:Mojo.Widget.getSystemTemplatePath('test/result'),
listTemplate:Mojo.Widget.getSystemTemplatePath('test/testcontainer'),
dividerTemplate:Mojo.Widget.getSystemTemplatePath('test/divider'),dividerFunction:dividerFunc},
this.resultsModel);

this.controller.setupWidget(Mojo.Menu.viewMenu,undefined,{items:[{label:"Unit Test"},{}]});

this.controller.setupWidget(Mojo.Menu.commandMenu,undefined,
{items:[
{label:"Run",command:'run'}
]});

this.controller.setupWidget('test_selector',this.testSelectorAttributes,this.testPrefsModel);
this.controller.listen('test_selector',Mojo.Event.propertyChange,this.updatePrefs);

this.controller.setupWidget('perf_toggle',{modelProperty:'perf'},this.testPrefsModel);
this.controller.listen('perf_toggle',Mojo.Event.propertyChange,this.updatePrefs);

this.testRunningSpinner=this.controller.get('test-running-spinner');
this.summary=this.controller.get('summary');
};

Mojo.Test.TestAssistant.prototype.testsLoaded=function testsLoaded(){
Mojo.Log.info("tests loaded");
this.createTestChoices();
this.testPrefsModel.choices=this.testChoices;
this.controller.modelChanged(this.testPrefsModel);
if(this.testRunParams&&this.testRunParams.runAll){
var resultsFunction=this.sendResults.bind(this,this.testRunParams.resultsUrl);
this.runAllTests.bind(this,resultsFunction).delay(0.5);
}
};

Mojo.Test.TestAssistant.prototype.updatePrefs=function updatePrefs(propChangeEvent){
this.cookie.put({
preferredTest:this.testPrefsModel.selectedTests,
perf:this.testPrefsModel.perf
});
};

Mojo.Test.TestAssistant.prototype.createTestChoices=function updateTestsMenu(){
var choices=[
{
label:'All Tests',
value:this.ALL_TESTS
}
];
var newNames=this.testCollection.each(function(testSpec){
var newChoice={
label:testSpec.title,
value:testSpec.testFunction
};
choices.push(newChoice);
});
this.testChoices=choices;
};


Mojo.Test.TestAssistant.prototype.handleCommand=function handleCommand(commandEvent){
if(commandEvent.type==Mojo.Event.command){
if(commandEvent.command==='run'){
this.runTests();
}
}
};

Mojo.Test.TestAssistant.prototype.clearResults=function clearResults(){
this.resultsModel.listTitle="Running: "+Mojo.Format.formatDate(new Date(),{time:'medium'});
this.resultsModel.items=[];
this.controller.modelChanged(this.resultsModel);
this.summary.innerHTML="";
};

Mojo.Test.TestAssistant.prototype.makeSummary=function makeSummary(results){
var passedCount=0;
results.each(function(result){
if(result.passed){
passedCount+=1;
}
});
var resultsSummary={passed:passedCount,failed:results.length-passedCount,total:results.length};
return Mojo.View.render({object:resultsSummary,template:Mojo.Widget.getSystemTemplatePath('test/summary')});
};


Mojo.Test.TestAssistant.prototype.updateResults=function updateResults(){
this.testRunningSpinner.mojo.stop();
this.resultsModel.listTitle="Results: "+Mojo.Format.formatDate(new Date(),{time:'medium'});
this.resultsModel.items=this.runner.results;
this.controller.modelChanged(this.resultsModel);
this.summary.innerHTML=this.makeSummary(this.runner.results);
};

Mojo.Test.TestAssistant.prototype.doRunTests=function doRunTests(selectedTests,whenCompleted){

this.controller.sceneScroller.mojo.scrollTo(0,0);
this.testRunningSpinner.mojo.start();
this.clearResults();
try{
var tests;
if(selectedTests===this.ALL_TESTS){
tests=this.testCollection.collect(function(testSpec){
return Mojo.findConstructorFunction(testSpec.testFunction);
});
}else{
tests=[Mojo.findConstructorFunction(selectedTests)];
}
this.runner=new Mojo.Test.CollectionRunner(tests,{perf:this.testPrefsModel.perf});
this.runner.start(whenCompleted);
}catch(e){
var logMsg="test runner failure: "+e.name+': ';

if(e.message){
logMsg=logMsg+e.message+" ";
}

if(e.sourceURL){
logMsg=logMsg+', '+e.sourceURL;
}
if(e.line){
logMsg=logMsg+':'+e.line;
}

whenCompleted("test failed",[{message:logMsg}]);
}
};


Mojo.Test.TestAssistant.prototype.runTests=function runTests(){
this.doRunTests(this.testPrefsModel.selectedTests,this.updateResults.bind(this));
};


Mojo.Test.TestAssistant.prototype.runAllTests=function runAllTests(optionalResultsFunction){
var resultsFunction=optionalResultsFunction||this.updateResults.bind(this);
this.doRunTests(this.ALL_TESTS,resultsFunction);
};

Mojo.Test.TestAssistant.prototype.sendResults=function sendResults(){
if(this.testRunParams.resultsUrl){
var requestOptions={
method:'put',
parameters:{
"test_run[result]":Object.toJSON(this.runner.results)
}
};
var resultsRequest=new Ajax.Request(this.testRunParams.resultsUrl,requestOptions);
}
this.updateResults();
};/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Function={};


Mojo.Function.Synchronize=function Synchronize(inOptions){
var options=inOptions||{};
this.syncCallback=options.syncCallback;
this.timeout=options.timeout;
this.pending=[];
this.received=[];

if(this.timeout!==undefined){
this.handleTimeout=this.handleTimeout.bind(this);
this.timeoutID=window.setTimeout(this.handleTimeout,this.timeout*1000);
}

};


Mojo.Function.Synchronize.prototype.wrap=function wrap(callback){
var that=this;
var f=function(){
that.handleWrapped(arguments.callee,callback,$A(arguments));
};
this.pending.push(f);
return f;
};


Mojo.Function.Synchronize.prototype.handleWrapped=function handleWrapped(wrappedCallback,callback,argumentList){
var index=this.pending.indexOf(wrappedCallback);
if(index!==-1){
this.received.push({callback:callback,argumentList:argumentList});
this.pending.splice(index,1);
if(this.pending.length===0||this.timedOut){
this.dispatchCallbacks();
}
}
};


Mojo.Function.Synchronize.prototype.dispatchCallbacks=function dispatchCallbacks(){
var cbRecord;
for(var i=this.received.length-1;i>=0;i--){
cbRecord=this.received[i];
cbRecord.callback.apply(undefined,cbRecord.argumentList);
}
this.received.clear();

if(this.syncCallback){
this.syncCallback.call(undefined,!!this.timedOut);
delete this.syncCallback;
}

this.cancelTimeout();
};


Mojo.Function.Synchronize.prototype.cancelTimeout=function handleTimeout(){
if(this.timeoutID){
window.clearTimeout(this.timeoutID);
delete this.timeoutID;
}
};


Mojo.Function.Synchronize.prototype.handleTimeout=function handleTimeout(){
this.timedOut=true;
this.dispatchCallbacks();
};




Mojo.Function.debounce=function debounce(onCall,onTimeout,delay,optionalWindow){
var timeoutID;
var savedArgs;
var triggerFunc,timeoutFunc;
optionalWindow=optionalWindow||window;

timeoutFunc=function(){
timeoutID=undefined;
onTimeout.apply(undefined,savedArgs);
savedArgs=undefined;
};

triggerFunc=function(){
savedArgs=$A(arguments);
if(timeoutID!==undefined){
optionalWindow.clearTimeout(timeoutID);
}
timeoutID=optionalWindow.setTimeout(timeoutFunc,delay*1000);
return onCall&&onCall.apply(this,arguments);
};

return triggerFunc;
};
















/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Controller.isCrossLaunch=function isCrossLaunch(){
var launchParams=Mojo.getLaunchParameters();
return launchParams.mojoCross!==undefined;
};


Mojo.Controller.handleCrossLaunchPop=function handleCrossLaunchPop(){
var launchParams=Mojo.getLaunchParameters();
var targetStage=Mojo.Controller.appController.getStageController(launchParams.sourceStageName);



if(targetStage&&targetStage._crossAppProxyScene){




targetStage._crossAppProxyScene.assistant.setCompleted(true);



targetStage.popScene(launchParams.returnValue,{transition:Mojo.Transition.crossApp});
}
};


Mojo.Controller.handleCrossLaunchPush=function handleCrossLaunchPush(){
var launchParams=Mojo.getLaunchParameters();
var augmentedSceneArguments=Object.extend({},launchParams.originalSceneArguments);
augmentedSceneArguments.mojoCrossLaunchPush=true;
augmentedSceneArguments.transition=Mojo.Transition.none;

var args={
sceneTemplate:Mojo.Widget.getSystemTemplatePath('cross-app-scene'),
assistantConstructor:Mojo.Controller.CrossAppTargetAssistant,
transition:Mojo.Transition.none,
name:'mojo-cross-app-target-proxy'
};

var f=function(stageController){
stageController.pushScene(args);
try{
stageController.pushScene.apply(stageController,[augmentedSceneArguments].concat(launchParams.remainingArguments));
}catch(e){
Mojo.Log.logException(e,"Cross push failed.");
}
};

var stageName="crossApp"+Date.now();
var stageArgs={
name:stageName,
lightweight:true,
parentidentifier:launchParams.sourceStageIdentifier
};
Mojo.Controller.appController.createStageWithCallback(stageArgs,f,Mojo.Controller.StageType.stackedCard);
};


Mojo.Controller.handleMojoCrossCallback=function handleMojoCrossCallback(){
var launchParams=Mojo.getLaunchParameters();
var targetStage=Mojo.Controller.appController.getStageController(launchParams.sourceStageName);
if(targetStage){
var currentScene=targetStage.topScene();
var assistant=currentScene.assistant;
assistant.dispatchCallback(launchParams);
}
};


Mojo.Controller.handleMojoCrossCallbackResponse=function handleMojoCrossCallbackResponse(){
var launchParams=Mojo.getLaunchParameters();
var targetStage=Mojo.Controller.appController.getStageController(launchParams.sourceStageName);
if(targetStage){
var currentScene=targetStage.topScene();
var assistant=currentScene.assistant;
var targetAssistant=targetStage.parentSceneAssistant(assistant);
if(targetAssistant&&targetAssistant.receiveResponse){
targetAssistant.receiveResponse(launchParams.callbackParams);
}else{
Mojo.Log.warn("handleMojoCrossCallbackResponse: can't find assistant to call");
}
}
};


Mojo.Controller.handleCrossLaunch=function handleCrossLaunch(controller){
var launchParams=Mojo.getLaunchParameters();
if(launchParams.mojoCrossPush){
Mojo.Controller.handleCrossLaunchPush(controller);
}else if(launchParams.mojoCrossPop){
Mojo.Controller.handleCrossLaunchPop();
}else if(launchParams.mojoCrossCallback){
Mojo.Controller.handleMojoCrossCallback();
}else if(launchParams.mojoCrossCallbackResponse){
Mojo.Controller.handleMojoCrossCallbackResponse();
}
};


Mojo.Controller.setupCrossAppPush=function setupCrossAppPush(sceneArguments,additionalArguments){
var newSceneArguments={
sceneTemplate:Mojo.Widget.getSystemTemplatePath('cross-app-scene'),
assistantConstructor:Mojo.Controller.CrossAppSourceAssistant,
name:'mojo-cross-app-source-proxy'
};
var originalSceneArguments=Object.extend({},sceneArguments);
delete originalSceneArguments.appId;
return{
sceneArguments:newSceneArguments,
additionalArguments:[sceneArguments.appId,originalSceneArguments,additionalArguments]
};
};



Mojo.Controller.CrossAppSourceAssistant=function CrossAppSourceAssistant(appId,originalSceneArguments,remainingArguments){
this.appId=appId;
this.originalSceneArguments=Object.extend({},originalSceneArguments);
this.remainingArguments=remainingArguments;
this.handleLaunchFailure=this.handleLaunchFailure.bind(this);
this.handleLaunchWorked=this.handleLaunchWorked.bind(this);
this.handleCallback=this.originalSceneArguments.callbackHandler;
if(this.handleCallback){
Mojo.requireFunction(this.handleCallback);
}
delete this.originalSceneArguments.callbackHandler;
};


Mojo.Controller.CrossAppSourceAssistant.prototype.setup=function setup(){
var stage;
var crossLaunchArgs={
mojoCross:true,
mojoCrossPush:true,
originalSceneArguments:this.originalSceneArguments,
remainingArguments:this.remainingArguments,
sourceStageName:this.controller.window.name,
sourceStageIdentifier:this.controller.window.PalmSystem.identifier,
sourceAppId:Mojo.Controller.appInfo.id
};
Mojo.Controller.appController.launch(this.appId,crossLaunchArgs,this.handleLaunchWorked,this.handleLaunchFailure);


this.controller.defaultTransition=Mojo.Transition.crossApp;


stage=this.controller.stageController;
Mojo.require(!stage._crossAppProxyScene,"A stage's scene stack cannot have more than one cross-app scene.");


stage._crossAppProxyScene=this.controller;

};

Mojo.Controller.CrossAppSourceAssistant.prototype.activate=function activate(){

this.controller.defaultTransition=Mojo.Transition.none;
};

Mojo.Controller.CrossAppSourceAssistant.prototype.setCompleted=function setCompleted(value){
this.completed=value;
};

Mojo.Controller.CrossAppSourceAssistant.prototype.handleCommand=function(event){


if(event.type===Mojo.Event.command&&event.command===Mojo.Menu.showAppCmd){
Mojo.Controller.appController.launch(this.appId,{'palm-command':'open-app-menu'});
event.stop();
}
};


Mojo.Controller.CrossAppSourceAssistant.prototype.cleanup=function cleanup(){
var stage=this.controller.stageController;


if(!this.completed){
if(stage.window.PalmSystem.cancelCrossAppScene){


stage.window.PalmSystem.cancelCrossAppScene(this.appId);
}else{
Mojo.Log.error("cancelCrossAppScene() not available, but we would have called it with",this.appId);
}
}

if(stage._crossAppProxyScene!==this.controller){
Mojo.Log.error('CrossAppSourceAssistant cleaned up when stage._crossAppProxyScene is set to something else.');
}

delete stage._crossAppProxyScene;

};


Mojo.Controller.CrossAppSourceAssistant.prototype.handleLaunchFailure=function handleLaunchFailure(params){
this.controller.stageController.popScene({launchFailed:true});
};


Mojo.Controller.CrossAppSourceAssistant.prototype.handleLaunchWorked=function handleLaunchFailure(params){
if(params&&(!params.processId||params.processId==="")){
this.handleLaunchFailure(params);
}
};

Mojo.Controller.CrossAppSourceAssistant.prototype.dispatchCallback=function dispatchCallback(launchParams){
Mojo.assertArray(launchParams.callbackParams,"dispatchCallback requires an array.");
this.targetStageName=launchParams.targetStageName;
if(this.handleCallback){
var f=this.sendCallbackResponse.bind(this);
var paramsWithResponseCallback=[f].concat(launchParams.callbackParams);
this.handleCallback.apply(undefined,paramsWithResponseCallback);
}
};

Mojo.Controller.CrossAppSourceAssistant.prototype.sendCallbackResponse=function sendCallbackResponse(){
var crossLaunchArgs={
mojoCross:true,
mojoCrossCallbackResponse:true,
sourceStageName:this.targetStageName,
callbackParams:$A(arguments)
};
Mojo.Controller.appController.launch(this.appId,crossLaunchArgs);
};



Mojo.Controller.CrossAppTargetAssistant=function CrossAppTargetAssistant(){
var launchParams=Mojo.getLaunchParameters();
this.originalSceneArguments=launchParams.originalSceneArguments;
this.sourceAppId=launchParams.sourceAppId;
this.sourceStageName=launchParams.sourceStageName;
};

Mojo.Controller.CrossAppTargetAssistant.prototype.aboutToActivate=function activate(returnValue){
var transition;



transition=this.controller.stageController._currentTransition;
if(transition){
transition.setTransitionType(Mojo.Transition.crossApp);
}else{
Mojo.Log.error("Cannot force cross-app transition on pop!");
}
};


Mojo.Controller.CrossAppTargetAssistant.prototype.activate=function activate(returnValue){
var crossLaunchArgs={
mojoCross:true,
mojoCrossPop:true,
sourceStageName:this.sourceStageName,
returnValue:returnValue
};
Mojo.Controller.appController.launch(this.sourceAppId,crossLaunchArgs);
this.controller.window.close();
};

Mojo.Controller.CrossAppTargetAssistant.prototype.sendCallback=function sendCallback(){
var paramsToSend=$A(arguments);
this.responseCallback=paramsToSend.shift();
var crossLaunchArgs={
mojoCross:true,
mojoCrossCallback:true,
sourceStageName:this.sourceStageName,
targetStageName:this.controller.stageController.window.name,
callbackParams:paramsToSend
};
Mojo.Controller.appController.launch(this.sourceAppId,crossLaunchArgs);
};

Mojo.Controller.CrossAppTargetAssistant.prototype.receiveResponse=function receiveResponse(callbackParams){
if(this.responseCallback){
this.responseCallback.apply(undefined,callbackParams);
}
};/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Transition={};


Mojo.Transition.none='none';


Mojo.Transition.zoomFade='zoom-fade';


Mojo.Transition.crossFade='cross-fade';


Mojo.Transition.defaultTransition=Mojo.Transition.zoomFade;


Mojo.Transition.crossApp='cross-app';



Mojo.Controller.Transition=function(theWindow,isPop){
if(Mojo.Host.current===Mojo.Host.browser){
this._currentTransition=new Mojo.Controller.Transition.PlaceholderTransition(theWindow,isPop);
}else{
this._currentTransition=new Mojo.Controller.Transition.ZoomFadeTransition(theWindow,isPop);
}
};

Mojo.Controller.Transition.prototype.setTransitionType=function(type,isPop){
this._currentTransition.setTransitionType(type,isPop);
};

Mojo.Controller.Transition.prototype.run=function(onComplete){
this._currentTransition.begin(onComplete||Mojo.doNothing);
};

Mojo.Controller.Transition.prototype.cleanup=function(){
this._currentTransition.cleanup();
};



Mojo.Controller.Transition.PlaceholderTransition=function(theWindow,isPop){
var startColor;


this.document=theWindow.document;
this.window=theWindow;
this.isPop=!!isPop;


startColor=isPop?'#F33':'#33F';
this._transitionGlass=Mojo.View.convertToNode("<div style='position:absolute; top:0px; left:0px; width:100%; height:100%; z-index:1000000; background-color:"+startColor+";'></div>",this.document);
this._transitionGlass._mojoIsPop=isPop;
this.document.body.appendChild(this._transitionGlass);


};

Mojo.Controller.Transition.PlaceholderTransition.prototype.setTransitionType=function(type){
this.transitionType=type;
};


Mojo.Controller.Transition.PlaceholderTransition.prototype.begin=function(onComplete){

var that=this;
var counter=0;
var hexLookup;



Mojo.Log.info("Beginning placeholder scene transition ",this.transitionType);

if(this.transitionType===Mojo.Transition.none){
that.cleanup();
onComplete();
return;
}

hexLookup=['0','1','2','3','4','5','6','7','8','9','A','B','C','D','E','F'];



var transitionAnimator=function(){



if(counter<12){
if(that._transitionGlass._mojoIsPop){
that._transitionGlass.style.backgroundColor='#'+hexLookup[15-counter]+'3'+hexLookup[3+counter];
}else{
that._transitionGlass.style.backgroundColor='#'+hexLookup[3+counter]+'3'+hexLookup[15-counter];
}
counter++;
}

else{
that.cleanup();
onComplete();
}
};


this._intervalID=this.window.setInterval(transitionAnimator,1000/30);
};


Mojo.Controller.Transition.PlaceholderTransition.prototype.cleanup=function(){

if(this._intervalID!==undefined){
this.window.clearInterval(this._intervalID);
}


if(this._transitionGlass){
this.document.body.removeChild(this._transitionGlass);
delete this._transitionGlass;
}

};



Mojo.Controller.Transition.ZoomFadeTransition=function(theWindow,isPop){
this.window=theWindow;
this.isPop=!!isPop;
this.cleanedup=false;

Mojo.require(this.window.Mojo._nativeTransitionInProgress!==true,"Only one transition may be run at a time");
this.window.Mojo._nativeTransitionInProgress=true;



this.window.PalmSystem.prepareSceneTransition(isPop);
};

Mojo.Controller.Transition.ZoomFadeTransition.prototype.setTransitionType=function(type,isPop){
this.transitionType=type;
if(isPop!==undefined){
this.isPop=isPop;
}
};

Mojo.Controller.Transition.ZoomFadeTransition.prototype.begin=function(onComplete){
var synchronizer;

Mojo.Log.info("Beginning native scene transition:",this.transitionType,", isPop=",this.isPop);

this.onComplete=onComplete;



if(this.transitionType===Mojo.Transition.none){
this.finish();
return;
}


this.ranTransition=true;


if(this.window.Mojo.sceneTransitionCompleted!==Mojo.doNothing){
Mojo.Log.warn('WARNING -- this.window.Mojo.sceneTransitionCompleted is not Mojo.doNothing!');
}




if(this.transitionType===Mojo.Transition.crossApp){
if(this.window.PalmSystem.runCrossAppTransition){
this.window.PalmSystem.runCrossAppTransition(this.isPop);
}else{


this.ranTransition=false;
}


this.finish();

}else{



synchronizer=new Mojo.Function.Synchronize({timeout:2,syncCallback:this.finish.bind(this)});
this.window.Mojo.sceneTransitionCompleted=synchronizer.wrap(Mojo.doNothing);

Mojo.Timing.pause("scene#aboutToActivateLatency");


this.window.PalmSystem.runSceneTransition(this.transitionType,this.isPop);
}

};

Mojo.Controller.Transition.ZoomFadeTransition.prototype.finish=function(){
Mojo.Timing.resume("scene#aboutToActivateLatency");
var onComplete=this.onComplete;
this.cleanup();
if(onComplete){
onComplete();
}
};

Mojo.Controller.Transition.ZoomFadeTransition.prototype.cleanup=function(){
if(!this.ranTransition&&this.window.PalmSystem){
this.window.PalmSystem.cancelSceneTransition();
this.ranTransition=true;
}
if(this.window.Mojo&&!this.cleanedup){
this.window.Mojo.sceneTransitionCompleted=Mojo.doNothing;
this.window.Mojo._nativeTransitionInProgress=false;
}
delete this.onComplete;
this.cleanedup=true;
};



/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Event.KeyMatcher=function(onMatch,options){
Mojo.assert(options.items||options.itemsRange,"Mojo.Event.KeyMatcher: Options must include items or itemsRange.");

if(options.items){
this.items=options.items;
}else{
this.itemsRange=options.itemsRange;
this.interval=this.itemsRange.interval||1;
this.memoizedRangeStrings={};
}

this.numeric=!!options.numeric;
this.onMatch=onMatch;



this.delayedClear=Mojo.Function.debounce(undefined,this.clear.bind(this),1,options.window);

this.clear();
};


Mojo.Event.KeyMatcher.prototype.keyPress=function(charCode){
var keyStr;

keyStr=String.fromCharCode(charCode).toLowerCase();
if(this.numeric){
keyStr=this.numericMap[keyStr];
}


if(keyStr){
this.matchStr+=keyStr;
this._checkForMatch();
this.delayedClear();
}
};


Mojo.Event.KeyMatcher.prototype.clear=function(){
this.matchStr='';
delete this.currentMatch;
};

Mojo.Event.KeyMatcher.prototype._foundMatch=function(value){
if(this.currentMatch!==value){
this.currentMatch=value;
this.onMatch(value);
}
};


Mojo.Event.KeyMatcher.prototype._checkForMatch=function(){
var i;
var items=this.items;
var matchStr=this.matchStr;
var rangeStrs,curStr;

while(matchStr.length>0){

if(this.items){

for(i=0;i<items.length;i++){

if(items[i].label.toString().toLowerCase().startsWith(matchStr)){

this._foundMatch(items[i].value);
return;
}
}
}
else{


rangeStrs=this.memoizedRangeStrings;

for(i=this.itemsRange.min;i<=this.itemsRange.max;i+=this.interval){


curStr=rangeStrs[i];
if(curStr===undefined){
rangeStrs[i]=i.toString();
curStr=rangeStrs[i];
}

if(curStr.startsWith(matchStr)){

this._foundMatch(i);
return;
}
}
}

matchStr=matchStr.slice(1);
this.matchStr=matchStr;
}
};

Mojo.Event.KeyMatcher.prototype.numericMap={
e:'1',r:'2',t:'3',
d:'4',f:'5',g:'6',
x:'7',c:'8',v:'9',
'@':'0',

1:'1',2:'2',3:'3',
4:'4',5:'5',6:'6',
7:'7',8:'8',9:'9',
0:'0'
};



Mojo.Event.YearKeyMatcher=function(onMatch,options){
Mojo.require(options.itemsRange,"Mojo.Event.YearKeyMatcher requires the years to be defined in itemsRange.");
Mojo.Event.KeyMatcher.apply(this,arguments);
};


Mojo.Event.YearKeyMatcher.prototype=Mojo.Model.decorate(Mojo.Event.KeyMatcher.prototype);

Mojo.Event.YearKeyMatcher.prototype._checkForMatch=function(){
var val;

while(this.matchStr.length>0){
val=parseInt(this.matchStr,10);



if(val<50){
val+=2000;
}else if(val<100){
val+=1900;
}

if(val>=this.itemsRange.min&&val<=this.itemsRange.max){
this._foundMatch(val);
break;
}else if(val>this.itemsRange.max){

this.matchStr=this.matchStr.slice(1);
}
else{

break;
}
}

};





/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Controller.ContainerStack=function(sceneController){
this._containers=[];
this.scene=sceneController;
};



Mojo.Controller.ContainerStack.prototype.cleanup=function(){


this.cancelAll();


if(this.listenedToDeactivate){
this.scene.document.removeEventListener(Mojo.Event.deactivate,this.handleDeactivate);
}
};


Mojo.Controller.ContainerStack.prototype.pushContainer=function(newContainer,layer,options){
var i,container;
var cancelThisOne;

Mojo.require(newContainer.dispatchEvent,"pushContainer: newContainer is not an element which can dispatch events.");


for(i=this._containers.length-1;i>=0;i--){
container=this._containers[i];


if(container.layer>=layer&&container.cancelFunc){
container.cancelFunc();
this._containers.splice(i,1);
}
}



container=this._containers[this._containers.length-1];



cancelThisOne=(container&&container.layer>=layer);


cancelThisOne=(cancelThisOne&&(container.isClosedFunc===undefined||!container.isClosedFunc()));


cancelThisOne=(cancelThisOne&&options&&options.cancelFunc);

if(cancelThisOne){
options.cancelFunc();
return;
}



if(!this.listenedToDeactivate&&options&&options.cancelFunc){
this.listenedToDeactivate=true;
this.handleDeactivate=this.cancelAll.bindAsEventListener(this);
this.scene.document.addEventListener(Mojo.Event.deactivate,this.handleDeactivate);
}


this._containers.push({container:newContainer,layer:layer,cancelFunc:(options&&options.cancelFunc),isClosedFunc:(options&&options.isClosedFunc)});

};


Mojo.Controller.ContainerStack.prototype.removeContainer=function(container){
var index=this._findContainer(container);

if(index!==undefined){
this._containers.splice(index,1);
return true;
}

return false;
};






Mojo.Controller.ContainerStack.prototype.topContainer=function(){
var container=this._containers[this._containers.length-1];
return container&&container.container;
};


Mojo.Controller.ContainerStack.prototype.cancelAll=function(){
var i,container;


for(i=this._containers.length-1;i>=0;i--){
container=this._containers[i];
if(container.cancelFunc){
container.cancelFunc();
this._containers.splice(i,1);
}
}
};


Mojo.Controller.ContainerStack.prototype.getLength=function(){
return this._containers.length;
};




Mojo.Controller.ContainerStack.prototype._findContainer=function(targetContainer){
var i,container;


for(i=this._containers.length-1;i>=0;i--){
container=this._containers[i];
if(container.container===targetContainer){
return i;
}
}
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */


Mojo.ActiveRecordListBridge=Class.create({





initialize:function(listFn,countFn,mungeFn,initialServiceParam){
this.baseListFn=listFn;
this.baseCountFn=countFn;
this.mungeFn=mungeFn;

this.setParam(initialServiceParam);
this.setDoCount(true);

this._handleResponseBound=this._handleResponse.bind(this);

this._handleCount=this._handleCountResponse.bind(this,false);
this._handleUpdateCount=this._handleCountResponse.bind(this,true);

this.timings=[];
},


fetchItems:function(listWidget,offset,limit){
Mojo.Log.info("list requesting items w/ offset/limit:",offset,"/",limit);

this.listWidget=listWidget;

var responseHandler;

if(!this.request){

responseHandler=this._handleResponseBound.curry(listWidget);
}

var newRequest=this.listFn(responseHandler,this.subscriberId,offset,limit);
if(!this.request){

this.request=newRequest;
}
this.timings.push(Date.now());
},


setParam:function(serviceParam){
Mojo.Log.info("THIS IS THE PARAM TO PASS TO SERVICE + \"",serviceParam,"\"");
this.listFn=this.baseListFn.curry(serviceParam);
this.countFn=this.baseCountFn.curry(serviceParam);
this._reset();
},

setDoCount:function(doCount){
this.doCount=doCount;
},

cleanup:function(){
if(this.request){
Mojo.Log.info("CANCELLING LIST QUERY");
this.request.cancel();
this.request=undefined;
}
if(this.sentCountRequest){
Mojo.Log.info("CANCELLING COUNT QUERY");
this.sentCountRequest.cancel();
this.sentCountRequest=undefined;
}
this.timings=[];
},

doUpdate:function(){
this.sentCountRequest=this.countFn(this._handleUpdateCount.curry(this.listWidget));
this.timings.push(Date.now());
},

_reset:function(){
this.cleanup();
this.subscriberId=undefined;
this.updateInProgress=false;
this.setDoCount(true);


},

_handleCountResponse:function(asPartOfUpdate,listWidget,response){
Mojo.assert(response!==undefined);
Mojo.assert(response.count!==undefined);

var begin=this.timings.shift();
Mojo.Log.info("*** count ROUND TRIP TIME = ",(Date.now()-begin)," for count=",response.count);

if(asPartOfUpdate){




this._reset();
}


if(asPartOfUpdate){

Mojo.Log.info("**** INVALIDATING LIST CACHE AND SETTING LIST COUNT TO: ",response.count);
listWidget.mojo.setLengthAndInvalidate(response.count);

}else{
if(listWidget.mojo.getLength()!=response.count){
Mojo.Log.info("calling list.setLength w/ count=",response.count);
listWidget.mojo.setLength(response.count);
}else{
Mojo.Log.info("got count response but list length is already set to: ",response.count);
}

if(listWidget.mojo.setCount){
listWidget.mojo.setCount(response.count);
}

}

},

_doUpdate:function(listWidget){
Mojo.Log.info("[[[[[[[[[[[[[[[[[ HANDLING DEFERRED UPDATE NOW");


if(!this.updateInProgress){

return;
}



this.updateInProgress=false;

this.doUpdate();
},

_handleResponse:function(listWidget,response){
var begin;


var setLengthToWindowSize=false;

Mojo.assert(response!==undefined);

if(response.updated){
Mojo.Log.info("[[[[[[[[[[[[[[[[[ Update Received");
if(!this.updateInProgress){
this.updateInProgress=true;

Mojo.Log.info("[[[[[[[[[[[[[[[[[ Update Received: starting deferred update handler");
this._doUpdate.bind(this).delay(5,listWidget);
}
return;
}


Mojo.assert(response.list!==undefined);
Mojo.assert(response.offset!==undefined);
Mojo.assert(response.limit!==undefined);

begin=this.timings.shift();
Mojo.Log.info("*** list ROUND TRIP TIME = ",(Date.now()-begin)," for offset/limit/actual",response.offset,"/",response.limit,"/",response.list.length);

if(!this.subscriberId&&response.subscriberId){
this.subscriberId=response.subscriberId;
}

if(!this.sentCountRequest){
if(response.list.length<response.limit){
Mojo.Log.info("window size < asked for limit, will set initial count = window size");
setLengthToWindowSize=true;
}
else if(this.doCount){

Mojo.Log.info("window size >= asked for limit, issuing service query to find count");
this.sentCountRequest=this.countFn(this._handleCount.curry(listWidget));
this.timings.push(Date.now());
}else{

if(listWidget.mojo.setCount){
listWidget.mojo.setCount('...');
}
}
}

if(this.mungeFn){
begin=new Date().getTime();
this.mungeFn(response);
var end=new Date().getTime();

}


listWidget.mojo.noticeUpdatedItems(response.offset,response.list);

if(setLengthToWindowSize){
this.timings.push(Date.now());
this._handleCount(listWidget,{count:response.list.length});
this.sentCountRequest={cancel:function(){}};
}

}

});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Timing={};


Mojo.Timing.enabled=false;


Mojo.Timing.perfTimers={};


Mojo.Timing.PerfTimer=function PerfTimer(label){
Mojo.require(label,"label must be defined");
this.label=label;
this.reset();
};


Mojo.Timing.PerfTimer.prototype.millisecondsNow=function millisecondsNow(){
return Date.now();
};


Mojo.Timing.PerfTimer.prototype.reset=function reset(){
this.count=0;
this.timesRecorded=0;
this.elapsedTime=0;
delete this.startTime;
this.running=false;
};


Mojo.Timing.PerfTimer.prototype.resume=function resume(){
this.count+=1;
if(this.count===1){
this.startTime=this.millisecondsNow();
this.running=true;
}
};


Mojo.Timing.PerfTimer.prototype.pause=function pause(){
Mojo.require(this.count>0,"unbalanced call to PerfTimer pause/resume '#{label}'",{label:this.label});
this.count-=1;
if(this.count===0){
this.elapsedTime+=(this.millisecondsNow()-this.startTime);
this.timesRecorded+=1;
this.running=false;
delete this.startTime;
}
};


Mojo.Timing.nullPerfTimer=new Mojo.Timing.PerfTimer("<null>");


Mojo.Timing.defaultCreatePerfTimer=function defaultCreatePerfTimer(label){
return new Mojo.Timing.PerfTimer(label);
};


Mojo.Timing.createPerfTimer=Mojo.Timing.defaultCreatePerfTimer;


Mojo.Timing.reset=function reset(category){
delete Mojo.Timing.perfTimers[category];
};


Mojo.Timing.getCategoriesWithPrefix=function getCategoriesWithPrefix(prefix){
var categories=$H(Mojo.Timing.perfTimers).keys();

var withPrefix=function(category){
return category.startsWith(prefix);
};
return categories.findAll(withPrefix);
};


Mojo.Timing.resetAll=function resetAll(){
Mojo.Timing.perfTimers={};
};


Mojo.Timing.resetAllWithPrefix=function resetAllWithPrefix(prefix){
var categories=Mojo.Timing.getCategoriesWithPrefix(prefix);
var resetOneCategory=function(category){
Mojo.Timing.reset(category);
};
categories.each(resetOneCategory);
};


Mojo.Timing.get=function get(category){
Mojo.require(category,"category must be defined");
if(!Mojo.Timing.enabled){
return Mojo.Timing.nullPerfTimer;
}
var perfTimers=Mojo.Timing.perfTimers;
var timerForCategory=perfTimers[category];
if(timerForCategory===undefined){
timerForCategory=Mojo.Timing.createPerfTimer(category);
perfTimers[category]=timerForCategory;
}
return timerForCategory;
};


Mojo.Timing.resume=function resume(category){
if(!Mojo.Timing.enabled){
return;
}
var timerForCategory=Mojo.Timing.get(category);
timerForCategory.resume();
};


Mojo.Timing.pause=function pause(category){
if(!Mojo.Timing.enabled){
return;
}
var timerForCategory=Mojo.Timing.get(category);
timerForCategory.pause();
};


Mojo.Timing.createTimingString=function createTimingString(prefix,label){
if(!Mojo.Timing.enabled){
return"";
}
var categories=Mojo.Timing.getCategoriesWithPrefix(prefix);
var makeOneTiming=function(category){
var perfTimer=Mojo.Timing.get(category);
return category.gsub(prefix,'')+": "+perfTimer.elapsedTime+"ms ("+perfTimer.timesRecorded+")";
};
var timings=categories.collect(makeOneTiming);
return""+label+": "+timings.join(", ");
};


Mojo.Timing.reportTiming=function reportTiming(prefix,label){
if(!Mojo.Timing.enabled){
return;
}
Mojo.Log.info(Mojo.Timing.createTimingString(prefix,label));
};


Mojo.Timing.resetSceneTiming=function resetSceneTiming(sceneWindow){
Mojo.Timing.resetAllWithPrefix('scene#');
sceneWindow.layoutCount=0;
};


Mojo.Timing.reportSceneTiming=function reportSceneTiming(sceneName,sceneWindow){
var layoutCount;
if(!Mojo.Timing.enabled){
return;
}
layoutCount=sceneWindow.layoutCount;
Mojo.Log.info(Mojo.Timing.reportTiming('scene#',"scene '"+sceneName+"': layouts: "+layoutCount));
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.Widget._Submenu=Class.create({


close:function(){
this._activateHandler();
},


kBorderSize:7,
kMaxRowWidth:280,
kMaxHeight:290,
kContainerMargin:16,
kSelectorBorderWidth:48,
kpopupId:'palm-app-menu',


kLabelTemplate:Mojo.Widget.getSystemTemplatePath("submenu/label"),
kGroupTemplate:Mojo.Widget.getSystemTemplatePath("submenu/group"),


setup:function(){
var model=this.controller.model;
var itemsText;
var scroller;
var i;
var scrimClass=model.scrimClass||'submenu-popup';


this.windowOrientation=this.controller.stageController.getWindowOrientation();

this.containerTemplate=Mojo.Widget.getSystemTemplatePath("submenu/list");
this.itemTemplate=Mojo.Widget.getSystemTemplatePath("submenu/item");

itemsText=this.renderItems(model.items,model.toggleCmd);
this.controller.element.innerHTML=Mojo.View.render({
object:{
listElements:itemsText,
popupClass:model.popupClass,
scrimClass:scrimClass,
popupId:(model.popupId||''),
touchableRows:Mojo.Environment.DeviceInfo.touchableRows
},
template:this.containerTemplate
});




this.controller.instantiateChildWidgets(this.controller.element,{open:false});

this.popup=this.controller.element.querySelector('div[x-mojo-popup-container]');
this.scrim=this.controller.element.querySelector('div[x-mojo-popup-scrim]');
this.popupContent=this.controller.element.querySelector('div[x-mojo-popup-content]');

scroller=this.controller.element.querySelector('div[x-mojo-element=Scroller]');
if(scroller){
scroller.mojo.validateScrollPosition();
}



var dims=Element.getDimensions(this.popup);
var width=dims.width;
var height=dims.height;
var sceneWidth=this.controller.window.innerWidth;
var sceneHeight=this.controller.window.innerHeight;
var placeX,placeY;
var offset;
var animateToLeft;
var placeNearW;

if(!model.manualPlacement){


if(model.placeNear){
placeNearW=Element.getWidth(model.placeNear);

offset=Mojo.View.viewportOffset(model.placeNear);




if(this.isFixedPosition(model.placeNear)){
offset.top-=this.controller.scene.sceneElement.offsetTop;
}

placeX=offset.left+placeNearW;
if(placeX+width>sceneWidth-this.kBorderSize){
placeX-=(placeX+width-(sceneWidth-this.kBorderSize));
}


animateToLeft=(offset.left+(placeNearW/2)>sceneWidth/2);

placeY=offset.top;
if(placeY+height>sceneHeight-this.kBorderSize){
placeY-=(placeY+height-(sceneHeight-this.kBorderSize));
}




if(placeX<0){
placeX=(sceneWidth-width)/2;
}

if(placeY<0){
placeY=(sceneHeight-height)/2;
}
}
else{

placeX=(sceneWidth-width)/2;
placeY=(sceneHeight-height)/2;
}

}



if(scroller&&model.toggleCmd!==undefined){
var node=scroller.querySelector('.chosen');
if(node){
scroller.mojo.revealElement(node);
}
}













this._activateHandler=this._activateHandler.bind(this);

this.controller.listen(this.controller.element,'mousedown',this._activateHandler);
this.controller.listen(this.controller.element,Mojo.Event.tap,this._activateHandler);

this.controller.scene.pushCommander(this);
this.controller.scene.pushContainer(this.controller.element,
(model._mojoContainerLayer!==undefined?model._mojoContainerLayer:this.controller.scene.submenuContainerLayer),
{cancelFunc:this.close.bind(this)});


this.controller.exposeMethods(["close"]);

this._animateOff=this._animateOff.bind(this);

this._animateOn(sceneWidth,offset,width,height,placeX,placeY,animateToLeft);
},

_animateOn:function(sceneWidth,offset,width,height,placeX,placeY,animateToLeft){
var that=this;
var animateSubmenu;
var cornersTo;
var cornersFrom;
var popupContentHeight;

if(this.controller.model.popupId===this.kpopupId){
if(!placeY){
placeY=this.popup.offsetTop;
}
this.popup.style.top=(-height)+'px';
this.popup.style.left=placeX+'px';
this.offsceneY=-height;

this.onsceneY=placeY;

animateSubmenu=Mojo.Animation.Appmenu.animate.curry(this.popup,this.offsceneY,this.onsceneY,Mojo.doNothing);

this.scrim.style.opacity=0;
Mojo.Animation.Scrim.animate(this.scrim,0,1,animateSubmenu);
}else if(this.controller.model.placeNear){
popupContentHeight=this.popupContent.offsetHeight;

this.popup.style.top=offset.top+'px';


if(animateToLeft||((animateToLeft===undefined)&&(sceneWidth-(placeX+width)-this.kBorderSize)===0)){

this.onsceneXStart=placeX+width-this.kSelectorBorderWidth;
}else{

this.onsceneXStart=placeX;
}
this.popup.style.left=this.onsceneXStart+'px';

this.onsceneYStart=offset.top-this.kSelectorBorderWidth;
this.onsceneY=placeY;
this.onsceneX=placeX;
this.popup.style['min-width']='0px';
this.popup.style.width=this.kSelectorBorderWidth+'px';
this.popupContent.style.height='0px';
this.popup.hide();

cornersFrom={
top:this.onsceneYStart,
left:this.onsceneXStart,
width:this.kSelectorBorderWidth,
height:0
};

cornersTo={
top:this.onsceneY,
left:this.onsceneX,
width:width,
height:popupContentHeight
};

animateSubmenu=function(){
that.popup.show();
Mojo.Animation.Submenu.animate(that.popup,that.popupContent,cornersFrom,cornersTo,Mojo.doNothing);
};


this.scrim.style.opacity=0;
Mojo.Animation.Scrim.animate(this.scrim,0,1,animateSubmenu);
}else{
this.popup.style.top=placeY+'px';
this.popup.style.left=placeX+'px';
}


},

_animateOff:function(){
var that=this;
var cornersTo;
var cornersFrom;
var animateScrim;

if(this.controller.model.placeNear){
this.popup.style['min-width']='0px';

cornersFrom={
top:this.popup.offsetTop,
left:this.popup.offsetLeft,
width:this.popup.offsetWidth,
height:this.popupContent.offsetHeight
};

cornersTo={
top:this.onsceneYStart+this.kSelectorBorderWidth,
left:this.onsceneXStart,
width:this.kSelectorBorderWidth,
height:0
};

animateScrim=function(){
that.popup.hide();
Mojo.Animation.Scrim.animate(that.scrim,1,0,that.controller.remove.bind(that.controller));
};

Mojo.Animation.Submenu.animate(this.popup,this.popupContent,cornersFrom,cornersTo,
animateScrim);
}else if(this.controller.model.popupId===this.kpopupId){
Mojo.Animation.Appmenu.animate(this.popup,this.onsceneY,-this.popup.offsetHeight,
Mojo.Animation.Scrim.animate.curry(this.scrim,1,0,this.controller.remove.bind(this.controller)));
}else{
this.controller.remove();
}
},

cleanup:function(){
this.controller.stopListening(this.controller.element,'mousedown',this._activateHandler);
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this._activateHandler);
},

renderItems:function(items,toggleCmd,prevParentItem,nextParentItem){
var groupText;
var item;
var renderParams;
var itemsText='';
var i;
var cmdItemCount=0;
var startOfMenu;
var endOfMenu;
var endOfSection;

for(i=0;i<items.length;i++){
item=items[i];
renderParams={formatters:{shortcut:this.itemFormatter,value:this.dividerFormatter,disabled:this.disabledFormatter},attributes:{}};

if(item.items){
groupText=this.renderItems(item.items,item.toggleCmd,item,items[i+1]||nextParentItem);
renderParams.attributes.groupItems=groupText;
renderParams.template=this.kGroupTemplate;
}else if(item.command!==undefined){


if(item.chosen||(item.command!==undefined&&item.command==toggleCmd)){
renderParams.attributes.chosenClass='chosen';
renderParams.attributes.checkmarkFormattedHTML="<div class='popup-item-checkmark'></div>";
}

renderParams.template=this.itemTemplate;

}else if(item.label!==undefined){

renderParams.template=this.kLabelTemplate;
cmdItemCount=-1;
}else{

renderParams.template=this.itemTemplate;
cmdItemCount=-1;
}


renderParams.object=item;


item=items[i+1];
endOfSection=!item||((item.command===undefined||item.command===null)&&!item.items);
startOfMenu=!prevParentItem&&i===0;
endOfMenu=!item&&!nextParentItem;


if(cmdItemCount===0&&endOfSection){
renderParams.attributes.listClass='single';
}else if(startOfMenu){
renderParams.attributes.listClass='first menu-start';
}else if(cmdItemCount===0){
renderParams.attributes.listClass='first';
}else if(endOfMenu){
renderParams.attributes.listClass='last menu-end';
}else if(endOfSection){
renderParams.attributes.listClass='last';
}else{
delete renderParams.attributes.listClass;
}

itemsText+=Mojo.View.render(renderParams);
cmdItemCount++;
}

return itemsText;
},


itemFormatter:function(shortcut,itemModel){
var formatterProps={};
if(this.theOldWaysAreBest){
return shortcut&&($LL("alt-")+shortcut);
}

if(itemModel.shortcut){
formatterProps.shortcutFormattedHTML=("<div class='label'>"+$LL("+ ")+itemModel.shortcut+"</div>");
}

if(itemModel.icon){
formatterProps.iconFormattedHTML="<div class='palm-popup-icon right "+itemModel.icon+"'></div>";
}else if(itemModel.iconPath){
formatterProps.iconFormattedHTML="<div class='palm-popup-icon right' style='background-image: url("+itemModel.iconPath+");'></div>";
}

if(itemModel.secondaryIcon){
formatterProps.secondaryIconFormattedHTML="<div class='palm-popup-icon left "+itemModel.secondaryIcon+"'></div>";
}else if(itemModel.secondaryIconPath){
formatterProps.secondaryIconFormattedHTML="<div class='palm-popup-icon left' style='background-image: url("+itemModel.secondaryIconPath+");'></div>";
}


if(!itemModel.disabled){
formatterProps.tapHighlightHTML='x-mojo-tap-highlight="persistent"';
}

return formatterProps;
},



dividerFormatter:function(value,model){
if(value===undefined&&model.label===undefined&&
model.lefticon===undefined&&model.righticon===undefined){
return{dividerClass:"palm-section-divider"};
}
return undefined;
},


disabledFormatter:function(disabled){
if(disabled){
return{disabledClass:"disabled"};
}
return undefined;
},


_activateHandler:function(e){
var cmd,node,toggleNode,open;

if(this.activated){
return;
}


if(e&&e.type!=Mojo.Event.tap&&e.target.id!='palm-scrim'){
return;
}

if(e){
Event.stop(e);


if(!cmd&&e.type==Mojo.Event.tap){


node=Mojo.View.findParentByAttribute(e.target,this.controller.element,'x-mojo-menu-cmd');


if(!node||Element.hasClassName(node,'disabled')){
return;
}

cmd=node.getAttribute('x-mojo-menu-cmd');



if(!cmd){



toggleNode=Mojo.View.findParentByAttribute(e.target,this.controller.element,'x-mojo-submenu-toggle');
node=toggleNode&&Mojo.View.findParentByAttribute(toggleNode,this.controller.element,'x-mojo-submenu-group');
node=node&&node.querySelector('div[x-mojo-element=Drawer]');

if(node){
open=node.mojo.getOpenState();

if(open){
Element.removeClassName(toggleNode,'palm-submenu-group-opened');
}else{
Element.addClassName(toggleNode,'palm-submenu-group-opened');
}

node.mojo.setOpenState(!open);
return;
}

}
}
}

this.activated=true;
this.controller.model.onChoose.call(this.controller.scene.assistant,cmd);

this.controller.scene.removeCommander(this);
this.controller.scene.removeContainer(this.controller.element);


if(e&&e.type===Mojo.Event.tap&&e.target.id!=='palm-scrim'){
this._animateOff.delay(0.2);
}else{
this._animateOff();
}

return;
},


_removeSubmenu:function(){
this.controller.remove();
},


handleCommand:function(event){
if(event.type==Mojo.Event.back){
this.close();
Event.stop(event);
}
},


orientationChange:function(event){
var orientation=this.controller.stageController.getWindowOrientation();
if(this.windowOrientation!==orientation){
this.close();
}
},

isFixedPosition:function(el){
var targetBody=el.ownerDocument.body;
while(el&&el!==targetBody){
if(Element.getStyle(el,'position')=='fixed'){
return true;
}
el=el.parentNode;
}

return false;
}

});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.ImageView=Class.create({

defaultExtractFSParams:"800:800:3",
defaultLowResExtractFSParams:"160:160:3",
defaultGutterWidth:25,
defaultZoomThreshold:25,
dragSnapThreshold:0.4,
highResolutionLoadTimeout:1.2,
extractFSPath:"/var/luna/data/extractfs",
corruptImage:Mojo.Config.IMAGES_HOME+'/corrupt-image.png',


setup:function()
{

Mojo.assert(this.controller.element,
"Mojo.Widget.ImageView requires an element");
Mojo.assert(this.controller.model,
"Mojo.Widget.ImageView requires a model. "+
"Did you call controller.setupWidgetModel() for "+
this.controller.widgetName+"?");


this.zoomTargetTime=0.5;
this.flickTargetTime=0.3;
this.sameTargetTime=0.5;
this.dragTargetTime=0.4;
this.flickScale=0.075;

this.targetDecodeResolution=1536;

this.dragAnimationSteps=this.dragTargetTime*
Mojo.Animation.targetFPS;


this.dragIntermediateSteps=8;
this.zoomIntermediateSteps=5;
this.zoomConstant=85;


this.element=this.controller.element;


this.centerImageExists=false;
this.leftImageExists=false;
this.rightImageExists=false;
this.inTransition=false;

this.zoomMax=1.0;
this.zoomLevel=1.0;
this.panX=0;
this.panY=0;

this.imageCenter=this._newImage();
this.imageRight=this._newImage();
this.imageLeft=this._newImage();
this.imageHighRes=this._newImage();

this.highResolutionLoadTimeoutSetting=
this.controller.attributes.highResolutionTimeout||
this.highResolutionLoadTimeout;
this.extractFSParams=
this.controller.attributes.extractfsParams||
this.defaultExtractFSParams;
this.lowResExtractFSParams=
this.controller.attributes.lowResExtractfsParams||
this.defaultLowResExtractFSParams;

this.noExtractFS=this.controller.attributes.noExtractFS;
this.limitZoom=this.controller.attributes.limitZoom;
this.panInsetX=this.controller.attributes.panInsetX||0;
this.panInsetY=this.controller.attributes.panInsetY||0;
this.autoSize=(!!this.controller.attributes.autoSize)||false;

this._bindLoads();

this.canvasElement=this.controller.document.createElement('canvas');
this.canvasElement.observe(Mojo.Event.tap,
this._tapHandler.bind(this));
this.canvasElement.observe(Mojo.Event.flick,
this._flickHandler.bind(this));
this.canvasElement.observe(Mojo.Event.dragStart,
this._dragStartHandler.bind(this));
this.canvasElement.observe(Mojo.Event.dragging,
this._draggingHandler.bind(this));
this.canvasElement.observe(Mojo.Event.dragEnd,
this._dragEndHandler.bind(this));

this.element.appendChild(this.canvasElement);

this.animationQueue=Mojo.Animation.queueForElement(
this.canvasElement);

this._readModelProperties(this.controller.model);

this.resizer=this._resizeHandler.bindAsEventListener(this);
this.manualSize(this.element.offsetWidth,this.element.offsetHeight);
this.controller.listen(
this.controller.window,'resize',this.resizer);

this.activateHandler=this._activate.bind(this);
this.deactivateHandler=this._deactivate.bind(this);
this.gestureStartHandler=this._gestureStart.bind(this);
this.gestureChangeHandler=this._gestureChange.bind(this);
this.gestureEndHandler=this._gestureEnd.bind(this);
this._overscrollTimeout=this._overscrollTimeout.bind(this);

this.controller.listen(
this.controller.scene.sceneElement,
Mojo.Event.activate,this.activateHandler);
this.controller.listen(
this.controller.scene.sceneElement,
Mojo.Event.deactivate,this.deactivateHandler);

this.controller.exposeMethods(['getCurrentParams']);
this.controller.exposeMethods(['manualSize']);
this.controller.exposeMethods(['leftUrlProvided']);
this.controller.exposeMethods(['rightUrlProvided']);
this.controller.exposeMethods(['centerUrlProvided']);
},

_newImage:function()
{
return this.controller.document.createElement('img');
},

_activate:function()
{
this.controller.document.observe('gesturestart',
this.gestureStartHandler);
this.controller.document.observe('gesturechange',
this.gestureChangeHandler);
this.controller.document.observe('gestureend',
this.gestureEndHandler);
},

_deactivate:function()
{
this.controller.document.stopObserving('gesturestart',
this.gestureStartHandler);
this.controller.document.stopObserving('gesturechange',
this.gestureChangeHandler);
this.controller.document.stopObserving('gestureend',
this.gestureEndHandler);
},


_cropHandler:function(name,event)
{
switch(name)
{
case Mojo.Event.tap:
return this._tapHandler(event);
case Mojo.Event.flick:
return this._flickHandler(event);
case Mojo.Event.dragStart:
return this._dragStartHandler(event);
case Mojo.Event.dragEnd:
return this._dragEndHandler(event);
case Mojo.Event.dragging:
return this._draggingHandler(event);
case'gesturestart':
return this._gestureStart(event);
case'gesturechange':
return this._gestureChange(event);
case'gestureend':
return this._gestureEnd(event);
}
},

getCurrentParams:function()
{
var result={};

var imageWidth=this.imageCenter.width*this.zoomLevel;
var imageHeight=this.imageCenter.height*this.zoomLevel;

result.focusX=(-this.panX+
(this.canvasElement.width/2))/imageWidth;

result.focusY=(-this.panY+
(this.canvasElement.height/2))/imageHeight;

result.sourceImage=this._getHighResUrl(
this.originalCenterUrl);
result.scale=this.zoomLevel;
result.sourceWidth=this.imageCenter.width;
result.sourceHeight=this.imageCenter.height;

return result;
},


noAction:function()
{
},


handleModelChanged:function(model,what)
{
this._readModelProperties(this.controller.model);
if(this.autoSize){
this.resizer();
}else{
this._adjustToSize();
}
},


_readModelProperties:function(model)
{
this.background=
this.controller.model.background||
this.controller.model.backgroundColor;
this.backgroundImage=
this.controller.model.backgroundImage;
this.onLeftFunction=this.controller.model.onLeftFunction||Mojo.doNothing;
this.onRightFunction=this.controller.model.onRightFunction||Mojo.doNothing;

if(this.backgroundImage)
{
this.loadedBackgroundImage=this._newImage();
this.loadedBackgroundImage.onload=
this._render.bind(this);
this.loadedBackgroundImage.src=this.backgroundImage;
}

this._modelChanged();
},


_bound:function(viewSize,imageSize,inset,coord,zoom)
{
var imageRealSize=imageSize*(zoom||this.zoomLevel);

if((viewSize-(inset*2))>imageRealSize){
return(viewSize-imageRealSize)/2;
}

if(coord>=inset){
return inset;
}

if((coord-viewSize)<-(inset+imageRealSize)){
return-((inset+imageRealSize)-viewSize);
}

return coord;
},


_boundX:function(x,customZoom)
{
return this._bound(this.canvasElement.width,
this.imageCenter.width,
this.panInsetX,
x,customZoom);
},


_boundY:function(y,customZoom)
{
return this._bound(this.canvasElement.height,
this.imageCenter.height,
this.panInsetY,
y,customZoom);
},


cleanup:function()
{

this.canvasElement.stopObserving(Mojo.Event.tap);
this.canvasElement.stopObserving(Mojo.Event.flick);
this.canvasElement.stopObserving(Mojo.Event.dragStart);
this.canvasElement.stopObserving(Mojo.Event.dragging);
this.canvasElement.stopObserving(Mojo.Event.dragEnd);
this.controller.stopListening(
this.controller.window,'resize',this.resizer);
delete this.imageCenter;
delete this.imageRight;
delete this.imageLeft;
delete this.imageHighRes;
},


_modelChanged:function()
{
this.imageHighRes.src=null;
this.imageCenter.src=null;
this.imageLeft.src=null;
this.imageRight.src=null;

this.leftImageExists=false;
this.rightImageExists=false;
this.centerImageExists=false;
},

_calculateGutterWidth:function(middleWidth)
{
var actualWidth=middleWidth||
this.imageCenter.width*this.zoomLevel;
var gutter=this.defaultGutterWidth;
if(actualWidth<this.canvasElement.width)
{
var middleBuffer=
(this.canvasElement.width-actualWidth)/2;
gutter=Math.max(middleBuffer,gutter);
}

return gutter;
},


_render:function(panXLeft,panXRight)
{
var context=this.canvasElement.getContext('2d');

if(this.background)
{
context.fillStyle=this.background;
context.fillRect(0,0,this.canvasElement.width,
this.canvasElement.height);
}
else
{
context.clearRect(0,0,this.canvasElement.width,
this.canvasElement.height);
}

if(this.backgroundImage&&
this.loadedBackgroundImage&&
this.loadedBackgroundImage.complete&&
this.loadedBackgorundImage.width&&
this.loadedBackgorundImage.height)
{
context.drawImage(this.loadedBackgroundImage,0,0);
}

var centerWidth=this.imageCenter.width*this.zoomLevel;
var centerHeight=this.imageCenter.height*this.zoomLevel;
var gutter=this._calculateGutterWidth(centerWidth);

var offsetX;
var offsetY;

if(this.centerImageExists)
{
offsetX=this.panX;
offsetY=this.panY;

context.drawImage(this.imageCenter,
offsetX,offsetY,
centerWidth,centerHeight);
}
else
{
Mojo.Log.info("Render with blank middle image!!!");
return;
}

if(this.leftImageExists)
{
var leftWidth=this.imageLeft.width*this.zoomLeft;
var leftHeight=this.imageLeft.height*this.zoomLeft;

if(panXLeft!==undefined)
{
offsetX=panXLeft;
}
else
{
offsetX=this.panX-(leftWidth+gutter);
}

context.drawImage(this.imageLeft,offsetX,
(this.canvasElement.height-
leftHeight)/2,
leftWidth,leftHeight);
}

if(this.rightImageExists)
{
var rightWidth=this.imageRight.width*this.zoomRight;
var rightHeight=this.imageRight.height*
this.zoomRight;

if(panXRight!==undefined)
{
offsetX=panXRight;
}
else
{
offsetX=this.panX+centerWidth+gutter;
}

context.drawImage(this.imageRight,offsetX,
(this.canvasElement.height-
rightHeight)/2,
rightWidth,rightHeight);
}
},


_getExtractFSUrl:function(url,params)
{
if(!url)
{
return null;
}

if(this.noExtractFS||!url.startsWith("/media/internal"))
{
return url;
}

return this.extractFSPath+encodeURIComponent(url)+
(url.indexOf(":")>=0?":":":0:0:")+
params;
},


_getLowResUrl:function(url)
{


return this._getExtractFSUrl(url,this.lowResExtractFSParams);
},


_getMediumResUrl:function(url)
{
return this._getExtractFSUrl(url,
this.canvasElement.width+":"+
this.canvasElement.height+":3");
},


_getHighResUrl:function(url)
{
return this._getExtractFSUrl(url,this.extractFSParams);
},


_applyHighResExtractFSParams:function(image,url)
{
Mojo.Log.info("Try applying high res ",url);
if(this.inNextFlickTransition||this.noExtractFS||
this.originalHighResUrl!==url)
{
Mojo.Log.info("Dropping high res.");
return;
}

if(this._userBusy())
{
this.highResolutionTimer=
this._applyHighResExtractFSParams.bind(this)
.delay(0.5,image,url);
return;
}

image.src=this._getHighResUrl(url);
},


_userBusy:function()
{
return this.inGesture||this.inDrag||
this.inZoomTransition||this.inSameTransition;
},

leftUrlProvided:function(url,thumbUrl)
{
Mojo.Log.info("provided left: "+url);
if(url!==this.originalLeftUrl)
{
this.leftImageExists=false;
this.originalLeftUrl=url;
this.imageLeft.src=this._getLowResUrl(thumbUrl||url);
}
},

centerUrlProvided:function(url,thumbUrl)
{
Mojo.Log.info("provided center: "+url);
if(url!==this.originalCenterUrl)
{
this.centerImageExists=false;
this.originalCenterUrl=url;
this.imageCenter.src=this._getLowResUrl(thumbUrl||url);
}
},

rightUrlProvided:function(url,thumbUrl)
{
Mojo.Log.info("provided right: "+url);
if(url!==this.originalRightUrl)
{
this.rightImageExists=false;
this.originalRightUrl=url;
this.imageRight.src=this._getLowResUrl(thumbUrl||url);
}
},


_retryUntilComplete:function(image,retry)
{


if(image.complete&&image.width>0&&image.height>0){
return;
}
if(retry&&retry>=10){
return;
}

this._retryUntilComplete.bind(this).delay(0.1,image,
retry?retry+1:1);
},


_leftImageLoaded:function(event)
{
this._retryUntilComplete(this.imageLeft);
this.zoomLeft=this._calculateInitialZoom(this.imageLeft);
this.leftImageExists=true;
Mojo.Log.info("Left Image done loading!",this.imageLeft.src);
},


_rightImageLoaded:function(event)
{
this._retryUntilComplete(this.imageRight);
this.zoomRight=this._calculateInitialZoom(this.imageRight);
this.rightImageExists=true;
Mojo.Log.info("Right Image done loading!",this.imageRight.src);
},


_highResImageFailed:function(event)
{
Mojo.Log.error("Failed to load high res image!",
this.originalHighResUrl);
},

_recoverFromFailedImage:function(side){
var src;
Mojo.Log.info("Recovering from failed image load by displaying a corrupt image placeholder.");

if(side==='center'){
src=this.imageCenter.src;
if(src.substring(src.length-this.corruptImage.length)!==this.corruptImage){
this.imageCenter.src=this.corruptImage;
return;
}
}else if(side==='right'){
src=this.imageRight.src;
if(src.substring(src.length-this.corruptImage.length)!==this.corruptImage){
this.imageRight.src=this.corruptImage;
return;
}
}else if(side==='left'){
src=this.imageLeft.src;
if(src.substring(src.length-this.corruptImage.length)!==this.corruptImage){
this.imageLeft.src=this.corruptImage;
return;
}
}
},


_alignCenterImage:function()
{
this.zoomBase=this._calculateBaseZoom(this.imageCenter);
this.zoomMax=this._calculateMaxZoom(this.imageCenter);
this.zoomInitial=this._calculateInitialZoom(this.imageCenter);
this.zoomLevel=this.zoomInitial;
this.panY=(this.canvasElement.height-
(this.imageCenter.height*this.zoomLevel))/2;
this.panX=(this.canvasElement.width-
(this.imageCenter.width*this.zoomLevel))/2;
},

_getFocus:function(pan,viewSize,imageSize)
{
return((viewSize/2)-pan)/(this.zoomLevel*imageSize);
},


_highResImageLoaded:function(event,retry)
{
this._retryUntilComplete(this.imageHighRes);

if(this.originalCenterUrl!=this.originalHighResUrl)
{
return;
}

Mojo.Log.info("High Res image done loading! "+
this.imageHighRes.src);

var oldFocusX=this._getFocus(this.panX,
this.canvasElement.width,
this.imageCenter.width);
var oldFocusY=this._getFocus(this.panY,
this.canvasElement.height,
this.imageCenter.height);
var zoomPercent;
if(this.isZoomed){
var zoomRange=this.zoomMax-this.zoomBase;
if(zoomRange!==0)
{
zoomPercent=(this.zoomLevel-this.zoomBase)/
(this.zoomMax-this.zoomBase);
}
else
{
zoomPercent=0;
}
}

this.zoomInitial=this._calculateInitialZoom(
this.imageHighRes);
this.zoomBase=this._calculateBaseZoom(this.imageHighRes);
this.zoomMax=this._calculateMaxZoom(this.imageHighRes);
if(this.isZoomed){
this.zoomLevel=this.zoomBase+
(zoomPercent*(this.zoomMax-this.zoomBase));
}else{
this.zoomLevel=this.zoomInitial;
}
this.panY=(this.canvasElement.height/2)-
(oldFocusY*this.imageHighRes.height*this.zoomLevel);
this.panX=(this.canvasElement.width/2)-
(oldFocusX*this.imageHighRes.width*this.zoomLevel);

this.imageCenter=this.imageHighRes;
this.imageHighRes=this._newImage();
this._bindHighRes();
delete this.originalHighResUrl;


this._bindCenter();

Mojo.Log.info("Render via highres image loaded.");
this._render();
},


_centerImageLoaded:function(event,retry)
{
var src=this.imageCenter.src;
this._retryUntilComplete(this.imageCenter);
Mojo.Log.info("Center Image done loading! "+
this.imageCenter.src);
this.centerImageExists=true;
this._alignCenterImage();
Mojo.Log.info("Render via center image loaded.");
this._render();

if(src.substring(src.length-this.corruptImage.length)!==this.corruptImage){
this._scheduleHighResTimer();
Mojo.Event.send(this.element,Mojo.Event.imageViewChanged,
{url:this.originalCenterUrl,error:false});
}else{
Mojo.Event.send(this.element,Mojo.Event.imageViewChanged,
{url:this.originalCenterUrl,error:true});
}

},

_scheduleHighResTimer:function()
{
if(this.highResolutionTimer)
{
this.controller.window.clearTimeout(this.highResolutionTimer);
delete this.highResolutionTimer;
}
this.originalHighResUrl=this.originalCenterUrl;
if(this.noExtractFS)
{
return;
}
Mojo.Log.info("Scheduling high res for",this.originalHighResUrl);
this.highResolutionTimer=
this._applyHighResExtractFSParams.bind(this)
.delay(this.highResolutionLoadTimeoutSetting,
this.imageHighRes,this.originalHighResUrl);
},


_calculateMaxZoom:function(img)
{
if(this.limitZoom)
{
return 1.0;
}


if(img.width>img.height)
{

return this.targetDecodeResolution/img.width;
}
else
{

return this.targetDecodeResolution/img.height;
}
},

_capZoom:function(desiredZoom)
{
if(this.limitZoom)
{
return Math.min(1.0,desiredZoom);
}
else
{
return desiredZoom;
}
},


_calculateBaseZoom:function(img)
{

var canvasRatio=this.canvasElement.width/
this.canvasElement.height;
var imageRatio=img.width/img.height;

var desiredZoom;

if(imageRatio>canvasRatio)
{

desiredZoom=this.canvasElement.width/img.width;
}
else
{

desiredZoom=this.canvasElement.height/img.height;
}

return this._capZoom(desiredZoom);
},


_calculateInitialZoom:function(img)
{
var zoom=this._calculateBaseZoom(img);

var imgWidth=zoom*img.width;
var imgHeight=zoom*img.height;

var thresholdWidth=(this.defaultZoomThreshold*imgWidth)/100;
var thresholdHeight=(this.defaultZoomThreshold*imgHeight)/100;

var targetWidth=this.canvasElement.width;
var targetHeight=this.canvasElement.height;

var diffWidth=targetWidth-imgWidth;
var diffHeight=targetHeight-imgHeight;

if(diffWidth>=1&&diffWidth<=thresholdWidth)
{
zoom=targetWidth/img.width;
}

if(diffHeight>=1&&diffHeight<=thresholdHeight)
{
zoom=targetHeight/img.height;
}

return this._capZoom(zoom);
},


_scheduleSame:function(x,y,dragging)
{
if(x==this.panX&&y==this.panY)
{


}

if(!this.inSameTransition)
{
this.inSameTransition=true;
this.animationQueue.add(this);
}

this.transitionStep=0;

if(dragging)
{
this.transitionSteps=8;
}
else
{
this.transitionSteps=20;
}
this.dragStartPanX=this.panX;
this.dragStartPanY=this.panY;
this.dragTargetPanX=x;

if((this.zoomLevel&&this.zoomInitial&&
this.zoomLevel>this.zoomInitial+0.01)||
this.panInsetY)
{
this.dragTargetPanY=y;
}
else
{
this.dragTargetPanY=
(this.canvasElement.height-
(this.imageCenter.height*this.zoomLevel))/2;
}
},


animate:function(value)
{
if(this.inSameTransition)
{
this.transitionStep+=1;
this.panX=this._calculateWithDecay(
this.dragStartPanX,
this.dragTargetPanX,
this.transitionStep,
this.transitionSteps);
this.panY=this._calculateWithDecay(
this.dragStartPanY,
this.dragTargetPanY,
this.transitionStep,
this.transitionSteps);

if(this.transitionStep>=this.transitionSteps)
{
Mojo.Log.info("ending same trans.");
this._endSame();
}
this._render();
}
else if(this.inGesture)
{


var decayedZoom=this.zoomLevel;
if(decayedZoom!=this.gestureZoomLevel)
{
decayedZoom+=
(this.gestureZoomLevel-decayedZoom)/2;
}


this.zoomTarget=decayedZoom;
this._animateZoom(decayedZoom*this.zoomConstant);
}
else
{
Mojo.Log.info("In animation queue for unknown reasons.");
this.animationQueue.remove(this);
}
},


_endSame:function()
{
if(this.inSameTransition)
{


this.animationQueue.remove(this);
this.inSameTransition=false;
}
},


_storeZoomFocus:function(x,y)
{
var realX=x||(this.canvasElement.width/2);
var realY=y||(this.canvasElement.height/2);

var currentWidth=this.imageCenter.width*this.zoomLevel;
var currentHeight=this.imageCenter.height*this.zoomLevel;

var pixFocusX=realX-this.panX;
var pixFocusY=realY-this.panY;

realX=Math.max(0,Math.min(realX,currentWidth));
realY=Math.max(0,Math.min(realY,currentHeight));

this.zoomFocusX=pixFocusX/currentWidth;
this.zoomFocusY=pixFocusY/currentHeight;
},


_scheduleZoom:function(target,targetX,targetY)
{
if(this.inNextFlickTransition)
{
Mojo.Log.info("Ignoring zoom transition while in "+
"next flick");
return false;
}

if(this.inSameTransition)
{
Mojo.Log.info("Stopping same transition for a zoom.");
this._endSame();
}

var zoomTarget;
if(target>this.zoomMax)
{
zoomTarget=this.zoomMax;
}
else if(target<this.zoomBase)
{
zoomTarget=this.zoomBase;
}
else
{
zoomTarget=target;
}

if(zoomTarget==this.zoomLevel)
{
return;
}

if(this.inZoomTransition)
{
Mojo.Log.info("Already in zoom transition.");
return false;
}

this.inZoomTransition=true;

this.zoomStart=this.zoomLevel;
this.zoomTarget=zoomTarget;
var isZoomed=this.zoomTarget>this.zoomStart;

this._storeZoomFocus(targetX,targetY);

this.zoomStartPanX=this.panX;
this.zoomStartPanY=this.panY;

var options={};
options.onComplete=this._completeZoom.bind(this,isZoomed);
options.reverse=false;
options.curve="ease-in-out";
options.from=this.zoomLevel*this.zoomConstant;
options.to=this.zoomTarget*this.zoomConstant;
options.duration=this.zoomTargetTime;
this.animator=Mojo.Animation.animateValue(
this.animationQueue,
'bezier',
this._animateZoom.bind(this),
options);

return true;
},



_animateZoom:function(value)
{


if(this.zoomTarget==this.zoomStart)
{
return;
}

var targetFocusPixX=this.zoomFocusX*
(this.imageCenter.width*this.zoomTarget);
var targetFocusPanX=this._boundX(
-(targetFocusPixX-
(this.canvasElement.width/2)),
this.zoomTarget);

var targetFocusPixY=this.zoomFocusY*
(this.imageCenter.height*this.zoomTarget);
var targetFocusPanY=this._boundY(
-(targetFocusPixY-
(this.canvasElement.height/2)),
this.zoomTarget);

this.zoomLevel=value/this.zoomConstant;

var zoomPercent=(this.zoomLevel-this.zoomStart)/
(this.zoomTarget-this.zoomStart);

this.panX=this.zoomStartPanX+
((targetFocusPanX-this.zoomStartPanX)*
zoomPercent);

this.panY=this.zoomStartPanY+
((targetFocusPanY-this.zoomStartPanY)*
zoomPercent);

this._render();
},


_completeZoom:function(isZoomed,element,cancelled)
{
this.isZoomed=isZoomed;
this.inZoomTransition=false;
},


_scheduleNextFlick:function(go_left,fastCurve)
{
if(go_left&&!this.leftImageExists)
{
Mojo.Log.info("Going left return false.");
return false;
}

if(!go_left&&!this.rightImageExists)
{
Mojo.Log.info("Going right return false.");
return false;
}

if(this.inNextFlickTransition)
{
Mojo.Log.info("Already in flick next transition.");
return false;
}


this.imageHighRes.src=null;

this._clearOverscrollTimeout();
this.inNextFlickTransition=true;

if(this.inSameTransition)
{
Mojo.Log.info("Stopping same transition for a zoom.");
this._endSame();
}

if(this.inGesture)
{
this.animationQueue.remove(this);
this.inGesture=false;
}

var curve="ease-in-out";
if(fastCurve)
{
curve="ease";
}

this.flickDirectionLeft=go_left;

var flickTarget;

var middleWidth=this.imageCenter.width*this.zoomLevel;
var gutter=this._calculateGutterWidth();
var leftWidth=this.imageLeft.width*this.zoomLeft;
var rightWidth=this.imageRight.width*this.zoomRight;

if(go_left)
{
if(leftWidth<this.canvasElement.width)
{
flickTarget=this.canvasElement.width;
}
else
{
flickTarget=this.canvasElement.width+
this._calculateGutterWidth(leftWidth);
}
}
else
{
if(rightWidth<this.canvasElement.width)
{
flickTarget=-middleWidth;
}
else
{
flickTarget=-(middleWidth+gutter);
}
}

var options={};
options.onComplete=this._completeNextFlick.bind(this);
options.reverse=false;
options.curve=curve;
options.from=this.panX;
options.to=flickTarget;
options.duration=this.flickTargetTime;

this.animatorFlickNext=
Mojo.Animation.animateValue(
this.animationQueue,
'bezier',
this._animateNextFlick.bind(this),
options);



this.panXLeftCustom=undefined;
this.panXRightCustom=undefined;

var nextOptions={};
nextOptions.reverse=false;
nextOptions.curve=options.curve;
nextOptions.duration=this.flickTargetTime;

if(go_left)
{

nextOptions.from=this.panX-(leftWidth+gutter);
nextOptions.to=
(this.canvasElement.width-leftWidth)/2;

this.animatorFlickNext=
Mojo.Animation.animateValue(
this.animationQueue,
'bezier',
this._animateLeftFlick.bind(this),
nextOptions);
}
else
{
nextOptions.from=this.panX+middleWidth+
this._calculateGutterWidth();
nextOptions.to=
(this.canvasElement.width-rightWidth)/2;

this.animatorFlickNext=
Mojo.Animation.animateValue(
this.animationQueue,
'bezier',
this._animateRightFlick.bind(this),
nextOptions);
}

return true;
},


_animateNextFlick:function(value)
{
this.panX=value;
this._render(this.panXLeftCustom,this.panXRightCustom);
},


_animateLeftFlick:function(value)
{
this.panXLeftCustom=value;
},


_animateRightFlick:function(value)
{
this.panXRightCustom=value;
},

_bindCenter:function()
{
var centerImageFailed=this._recoverFromFailedImage.bind(this,'center');
this.imageCenter.onload=this._centerImageLoaded.bind(this);
this.imageCenter.onabort=centerImageFailed;
this.imageCenter.onerror=centerImageFailed;
},

_bindHighRes:function()
{
var highResFailed=this._highResImageLoaded.bind(this);
this.imageHighRes.onload=highResFailed;
this.imageHighRes.onabort=highResFailed;
this.imageHighRes.onerror=highResFailed;
},

_bindLoads:function()
{
var imageRightError=this._recoverFromFailedImage.bind(this,'right');
var imageLeftError=this._recoverFromFailedImage.bind(this,'left');

this._bindHighRes();
this._bindCenter();

this.imageRight.onload=this._rightImageLoaded.bind(this);
this.imageRight.onabort=imageRightError;
this.imageRight.onerror=imageRightError;

this.imageLeft.onload=this._leftImageLoaded.bind(this);
this.imageLeft.onabort=imageLeftError;
this.imageLeft.onerror=imageLeftError;
},


_completeNextFlick:function(element,cancelled)
{
Mojo.Log.info("complete next flick");

this._clearOverscrollTimeout();
this.resetOffsetY=0;
this.resetOffsetX=0;



this.centerImageExists=false;
this.leftImageExists=false;
this.rightImageExists=false;

if(this.flickDirectionLeft)
{
this.imageRight=this.imageCenter;
this.originalRightUrl=this.originalCenterUrl;
this.imageCenter=this.imageLeft;
this.originalCenterUrl=this.originalLeftUrl;
this.imageLeft=this._newImage();
delete this.originalLeftUrl;

this._bindLoads();

this._centerImageLoaded();
this._rightImageLoaded();

this.onLeftFunction();
}
else
{
this.imageLeft=this.imageCenter;
this.originalLeftUrl=this.originalCenterUrl;
this.imageCenter=this.imageRight;
this.originalCenterUrl=this.originalRightUrl;
this.imageRight=this._newImage();
delete this.originalRightUrl;

this._bindLoads();

this._centerImageLoaded();
this._leftImageLoaded();

this.onRightFunction();
}

this.zoomTarget=this.zoomLevel;

this.panXLeftCustom=undefined;
this.panXRightCustom=undefined;

this.inNextFlickTransition=false;
},


_calculateWithDecay:function(start,stop,step,total)
{
var diff=stop-start;

if(diff===0||step>=total)
{
return stop;
}

var percent=step/total;
var onePixelTarget=Math.log(Math.abs(diff));

return Math.round((stop-(diff*
(1/Math.pow(Math.E,onePixelTarget*percent)))));
},


_dragStartHandler:function(event)
{
if(!this.centerImageExists)
{
Mojo.Log.info("No center image to handle gesture!");
return;
}

if(this.inGesture||this.inNextFlickTransition)
{
return;
}

this._scheduleOverscrollTimeout();

Mojo.Log.info("Drag start ...");

this.inSameFromFlick=false;

this.inDrag=true;
this.imageDragStart=this.imageCenter.src;
this.dragDownPanX=this.panX;
this.dragDownPanY=this.panY;
this.resetOffsetX=0;
this.resetOffsetY=0;

this.lastDragNewX=0;
this.lastDragNewY=0;


this.dragDownClientX=event.down.clientX;
this.dragDownClientY=event.down.clientY;
event.stop();

return Mojo.Gesture.CONSUMED_EVENT;
},


_draggingWrap:function(diffX,diffY,ending)
{
var newX=this.dragDownPanX;
var newY=this.dragDownPanY;

if(ending)
{
newX+=this.lastDiffX||0;
newY+=this.lastDiffY||0;


var middleWidth=this.imageCenter.width*
this.zoomLevel;
var snapPixels=this.canvasElement.width*
this.dragSnapThreshold;
if(newX>snapPixels)
{
Mojo.Log.info("go to the left",newX,snapPixels,middleWidth);
if(!this._scheduleNextFlick(true))
{
this._scheduleOverscrollTimeout();
}
}
else if(newX<-(middleWidth-(this.canvasElement.width-snapPixels)))
{
Mojo.Log.info("go to the right",newX,snapPixels,middleWidth);
if(!this._scheduleNextFlick(false))
{
this._scheduleOverscrollTimeout();
}
}
else
{
Mojo.Log.info("stay the same: "+(this.imageCenter.width*this.zoomLevel));
Mojo.Log.info("staying zoom: "+this.zoomLevel);
Mojo.Log.info("staying width: "+this.imageCenter.width);
this._scheduleOverscrollTimeout();
}
}
else
{
newX+=diffX;
newY+=diffY;
this.lastDiffX=diffX;
this.lastDiffY=diffY;
delete this.scheduledReturn;
this._scheduleSame(newX,newY,true);
if(Math.abs(this.lastDragNewX-newX)>2||
Math.abs(this.lastDragNewY-newY)>2)
{
this.lastDragNewX=newX;
this.lastDragNewY=newY;
this._scheduleOverscrollTimeout();
}
}

this.controller.window.event.stop();

return Mojo.Gesture.CONSUMED_EVENT;
},


_overscrollTimeout:function(event)
{
var overscrollX=this.panX-this._boundX(this.panX);
var overscrollY=this.panY-this._boundY(this.panY);

this._clearOverscrollTimeout();

if(this.scheduledReturn)
{
if(!overscrollX&&!overscrollY)
{
delete this.scheduledReturn;
}

Mojo.Log.info("overscroll...",overscrollX,overscrollY);

this._scheduleOverscrollTimeout();
Mojo.Log.info("Scheduled return in prog.");
return;
}

if(!this.inDrag)
{

if(!overscrollX&&!overscrollY)
{
return;
}

Mojo.Log.info("Not in drag overscroll timer..");
this._scheduleSame(
this._boundX(this.panX),
this._boundY(this.panY),false);
return;
}

Mojo.Log.info("regular drag overscroll timer..");

this.resetOffsetY=overscrollY;
this.dragDownPanY-=this.resetOffsetY;

var potentialX=this.panX;

if((overscrollX>0&&!this.leftImageExists)||
(overscrollX<0&&!this.rightImageExists))
{
this.resetOffsetX=overscrollX;
this.dragDownPanX-=this.resetOffsetX;
potentialX=this._boundX(this.panX);
}

if(!this.scheduledReturn&&
(potentialX!=this.panX)||overscrollY)
{
Mojo.Log.info("Scheduling return.");
this.scheduledReturn=true;
this._scheduleSame(
potentialX,this._boundY(this.panY),false);
}

this._scheduleOverscrollTimeout();
},


_clearOverscrollTimeout:function()
{
if(!this.overscrollTimer)
{
return;
}

this.controller.window.clearTimeout(this.overscrollTimer);
delete this.overscrollTimer;
},


_scheduleOverscrollTimeout:function()
{
this._clearOverscrollTimeout();
this.overscrollTimer=this.controller.window.setTimeout(
this._overscrollTimeout,
250);
},


_draggingHandler:function(event)
{
if(this.inGesture||!this.inDrag||this.inNextFlickTransition)
{
return;
}
return this._draggingWrap(
event.move.clientX-event.down.clientX,
event.move.clientY-event.down.clientY);
},


_dragEndHandler:function(event)
{
Mojo.Log.info("Drag end...");

if(this.inGesture||!this.inDrag||
this.inNextFlickTransition)
{
this.inDrag=false;
return;
}

this.inDrag=false;

if(!this.inSameFromFlick)
{
var diffX=event.up.clientX-this.dragDownClientX;
var diffY=event.up.clientY-this.dragDownClientY;

return this._draggingWrap(diffX,diffY,true);
}
},


_gestureStart:function(event)
{
if(!this.centerImageExists)
{
Mojo.Log.info("No center image to handle gesture!");
return;
}

if(this.inSameTransition)
{
Mojo.Log.info("Stopping same transition for a zoom.");
this._endSame();
}

this.inGesture=true;
this.gestureStartZoomLevel=this.zoomLevel;
this.gestureZoomLevel=this.gestureStartZoomLevel;

this.zoomStartPanX=this.panX;
this.zoomStartPanY=this.panY;
this.zoomStart=this.gestureStartZoomLevel;

Mojo.Log.info("event xy: "+event.pointerX());
Mojo.Log.info("event xy: "+event.pointerY());



this._storeZoomFocus();

this.animationQueue.add(this);

event.stop();

return Mojo.Gesture.CONSUMED_EVENT;
},


_gestureChange:function(event)
{
if(this.inSameTransition||!this.inGesture)
{
return Mojo.Gesture.CONSUMED_EVENT;
}






var zoomTarget=this.gestureStartZoomLevel*event.scale;
if(zoomTarget>this.zoomMax)
{
zoomTarget=this.zoomMax;
}
else if(zoomTarget<this.zoomBase)
{
zoomTarget=this.zoomBase;
}

if(zoomTarget==this.zoomLevel)
{
return;
}
this.gestureZoomLevel=zoomTarget;



event.stop();

return Mojo.Gesture.CONSUMED_EVENT;
},


_gestureEnd:function(event)
{
if(this.inSameTransition||!this.inGesture)
{
return Mojo.Gesture.CONSUMED_EVENT;
}

this.animationQueue.remove(this);
this.inGesture=false;

event.stop();

return Mojo.Gesture.CONSUMED_EVENT;
},


_tapHandler:function(event)
{
if(!this.centerImageExists)
{
Mojo.Log.info("No center image to handle tap!");
return;
}

if(event.count>=2)
{
if(this.zoomLevel>(this.zoomBase+
((this.zoomMax-this.zoomBase)/2)))
{
this._scheduleZoom(this.zoomInitial);
}
else
{

this._scheduleZoom(this.zoomMax,
event.down.clientX,
event.down.clientY);
}
event.stop();
}
},


_zoomLessThanEqualToInitial:function()
{
return(this.zoomInitial>=(this.zoomLevel-0.01));
},


_calculateFlickTarget:function(start,velocity)
{
return start+
(velocity*(this.flickScale/this.sameTargetTime));
},


_flickHandler:function(event)
{
if(!this.centerImageExists)
{
Mojo.Log.info("No center image to handle flick!");
return;
}

var centerWidth=this.imageCenter.width*this.zoomLevel;
var centerHeight=this.imageCenter.height*this.zoomLevel;
var pixelThreshold=5;

Mojo.Log.info("Velocity: "+event.velocity.x);
Mojo.Log.info("panx "+this.panX);
Mojo.Log.info("Center wid "+centerWidth);
Mojo.Log.info("canvas width: "+this.canvasElement.width);

if(Math.abs(event.velocity.y)>Math.abs(event.velocity.x)&&
centerHeight<=this.canvasElement.height)
{

Mojo.Log.info("Dropping flick because of y velocity.");
}
else if(event.velocity.x>0&&
(this.panX>=-pixelThreshold||
this._zoomLessThanEqualToInitial()))
{
if(!this._scheduleNextFlick(true,true))
{
this._scheduleOverscrollTimeout();
}
event.stop();
}
else if(event.velocity.x<0&&
((this.panX+centerWidth)<=
(this.canvasElement.width+pixelThreshold)||
this._zoomLessThanEqualToInitial()))
{
if(!this._scheduleNextFlick(false,true))
{
this._scheduleOverscrollTimeout();
}
event.stop();
}
else
{
var newX=this._boundX(this._calculateFlickTarget(
this.panX,event.velocity.x));
var newY=this._boundY(this._calculateFlickTarget(
this.panY,event.velocity.y));
Mojo.Log.info("target: "+newX+","+newY+
" current: "+this.panX+","+this.panY);

this.inSameFromFlick=true;
this._scheduleSame(newX,newY,false);

this._scheduleOverscrollTimeout();

event.stop();
}
},

_adjustToSize:function()
{
var dim=Element.getDimensions(this.element);
this.canvasElement.height=dim.height;
this.canvasElement.width=dim.width;
},

manualSize:function(width,height)
{
var needRender=false;

if(width==this.canvasElement.width&&
height==this.canvasElement.height)
{
return;
}

this.inGesture=false;
this.inDrag=false;
this.inSameTransition=false;
this._endSame();

this.canvasElement.height=height;
this.canvasElement.width=width;

if(this.originalCenterUrl)
{
if(this.centerImageExists)
{
needRender=true;
this._alignCenterImage();
this._scheduleHighResTimer();
}
else
{
this.imageCenter.src=this._getMediumResUrl(
this.originalCenterUrl);
}
}
if(this.originalLeftUrl)
{
if(this.leftImageExists)
{
needRender=true;
this.zoomLeft=this._calculateInitialZoom(
this.imageLeft);
}
else
{
this.imageLeft.src=this._getMediumResUrl(
this.originalLeftUrl);
}
}
if(this.originalRightUrl)
{
if(this.rightImageExists)
{
needRender=true;
this.zoomRight=this._calculateInitialZoom(
this.imageRight);
}
else
{
this.imageRight.src=this._getMediumResUrl(
this.originalRightUrl);
}
}

if(needRender)
{
this._render();
}
},

_resizeHandler:function(event)
{
Mojo.Log.info("resize event!: "+Object.keys(event));
Mojo.Log.info("width!: "+this.element.clientWidth);
Mojo.Log.info("height !: "+this.element.clientHeight);
Mojo.Log.info("autoSize!:",this.autoSize);
if(this.autoSize){
var orientation=this.controller.stageController.getWindowOrientation();
var portrait=orientation==='up'||orientation==='down';
this.manualSize(
portrait?this.element.clientWidth:this.element.clientHeight,
portrait?this.element.clientHeight:this.element.clientWidth);
}
}

});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Widget.AddressingWidget=Class.create({
SEARCH_DELAY:300,
MIN_GAL_LOOKUP:3,
MAX_RECIPIENT_DISPLAY_CHARS:17,
ADDRESSING_WIDGET_UNFOCUSED:0,
ADDRESSING_WIDGET_FILTERSTATE:1,
ADDRESSING_WIDGET_SHOWALLSTATE:2,
ADDRESSING_WIDGET_FOCUSED:3,
ADDRESSING_WIDGET_RECIPIENT_OPEN:4,
AVAILABLE_LOCS_PRIORITY:{
'addresses':1,
'remote-addresses':2,
'phoneArea':3,
'imArea':4,
'inputArea':5
},
BOTTOM_PADDING_PERCENT:0.7,
REVERSE_LOOKUP_MAX:2000,
CONTACT_TYPE:{
PHONE:'phone',
IM:'im',
EMAIL:'email',
SMS:'sms'
},



initialize:function(){

this.STATE=this.ADDRESSING_WIDGET_UNFOCUSED;
},


setup:function(){

this.initializeDefaultValues();
this.renderWidget();
this.measureShill=this.controller.get(this.controller.model.divPrefix+'-shill');
this.setupButtons();
this.setupTextField();
this.setupPrepopulatedRecipients(this.controller.model.recipients);
this._updateTextfieldWidth(true);


this.controller.exposeMethods(['focus','close','updateRecipients']);
Mojo.View.makeFocusable(this.controller.element);

this.handleMouseEvent=this.handleMouseEvent.bind(this);
this.handleMouseEventListWrapper=this.handleMouseEventListWrapper.bind(this);
Mojo.Event.listen(this.controller.document,Mojo.Event.tap,this.handleMouseEvent,true);
Mojo.Event.listen(this.popupContainer,Mojo.Event.listTap,this.handleMouseEventListWrapper);
this.handleFocusChange=this.handleFocusChange.bind(this);
Mojo.Event.listen(this.controller.scene.sceneElement,"DOMFocusIn",this.handleFocusChange);
this.handleKeyEvent=this.handleKeyEvent.bind(this);
Mojo.Event.listen(this.inputArea,"keydown",this.handleKeyEvent);
this.handleKeyUpEvent=this.handleKeyUpEvent.bind(this);
Mojo.Event.listen(this.inputArea,"keyup",this.handleKeyUpEvent);
this.controller.scene.pushCommander(this);

this.scroller=Mojo.View.getScrollerForElement(this.controller.element);
if(this.scroller){
this.addAsScrollListener=this.addAsScrollListener.bind(this);
Mojo.Event.listen(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener,false);
}
if(this.controller.model.initialSearch!==undefined){
this.initialSearch=this.controller.model.initialSearch;
if(this.controller.model.initialSearch.blank()){
this.enterShowAllState();
}else{

this.enterFilterState();
}
}else if(this.controller.model.focus){
this.enterFocusedState();
}else{
this.enterUnfocusedState();
}


this.setPopupHeight=this.setPopupHeight.bind(this);
if(!this.controller.model._commitLimited){
Mojo.Event.listen(this.controller.window,'resize',this.setPopupHeight);
}

this.commitChanges=this.commitChanges.bind(this);
Mojo.Event.listen(this.controller.scene.sceneElement,Mojo.Event.commitChanges,this.commitChanges);
},

addAsScrollListener:function(event){
event.scroller.addListener(this);
},

updateRecipients:function(recips){
this.setupPrepopulatedRecipients(recips);
},

setText:function(text){

this._stateUpdater();
},

_updateTextfieldWidth:function(showingButton){
var width;
this.measureShill.show();
width=Mojo.View.getDimensions(this.measureShill).width;
if(showingButton){
width-=48;
}
this.inputDiv.setStyle({'max-width':width+'px'});
this.measureShill.hide();
},

cleanup:function(){
this.cancelSearch();
Mojo.Event.stopListening(this.controller.document,Mojo.Event.tap,this.handleMouseEvent,true);
Mojo.Event.stopListening(this.popupContainer,Mojo.Event.listTap,this.handleMouseEventListWrapper);
Mojo.Event.stopListening(this.controller.scene.sceneElement,"DOMFocusIn",this.handleFocusChange);
if(!this.controller.model._commitLimited){
Mojo.Event.stopListening(this.controller.window,'resize',this.setPopupHeight);
}
Mojo.Event.stopListening(this.controller.scene.sceneElement,Mojo.Event.commitChanges,this.commitChanges);
if(this.scroller){
Mojo.Event.stopListening(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener,false);
}
Mojo.Event.stopListening(this.inputArea,"keydown",this.handleKeyEvent);
Mojo.Event.stopListening(this.inputArea,"keyup",this.handleKeyUpEvent);
Mojo.Event.stopListening(this.commitButton,Mojo.Event.tap,this.handleCommitButton);
Mojo.Event.stopListening(this.showAllButton,Mojo.Event.tap,this.handleButtonPress);
},

commitChanges:function(){
if(this.state===this.ADDRESSING_WIDGET_RECIPIENT_OPEN){
if(this.inputDiv.mojo.getValue().length===0){
this.removeRecipient(this.activeRecipient);
this.enterUnfocusedState();
}else{
this.revertRecipient();
}
}else if(this.STATE===this.ADDRESSING_WIDGET_FILTERSTATE){

this.selectDefaultEntryAndClose();
}
},


isInHeader:function(target){
if(target.getAttribute("name")==="contact_header"||target.up('[name=contact_header]')){
return true;
}
},

handleMouseEventListWrapper:function(triggerEvent){

if(this.isInHeader(triggerEvent.originalEvent.target)){
return;
}

if(this.STATE===this.ADDRESSING_WIDGET_RECIPIENT_OPEN){
this.replaceRecipient(this.activeRecipient,triggerEvent.item);
this.activeRecipient=undefined;
this.specificContactList.hide();
this.enterFocusedState();
}else{
this.addRecipient(triggerEvent.item);
this.enterFocusedState();
triggerEvent.stop();
}
},



handleFocusChange:function(focusEvent){
var target=focusEvent.target;
if(target.id!==this.addressingArea.id&&!target.up('div#'+this.addressingArea.id)){

this.handleMouseEvent(focusEvent);
}else if(target.up('div#'+this.inputDiv.id)&&this.STATE===this.ADDRESSING_WIDGET_UNFOCUSED){
this.enterFocusedState();
}
},


initializeDefaultValues:function(){
this.prefix=this.controller.model.property||'to';
this.controller.model.divPrefix=this.controller.scene.sceneId+this.controller.element.id;
this.totalRecips=0;


this.includeEmails=this.controller.model.includeEmails||false;
this.includePhones=this.controller.model.includePhones||false;
this.includeIMs=this.controller.model.includeIMs||false;
this.dataSource=new Mojo.Widget.AddressingWidget.DataSource(this.includeEmails,this.includePhones,this.includeIMs);

this.showGAL=this.controller.model.showGAL;
this._maybeUpdateState=this._maybeUpdateState.bind(this);

this.galAvailable=this.galAvailable.bind(this);
this.selectEntryBound=this.selectEntryAndClose.bind(this);
},

setupButtons:function(){
this.commitButton=this.controller.get(this.controller.model.divPrefix+'-commit_button');
this.commitButton.hide();
this.handleCommitButton=this.handleCommitButton.bind(this);
Mojo.Event.listen(this.commitButton,Mojo.Event.tap,this.handleCommitButton);

this.showAllButton=this.controller.get(this.controller.model.divPrefix+'-show_all_button');
this.handleButtonPress=this.handleButtonPress.bind(this);
Mojo.Event.listen(this.showAllButton,Mojo.Event.tap,this.handleButtonPress);
},


setPopupHeight:function(){
if(!this.inputArea){
return;
}

var inputHeight=this.editContainer.offsetHeight;
var topPos=Mojo.View.viewportOffset(this.controller.element);

var maxHeight=Mojo.View.getViewportDimensions(this.controller.document).height;
var diff=50;
var style;

style='max-height: '+(maxHeight-(topPos.top+inputHeight)-diff)+'px;';
this.popupResultsContainer.setStyle(style);
this.popupContainer.setStyle(style);
this.popupResultsContainer.setStyle({position:'absolute'});
},

showInputArea:function(){
this.makeNotFocusable();
this.inputArea.show();
this.controller.scene.showWidgetContainer(this.inputDiv);
this.inputDiv.mojo.focus();
},

hideInputArea:function(){
this.inputDiv.mojo.blur();
this.inputArea.hide();
if(this.totalRecips>0){
this.inputDiv.setStyle({'max-width':'0px'});
}
this.controller.scene.hideWidgetContainer(this.inputDiv);
},

show:function(){
this.setPopupHeight();
this.popupResultsContainer.show();
},

hide:function(){
if(this.addressList.mojo){
this.addressList.mojo.setLength(0);
}

if(this.galList.mojo){
this.galList.mojo.setLength(0);
}

if(this.popupResultsContainer){
this.popupResultsContainer.hide();
}
},

_clearAllResults:function(){
if(this.imSearch){
Mojo.Event.stopListening(this.imSearch,Mojo.Event.tap,this.selectEntryBound);
}
this.imSearch=undefined;
this._setPhoneNumberArea();
this.removeSMSMatchArea();
},

search:function(text,force){
if(!force&&(!text||text.length===0)){
return;
}

if(text===this.filter){
return;
}
this.filter=text;
this.dataSource.setFilter(text);

this.isFirstFilter=true;
this.dataSource._requestContactsList(this._renderContactsList.bind(this),this.addressList,0,this.addressList.mojo.maxLoadedItems());
this._clearAllResults();



this.renderSpecialAreas(text);
},


submitFilteredSearch:function(){

this.filterTimer=undefined;
this.search(this.inputArea.value);
},


filteredSearch:function(){
if(this.filterTimer){
this.controller.window.clearTimeout(this.filterTimer);
this.filterTimer=undefined;
}
if(!this.isValidAddress(this.inputArea.value)){



this.adjustCommitButtonLoc('inputArea',true);
this.filterTimer=this.controller.window.setTimeout(this.submitFilteredSearch.bind(this),this.SEARCH_DELAY);
}else{
this.addressList.mojo.setLength(0);
this._clearAllResults();
this.renderSpecialAreas(this.inputArea.value);
}
},


_showNoResults:function(){
this.show();
this.noResults.show();
Mojo.View.removeTouchFeedback(this.showAllButton);
},

setLocalContactSelectable:function(availableLoc){
var wasMatch=this.setContactSelectable(availableLoc,'remote-addresses',this.addressList);
if(!wasMatch&&(!this.showGAL||this.inputArea.value.length<this.MIN_GAL_LOOKUP)){
this._showNoResults();
}else if(this.showGAL&&this.inputArea.value.length<this.MIN_GAL_LOOKUP){
this.noResults.hide();
}
},

setRemoteContactSelectable:function(availableLoc){
var wasMatch=this.setContactSelectable(availableLoc,'phoneArea',this.galList);
if(!this.galContainer.visible()&&!wasMatch&&this.showGAL&&this.inputArea.value.length>=this.MIN_GAL_LOOKUP){
this._showNoResults();
}else if(!this.galContainer.visible()){
this.noResults.hide();
}
},

setContactSelectable:function(availableLoc,fallbackLoc,list){
var contactRow;
contactRow=list.mojo.getNodeByIndex(0);
if(!contactRow){
this.adjustCommitButtonLocFallback(fallbackLoc);
return false;
}
this.currentLoc=availableLoc;
contactRow=contactRow.querySelector('[name=contact-row]');
if(contactRow){
this.makeRowSelectable(contactRow);
return true;
}
return false;
},

setPhoneAreaSelectable:function(availableLoc){
if(!this.phoneNumberArea){
this.adjustCommitButtonLocFallback('inputArea');
return;
}
this.currentLoc=availableLoc;
this.makeRowSelectable(this.phoneNumberArea);
},

setInputAreaSelectable:function(availableLoc){
this.currentLoc=availableLoc;
this.showAllButton.removeClassName('add-contact-open');
this.showAllButton.addClassName('add-contact');
this.showAllButton.hide();
this.commitButton.show();
this._updateTextfieldWidth(true);
},

adjustCommitButtonLocFallback:function(availableLoc){
this.adjustCommitButtonLoc(availableLoc,true);
},

maybeAdjustCommitButtonLoc:function(availableLoc){
this.adjustCommitButtonLoc(availableLoc);
},


adjustCommitButtonLoc:function(availableLoc,force){
if(this.STATE===this.ADDRESSING_WIDGET_SHOWALLSTATE){
return;
}

var priority=this.AVAILABLE_LOCS_PRIORITY[availableLoc];
var currPriority=this.AVAILABLE_LOCS_PRIORITY[this.currentLoc];

if(!force&&currPriority&&priority>currPriority){
return;

}



var selectables=this.popupContainer.select('.selectable');
selectables.each(function(s){
s.removeClassName('selectable');
});
if(this.currentLoc==='inputArea'){
this.commitButton.hide();
this._updateTextfieldWidth(false);
}



switch(availableLoc){
case'addresses':
this.setLocalContactSelectable(availableLoc);
break;
case'remote-addresses':
this.setRemoteContactSelectable(availableLoc);
break;
case'phoneArea':
this.setPhoneAreaSelectable(availableLoc);
break;
case'imArea':
this.currentLoc=availableLoc;
break;
case'inputArea':
this.setInputAreaSelectable(availableLoc);
break;
default:
break;
}
},

makeRowSelectable:function(row){
if(row){
row.addClassName('selectable');
}
},



_belongsToThisWidget:function(event){
return event.target.up('div#'+this.addressingArea.id);
},




isEventInMenu:function(event,focused){
var target=event.target;
if(focused&&Mojo.View.findParentByAttribute(target,this.controller.document,"x-mojo-element","_Submenu")){
return true;
}
return false;
},


isEventInAddressing:function(event,focused){
var target;

if(this._belongsToThisWidget(event)&&(this.isEventInShowAll(event)||this.isEventInCommit(event)||(focused&&this.isEventInRecipient(event))||this.isEventInLabel(event))){
return false;
}

target=event.target;
if(target.id===this.addressingArea.id||target===this.controller.element||target.up('div#'+this.addressingArea.id)){
return true;
}

return false;
},

isEventInShowAll:function(event){
var target=event.target;
if(this._belongsToThisWidget(event)&&target.id==this.showAllButton.id){
return true;
}
return false;
},

isEventInLabel:function(event){
var target;
if(!this.controller.model.actionableLabel||!this.labelContent){
return false;
}

target=event.target;
if(this._belongsToThisWidget(event)&&(target===this.labelContent||target.up('div#'+this.labelContent.id))){
return true;
}
},

isEventInCommit:function(event){
var target=event.target;
if(this._belongsToThisWidget(event)&&target.id===this.commitButton.id){
return true;
}
return false;
},


isEventInPopup:function(event){
var target=event.target;
if(this.popupContainer&&this._belongsToThisWidget(event)&&
((target.id===this.popupContainer.id||target.up('div#'+this.popupContainer.id)))){
return true;
}
return false;
},

isEventInPopupList:function(event){
return!!Mojo.View.findParentByAttribute(event.target,this.popupContainer,"x-mojo-element","List");
},

inEventInTopSpecialContainer:function(event){
var target=event.target;
while(target){
if(target===this.topSpecialSearchContainer){
return true;
}
target=target.parentNode;
}
return false;
},

isEventInRecipient:function(event){
var target=event.target;


if(target&&this._belongsToThisWidget(event)&&((target.hasClassName('recipient-atom')||target.up('div.recipient-atom')))){
return true;
}
return false;
},


isEventInInputField:function(event){
var target=event.target;


if(target&&this._belongsToThisWidget(event)&&target.up('div#'+this.inputDiv.id)){
return true;
}
return false;
},

isMetaEvent:function(event){
return event.which===Mojo.Char.metaKey;
},



focusRecips:function(){
var atoms=this.controller.element.select('div.recipient');
atoms.each(function(e){
e.removeClassName('recipient');
e.querySelector('[name="comma"]').hide();
e.addClassName('recipient-atom');
}.bind(this));
},


unfocusRecips:function(){
var counter=0;
var atoms=this.controller.element.select('div[name="address"]');
atoms.each(function(e){
e.removeClassName('recipient-atom');
e.addClassName('recipient');
if(counter!=atoms.length-1){
e.querySelector('[name="comma"]').show();
}
counter++;
}.bind(this));
},

showAllButtonToggle:function(open){
if(open){
this.showAllButton.removeClassName('add-contact');
this.showAllButton.addClassName('add-contact-open');
}else{
this.showAllButton.removeClassName('add-contact-open');
this.showAllButton.addClassName('add-contact');
}
},

enterShowAllState:function(){
var originalShowGal=this.showGAL;
this.setupLazyLists();
this.STATE=this.ADDRESSING_WIDGET_SHOWALLSTATE;
this.showGAL=false;
this.cancelSearch();
this.clearSearch();
this.focusRecips();
this.showAllButton.show();
this.showAllButtonToggle(true);
this.commitButton.hide();
this.hide();
this.show();
this.search('',true);
this.showGAL=originalShowGal;
this.showInputArea();
this._updateTextfieldWidth(true);
},

enterFilterState:function(){
this.STATE=this.ADDRESSING_WIDGET_FILTERSTATE;
this.setupLazyLists();

this.showInputArea();
this.cancelSearch();
this.clearSearch();
this.showAllButton.hide();
this._updateTextfieldWidth(false);
this.showAllButtonToggle(false);
this.hideHintText();
this.show();
this.filteredSearch();

this._scrollIntoView();
},

updateFilterState:function(){
if(this.inputDiv.mojo.getValue().length>0){
this.cancelSearch();
this.show();
this.filteredSearch();
}else{
this.enterFocusedState();
}

this._scrollIntoView();
},

hideHintText:function(){
this.textFieldAttributes.hintText='';
this.textFieldModel.value=this.inputArea.value;
this.controller.modelChanged(this.textFieldModel);
},

showHintText:function(){
this.textFieldAttributes.hintText=this.controller.model.hintText||'';
this.textFieldModel.value=this.inputArea.value;
this.controller.modelChanged(this.textFieldModel);
},

enterUnfocusedState:function(){
var previousState=this.STATE;
this.STATE=this.ADDRESSING_WIDGET_UNFOCUSED;
if(this.totalRecips>0){
this.hideHintText();
}else{
this.showHintText();
}
this._updateTextfieldWidth(true);
this.hideInputArea();
this.resetTextFieldValue();
this.cancelSearch();
this.clearSearch();
this.commitButton.hide();
this.showAllButtonToggle(false);
this.showAllButton.show();
this.hide();
this.unfocusRecips();
var focusable=this.makeFocusable.bind(this);
focusable.delay(0.1);

if(previousState!==this.STATE){
Mojo.Event.send(this.controller.element,Mojo.Event._addressingWidgetBlur,undefined,false);
}
},

advanceFocusDeferred:function(){
this.showInputArea();
this.inputArea.show();
Mojo.View.advanceFocus(this.controller.scene.sceneElement,this.inputArea);
this.hideInputArea();
this.inputArea.hide();
},

advanceFocus:function(event){
var advance;
if(event){
event.stop();
}
advance=this.advanceFocusDeferred.bind(this);
advance.defer();
},

makeFocusable:function(){
Mojo.View.makeFocusable(this.controller.element);
},

makeNotFocusable:function(){
Mojo.View.makeNotFocusable(this.controller.element);
},

enterFocusedState:function(){
if(this.STATE===this.ADDRESSING_WIDGET_FOCUSED){
return;
}

this.showInputArea();
this.focusRecips();

this.STATE=this.ADDRESSING_WIDGET_FOCUSED;
if(this.totalRecips>0){
this.hideHintText();
}else{
this.showHintText();
}

if(this.inputArea.value.length>0){
this.enterFilterState();
return;
}
this.cancelSearch();
this.clearSearch();
this.showAllButton.show();
this.showAllButton.removeClassName('add-contact-open');
this.showAllButton.addClassName('add-contact');
this.commitButton.hide();
this._updateTextfieldWidth(true);
this.hide();
},

enterRecipientOpenState:function(event){

this.setupLazyLists();
this.STATE=this.ADDRESSING_WIDGET_RECIPIENT_OPEN;
this.cancelSearch();
this.inputDiv.mojo.blur();
this.activateRecipient(event.target);
this.showInputArea();
this.showAllButton.hide();
this.commitButton.show();
this._updateTextfieldWidth(true);
},

selectDefaultEntryAndClose:function(event){
if(event){
Event.stop(event);
}

this.selectDefaultEntry();
this.enterUnfocusedState();
this.advanceFocus(event);
},

selectDefaultEntry:function(){
var recip=this.handleEnterEvent();

if(!recip&&this.inputArea.value.length>0){
this.selectInputAreaEntry();
return;
}
if(recip){
this.addRecipient(recip);
}
},

selectInputAreaEntry:function(){
var recip={
'value':this.inputArea.value,
'contactDisplay':this.inputArea.value
};
this.addRecipient(recip);
},


selectEntryAndClose:function(event){
Event.stop(event);
this.selectEntry(event);
this.enterUnfocusedState();
this.advanceFocus(event);
},

selectEntry:function(event){

var target=event.target;
var data;
var json;

if(target&&target.getAttribute("name")!=="contactPoint"){
target=Mojo.View.findParentByAttribute(target,this.controller.element,'name','contactPoint');
}

if(target){
data=target.querySelector("input[x-mojo-format='json']");
if(data){
json=data.value.evalJSON();
this.addRecipient(json);
}
}
},

handleButtonPress:function(event){
if(this.STATE!=this.ADDRESSING_WIDGET_SHOWALLSTATE){
this.enterShowAllState();
Mojo.View.addTouchFeedback(this.showAllButton);
event.stop();
}else{
Mojo.View.removeTouchFeedback(this.showAllButton);
if(this.controller.model._commitLimited){
this.enterUnfocusedState();
}else{
this.enterFocusedState();
}
event.stop();
}
},




moved:function(scrollEnding,position){
if(this._anyResults()&&this.popupContainer.visible()){
this.setPopupHeight();
}
},


_maybeUpdateState:function(){
if(this.prevValue===this.inputDiv.mojo.getValue()){
return;
}

this._stateUpdater();
},

_stateUpdater:function(){
if((this.prevValue&&this.prevValue.length>0)||this.inputDiv.mojo.getValue().length>0){
if(this.STATE===this.ADDRESSING_WIDGET_FILTERSTATE){
this.updateFilterState();
}else if(this.STATE===this.ADDRESSING_WIDGET_FOCUSED&&this.inputDiv.mojo.getValue().length>0){
this.enterFilterState();
}else if(this.STATE===this.ADDRESSING_WIDGET_RECIPIENT_OPEN){
this.removeRecipient(this.activeRecipient);
if(this.inputDiv.mojo.getValue().length===0){
this.enterFocusedState();
}else{
this.enterFilterState();
}
}else{
this.enterFocusedState();
this.enterFilterState();
}
}else{
this.enterFocusedState();
}
},

isValidAddress:function(addr){
return addr&&(addr.indexOf('@')!==-1);
},

replaceOpenRecipient:function(){
var data=this.activeRecipient.querySelector("input[x-mojo-format='json']");
var parsedVal=Mojo.parseJSON(data.value);
var recipVal=parsedVal.value;
var recip;
if(data&&(recipVal!==this.inputArea.value)){
recip={
'value':this.inputArea.value,
'contactDisplay':this.inputArea.value
};
this.replaceRecipient(this.activeRecipient,recip,true);
}else{
this.activeRecipient.show();
}

this.activeRecipient=undefined;
},

handleMouseEvent:function(event){

if(event.target&&Mojo.View.getParentWithAttribute(event.target,"x-mojo-element","CharSelector")){
return;
}
switch(this.STATE){

case this.ADDRESSING_WIDGET_UNFOCUSED:
if(this.isEventInAddressing(event,false)){
this.enterFocusedState();
event.stop();
}
break;
case this.ADDRESSING_WIDGET_FOCUSED:
if(this.isEventInMenu(event,true)){
return;
}else if(this.isEventInShowAll(event)){
break;
}else if(this.isEventInRecipient(event)){
this.enterRecipientOpenState(event);
event.stop();
}else if(!this.isEventInAddressing(event,true)){
if(!this.controller.model._commitLimited){
this.resetTextFieldValue();
this.enterUnfocusedState();
}
}else if(this.isEventInAddressing(event,true)){
this.showInputArea();
event.stop();
}
break;
case this.ADDRESSING_WIDGET_FILTERSTATE:
if(this.isEventInMenu(event,true)){
return;
}else if(this.isEventInShowAll(event)){
break;
}else if(this.isEventInRecipient(event)){
if(!this.controller.model._commitLimited){
this.selectDefaultEntry(event);
}
this.enterRecipientOpenState(event);
event.stop();
}else if(this.isEventInPopup(event)){
if(this.controller.model._commitLimited&&!(this.isEventInPopupList(event)||this.inEventInTopSpecialContainer(event))){
event.stop();
}
return;
}else if(!this.isEventInAddressing(event,true)){
if(!this.controller.model._commitLimited){
this.selectDefaultEntry(event);
this.enterUnfocusedState();
}else{
event.stop();
}
}else if(this.isEventInAddressing(event,true)){

this.inputArea.selectionStart=this.inputArea.value.length;
this.inputArea.selectionEnd=this.inputArea.selectionStart;
if(event.target!==this.inputArea){
event.stop();
}
}
break;
case this.ADDRESSING_WIDGET_SHOWALLSTATE:
if(this.isEventInMenu(event,true)){
return;
}else if(this.isEventInShowAll(event)){
break;
}else if(this.isEventInRecipient(event)){
this.enterRecipientOpenState(event);
event.stop();
}else if(this.isEventInPopup(event)){
return;
}else if(!this.isEventInAddressing(event,true)){
if(!this.controller.model._commitLimited){
this.resetTextFieldValue();
this.enterUnfocusedState();
}
event.stop();
}
break;
case this.ADDRESSING_WIDGET_RECIPIENT_OPEN:
if(this.isEventInMenu(event,true)){
return;
}else if(this.isEventInPopup(event)){
return;
}else if(this.isEventInShowAll(event)){
return;
}else if(this.isEventInInputField(event)){
return;
}else if(this.isEventInRecipient(event)){
if(this.activeRecipient){
this.revertRecipient(true);
}
this.enterRecipientOpenState(event);
event.stop();
return;
}else if(this.isEventInAddressing(event,true)||!this.isEventInPopup(event)||!this.isEventInAddressing(event)){
this.revertRecipient();
event.stop();
}
this.specificContactList.hide();
break;
default:
break;
}
},



getJsonData:function(item){
var data,json;
if(item){
data=item.querySelector("input[x-mojo-format='json']");
json=data.value.evalJSON();
return json;
}
return null;
},

handleEnterEvent:function(keepFocus){
var hasStandardChildren,hasRemoteChildren,hasPhoneNumber,hasIM;
var address;
var data;
var json;
var node;


if(this.currentLoc==='addresses'){
address=this.addressList.mojo.getNodeByIndex(0);
if(address){
return this.addressList.mojo.getItemByNode(address);
}
}else if(this.currentLoc==='remote-addresses'){

address=this.galList.mojo.getNodeByIndex(0);
if(address){
return this.galList.mojo.getItemByNode(address);
}
}else if(this.currentLoc==='phoneArea'){

hasPhoneNumber=this.phoneNumberArea||false;
if(hasPhoneNumber){
address=this.topSpecialSearchContainer;
return this.getJsonData(address);
}
}
},


_anyResults:function(){
if(!this.popupContainer||this.popupContainer.offsetWidth===0){
return false;
}
return true;
},


validFilterStart:function(e){
return(e.keyCode!==Mojo.Char.spaceBar);
},

handleKeyUpEvent:function(event){
var chr=event.keyCode;
var node;
var data;
var recipVal,recip,parsedVal;


if(this.isMetaEvent(event)){
this.clipboardEvent();
return;
}

if(Mojo.Char.isCommitKey(chr)){
return;
}

switch(this.STATE){
case this.ADDRESSING_WIDGET_FOCUSED:
if(Mojo.Char.isDeleteKey(chr)){
if(this.totalRecips>0){

this.removeRecipient();
}
if(this.totalRecips===0){
this.showHintText();
this.showInputArea();
}
if(this.controller.model._commitLimited){
this.enterUnfocusedState();
}
}else if(Mojo.Char.isCommitKey(chr)){

}else if(this.validFilterStart(event)&&Mojo.Char.isValid(chr)){
this.enterFilterState();
}else if(Mojo.Char.isEnterKey(chr)){
this.enterUnfocusedState();
this.advanceFocus(event);
}
break;
case this.ADDRESSING_WIDGET_FILTERSTATE:
if(Mojo.Char.isDeleteKey(chr)){
if(this.inputArea.value.length<=0||this.selectedItems===0){
if(this.controller.model._commitLimited){
this.enterShowAllState();
this.showHintText();
}else{
this.resetTextFieldValue();
this.enterFocusedState();
}
}else{
this.updateFilterState();
}
}else if(Mojo.Char.isValid(chr)){
this.updateFilterState();
}else if(Mojo.Char.isEnterKey(chr)){
this.selectDefaultEntryAndClose(event);
}
break;
case this.ADDRESSING_WIDGET_SHOWALLSTATE:
if(Mojo.Char.isDeleteKey(chr)){
this.enterUnfocusedState();
}else if(Mojo.Char.isValidWrittenChar(chr)){
this.enterFilterState();
}else if(Mojo.Char.isEnterKey(chr)){
this.advanceFocus(event);
}
break;
case this.ADDRESSING_WIDGET_RECIPIENT_OPEN:
if(Mojo.Char.isEnterKey(chr)){
node=this.specificContactList.mojo.getNodeByIndex(0);
if(node){
this.replaceRecipient(this.activeRecipient,this.specificContactList.mojo.getItemByNode(node));
this.activeRecipient=undefined;
}else{
this.replaceOpenRecipient();
}

this.enterUnfocusedState();
this.advanceFocus(event);
event.stop();
}else{
this.removeRecipient(this.activeRecipient);
if(this.inputDiv.mojo.getValue().length===0){
this.enterFocusedState();
}else{
this.enterFilterState();
}
event.stop();
}
this.specificContactList.hide();
break;
default:
break;
}
},

handleKeyEvent:function(event){
var chr=event.keyCode;
var node;

if(this.isMetaEvent(event)){
this.prevValue=this.inputDiv.mojo.getValue();
return;
}
if(!Mojo.Char.isCommitKey(chr)){
return;
}

switch(this.STATE){
case this.ADDRESSING_WIDGET_FILTERSTATE:
if(Mojo.Char.isCommitKey(chr)){
if(!this.controller.model._commitLimited){
this.selectDefaultEntry();
}
this.enterFocusedState();
event.stop();
}
break;
case this.ADDRESSING_WIDGET_RECIPIENT_OPEN:
if(Mojo.Char.isCommitKey(chr)){
this.activeRecipient.show();
this.activeRecipient=undefined;
this.enterUnfocusedState();
event.stop();
this.specificContactList.hide();
}
break;
default:
break;
}
},


charsAllow:function(key){
if((key==59||key==Mojo.Char.semiColon||key==Mojo.Char.comma||key==44)){
return false;
}

if(key===Mojo.Char.spaceBar){
if(this.inputDiv.mojo.getValue().length>0){
return true;
}
return false;
}

return true;
},


focus:function(event){
this.enterFocusedState();
},

handleCommitButton:function(event){
this.selectDefaultEntry(event);
this.enterUnfocusedState();
this.advanceFocus(event);
},

renderWidget:function(){
var labelContent="";
var labelTemplate;
if(this.controller.model.labelText){
if(this.controller.model.actionableLabel){
labelTemplate='/addr-widget/label-button-content';
}else{
labelTemplate='/addr-widget/label-content';
}
}else{
labelTemplate='/addr-widget/empty-label-content';
}

labelContent=Mojo.View.render({object:this.controller.model,template:Mojo.Widget.getSystemTemplatePath(labelTemplate)});

this.controller.model.labelContent=labelContent;
var content=Mojo.View.render({object:this.controller.model,
template:Mojo.Widget.getSystemTemplatePath('/addr-widget/addr-widget')
});
this.controller.element.insert(content);
this.recipientArea=this.controller.element.querySelector('span#'+this.controller.model.divPrefix+'-recipsspan');
this.addressingArea=this.controller.get(this.controller.model.divPrefix+'-addressing-widget');
this.labelContent=this.controller.get(this.controller.model.divPrefix+'-labelContent');
this.galContainer=this.controller.get(this.controller.model.divPrefix+'-gal-lookup-container');
this.noResults=this.controller.get(this.controller.model.divPrefix+'-no-results');
},

setupLazyLists:function(){
if(!this.lazyListSetup){
this.controller.scene.setupWidget(this.addressList.id,this.popupAttributes,this.popupModel);
this.controller.scene.setupWidget(this.galList.id,this.galListAttributes,this.galListModel);
this.controller.scene.setupWidget(this.specificContactList.id,this.specificContactAttributes,this.specificContactModel);
this.controller.instantiateChildWidgets(this.controller.element);
this.controller.scene.showWidgetContainer(this.controller.element);
this.lazyListSetup=true;
}

},

setupTextField:function(){

var startFilter=(this.controller.model.initialSearch===undefined||this.controller.model.initialSearch.blank())?undefined:this.controller.model.initialSearch;
this.textFieldAttributes={
textFieldName:this.controller.model.divPrefix+'-input_area',
focus:this.controller.model.focus,
hintText:this.controller.model.hintText,
charsAllow:this.charsAllow.bind(this),
consumeBack:true,
enterSubmits:true,
focusMode:this.controller.model.focusMode||Mojo.Widget.focusSelectMode,
requiresEnterKey:true,
textReplacement:false,
autoResize:true
};

this.textFieldModel={
value:startFilter
};
this.controller.scene.setupWidget(this.controller.model.divPrefix+'-input_area_div',this.textFieldAttributes,this.textFieldModel);


this.popupAttributes={itemTemplate:Mojo.Widget.getSystemTemplatePath('/addr-widget/contact-point'),lookahead:30,renderLimit:50,
itemsCallback:this.dataSource._requestContactsList.bind(this,this._renderContactsList.bind(this))};
this.popupModel={
};

this.addressList=this.controller.get(this.controller.model.divPrefix+'-results-container');



this.galListAttributes={itemTemplate:Mojo.Widget.getSystemTemplatePath('/addr-widget/contact-point'),
itemsCallback:this.searchGal.bind(this)};
this.galListModel={stuff:'stuff'
};
this.galList=this.controller.get(this.controller.model.divPrefix+'-special-results-container');


this.specificContactAttributes={itemTemplate:Mojo.Widget.getSystemTemplatePath('/addr-widget/contact-point'),
itemsCallback:this.dataSource._requestAddressList.bind(this,this._renderSpecificContactList.bind(this))};
this.specificContactModel={};
this.specificContactList=this.controller.get(this.controller.model.divPrefix+'-specific-contact-container');

this.controller.instantiateChildWidgets(this.controller.element);

this.popupContainer=this.controller.get(this.controller.model.divPrefix+'-popup');
this.popupContainer.down().setStyle({display:"block",overflow:'hidden','margin-left':"1px;"});
this.popupResultsContainer=this.controller.get(this.controller.model.divPrefix+'-popup-results');

this.hintTextArea=this.controller.get(this.textFieldAttributes.textFieldName+'_hintText');
this.inputDiv=this.controller.get(this.controller.model.divPrefix+'-input_area_div');
this.inputArea=this.inputDiv.querySelector('[name='+this.controller.model.divPrefix+'-input_area]');
this.inputArea.mojo={};
this.inputArea.mojo.setText=this.setText.bind(this);
this.inputAreaOriginalSize=this.inputArea.getWidth();

this.bottomSpecialSearchContainer=this.controller.get(this.controller.model.divPrefix+'-bottomspecial-search-container');
this.imSpecialSearchContainer=this.controller.get(this.controller.model.divPrefix+'-imspecial-search-container');
this.topSpecialSearchContainer=this.controller.get(this.controller.model.divPrefix+'-topspecial-search-container');
this.specialResultsContainer=this.controller.get(this.controller.model.divPrefix+'-special-results-container');

this.editContainer=this.controller.get(this.controller.model.divPrefix+'-edit-container');
},

checkEnterFocusedState:function(event){
if(this.STATE==this.ADDRESSING_WIDGET_UNFOCUSED){
this.enterFocusedState();
}
},



setupPrepopulatedRecipients:function(recipients){
var that=this;
if(recipients&&recipients.length>0){
this.hideHintText();

recipients.each(function(r){


if(r.id){
r.alreadyValidated=true;
}
that.addRecipient(r);
});
}else{

this.recipientArea.innerHTML='';
this.totalRecips=0;
this.showHintText();
}
},

handleModelChanged:function(){
this.includeEmails=this.controller.model.includeEmails||false;
this.includePhones=this.controller.model.includePhones||false;
this.includeIMs=this.controller.model.includeIMs||false;
this.cancelSearch();
this.dataSource._resetFilters(this.includeEmails,this.includePhones,this.includeIMs);
if(this.initialSearch!==this.controller.model.initialSearch){
this.initialSearch=this.controller.model.initialSearch;

this.inputDiv.mojo.setText(this.initialSearch);
if(!this.initialSearch.blank()){
this._maybeUpdateState();
}else{
this.enterShowAllState();
}
}
},





cancelSearch:function(){
this.dataSource._cancelGalSearch();
this.dataSource._cancelContactsSearch();
this.isFirstFilter=false;
this.filter=undefined;
this.dataSource.setFilter(undefined);
this.curId=undefined;
this._setPhoneNumberArea();

if(this.filterTimer){
this.controller.window.clearTimeout(this.filterTimer);
this.filterTimer=null;
}
Mojo.View.removeTouchFeedback(this.showAllButton);
},

clearSearch:function(){
this.currentLoc=undefined;
this._hideGalSearch();
this.addressList.show();
this.topSpecialSearchContainer.innerHTML='';
this.bottomSpecialSearchContainer.innerHTML='';
this.imSpecialSearchContainer.innerHTML='';
this.specialResultsContainer.innerHTML='';
this.noResults.hide();
Mojo.View.removeTouchFeedback(this.showAllButton);
delete this.isGALAvailable;
delete this.invalidGalSearch;
},






_hideGalSearch:function(){
if(this.galContainer){
this.galContainer.hide();
this.controller.scene.hideWidgetContainer(this.galContainer);
if(this.galSpinner){
this.galSpinner.mojo.stop();
}
}
},

_showGalSearch:function(){
if(!this.galLookup){
this.galLookup=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath("/addr-widget/gal-lookup"),attributes:{divPrefix:this.controller.model.divPrefix}});
this.galContainer.innerHTML=this.galLookup;
this.controller.instantiateChildWidgets(this.galContainer);
this.galSpinner=this.controller.get(this.controller.model.divPrefix+"-gal-spinner");
this.galText=this.controller.get(this.controller.model.divPrefix+"-gal-text");
}
this.galContainer.show();
this.galSpinner.mojo.start();
this.controller.scene.showWidgetContainer(this.galContainer);
this.noResults.hide();
},

searchGal:function(){

if(!this.inputArea||this.inputArea.value.length<this.MIN_GAL_LOOKUP||this.isValidAddress(this.inputArea.value)){
return;
}

if(this.invalidGalSearch&&this.inputArea.value.length>=this.invalidGalSearch.length&&this.inputArea.value.substring(0,this.invalidGalSearch.length)===this.invalidGalSearch){
this.specialResultsContainer.innerHTML='';
this.galList.mojo.setLength(0);
this.maybeAdjustCommitButtonLoc('remote-addresses');
return;
}


if(this.isGALAvailable===undefined){
this.dataSource._isGALAvailable(this.galAvailable);
}else if(this.isGALAvailable){
this._searchGal();
}
},

_searchGal:function(){
this._showGalSearch();
this.dataSource._searchGal(this.renderGal.bind(this),this.galError.bind(this),this.galList,0,this.galList.mojo.maxLoadedItems());
},

galAvailable:function(result){
this.isGALAvailable=result?result.result:false;
if(this.isGALAvailable){
this._searchGal();
}
},

galError:function(){
this.galText.innerText=$LL("GAL service is unavailable");
this.galSpinner.mojo.stop();
},



renderGal:function(searchStr,offset,listWidget,results){
var list=results.result;
var that=this;
var addressList,address;
var whackedData=[];
var count,pos;
var curPerson,contact,prevContact;

this.specialResultsContainer.innerHTML='';
this._hideGalSearch();


list.each(function(contactIn){

addressList=contactIn.addressList||[];
curPerson={};
curPerson.firstName=contactIn.firstName;
curPerson.lastName=contactIn.lastName;
if(!curPerson.contactDisplay&&contactIn.addressList.length>0){
curPerson.contactDisplay=Mojo.PatternMatching.addContactNameFormatting(curPerson,contactIn.addressList[0].value);
}


count=0;
pos=0;
prevContact=undefined;

addressList.each(function(address){
if(that.isAllowedType(address.type)){
contact={};

if(count>0){
contact.contactHeaderDisplay='none';
}
contact.value=address.value;
contact.count=count;
contact.rowClass='single';
if(prevContact&&count===1){
prevContact.rowClass='first';
}

if(pos===(addressList.length-1)&&prevContact){
contact.rowClass='last';
}

contact=that._updateContactFormatting(curPerson,contact,searchStr);

prevContact=contact;
whackedData.push(contact);
count++;
}
pos++;
});
}.bind(this));

if(offset===0){
listWidget.mojo.setLength(0);
}

if(list.length===0||(list.length===1&&list[0].addressList.length===0)){
this.invalidGalSearch=searchStr;
}

listWidget.mojo.noticeUpdatedItems(offset,whackedData);
listWidget.mojo.setLength(whackedData.length);

this.maybeAdjustCommitButtonLoc('remote-addresses');
},

_updateContactFormatting:function(curPerson,contact,searchStr){
contact.contactDisplay=curPerson.contactDisplay;
contact.formattedDisplay=Mojo.PatternMatching.addContactMatchFormatting(contact.contactDisplay,searchStr);
contact.alreadyValidated=true;
if(contact.type===this.CONTACT_TYPE.PHONE){
contact.formattedValue=Mojo.Format.formatPhoneNumber(contact.value);
contact.formattedValue=Mojo.PatternMatching.addContactMatchFormatting(contact.formattedValue,searchStr);
}else{
contact.formattedValue=Mojo.PatternMatching.addContactMatchFormatting(contact.value,searchStr);
}
contact.formattedLabel=Mojo.PatternMatching.addContactLabelFormatting(contact.type,contact.label,contact.customLabel,contact.serviceName);
return contact;
},







replaceRecipient:function(target,recip,notValidated){



if(target){
target.remove();
}
this.totalRecips--;
recip.alreadyValidated=!notValidated;
this.addRecipient(recip);
this.activeRecipient=undefined;
},

_scrollIntoView:function(noUp){
var currentScrollerPos=this.scroller.mojo.getScrollPosition().top;
var currentElementBottom=this.controller.element.offsetHeight+Mojo.View.viewportOffset(this.controller.element).top;
var viewportBottom=Mojo.View.getViewportDimensions(this.controller.document).height;
var moveAmt=viewportBottom-(viewportBottom*this.BOTTOM_PADDING_PERCENT)-currentElementBottom;




if(noUp&&moveAmt<0){
return;
}

if(moveAmt!==0){
this.scroller.mojo.scrollTo(undefined,currentScrollerPos+moveAmt,true);
}
},




removeRecipient:function(recipient){
var toRemove=recipient;
var recips;
if(!toRemove){
recips=this.recipientArea.select('.recipient-atom');
if(recips&&recips.length>0){
toRemove=recips.last();
}
}
if(toRemove){
toRemove.remove();
Mojo.Event.send(this.controller.element,Mojo.Event.addressingRecipientDeleted);
this.totalRecips--;
}

this._scrollIntoView(true);
},

revertRecipient:function(dontBlur){
this.resetTextFieldValue();
this.activeRecipient.show();
this.activeRecipient=undefined;
if(!dontBlur){
this.enterUnfocusedState();
}
},


addRecipient:function(recip){
var content,element;
var recipDiv;




if(recip.personId){
recip.alreadyValidated=true;
}
recip.prefix=this.prefix;
recip.identifier=Mojo.View.makeUniqueId();

content=Mojo.View.render({object:recip,template:Mojo.Widget.getSystemTemplatePath("/addr-widget/recipient")});
element=this.recipientArea.insert({bottom:content});
this.resetTextFieldValue();
recipDiv=this.controller.get(recip.identifier);


this._setJsonRecip(recip,recipDiv);

if(!recip.alreadyValidated&&this._validateRecipient(recip,recipDiv)){
this._reverseLookup(recip,recipDiv);
}
Mojo.Event.send(this.controller.element,Mojo.Event.addressingRecipientAdded);
this.totalRecips++;
},





_setJsonRecip:function(model,area){
var jsonRecip=Object.toJSON(model);
var jsonField=area.querySelector("input[x-mojo-format='json']");
if(jsonField){
jsonField.value=jsonRecip;
}
},

_setPhoneNumberArea:function(element){
if(this.phoneNumberArea){
Mojo.Event.stopListening(this.phoneNumberArea,Mojo.Event.tap,this.selectEntryBound);
}

this.phoneNumberArea=element;

if(element){
Mojo.Event.listen(this.phoneNumberArea,Mojo.Event.tap,this.selectEntryBound);
}
},

insertPhoneNumberMatchArea:function(chars){
var numStr;
var jsonRecip;

if(!chars){
return;
}

numStr=Mojo.Widget.AddressingWidget._toPhoneNumber(chars);
if(numStr){
var formattedStr=Mojo.Format.formatPhoneNumber(numStr);
var numberModel={
phoneNumber:formattedStr,
divPrefix:Mojo.View.makeUniqueId(),
display:formattedStr,
type:this.CONTACT_TYPE.PHONE,
id:'',
value:formattedStr,
serviceName:'',
contactId:'',
contactDisplay:formattedStr,
isRemote:false
};
var content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath("/addr-widget/phone-entry"),object:numberModel});
if(this.topSpecialSearchContainer){
this.topSpecialSearchContainer.innerHTML=content;
}

this._setPhoneNumberArea(this.controller.get(numberModel.divPrefix+'-phone-number'));


this._setJsonRecip(numberModel,this.phoneNumberArea);
}else{
if(this.topSpecialSearchContainer){
this.topSpecialSearchContainer.innerHTML='';
}
this._setPhoneNumberArea();
}
this.maybeAdjustCommitButtonLoc('phoneArea');

},

removeSMSMatchArea:function(){
if(this.smsArea){

if(this.smsArea.parentNode){
this.smsArea.remove();
}
Mojo.Event.stopListening(this.smsArea,Mojo.Event.tap,this.selectEntryBound);
this.smsArea=undefined;
}
},

insertSMSMatchArea:function(chars){
var numStr=Mojo.Widget.AddressingWidget._toPhonepadNumber(chars);

this.removeSMSMatchArea();

if(numStr){
var model={
shortCode:'('+numStr+')',
text:chars
};
if(numStr==chars){
model.shortCode='';
}
var display=Mojo.View.render({object:model,template:Mojo.Widget.getSystemTemplatePath("/addr-widget/recipient-shortcode")});
var numberModel={
shortCodeValue:numStr,
type:'SMS',
divPrefix:Mojo.View.makeUniqueId(),
display:display,
sms:display,
value:numStr,
id:'',
serviceName:'',
contactId:'',
contactDisplay:display,
isRemote:false,
alreadyValidated:true
};
var content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath("/addr-widget/sms-entry"),object:numberModel});
if(this.bottomSpecialSearchContainer){
this.bottomSpecialSearchContainer.insert({top:content});
}
this.smsArea=this.controller.get(numberModel.divPrefix+'-sms-area');
this._setJsonRecip(numberModel,this.smsArea);
Mojo.Event.listen(this.smsArea,Mojo.Event.tap,this.selectEntryBound);
}

},




insertIMArea:function(content,searchStr){
this.imSpecialSearchContainer.innerHTML=content;
this.imSearch=this.controller.get(this.controller.model.divPrefix+'-mojo-imsearch');
Mojo.Event.listen(this.imSearch,Mojo.Event.tap,this.selectEntryBound);
},


_hasDupes:function(inArray){
var out=[];
var h={};
var domain;
var hasDupes=false;

if(inArray.length<=1){
return false;
}

inArray.each(function(item){
domain=item.accountDomain;
if(!h[domain]){
h[domain]=item;
out.push(item);
}else{
hasDupes=true;
return;
}
});

return hasDupes;
},


renderIMSearchArea:function(searchStr,result){
var content;
var hasDupes,tempModel,imEntry;
var template,imEntriesArea;

if(!result.list||result.count===0||!searchStr){
return;
}

tempModel={
match:searchStr,
divPrefix:this.controller.model.divPrefix
};
content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath("/addr-widget/im-search"),object:tempModel});
this.insertIMArea(content,searchStr);
hasDupes=this._hasDupes(result.list);

if(!hasDupes){
template=Mojo.Widget.getSystemTemplatePath("/addr-widget/im-searchentry");
}else{
template=Mojo.Widget.getSystemTemplatePath("/addr-widget/im-named-searchentry");
}

imEntriesArea=this.imSearch.querySelector('#im-entries-area');
for(var i=0;i<result.list.length;i++){
result.list[i].value=searchStr;
result.list[i].serviceName=result.list[i].accountDomain;
result.list[i].contactDisplay=searchStr;
result.list[i].type=this.CONTACT_TYPE.IM;
content=Mojo.View.render({template:template,object:result.list[i],attributes:{contact:searchStr,path:Mojo.Config.ACCOUNT_IMAGES_HOME}});
imEntry=Mojo.View.convertToNode(content,this.controller.document);
this._setJsonRecip(result.list[i],imEntry);
imEntriesArea.insert({bottom:imEntry});
}
},






renderSpecialAreas:function(searchStr){

if(this.includePhones&&searchStr){
this.insertPhoneNumberMatchArea(searchStr);
}else if(this.includePhones){
this.topSpecialSearchContainer.innerHTML="";
this._setPhoneNumberArea();
}

if(this.controller.model.includeShortCode&&searchStr){
this.insertSMSMatchArea(searchStr);
}

if(this.includeIMs&&searchStr){
this.dataSource._getMessagingTransports(this.renderIMSearchArea.bind(this,searchStr));
}else if(this.includeIMs){
if(this.imSearch){
Mojo.Event.stopListening(this.imSearch,Mojo.Event.tap,this.selectEntryBound);
}
this.imSpecialSearchContainer.innerHTML='';
this.imSearch=undefined;
}


if(this.showGAL&&searchStr.length>=this.MIN_GAL_LOOKUP){
this.searchGal();
}else if(searchStr.length<this.MIN_GAL_LOOKUP){
this._hideGalSearch();
this.specialResultsContainer.innerHTML='';

}
},


isAllowedType:function(type){
type=type.toLowerCase();

if(type===this.CONTACT_TYPE.EMAIL&&this.includeEmails){
return true;
}
if(type===this.CONTACT_TYPE.PHONE&&this.includePhones){
return true;
}
if(type===this.CONTACT_TYPE.IM&&this.includeIMs){
return true;
}
return false;
},


_renderSpecificContactList:function(searchStr,offset,listWidget,result){


var list=result.list;
var json=this.activeRecipientJson;
var personId='Person_id';

if(list&&list.length>0){
list.each(function(address){
address.firstName=json.firstName;
address.lastName=json.firstName;
address.companyName=json.companyName;
address.contactDisplay=json.contactDisplay;
address.Person_id=json.personId;
address.personId=json.personId;
});
result.list=list;
this._renderContactsList(searchStr,offset,listWidget,result);
}


this.noResults.hide();
},


_renderContactsList:function(searchStr,offset,listWidget,result){

var address;
var whackedData=[];
var count=0;
var prevContact;
var firstName='Person_firstName';
var lastName='Person_lastName';
var companyName='Person_companyName';
var curPerson;

Mojo.View.removeTouchFeedback(this.showAllButton);

if(!result.list||result.count===0){
listWidget.mojo.setLength(0);
this.popupContainer.mojo.scrollTo(undefined,0);
this.isFirstFilter=false;
this.maybeAdjustCommitButtonLoc('addresses');
return;
}

result.list.each(function(contact){
if(this.curId&&this.curId===contact.Person_id){
contact.contactHeaderDisplay='none';
if(prevContact){
contact.displayIsEmail=prevContact.displayIsEmail;
}
}else if(!this.curId||this.curId!=contact.Person_id){
contact.contactHeaderDisplay='block';
count=0;
}

curPerson={};
curPerson.firstName=contact[firstName];
curPerson.lastName=contact[lastName];
curPerson.companyName=contact[companyName];
curPerson.contactDisplay=contact.contactDisplay;
curPerson.displayIsEmail=contact.displayIsEmail;
if(!curPerson.contactDisplay){
curPerson.contactDisplay=Mojo.PatternMatching.addContactNameFormatting(curPerson,contact.value);
}
if(prevContact){
if(prevContact.Person_id===contact.Person_id&&count===1){
prevContact.rowClass='first';
}else if(prevContact.Person_id===contact.Person_id&&count!==1){
prevContact.rowClass='';
}else if(prevContact.Person_id!==contact.Person_id&&prevContact.count!==0){
prevContact.rowClass='last';
}
}
contact.count=count;
contact.rowClass='single';
count++;
this.curId=contact.Person_id;
if(curPerson.displayIsEmail){
contact.displayIsEmail=curPerson.displayIsEmail;
}
contact.personId=contact.Person_id;

contact=this._updateContactFormatting(curPerson,contact,searchStr);
contact.isLocal='display: none;';
prevContact=contact;

if(this._shouldAddContact(contact,searchStr)){
whackedData.push(contact);
}

}.bind(this));

if(this.isFirstFilter&&offset===0){
listWidget.mojo.setLength(0);
this.popupContainer.mojo.scrollTo(undefined,0);
this.isFirstFilter=false;
}
listWidget.mojo.noticeUpdatedItems(offset,whackedData);
listWidget.mojo.setLength(result.count);
this.curId=undefined;
this.maybeAdjustCommitButtonLoc('addresses');
this.noResults.hide();
},

_shouldAddContact:function(contact,query){




var add=true;
if(contact.displayIsEmail&&contact.count>0){
if(contact.value.substring(0,query.length)!==query){
add=false;
}
}
return add;
},


_activateRealContact:function(jsonval,target){
var personId="Person_id";


this.textFieldModel.value=jsonval.value;
this.controller.modelChanged(this.textFieldModel);
this.specificContactId=jsonval.personId;
this.activeRecipientJson=jsonval;
this.show();
this.specificContactList.show();
this.controller.modelChanged(this.specificContactModel);
delete this.specificContactId;
},

_activateCreatedContact:function(jsonval,target){

var value=jsonval.value;
if(jsonval.type===this.CONTACT_TYPE.SMS){
value=jsonval.contactDisplay;
}
this.textFieldModel.value=jsonval.value;
this.controller.modelChanged(this.textFieldModel);
this.showGAL=false;
this.renderSpecialAreas(value);
this.showGAL=true;
},

activateRecipient:function(target){

if(!target.hasClassName("recipient-atom")){
target=target.up(".recipient-atom");
}

if(!target){
this._handleFocusAddressingArea();
return;
}

if(this.activeRecipient&&(target.id==this.activeRecipient.id)){
this.activeRecipient=null;
return;
}
if(this.activeRecipient){
this.activeRecipient.show();
this.activeRecipient=null;
}


this.activeRecipient=target;

this.hide();
target.hide();


var content=target.querySelector("[name='"+this.prefix+"']");

if(content){
var jsonval=content.value.evalJSON();
if(jsonval.personId||jsonval.isRemote){
this._activateRealContact(jsonval,target);
}else{
this._activateCreatedContact(jsonval,target);
}
}
},

_invalidateRecipient:function(contact,contactDiv){
contactDiv.querySelector("[name='address']").setStyle('color: red;');
},

_validateRecipient:function(contact,contactDiv){
var validationFunction=this.controller.model.validationFunction;
var valid=true;

if(contact.personId){
return true;
}
if(validationFunction){
valid=validationFunction(contact.value);
if(!valid){
this._invalidateRecipient(contact,contactDiv);
}
}
return valid;
},

_updateRecipientDisplay:function(contact,contactDiv,result){
var updatedContact=result.record;
var personId='Person_id';
var contactD;

if(updatedContact){
updatedContact.contactDisplay=Mojo.PatternMatching.addContactNameFormatting(updatedContact);
}else if(!updatedContact&&contact.type===this.CONTACT_TYPE.PHONE){
updatedContact={};
updatedContact.contactDisplay=Mojo.Format.formatPhoneNumber(contact.value);
}

if(updatedContact){
updatedContact[personId]=updatedContact.id;
updatedContact.personId=updatedContact.id;
updatedContact.type=contact.type;
updatedContact.serviceName=contact.serviceName;
updatedContact.id=contact.id;
updatedContact.value=contact.value;
updatedContact.alreadyValidated=true;
updatedContact.username=contact.username;
this.replaceRecipient(contactDiv,updatedContact);
}

contactD=this.controller.get(contactDiv.id);
if(contactD){
var div=this.controller.get(contactDiv.id);
var spinner=div.down("[name=reverse-lookup]");
this.controller.window.clearTimeout(spinner.activateSpinner);
spinner.mojo.stop();
}

if(this.STATE===this.ADDRESSING_WIDGET_UNFOCUSED){
this.unfocusRecips();
}
},


_reverseLookup:function(contact,contactDiv){
var spinner;
if(contact.personId||contact.isRemote){
return;
}


if(!contact.type&&this.controller.model.determineTypeFunction){
contact.type=this.controller.model.determineTypeFunction(contact.value);
}


if(contact.type){
contact.type=contact.type.toLowerCase();
}else{
contact.type='';
}


if(contactDiv&&contact.value&&!contact.personId){
spinner=contactDiv.down("[name=reverse-lookup]");
this.controller.instantiateChildWidgets(contactDiv);
this.controller.scene.showWidgetContainer(contactDiv);

spinner.activateSpinner=this.controller.window.setTimeout(spinner.mojo.start,this.REVERSE_LOOKUP_MAX);
this.dataSource._reverseLookup(contact.value,contact.type,contact.serviceName,this._updateRecipientDisplay.bind(this,contact,contactDiv));
}
},



handleCommand:function(event){
if(event.type===Mojo.Event.back){
this._closeWidget(event);
}else if(event.type===Mojo.Event.command&&this.STATE!==this.ADDRESSING_WIDGET_UNFOCUSED){
switch(event.command){
case Mojo.Menu.cutCmd:
case Mojo.Menu.pasteCmd:
this.prevValue=this.inputDiv.mojo.getValue();
this.clipboardEvent();
break;
}
}
},


clipboardEvent:function(){
this._maybeUpdateState.defer();
},

_closeWidget:function(event,force){
switch(this.STATE){
case this.ADDRESSING_WIDGET_FILTERSTATE:
if(!force){
var dontClose=this._anyResults();
if(dontClose){

this.resetTextFieldValue();
this.enterUnfocusedState();
event.preventDefault();
event.stopPropagation();
}
}else{
this.resetTextFieldValue();
this.enterUnfocusedState();
}
break;
case this.ADDRESSING_WIDGET_SHOWALLSTATE:
this.resetTextFieldValue();
this.enterUnfocusedState();
if(event){
event.preventDefault();
event.stopPropagation();
}
break;
case this.ADDRESSING_WIDGET_RECIPIENT_OPEN:
this.revertRecipient();
if(event){
event.preventDefault();
event.stopPropagation();
}
break;
case this.ADDRESSING_WIDGET_FOCUSED:
this.enterUnfocusedState();
break;
case this.ADDRESSING_WIDGET_UNFOCUSED:
break;
default:
break;
}
},

close:function(){
this._closeWidget(undefined,true);
delete this.initialSearch;
delete this.prevValue;
},

resetTextFieldValue:function(){
this.textFieldModel.value='';
this.controller.modelChanged(this.textFieldModel);
}

});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.AddressingWidget.DataSource=Class.create({
FILTERED_LIMIT:50,

initialize:function(includeEmails,includePhones,includeIMs){
Mojo.Log.info("SETTING UP VALUES");
this.includeEmails=includeEmails;
this.includePhones=includePhones;
this.includeIMs=includeIMs;

this.activeAddressRequests=[];
this.activeRequests=[];
},

_resetFilters:function(includeEmails,includePhones,includeIMs){
this.includeEmails=includeEmails;
this.includePhones=includePhones;
this.includeIMs=includeIMs;
},



_isGALAvailable:function(callback){

var req=new Mojo.Service.Request('palm://com.palm.mail',{
method:'hasEASAccount',
onSuccess:callback,
onFailure:callback
});
},

_cancelGalSearch:function(){
if(this.galReq){
this.galReq.cancel();
}
},


_searchGal:function(callback,errorCallback,listWidget,offset,limit){

if(this.galReq){
this.galReq.cancel();
}
this.galReq=new Mojo.Service.Request('palm://com.palm.mail',{
method:'queryGAL',
parameters:{'target':this.filter,'offset':0,'limit':10},
onSuccess:callback.bind(this,this.filter,offset,listWidget),
onFailure:errorCallback
});
},


cleanupAddressRequest:function(data,request){
var i=-1;
i=this.activeAddressRequests.indexOf(request);
if(i!==-1){
this.activeAddressRequests=this.activeAddressRequests.splice(i,1);
}
},


_requestAddressList:function(callback,listWidget,offset,limit){
var request;
if(!this.specificContactId){
return;
}
this.activerequest=new Mojo.Service.Request('palm://com.palm.contacts',{
method:'listContactPoints',
parameters:{'id':this.specificContactId,'includeEmails':this.includeEmails,'includePhones':this.includePhones,'includeIMs':this.includeIMs},
onSuccess:callback.bind(this,'',offset,listWidget)

});

},





_requestContactsList:function(callback,listWidget,offset,limit){
if(this.filter===undefined){
return;
}



var releaseCallback,reqList,req;
if(this.dataSource){
releaseCallback=this.dataSource.releaseRequest.bind(this.dataSource);
reqList=this.dataSource.activeRequests;
}else{
releaseCallback=this.releaseRequest.bind(this);
reqList=this.activeRequests;
}
if(this.filter.blank()){
req=new Mojo.Service.Request('palm://com.palm.contacts',{
method:'listAllContactPoints',
parameters:{'filter':this.filter,'offset':offset,'limit':limit,'includeEmails':this.includeEmails,'includePhones':this.includePhones,'includeIMs':this.includeIMs},
onSuccess:callback.bind(this,this.filter,offset,listWidget),
onComplete:releaseCallback
});
reqList.push(req);
}else{
if(this.activeContactsRequest){
this.activeContactsRequest.cancel();
}

req=this.activeContactsRequest=new Mojo.Service.Request('palm://com.palm.contacts',{
method:'listUniqueContactPoints',
parameters:{'filter':this.filter,'limit':this.FILTERED_LIMIT,'includeEmails':this.includeEmails,'includePhones':this.includePhones,'includeIMs':this.includeIMs},
onSuccess:callback.bind(this,this.filter,offset,listWidget),
onComplete:releaseCallback
});
this.activeContactsRequest=req;
reqList.push(req);
}
},


failed:function(data){
Mojo.Log.error("failed "+$H(data).inspect());
},

_cancelContactsSearch:function(){
if(this.activeContactsRequest){
this.activeContactsRequest.cancel();
}
if(this.activeAddressRequests){
this.activeAddressRequests.each(function(e){
e.cancel();
});
this.activeAddressRequests=[];
}
},


_getMessagingTransports:function(callback){
this.activeIMRequest=new Mojo.Service.Request('palm://com.palm.messaging',{
method:'getOnlineTransports',
onSuccess:this.mapToIcons.bind(this,callback)
});
},

mapToIcons:function(callback,results){
var icon;
if(results&&results.list){
results.list.each(function(account){
switch(account.accountDomain){
case'aol':
icon='aim-32x32.png';
break;
case'gmail':
icon='googletalk-32x32.png';
break;
case'msn':
icon='messenger-32x32.png';
break;
case'yahoo':
icon='yahoo-32x32.png';
break;
default:
break;
}
account.icon=icon;
});
}
callback(results);
},

_reverseLookup:function(value,type,serviceName,callback){
var request=new Mojo.Service.Request('palm://com.palm.contacts',{
method:'reverseLookup',
onSuccess:callback,
onFailure:callback,
onComplete:this.releaseRequest.bind(this),
parameters:{'value':value,'type':type,'serviceName':serviceName}
});
this.activeRequests.push(request);
},

releaseRequest:function(r){
var i=-1;
if(this.activeRequests){
i=this.activeRequests.indexOf(r);
if(i!==-1){
this.activeRequests.splice(i,1);
}
}
},

setFilter:function(filter){
this.filter=filter;
}
});


Mojo.Widget.AddressingWidget._couldBeEmail=function(letter){
if(letter=='@'){
return true;
}
return false;
};

Mojo.Widget.AddressingWidget._toPhoneNumber=function(str){
var is=true;
var numChar='-1';
var numberStr='';
for(var i=0;i<str.length;i++){
numChar=Mojo.Widget.AddressingWidget._translateToDigit(str.charAt(i));
if(numChar=='-1'){
is=false;
break;
}else{
numberStr+=numChar;
}
}

if(is){
return numberStr;
}else{
return null;
}
};

Mojo.Widget.AddressingWidget._toPhonepadNumber=function(str){
var is=true;
var numChar='-1';
var numberStr='';
for(var i=0;i<str.length;i++){
numChar=Mojo.Widget.AddressingWidget._translateToPhonepadDigit(str.charAt(i));
if(numChar=='-1'){
is=false;
break;
}else{
numberStr+=numChar;
}
}

if(is){
return numberStr;
}else{
return null;
}
};

Mojo.Widget.AddressingWidget._translateToPhonepadDigit=function(letter){
var number=-1;
letter=letter.toLowerCase();
switch(letter){
case'a':
case'b':
case'c':
number=2;
break;
case'd':
case'e':
case'f':
number=3;
break;
case'g':
case'h':
case'i':
number=4;
break;
case'j':
case'k':
case'l':
number=5;
break;
case'm':
case'n':
case'o':
number=6;
break;
case'p':
case'q':
case'r':
case's':
number=7;
break;
case't':
case'u':
case'v':
number=8;
break;
case'w':
case'x':
case'y':
case'z':
number=9;
break;
}
return number;
};

Mojo.Widget.AddressingWidget._translateToDigit=function(letter){

var number=-1;
letter=letter.toLowerCase();
switch(letter){
case'e':
number=1;
break;
case'r':
number=2;
break;
case't':
number=3;
break;
case'd':
number=4;
break;
case'f':
number=5;
break;
case'g':
number=6;
break;
case'x':
number=7;
break;
case'c':
number=8;
break;
case'v':
number=9;
break;
case'@':
number=0;
break;
}
return number;
};




/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






var contactsDetailEmailsResponse={
"count":3,
"list":[
]
};


var galListResponse=
{'result':[],
'count':3,
'total':3};

var contactsListResponse2={"list":[{"id":"49478023250041","type":"IM","value":"RANDOMIm1","label":3,"trailingDigits":7277215,"Person_id":50577534877809,"Person.firstName":"IMRecipient1","Person.pictureLoc":"",'serviceName':'gmail'},{"id":"49478023250041","type":"PHONE","value":"555-5555","label":3,"trailingDigits":7277215,"Person_id":50577534877809,"Person.firstName":"PhoneRecipient1","Person.pictureLoc":"",'serviceName':''},{"id":"49478023250041","type":"EMAIL","customLabel":'pubphonefor mybar',"value":"emailRecip@gmailREALLYLONGNAMEFORTHIS.com","label":2,"Person_id":50577534877809,"Person.firstName":"EmailRecip1","Person.pictureLoc":""},{"id":"49478023249926","type":"PHONE","value":"555-5555","label":2,"customLabel":'pubphone',"trailingDigits":9241200,"Person_id":50577534877702,"Person.firstName":"PhoneRecip2","Person.pictureLoc":""},{"id":"49478023249921","type":"PHONE","value":"555-5555","label":4,"trailingDigits":8725526,"Person_id":50577534877697,"Person.firstName":"PhoneRecip3","Person.pictureLoc":""},{"id":"49478023249957","type":"PHONE","value":"555-5555","label":3,"trailingDigits":5754131,"Person_id":50577534877729,"Person.firstName":"PhoneRecip4","Person.lastName":"Phone","Person.pictureLoc":""}],'count':5};


var contactListResponseEmpty={
"count":0,
"list":[]
};

var contactsListResponse3={
"count":6,
"list":[]};






Mojo.Widget.AddressingWidget.MockDataSource=Class.create({
initialize:function(includeEmails,includePhones,includeIMs){
this.curr=contactsListResponse2;
this.includeEmails=includeEmails;
console.log("DID WE GET INCLUDE EMAILS "+this.includeEmails);
this.includePhones=includePhones;
this.includeIMs=includeIMs;
this.addressListTimers=[];
},


_sendGalResponse:function(callback,filter,offset,listWidget){
callback(filter,offset,listWidget,galListResponse);
},

_searchGal:function(callback,errorCallback,listWidget,offset,limit){
window.setTimeout(this._sendGalResponse.bind(this,callback,this.filter,offset,listWidget),0);
},



_requestAddressList:function(callback,listWidget,offset,limit){
console.log("getting address for "+this.specificContactId);
if(!this.specificContactId){
return;
}
window.setTimeout(callback('',offset,listWidget,contactsDetailEmailsResponse),300);
return null;
},

_sendContactsResponse:function(callback){
callback(this.curr);
this.contactsTimer=undefined;
return;
},


_requestContactsList:function(callback,listWidget,offset,limit){



if(this.filter===undefined){
return;
}
var func=function(callback,offset,str,listWidget,data){
Mojo.Log.info("GOT CALLED BACK");
this.activeContactsRequest=undefined;
callback(str,offset,listWidget,data);
};


this.contactsTimer=window.setTimeout(callback.bind(this,this.filter,offset,listWidget,contactsListResponse2),300);
return null;
},




_isGALAvailable:function(callback){
callback({result:true});
},


_getMessagingTransports:function(callback){
var transports={
'list':[

],
'count':5};
this.mapToIcons(callback,transports);
},

mapToIcons:function(callback,results){
var icon;
if(results&&results.list){
results.list.each(function(account){
switch(account.accountDomain){
case'aol':
icon='aim-32x32.png';
break;
case'gmail':
icon='googletalk-32x32.png';
break;
case'msn':
icon='messenger-32x32.png';
break;
case'yahoo':
icon='yahoo-32x32.png';
break;
default:
break;
}
account.icon=icon;
});
}
callback(results);
},

_resetFilters:function(includeEmails,includePhones,includeIMs){
this.includeEmails=includeEmails;
this.includePhones=includePhones;
this.includeIMs=includeIMs;
},


_cancelGalSearch:function(){
return;
},

_reverseLookup:function(value,type,serviceName,callback){
window.setTimeout(callback.bind(this,{}),5000);
},

_cancelContactsSearch:function(){
if(this.contactsTimer){
window.clearTimeout(this.contactsTimer);
this.contactsTimer=undefined;
}
this.addressListTimers.each(function(e){
if(e){
window.clearTimeout(e);
}
});

return;
},

setFilter:function(filter){
this.filter=filter;
}

});

if(Mojo.Host.current===Mojo.Host.mojoHost){
Mojo.Widget.AddressingWidget.DataSource=Mojo.Widget.AddressingWidget.MockDataSource;
}/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget._PickerPopup=Class.create({

kValueAttribute:'x-mojo-value',
kValueSelector:'div[x-mojo-value]',

kMinTop:10,

kMinScrollItems:4,

kRenderLimit:20,
kDialogDiffHack:30,


setup:function(){
var range;
var selectedItem;

Mojo.assert(this.controller.model,"Mojo.Widget._PickerPopup requires a model. Did you call controller.setupWidgetModel() with the name of this widget?");
Mojo.assert(this.controller.model.items||this.controller.model.itemsRange,"Mojo.Widget._PickerPopup model requires items or itemsRange to be defined.");


if(!this.controller.model.padNumbers){
this.zeroPadding=null;
}
range=this.controller.model.itemsRange;
this.range=range;
this.items=this.controller.model.items||this.makeItems(range.min,range.max,range.interval);

if(this.items.length<this.kMinScrollItems){
this.noScroll=true;
}

this.itemTemplate=Mojo.Widget.getSystemTemplatePath("picker/popup-item");




this.controller.reparent(this.controller.model.placeOver.parentNode);


this.tapHandler=this.tapHandler.bindAsEventListener(this);
Mojo.listen(this.controller.element,Mojo.Event.tap,this.tapHandler);




this.renderOffset=this.getSelectedIndex()-Math.floor(this.kRenderLimit/2);
this.updateFromModel();

if(this.scroller){
this.addAsScrollListener=this.addAsScrollListener.bindAsEventListener(this);
this.controller.listen(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener);

this.moved=Mojo.Widget.Scroller.createThreshholder(this.movedEnough.bind(this),this.itemsParent,this.rowHeight);

}


this.controller.exposeMethods(["close"]);


this.controller.scene.pushContainer(this.controller.element,this.controller.scene.submenuContainerLayer,
{cancelFunc:this.close.bind(this)});

this.isDialogChild=this.controller.model.isDialogChild;

selectedItem=this.controller.element.querySelector('div['+this.kValueAttribute+"='"+this.controller.model.value+"']");
if(selectedItem){
this.scrollToCenterItem(selectedItem,false);
}
},

cleanup:function(){
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.tapHandler);
if(this.scroller){
this.controller.stopListening(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener);
}
},



updateFromModel:function(){
var itemsHTML;
var placeOver;
var viewDims,ourHeight;
var placeOverOffset;
var ourOffsetX,ourOffsetY;
var scrollPos;
var template;
var i;

if(this.noScroll){

template=Mojo.Widget.getSystemTemplatePath("picker/popup-noscroll");
itemsHTML=Mojo.View.render({collection:this.items,
template:this.itemTemplate});
}else{

template=Mojo.Widget.getSystemTemplatePath("picker/popup");


itemsHTML='';
for(i=0;i<this.kRenderLimit;i++){
itemsHTML+=this.renderItemHTML(i+this.renderOffset);
}
}




this.controller.element.innerHTML=Mojo.View.render({object:{itemsHTML:itemsHTML},
template:template});


this.controller.element.appendChild(Mojo.View.createScrim(this.controller.document,{onMouseDown:this.close.bind(this),scrimClass:'picker-popup'}));


this.controller.instantiateChildWidgets();


this.pickerContainer=this.controller.element.querySelector('div[x-mojo-picker-popup]');
this.itemNodes=this.pickerContainer.querySelectorAll(this.kValueSelector);
this.scroller=this.pickerContainer.querySelector("div[x-mojo-element='Scroller']");
this.itemsParent=this.pickerContainer.querySelector('div[x-mojo-items-parent]');


this.chosenValue=this.controller.model.value;
this.selectItemsWithValue(this.chosenValue);


placeOver=this.controller.model.placeOver;
placeOverOffset=Mojo.View.viewportOffset(placeOver);

viewDims=Mojo.View.getViewportDimensions(this.controller.document);
ourHeight=this.pickerContainer.offsetHeight;

ourOffsetX=placeOverOffset.left+placeOver.offsetWidth/2-this.pickerContainer.offsetWidth/2;
ourOffsetY=placeOverOffset.top+placeOver.offsetHeight/2-ourHeight/2;

ourOffsetY=Math.max(this.kMinTop,ourOffsetY);
ourOffsetY=Math.min(ourOffsetY+ourHeight,viewDims.height)-ourHeight;

this.pickerContainer.style.top=ourOffsetY+'px';
this.pickerContainer.style.left=ourOffsetX+'px';


if(this.scroller){
this.rowHeight=this.firstItem().getHeight();
this.scrollerTop=Mojo.View.viewportOffset(this.scroller).top;






this.shiftDownThreshold=this.rowHeight*-5;
this.shiftUpThreshold=this.rowHeight*-3;







}

},


getSelectedIndex:function(){
var i,items,len,val,interval;

if(this.range){
interval=this.range.interval||1;
return Math.floor((parseInt(this.controller.model.value,10)-this.range.min)/interval);
}else{
items=this.items;
len=items.length;
val=this.controller.model.value;
for(i=0;i<len;i++){
if(items[i].value===val){
return i;
}
}
}

},


movedEnough:function(scrollEnding,position){
var node;
var nodeTop;
var delta,shift;
var doc;


if(this.tappedValue&&scrollEnding){
this.close();
return;
}




node=this.firstItem();
nodeTop=Mojo.View.viewportOffset(node).top-this.scrollerTop;
doc=this.controller.document;



delta=nodeTop-this.shiftDownThreshold;
if(delta>=0){
delta=nodeTop-this.shiftUpThreshold;
if(delta<0){
delta=0;
}
}


shift=-Math.ceil(delta/this.rowHeight);



while(shift<0){
this.lastItem().remove();
this.renderOffset--;
shift++;
this.itemsParent.insertBefore(Mojo.View.convertToNode(this.renderItemHTML(this.renderOffset),doc),this.itemsParent.firstChild);
this.scroller.mojo.adjustBy(0,-this.rowHeight);
}

while(shift>0){
this.firstItem().remove();
this.itemsParent.appendChild(Mojo.View.convertToNode(this.renderItemHTML(this.renderOffset+this.kRenderLimit),doc));
this.renderOffset++;
shift--;
this.scroller.mojo.adjustBy(0,this.rowHeight);
}

},


firstItem:function(){
var item=this.itemsParent.firstChild;
while(item&&(!item.hasAttribute||!item.hasAttribute(this.kValueAttribute))){
item=item.nextSibling;
}

return item||undefined;
},


lastItem:function(){
var item=this.itemsParent.lastChild;
while(item&&(!item.hasAttribute||!item.hasAttribute(this.kValueAttribute))){
item=item.previousSibling;
}

return item||undefined;
},


renderItemHTML:function(which){
var len=this.items.length;

while(which<0){
which+=len;
}
which=which%len;

return Mojo.View.render({object:this.items[which],
template:this.itemTemplate});
},


scrollToCenterItem:function(item,animate){
var placeover,placeoverCenter,itemCenter,scrollPos;

if(item&&this.scroller){
placeover=this.controller.model.placeOver;

placeoverCenter=Mojo.View.viewportOffset(placeover).top+(placeover.offsetHeight/2);
itemCenter=Mojo.View.viewportOffset(item).top+(item.offsetHeight/2);
scrollPos=this.scroller.mojo.getScrollPosition();

scrollPos.top+=placeoverCenter-itemCenter;
if(this.isDialogChild){
scrollPos.top=scrollPos.top-this.kDialogDiffHack;
}
this.scroller.mojo.scrollTo(scrollPos.left,scrollPos.top,animate);
}
},


makeItems:function(min,max,interval){
var i,items,label;
var maxLength=max.toString().length;

interval=interval||1;

items=[];
for(i=min;i<=max;i+=interval){

label=i.toString();
if(this.zeroPadding&&label.length<maxLength){
label=(this.zeroPadding[maxLength-label.length]||'')+label;
}

items.push({label:label,value:i});
}

return items;
},

zeroPadding:['','0','00','000'],


addAsScrollListener:function addAsScrollListener(event){
event.scroller.addListener(this);
},


tapHandler:function(event){
var scrollPos;
var pickerItem;

event.stop();



if(this.tappedValue){
return;
}


pickerItem=Mojo.View.getParentWithAttribute(event.target,this.kValueAttribute);

if(pickerItem){
this.chosenValue=pickerItem.getAttribute(this.kValueAttribute);
this.tappedValue=true;

this.selectItemsWithValue(this.chosenValue);

if(this.scroller){



this.scrollToCenterItem(event.target,true);
}else{


this.movedEnough.bind(this,true).delay(0.3);
}
}

},


selectItemsWithValue:function(value){

if(this.selectedItems){
this.selectedItems.each(function(el){el.removeClassName('current-value');});
}


this.selectedItems=$A(this.controller.element.querySelectorAll('div['+this.kValueAttribute+"='"+value+"']"));
this.selectedItems.each(function(el){el.addClassName('current-value');});
},


close:function(){
if(!this.closed){
this.closed=true;
this.controller.scene.removeContainer(this.controller.element);
this.controller.remove();
this.controller.model.onChoose(this.chosenValue);
}
}


});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */








Mojo.Widget._GenericPicker=function(strategy){





this.strategy=strategy;
};


Mojo.Widget._GenericPicker.prototype.kCapsuleTypeAttr='x-mojo-capsule-type';
Mojo.Widget._GenericPicker.prototype.kFocusTargetAttr='x-mojo-focus-me';



Mojo.Widget._GenericPicker.prototype.setup=function(){
Mojo.assert(this.controller.model,"Mojo.Widget._GenericPicker requires a model. Did you call controller.setupWidgetModel() with the name of this widget?");


this.strategy.controller=this.controller;
this.strategy.assistant=this;
if(this.strategy.setup){
this.strategy.setup();
}


this.suppressPopUp=true;

this.label=this.controller.attributes.label||this.strategy.kDefaultLabel;

this.modelProperty=this.controller.attributes.modelProperty||this.strategy.kDefaultModelProperty;
this.keymatchers={};

this.updateFromModel();


this.tapHandler=this.tapHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.tapHandler);

this.focusInHandler=this.focusInHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,'DOMFocusIn',this.focusInHandler);
this.focusOutHandler=this.focusOutHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,'DOMFocusOut',this.focusOutHandler);

this.keypressHandler=this.keypressHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,'keypress',this.keypressHandler);


if(Mojo.View.getParentWithAttribute(this.controller.element,'x-mojo-element','_Dialog')){
this.isDialogChild=true;
}

if(this.controller.attributes.labelPlacement===Mojo.Widget.labelPlacementRight){
this.controller.element.querySelector('div[x-mojo-picker-label]').removeClassName('left');
}

};

Mojo.Widget._GenericPicker.prototype.cleanup=function(){

this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.tapHandler);
this.controller.stopListening(this.controller.element,'DOMFocusIn',this.focusInHandler);
this.controller.stopListening(this.controller.element,'DOMFocusOut',this.focusOutHandler);
this.controller.stopListening(this.controller.element,'keypress',this.keypressHandler);
};


Mojo.Widget._GenericPicker.prototype.updateFromModel=function(){
var content,i;
var capsuleTemplate=Mojo.Widget.getSystemTemplatePath("picker/capsule");
var capsuleList=this.strategy.kCapsuleList;
var type;


content='';
for(i=0;i<capsuleList.length;i++){
type=capsuleList[i];
content+=Mojo.View.render({object:{value:this.strategy.getValueForType(type),type:type},template:capsuleTemplate});
}


content=Mojo.View.render({object:{label:this.label,capsules:content},
template:Mojo.Widget.getSystemTemplatePath("picker/picker")});

this.controller.element.innerHTML=content;

if(this.controller.attributes.labelPlacement===Mojo.Widget.labelPlacementRight){
this.controller.element.querySelector('div[x-mojo-picker-label]').removeClassName('left');
}

this.closeOpenedPicker();
};


Mojo.Widget._GenericPicker.prototype.getModelProperty=function(){
return this.controller.model[this.modelProperty];
};


Mojo.Widget._GenericPicker.prototype.handleModelChanged=function(){
var focusedCapsule=this.focusedCapsule;

this.updateFromModel();


if(focusedCapsule!==undefined){
this.focusCapsule(focusedCapsule,true);
}
};


Mojo.Widget._GenericPicker.prototype.focusInHandler=function(event){
var highlightElement=Mojo.View.findParentByAttribute(event.target,this.controller.document,Mojo.Widget.focusAttribute);
var capsule;


if(highlightElement){
highlightElement.addClassName('focused');
}


capsule=Mojo.View.findParentByAttribute(event.target,this.controller.element,this.kCapsuleTypeAttr);

this.setupCapsule(capsule);
};



Mojo.Widget._GenericPicker.prototype.focusOutHandler=function(event){
var highlightElement=Mojo.View.findParentByAttribute(event.target,this.controller.document,Mojo.Widget.focusAttribute);



if(highlightElement){
highlightElement.removeClassName('focused');
}

this.closeOpenedPicker();
delete this.currentKeyMatcher;
delete this.focusedCapsule;

};


Mojo.Widget._GenericPicker.prototype.setupCapsule=function(capsule){
var type,popupModel;

if(!capsule){
return;
}

type=capsule.getAttribute(this.kCapsuleTypeAttr);



if(type){
this.focusedCapsule=type;
this.currentKeyMatcher=this.keymatchers[type]||this.strategy.createKeyMatcherForType(type);
}else{


this.focusedCapsule=false;
this.currentKeyMatcher=this.keymatchers[this.strategy.kDefaultCapsuleType]||this.strategy.createKeyMatcherForType(this.strategy.kDefaultCapsuleType);
}
this.keymatchers[type]=this.currentKeyMatcher;



if(this.suppressPopUp){
return;
}

this.controller.element.addClassName('active-popup');


if(type){
popupModel=this.strategy.createPopupModelForType(type);
if(popupModel){
popupModel.placeOver=capsule;
popupModel.onChoose=this._pickerChoose.bind(this,popupModel.onChoose);
popupModel.isDialogChild=this.isDialogChild;
this.openPicker=this.controller.scene.showPickerPopup(popupModel);

Mojo.listen(this.controller.element,Mojo.Event.dragStart,this.dragStopper);
}
}
};


Mojo.Widget._GenericPicker.prototype.closeOpenedPicker=function(){
if(this.openPicker){
this.openPicker.mojo.close();
delete this.openPicker;

Mojo.stopListening(this.controller.element,Mojo.Event.dragStart,this.dragStopper);
}
};

Mojo.Widget._GenericPicker.prototype.dragStopper=function(event){
event.stop();
};


Mojo.Widget._GenericPicker.prototype._pickerChoose=function(originalChooseFunc,value){

this.controller.element.removeClassName('active-popup');

if(originalChooseFunc){
originalChooseFunc(value);
}


this.closeOpenedPicker();
};


Mojo.Widget._GenericPicker.prototype.tapHandler=function(event){
var capsule,capsuleType;

event.stop();

this.propChangeEvent=event;







capsule=Mojo.View.findParentByAttribute(event.target,this.controller.element,this.kCapsuleTypeAttr);
capsuleType=capsule&&capsule.getAttribute(this.kCapsuleTypeAttr);



if(!this.strategy.handleTap||
!this.strategy.handleTap(capsuleType)){

if(!capsuleType){

this.focusCapsule(this.strategy.kDefaultCapsuleType,true);
}else{
this.focusCapsule(capsuleType,false);
}
}
};


Mojo.Widget._GenericPicker.prototype.keypressHandler=function(event){
this.propChangeEvent=event;

if(this.currentKeyMatcher){
this.closeOpenedPicker();
this.currentKeyMatcher.keyPress(event.charCode);
}
};


Mojo.Widget._GenericPicker.prototype.modifiedModelProperty=function(changedType,suppressPopup){
var capsules,idx;







this.updateFromModel();

if(changedType){
this.focusCapsule(changedType,suppressPopup);
}

Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,
{property:this.modelProperty,
value:this.controller.model[this.modelProperty],
model:this.controller.model,
originalEvent:this.propChangeEvent
});
};



Mojo.Widget._GenericPicker.prototype.focusCapsule=function(type,suppressPopup){
var el;

type=type||this.strategy.kDefaultCapsuleType;
el=this.controller.element.querySelector("div["+this.kCapsuleTypeAttr+"="+type+"]");

this.suppressPopUp=suppressPopup;

if(this.focusedCapsule===type){
this.setupCapsule(el);
}else{
if(el){
el.focus();
}
}

this.suppressPopUp=true;
};



Mojo.Widget._GenericPicker.prototype.zeroPad=function(val){
if(val<10){
val='0'+val;
}
return val;
};



Mojo.Widget._GenericPicker.prototype._chooseIntegerProperty=function(getter,setter,type,value){
var propObj;

if(value===undefined){
return;
}

value=parseInt(value,10);
propObj=this.getModelProperty();
if(propObj[getter]()!==value){
propObj[setter](value);
this.modifiedModelProperty(type,true);
}
};

Mojo.Widget._GenericPicker.prototype.clearCachedKeyMatcher=function(type){
delete this.keymatchers[type];
};




Mojo.Widget._TimePickerStrategy=function(){
this.using12HourTime=Mojo.Format.using12HrTime();
};


Mojo.Widget._TimePickerStrategy.prototype.setup=function(){

this._chooseHours=this._chooseHours.bind(this);
this._chooseMinutes=this.assistant._chooseIntegerProperty.bind(this.assistant,
'getMinutes','setMinutes',this.kMinutesCapsuleType);


if(this.using12HourTime){
this._chooseAMPM=this._chooseAMPM.bind(this);
}else{

this.kCapsuleList=this.kCapsuleList.slice(0,2);
}

this.minuteInterval=this.controller.attributes.minuteInterval||5;
};


Mojo.Widget._TimePickerStrategy.prototype.ampmItems=[{label:$LL('AM'),value:'am'},{label:$LL('PM'),value:'pm'}];
Mojo.Widget._TimePickerStrategy.prototype.hoursItems=[{label:'1',value:1},
{label:'2',value:2},
{label:'3',value:3},
{label:'4',value:4},
{label:'5',value:5},
{label:'6',value:6},
{label:'7',value:7},
{label:'8',value:8},
{label:'9',value:9},
{label:'10',value:10},
{label:'11',value:11},
{label:'12',value:0}
];


Mojo.Widget._TimePickerStrategy.prototype.kHoursCapsuleType='hours';
Mojo.Widget._TimePickerStrategy.prototype.kMinutesCapsuleType='minutes';
Mojo.Widget._TimePickerStrategy.prototype.kAMPMCapsuleType='ampm';


Mojo.Widget._TimePickerStrategy.prototype.kDefaultLabel=$LL('Time');
Mojo.Widget._TimePickerStrategy.prototype.kDefaultModelProperty='time';
Mojo.Widget._TimePickerStrategy.prototype.kDefaultCapsuleType=Mojo.Widget._TimePickerStrategy.prototype.kHoursCapsuleType;
Mojo.Widget._TimePickerStrategy.prototype.kCapsuleList=['hours','minutes','ampm'];



Mojo.Widget._TimePickerStrategy.prototype.getValueForType=function(type){
var time=this.assistant.getModelProperty();
var label;

switch(type){
case this.kHoursCapsuleType:
label=time.getHours();
if(this.using12HourTime){
label=label%12;
label=label||12;
}
break;

case this.kMinutesCapsuleType:
label=this.assistant.zeroPad(time.getMinutes());
break;

case this.kAMPMCapsuleType:
label=this.ampmItems[this._getAMPMIndex(time)].label;
break;
}

return label;
};


Mojo.Widget._TimePickerStrategy.prototype.createKeyMatcherForType=function(type){
var matcher;
var options;

switch(type){
case this.kHoursCapsuleType:
options={window:this.controller.window,numeric:true};

if(this.using12HourTime){
options.items=this.hoursItems;
}else{
options.itemsRange={min:0,max:23};
}

matcher=new Mojo.Event.KeyMatcher(this._chooseHours,options);
break;

case this.kMinutesCapsuleType:
matcher=new Mojo.Event.KeyMatcher(this._chooseMinutes,
{itemsRange:{min:0,max:59,interval:this.minuteInterval},
window:this.controller.window,numeric:true});
break;

case this.kAMPMCapsuleType:
matcher=new Mojo.Event.KeyMatcher(this._chooseAMPM,
{items:this.ampmItems,window:this.controller.window});
break;
}

return matcher;
};


Mojo.Widget._TimePickerStrategy.prototype.createPopupModelForType=function(type){
var popupModel;
var time=this.assistant.getModelProperty();

switch(type){
case this.kHoursCapsuleType:

popupModel={
onChoose:this._chooseHours,
value:time.getHours()
};

if(this.using12HourTime){
popupModel.value=popupModel.value%12;
popupModel.items=this.hoursItems;
}else{
popupModel.itemsRange={min:0,max:23};
}

break;

case this.kMinutesCapsuleType:
popupModel={
onChoose:this._chooseMinutes,
value:time.getMinutes(),
itemsRange:{min:0,max:59,interval:this.minuteInterval},
padNumbers:true
};
break;

case this.kAMPMCapsuleType:
popupModel={
onChoose:this._chooseAMPM,
value:this._getAMPMIndex(time),
items:this.ampmItems
};



if(this.tappedAMPM){
popupModel.value=popupModel.value?0:1;
delete this.tappedAMPM;
}
popupModel.value=this.ampmItems[popupModel.value].value;
break;
}

return popupModel;
};


Mojo.Widget._TimePickerStrategy.prototype._getAMPMIndex=function(time){
return Math.floor(time.getHours()/12);
};




Mojo.Widget._TimePickerStrategy.prototype._chooseHours=function(value){
var time;

if(value===undefined){
return;
}

time=this.assistant.getModelProperty();

value=parseInt(value,10);


if(this.using12HourTime&&time.getHours()>=12){
value+=12;
}

if(time.getHours()!==value){
time.setHours(value);
this.assistant.modifiedModelProperty(this.kHoursCapsuleType,true);
}
};



Mojo.Widget._TimePickerStrategy.prototype._chooseAMPM=function(value){
var time,hours;

if(value===undefined){
return;
}

time=this.assistant.getModelProperty();
hours=time.getHours();

if(hours>=12&&value==='am'){
hours-=12;
}else if(hours<12&&value==='pm'){
hours+=12;
}

if(time.getHours()!==hours){
time.setHours(hours);
this.assistant.modifiedModelProperty(this.kAMPMCapsuleType,true);
}

};



Mojo.Widget.TimePicker=function(){

Mojo.Widget._GenericPicker.call(this,new Mojo.Widget._TimePickerStrategy());
};
Mojo.Widget.TimePicker.prototype=Mojo.Widget._GenericPicker.prototype;





Mojo.Widget._DatePickerStrategy=function(){
var formatHash,format;
var monthItems,dateTimeHash,i;
var newCapsuleList;



if(!this._checkedDateFormat){
Mojo.Widget._DatePickerStrategy.prototype._checkedDateFormat=true;

formatHash=Mojo.Format.getFormatHash();
format=formatHash&&formatHash.dateFieldOrder;

if(format){
newCapsuleList=[];
for(i=0;i<format.length;i++){
switch(format[i]){
case'm':
newCapsuleList.push('month');
break;
case'd':
newCapsuleList.push('day');
break;
case'y':
newCapsuleList.push('year');
break;
}
}

Mojo.Widget._DatePickerStrategy.prototype.kCapsuleList=newCapsuleList;
}


monthItems=this.monthItems;
dateTimeHash=Mojo.Format.getDateTimeHash();
dateTimeHash=dateTimeHash.medium.month;
for(i=0;i<monthItems.length;i++){
monthItems[i].label=dateTimeHash[i];
}

}

};


Mojo.Widget._DatePickerStrategy.prototype.setup=function(){
this.kCapsuleList=this.kCapsuleList.slice(0);


if(this.controller.attributes.month!==false){
this._chooseMonth=this._chooseMonth.bind(this);
}else{
this.kCapsuleList.splice(this.kCapsuleList.indexOf('month'),1);
}

if(this.controller.attributes.day!==false){
this._chooseDay=this.assistant._chooseIntegerProperty.bind(this.assistant,'getDate','setDate',this.kDayCapsuleType);
}else{
this.kCapsuleList.splice(this.kCapsuleList.indexOf('day'),1);
}

if(this.controller.attributes.year!==false){
this._chooseYear=this._chooseYear.bind(this);
}else{
this.kCapsuleList.splice(this.kCapsuleList.indexOf('year'),1);
}

if(this.controller.attributes.maxYear!==undefined){
this.maxYear=this.controller.attributes.maxYear;
}else{
this.maxYear=this.kMaxYear;
}

if(this.controller.attributes.minYear!==undefined){
this.minYear=this.controller.attributes.minYear;
}else{
this.minYear=this.kMinYear;
}


};


Mojo.Widget._DatePickerStrategy.prototype.monthItems=[
{value:0,days:31},
{value:1,days:28},
{value:2,days:31},
{value:3,days:30},
{value:4,days:31},
{value:5,days:30},
{value:6,days:31},
{value:7,days:31},
{value:8,days:30},
{value:9,days:31},
{value:10,days:30},
{value:11,days:31}
];


Mojo.Widget._DatePickerStrategy.prototype.kDayCapsuleType='day';
Mojo.Widget._DatePickerStrategy.prototype.kMonthCapsuleType='month';
Mojo.Widget._DatePickerStrategy.prototype.kYearCapsuleType='year';


Mojo.Widget._DatePickerStrategy.prototype.kDefaultLabel=$LL('Date');
Mojo.Widget._DatePickerStrategy.prototype.kDefaultModelProperty='date';
Mojo.Widget._DatePickerStrategy.prototype.kDefaultCapsuleType='month';
Mojo.Widget._DatePickerStrategy.prototype.kCapsuleList=['month','day','year'];

Mojo.Widget._DatePickerStrategy.prototype.kMinYear=1900;
Mojo.Widget._DatePickerStrategy.prototype.kMaxYear=2099;



Mojo.Widget._DatePickerStrategy.prototype.getValueForType=function(type){
var date=this.assistant.getModelProperty();
var label;

switch(type){
case this.kDayCapsuleType:
label=this.assistant.zeroPad(date.getDate());
break;

case this.kMonthCapsuleType:
label=this.monthItems[date.getMonth()].label;
break;

case this.kYearCapsuleType:
label=date.getFullYear();
break;
}

return label;
};



Mojo.Widget._DatePickerStrategy.prototype.createKeyMatcherForType=function(type){
var matcher,date,days,dayCount;

switch(type){
case this.kDayCapsuleType:
date=this.assistant.getModelProperty();
dayCount=this._countDaysForMonth(date.getMonth(),date.getFullYear());
matcher=new Mojo.Event.KeyMatcher(this._chooseDay,
{itemsRange:{min:1,max:dayCount},window:this.controller.window,numeric:true});
break;

case this.kMonthCapsuleType:
matcher=new Mojo.Event.KeyMatcher(this._chooseMonth,
{items:this.monthItems,window:this.controller.window});
break;

case this.kYearCapsuleType:
matcher=new Mojo.Event.YearKeyMatcher(this._chooseYear,
{itemsRange:{min:this.minYear,max:this.maxYear},window:this.controller.window,numeric:true});
break;
}

return matcher;
};



Mojo.Widget._DatePickerStrategy.prototype.createPopupModelForType=function(type){
var popupModel;
var date=this.assistant.getModelProperty();
var days;

switch(type){
case this.kDayCapsuleType:
days=this._countDaysForMonth(date.getMonth(),date.getFullYear());
popupModel={
onChoose:this._chooseDay,
value:date.getDate(),
itemsRange:{min:1,max:days}
};
break;

case this.kMonthCapsuleType:
popupModel={
onChoose:this._chooseMonth,
value:date.getMonth(),
items:this.monthItems
};
break;

case this.kYearCapsuleType:
popupModel={
onChoose:this._chooseYear,
value:date.getFullYear(),
itemsRange:{min:this.minYear,max:this.maxYear}
};
break;
}

return popupModel;
};



Mojo.Widget._DatePickerStrategy.prototype._chooseMonth=function(value){
var days,date,year;

if(value===undefined){
return;
}


this.assistant.clearCachedKeyMatcher(this.kDayCapsuleType);

value=parseInt(value,10);
date=this.assistant.getModelProperty();


if(date.getMonth()===value){
return;
}






days=this._countDaysForMonth(value,date.getFullYear());

if(date.getDate()>days){
date.setDate(days);
}

date.setMonth(value);
this.assistant.modifiedModelProperty(this.kMonthCapsuleType,true);

};


Mojo.Widget._DatePickerStrategy.prototype._chooseYear=function(value){
this.assistant._chooseIntegerProperty('getFullYear','setFullYear',this.kYearCapsuleType,value);


this.assistant.clearCachedKeyMatcher(this.kDayCapsuleType);
};





Mojo.Widget._DatePickerStrategy.prototype._countDaysForMonth=function(which,year){
var days=this.monthItems[which].days;


if(which===1){
if(((year%4)===0&&(year%100)!==0)||(year%400)===0){
days++;
}
}

return days;
};



Mojo.Widget.DatePicker=function(){

Mojo.Widget._GenericPicker.call(this,new Mojo.Widget._DatePickerStrategy());
};
Mojo.Widget.DatePicker.prototype=Mojo.Widget._GenericPicker.prototype;





Mojo.Widget._IntegerPickerStrategy=function(){
};


Mojo.Widget._IntegerPickerStrategy.prototype.setup=function(){
this._choose=this._choose.bind(this);
};



Mojo.Widget._IntegerPickerStrategy.prototype.kIntegerCapsuleType='value';


Mojo.Widget._IntegerPickerStrategy.prototype.kDefaultLabel=$LL('Value');
Mojo.Widget._IntegerPickerStrategy.prototype.kDefaultModelProperty=Mojo.Widget.defaultModelProperty;
Mojo.Widget._IntegerPickerStrategy.prototype.kDefaultCapsuleType='value';
Mojo.Widget._IntegerPickerStrategy.prototype.kCapsuleList=['value'];


Mojo.Widget._IntegerPickerStrategy.prototype.getValueForType=function(type){
var label=this.assistant.getModelProperty();
if(this.controller.attributes.padNumbers){
label=this.assistant.zeroPad(label);
}
return label;
};



Mojo.Widget._IntegerPickerStrategy.prototype.createKeyMatcherForType=function(type){
var attrs=this.controller.attributes;
return new Mojo.Event.KeyMatcher(this._choose,
{itemsRange:{min:attrs.min,max:attrs.max},
window:this.controller.window,numeric:true});
};



Mojo.Widget._IntegerPickerStrategy.prototype.createPopupModelForType=function(type){
var popupModel;
var attrs=this.controller.attributes;

popupModel={
onChoose:this._choose,
value:this.assistant.getModelProperty(),
itemsRange:{min:attrs.min,max:attrs.max},
padNumbers:this.controller.attributes.padNumbers
};

return popupModel;
};


Mojo.Widget._IntegerPickerStrategy.prototype._choose=function(value){
var propObj;

if(value===undefined){
return;
}

value=parseInt(value,10);
if(value!==this.assistant.getModelProperty()){
this.controller.model[this.assistant.modelProperty]=value;
this.assistant.modifiedModelProperty('value',true);
}
};



Mojo.Widget.IntegerPicker=function(){

Mojo.Widget._GenericPicker.call(this,new Mojo.Widget._IntegerPickerStrategy());
};
Mojo.Widget.IntegerPicker.prototype=Mojo.Widget._GenericPicker.prototype;


/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.ExperimentalWrapAround=function WrapAround(argument){
};


Mojo.Widget.ExperimentalWrapAround.prototype.setupOptional=true;


Mojo.Widget.ExperimentalWrapAround.prototype.setup=function setup(){
this.wrapTarget=this.controller.element.firstDescendant();
this.wrapTargetHeight=this.wrapTarget.getDimensions().height;
this.wrapTargetTopClone=this.wrapTarget.cloneNode(true);
this.wrapTarget.parentNode.insertBefore(this.wrapTargetTopClone,this.wrapTarget);
this.wrapTargetBottomClone=this.wrapTarget.cloneNode(true);
this.wrapTarget.parentNode.appendChild(this.wrapTargetBottomClone);
this.scroller=Mojo.View.getScrollerForElement(this.controller.element);
this.addAsScrollListener=this.addAsScrollListener.bind(this);
this.controller.listen(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener);
this.controller.exposeMethods(["scrollTo"]);

};

Mojo.Widget.ExperimentalWrapAround.prototype.cleanup=function cleanup(){
if(this.scroller){
this.controller.stopListening(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener);
}
};


Mojo.Widget.ExperimentalWrapAround.prototype.addAsScrollListener=function addAsScrollListener(event){
event.scroller.addListener(this);

this.moved=Mojo.Widget.Scroller.createThreshholder(this.movedEnough.bind(this),this.controller.element,100);
this.scroller.mojo.scrollTo(undefined,-this.wrapTargetHeight);
};


Mojo.Widget.ExperimentalWrapAround.prototype.movedEnough=function movedEnough(){
var offset=this.scroller.mojo.getScrollPosition();
var top=-offset.top;
if(top>3*this.wrapTargetHeight/2){
this.scroller.mojo.adjustBy(0,this.wrapTargetHeight);
}else if(top<this.wrapTargetHeight/2){
this.scroller.mojo.adjustBy(0,-this.wrapTargetHeight);
}
};


Mojo.Widget.ExperimentalWrapAround.prototype.scrollTo=function(x,y,animate){
var pos=this.scroller.mojo.getScrollPosition();
var top=-pos.top;

if(top>this.wrapTargetHeight&&-y>top){
this.scroller.mojo.adjustBy(0,this.wrapTargetHeight);
y+=this.wrapTargetHeight;
}else if(top<this.wrapTargetHeight&&-y<top){
this.scroller.mojo.adjustBy(0,-this.wrapTargetHeight);
y-=this.wrapTargetHeight;
}

this.scroller.mojo.scrollTo(x,y,animate);
};



/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.Slider=Class.create({
initialize:function(){

},

setup:function(){
this.initializeDefaultValues();
Mojo.assert(this.controller.model.minValue!==undefined,"Mojo.Widget.Slider requires a minimum value.");
Mojo.assert(this.controller.model.maxValue!==undefined,"Mojo.Widget.Slider requires a maximum value.");

if(this.controller.attributes.updateInterval){
this.draggingUpdate=this.sendDragUpdate.bind(this);
}
this.renderWidget();
this.controller.exposeMethods(['updateDraggingArea']);
},


_sanitizeModelValue:function(){
var value=this.controller.model[this.modelProperty];
value=Math.min(value,this.originalMaxValue);
value=Math.max(value,this.originalMinValue);
this.controller.model[this.modelProperty]=value;
return value;
},

remeasure:function(e){
this.positionSlider();
if(!this.dragStartHandler){
this.dragStartHandler=this.dragStartHandlerFunc.bindAsEventListener(this);
this.controller.listen(this.slider,Mojo.Event.dragStart,this.dragStartHandler);
}
Mojo.Drag.setupDropContainer(this.controller.attributes.backgroundElement||this.controller.element,this);
},

cleanup:function(){
if(this.dragStartHandler){
this.controller.stopListening(this.slider,Mojo.Event.dragStart,this.dragStartHandler);
}
},



sendDragUpdate:function(){
this.updateModel();

if(this.seeking){
this.queuedDragUpdate=this.draggingUpdate.delay(this.controller.attributes.updateInterval);
}
},

initializeDefaultValues:function(){
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.controller.model=this.controller.model||{};
this.controller.attributes=this.controller.attributes||{};
this.increments=0;
this.controller.model.maxValue=this.controller.valueFromModelOrAttributes('maxValue',0);
this.controller.model.minValue=this.controller.valueFromModelOrAttributes('minValue',0);
this.originalMaxValue=this.controller.model.maxValue;
this.originalMinValue=this.controller.model.minValue;
this.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
},

renderWidget:function(){
var model={
divPrefix:this.divPrefix
};
var label,labelContent='',width='0px',i=0;
var max=this.controller.model.maxValue;
var min=this.controller.model.minValue;
var diff=max-min;
var value=0,that=this;

if(this.controller.attributes.labels){
this.increments=this.controller.attributes.labels.length;

this.controller.attributes.labels.each(function(l){
label={'label':l,'width':width,'name':i,'value':value};
labelContent+=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/slider/slider-label'),object:label});
i++;
value+=(diff/(that.increments-1));
});
model.labelContent=labelContent;
}

var sliderContent=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/slider/slider'),object:model});
if(!this.controller.attributes.backgroundElement){
var content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/slider/slider-background'),object:model});
this.controller.element.innerHTML=content;
}
this.sliderBackground=this.controller.get(this.controller.attributes.backgroundElement)||this.controller.get(this.divPrefix+"-sliderBackground");
this.sliderBackground.insert({bottom:sliderContent});
this.slider=this.controller.get(this.divPrefix+"-slider");
this.remeasure();
},

updateDraggingArea:function(min,max){
this.controller.model.maxValue=max;
this.controller.model.minValue=min;
},

positionSlider:function(){
var pos;
var maxPix;
var minPix;
var diff;
var percent;
var sliderPos;
var max=this.controller.model.maxValue;
var min=this.controller.model.minValue;
if(this.controller.model[this.modelProperty]===undefined){
return;
}

pos=this._sanitizeModelValue();
maxPix=this.getMaxPixel();
minPix=this.getMinPixel();
diff=maxPix-minPix;
percent=(pos-min)/(max-min);
sliderPos=(percent*diff)+minPix;

if(sliderPos<minPix){
sliderPos=minPix;
}
if(sliderPos>maxPix){
sliderPos=maxPix;
}
this.slider.setStyle({'left':sliderPos+'px'});
},

handleModelChanged:function(){
if(!this.seeking){
this.positionSlider();
}
},

getMaxPixel:function(){
return this.getSliderbarWidth();
},

getMinPixel:function(){
return this.sliderBackground.offsetLeft-this.slider.getWidth()/2;
},



getSliderbarWidth:function(){

this.slider.removeClassName('palm-drag-element');
return this.sliderBackground.getWidth()-(this.slider.getWidth()/2)+this.sliderBackground.offsetLeft;
},


dragStartHandlerFunc:function(event){

var minimumPixel=this.getMinPixel();
var maximumPixel=this.getMaxPixel();
var viewportDimensions=Mojo.View.getViewportDimensions(this.controller.element.ownerDocument);
if(maximumPixel>viewportDimensions.width){
maximumPixel=viewportDimensions.width;
}


Mojo.Drag.startDragging(this.controller.scene,this.slider,event.down,{preventVertical:true,preventDropReset:true,minHorizontalPixel:minimumPixel,maxHorizontalPixel:maximumPixel});
this.seeking=true;

if(this.controller.attributes.updateInterval){

this.queuedDragUpdate=this.draggingUpdate.delay(this.controller.attributes.updateInterval);
}

Mojo.Event.send(this.controller.element,Mojo.Event.sliderDragStart);
},


dragDrop:function(el){
if(this.controller.attributes.updateInterval&&this.queuedDragUpdate){
this.controller.window.clearTimeout(this.queuedDragUpdate);
this.queuedDragUpdate=undefined;
}
this.updateModel();
Mojo.Event.send(this.controller.element,Mojo.Event.sliderDragEnd);
this.seeking=false;
},


updateModel:function(){
var pos=this.determineSliderValue(this.slider.offsetLeft);
if(pos!==this.controller.model[this.modelProperty]){
this.controller.model[this.modelProperty]=pos;
Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,{value:pos});
}
},

determineSliderValue:function(position){
var max=this.originalMaxValue||0;
var min=this.originalMinValue||0;
var diff=max-min;

var maxPix=this.getMaxPixel();
var minPix=this.getMinPixel();


var relativePos=position-minPix;
var diffPix=maxPix-minPix;


var percent=relativePos/diffPix;


var value=(percent*diff)+min;
if(value>max){
value=max;
}
else if(value<min){
value=min;
}

if(this.controller.attributes.round){
value=Math.round(value);
}else if(this.increments>0){

var sectionSize=diff/this.increments;
var i=this.increments-1,size=max;
while(size>value&&i>0){
size-=sectionSize;
i--;
}

if(size>value){

}

var increment=this.controller.element.select('[name="'+i+'"]')[0];
increment=increment.select('[name="incrementvalue"]')[0];
increment=parseFloat(increment.value,10);
var increment2=this.controller.element.select('[name="'+(i+1)+'"]')[0];
if(increment2){
increment2=increment2.select('[name="incrementvalue"]')[0];
increment2=parseFloat(increment2.value,10);

if(Math.abs(increment-value)<Math.abs(increment2-value)){
value=increment;
}else{
value=increment2;
}
}else{
value=increment;
}

this.controller.model[this.modelProperty]=value;
this.positionSlider();
}
return value;
},

updateProgressStart:function(percent){

},

updateProgressEnd:function(percent){

}
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.RichTextEdit=Class.create({
initialize:function(){},





setup:function(){
var editor=this.controller.element;
editor.setStyle(this.RICH_TEXT_STYLES);
Mojo.View.makeFocusable(editor);

this.onFocus=this.onFocus.bindAsEventListener(this);
this.controller.listen(this.controller.element,"focus",this.onFocus);
this.onBlur=this.onBlur.bindAsEventListener(this);
this.controller.listen(this.controller.element,"blur",this.onBlur);
this.onTap=this.onTap.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.onTap);
},

onTap:function(e){
e.stopPropagation();
},


cleanup:function(){
this.controller.stopListening(this.controller.element,"focus",this.onFocus);
this.controller.stopListening(this.controller.element,"blur",this.onBlur);
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.onTap);
},


toggleBold:function(){
this.controller.document.execCommand("bold",false,null);
},


toggleItalics:function(){
this.controller.document.execCommand("italic",false,null);
},


toggleUnderline:function(){
this.controller.document.execCommand("underline",false,null);
},


onFocus:function(){
var unselect=function(){
var sel=this.controller.window.getSelection();
sel.collapseToStart();
}.bind(this);

unselect.defer();
this.controller.scene.pushCommander(this);
this.applyFocusClass(this.controller.element);
},


onBlur:function(){
this.controller.scene.removeCommander(this);
this.removeFocusClass(this.controller.element);
},


handleCommand:function(event){

var cmd;

if(event.type==Mojo.Event.command){

switch(event.command){
case Mojo.Menu.boldCmd:
this.toggleBold();
break;
case Mojo.Menu.italicCmd:
this.toggleItalics();
break;
case Mojo.Menu.underlineCmd:
this.toggleUnderline();
break;
}

}
},


applyFocusClass:function(target){
var parentTarget=Mojo.View.findParentByAttribute(target,this.controller.document,Mojo.Widget.focusAttribute);
if(parentTarget){
this.focusedParentElement=parentTarget;
Element.addClassName(parentTarget,'focused');
}
},


removeFocusClass:function(target){
if(this.focusedParentElement){
Element.removeClassName(this.focusedParentElement,'focused');
this.focusedParentElement=undefined;
}
},


RICH_TEXT_STYLES:{
"-webkit-user-select":"text",
"-webkit-user-modify":"read-write",
"word-wrap":" break-word",
"cursor":"text",
"-webkit-line-break":"after-white-space"
}



});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.TextField=Class.create({
INPUT_WIDTH:17,
CHAR_MIN:3,


initialize:function(){
},


setup:function(){
var timing=Mojo.Timing;
timing.resume('scene#textField#setup');
Mojo.require(this.controller.element,"Mojo.Widget.TextField requires an element");
Mojo.require(!(this.controller.attributes.multiline&&this.usePasswordTemplate),"Error: Multiline password fields are not supported.");
Mojo.require(!(this.controller.attributes.multiline&&this.controller.attributes.maxLength),"Error: MaxLength is not supported in multiline text fields.");
this.initializeDefaultValues();

this.renderWidget();
this.handleKeyDownEvent=this.handleKeyDownEvent.bind(this);
this.controller.listen(this.controller.element,"keydown",this.handleKeyDownEvent);
this.handleKeyUpEvent=this.handleKeyUpEvent.bind(this);
this.controller.listen(this.controller.element,"keyup",this.handleKeyUpEvent);
this.handleKeyPressEvent=this.handleKeyPressEvent.bind(this);
this.controller.listen(this.controller.element,"keypress",this.handleKeyPressEvent);


this.tapController=this.tapController.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.tapController,true);

this.deactivate=this.deactivate.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.deactivate);

if(this.controller.attributes.holdToEnable){
this.enableTextfield=this.enableTextfield.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.holdEnd,this.enableTextfield);
this.controller.listen(this.controller.element,Mojo.Event.hold,this.enableTextfield);
}

if(this.controller.attributes.holdToEdit){
this.makeTextfieldEditable=this.makeTextfieldEditable.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.hold,this.makeTextfieldEditable);
}

this.commitChanges=this.commitChanges.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.commitChanges,this.commitChanges);

this.controller.exposeMethods(['focus','blur','getValue','setText','setValue','getCursorPosition','setCursorPosition','setConsumesEnterKey']);
this.startValue=this.inputArea.value;

timing.pause('scene#textField#setup');



this.clipboardEvent=this.clipboardEvent.bind(this);
this.controller.listen(this.inputArea,'paste',this.clipboardEvent);
this.controller.listen(this.inputArea,'cut',this.clipboardEvent);

this.updateText=this.updateText.bind(this);
},

setConsumesEnterKey:function(requires){
if(requires){
this.inputArea.setAttribute(Mojo.Gesture.consumesEnterAttribute,"true");
}else{
this.inputArea.setAttribute(Mojo.Gesture.consumesEnterAttribute,"false");
}
},


setText:function(text){
this.setValue(text);
},

setValue:function(text){
this.inputArea.value=text;
this.updateText();
},

updateText:function(){
var value=this.inputArea.value;

if(this.inputArea.value.length===0){
this.hintTextArea.show();
}else{
this.hintTextArea.hide();
}

this.setInputAreaDivText(value);

this._maybeSendChangeOnKeyPress();


this.maybeUpdateTextAreaHeight();
this.maybeUpdateTextAreaWidth();
},

setInputAreaDivText:function(value){
if(this.usePasswordTemplate){
value=this.buildHiddenInput(value.length);
this.inputAreaDiv.innerHTML=value;
}else{
this.inputAreaDiv.innerText=value;
}
},

clipboardEvent:function(e){

if(this.disabled){
return;
}
this.updateText.defer();
},


deactivate:function(){
if(this.focused){
this.inputArea.blur();
}
},

commitChanges:function(e){


if(this.focused){
this.maybeSendPropertyChangeEvent(e);
}
},

remeasureCleanup:function(divVisible,inputVisible,hintVisible,originalFloat,timing){

if(divVisible){
this.inputAreaDiv.show();
}else{
this.inputAreaDiv.hide();
}

if(inputVisible){
this.inputArea.show();
}else{
this.inputArea.hide();
}

if(hintVisible){
this.hintTextArea.show();
}else{
this.hintTextArea.hide();
}

if(originalFloat!=='none'){
this.controller.element.style["float"]=originalFloat;
}


this.maybeUpdateTextAreaWidth();
this.maybeUpdateTextAreaHeight();
timing.pause('scene#textField#remeasure');
},

remeasure:function(e){
var timing=Mojo.Timing;
timing.resume('scene#textField#remeasure');

var forWidth,forHeight;
var divVisible,inputVisible,hintVisible,divWidth;
var originalFloat;
var offsetLeft;

if(!this.focused){
return;
}


if(!this.controller.element.visible()){
timing.pause('scene#textField#remeasure');
return;
}


divVisible=this.inputAreaDiv.visible();
inputVisible=this.inputArea.visible();
hintVisible=this.hintTextArea.visible();


this.inputAreaOriginalSize=Mojo.View.getDimensions(this.inputArea).width||0;

if(hintVisible){
this.hintTextArea.hide();
}

if(!divVisible){
this.inputAreaDiv.show();
}


offsetLeft=this.inputAreaDiv.offsetLeft;
if(this.hintTextArea.style.left!==offsetLeft&&offsetLeft!==0){
this.hintTextArea.style.left=offsetLeft+'px';
}


this.inputAreaDiv.style.width='auto';

originalFloat=this.controller.element.style['float'];
if(originalFloat&&!originalFloat.blank()&&originalFloat!=='none'){
this.controller.element.style["float"]='none';
}
divWidth=Mojo.View.getDimensions(this.inputAreaDiv).width||(this.INPUT_WIDTH*this.CHAR_MIN);
this.inputAreaDiv.style.width='';



if(divWidth===this.inputDivOriginalSize&&!this.controller.attributes.multiline){
this.remeasureCleanup(divVisible,inputVisible,hintVisible,originalFloat,timing);
return;
}


if(this.inputDivOriginalSize!==divWidth){
this.inputDivOriginalSize=divWidth;

divWidth=Mojo.View.getDimensions(this.inputAreaDiv).width;
if(divWidth===0){
divWidth=this.inputDivOriginalSize;
}
this.inputArea.setStyle("width:"+divWidth+"px");
if(this.growWidth){
this.makeWidthGrowable(this.inputArea,this.controller.attributes.limitResize);
}
}


if(this.controller.attributes.multiline){
this.makeHeightGrowable(this.inputArea,this.controller.attributes.limitResize);
}

this.remeasureCleanup(divVisible,inputVisible,hintVisible,originalFloat,timing);
},


focusDiv:function(){
this.focus();
},

blur:function(){
this.inputArea.blur();
},

getValue:function(){
return this.inputArea.value;
},



focus:function(){

if(!this.focused&&!this.disabled&&this.editable){

this.applyFocusClass(this.inputArea);
this.swap(true);
this.inputArea.originalFocus();
}
},

initializeDefaultValues:function(){

this.autoFocus=this.controller.attributes.focus||this.controller.attributes.autoFocus;
this.growWidth=this.controller.attributes.autoResize||this.controller.attributes.growWidth;
this.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.hintText=this.controller.attributes.hintText;
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];
this.editable=!this.controller.attributes.holdToEdit;
this.focusMode=this.controller.attributes.focusMode||Mojo.Widget.focusInsertMode;

if(this.controller.attributes.multiline){
this.swap=this.swapMultiline.bind(this);
}else{
this.swap=this.swapSingleline.bind(this);
}

this.textReplacement=true;

if(this.controller.attributes.autoReplace===false){
this.textReplacement=false;
}else if(this.controller.attributes.textReplacement===false){
this.textReplacement=this.controller.attributes.textReplacement;
}else{
this.textReplacement=true;
}


this.maybeUpdateTextAreaHeight=Mojo.doNothing;
this.maybeUpdateTextAreaWidth=Mojo.doNothing;
},

enableTextfield:function(event){
if(event.type===Mojo.Event.holdEnd){
if(this.disabled&&this.controller.attributes.holdToEnable){
this.disabled=false;
this.updateEnabledState();
this.focus();
}
}else if(event.type===Mojo.Event.hold&&this.disabled&&this.controller.attributes.holdToEnable){
event.stop();
}
},

makeTextfieldEditable:function(event){
var highlightTarget;
if(this.controller.attributes.holdToEdit){
this.editable=true;
highlightTarget=Mojo.Gesture.highlightTarget;
if(highlightTarget){
highlightTarget.removeClassName('selected');
}
this.updateEditableState();
this.focus();
}
},



getCursorPosition:function(value){
var selectionStart,selectionEnd;

if(!this.inputArea.value||this.inputArea.value.length===0){

selectionStart=value.length;
selectionEnd=value.length;
}else{
selectionStart=this.inputArea.selectionStart;
selectionEnd=this.inputArea.selectionEnd;
}
return{'selectionStart':selectionStart,'selectionEnd':selectionEnd};
},

setCursorPosition:function(start,end){

this.inputArea.selectionStart=start;
this.inputArea.selectionEnd=end;
},



handleModelChanged:function(){
var forWidth=false,forHeight=false;
var value=this.controller.model[this.modelProperty]||'';
var originalValue=this.inputArea.value;
var positions;

if(value!==this.inputArea.value){
positions=this.getCursorPosition(value);
this.inputArea.value=value;


if(positions.selectionStart===positions.selectionEnd&&this.focused){
this.setCursorPosition(positions.selectionStart,positions.selectionEnd);
}


this.setInputAreaDivText(value);
}




if(this.focused&&value!==originalValue){
this.remeasure();
}

if(this.controller.model[this.modelProperty]&&this.controller.model[this.modelProperty].length>0){
this.hintTextArea.hide();
}else{
this.hintTextArea.show();
}


if(this.disabled!=this.controller.model[this.disabledProperty]){
this.disabled=this.controller.model[this.disabledProperty];
this.updateEnabledState();
}

this.startValue=this.inputArea.value;


if(this.hintText!==this.controller.attributes.hintText){

this.hintTextArea.innerText=(this.controller.attributes.hintText||'');
this.hintText=this.controller.attributes.hintText;
}
},

updateEnabledState:function(){
if(this.disabled){
Mojo.View.makeNotFocusable(this.inputAreaDiv);
if(this.focused){
this.inputArea.blur();
}
this.inputAreaDiv.addClassName('palm-textfield-disabled');
}else{
Mojo.View.makeFocusable(this.inputAreaDiv);
this.inputAreaDiv.removeClassName('palm-textfield-disabled');
}
},


updateEditableState:function(){
if(!this.editable){
Mojo.View.makeNotFocusable(this.inputAreaDiv);
}else{
Mojo.View.makeFocusable(this.inputAreaDiv);
}
},


_addSteString:function(inString,mode){
var txtModesString=inString;
if(!mode){
return inString;
}
if(txtModesString.length>0){
txtModesString+=" ";
}else{
txtModesString="'x-palm-ste-mode='";
}
txtModesString+=mode;
return txtModesString;
},

_isNewSteControls:function(){

if((this.controller.attributes.textCase!==undefined||this.controller.attributes.emoticons!==undefined||this.controller.attributes.autoReplace!==undefined)||
(this.controller.attributes.textReplacement===undefined&&this.controller.attributes.autoCapitalization===undefined)){
return true;
}
return false;
},



renderWidget:function(){
var hintText=this.hintText;
var model;
var content;
var textFieldName=this.controller.attributes.inputName||this.controller.attributes.textFieldName||this.divPrefix+'_textField';
var originalValue=this.controller.model[this.modelProperty]||'';
var newOriginalValue='',maskedValue='';
var template;
var forWidth=false,forHeight=false;
var txtReplace='',autoCaps='';
var showHint,showRead,showWrite;
var offsetLeft;
var txtModesString="";
var autoReplace=(this.controller.attributes.autoReplace===false)?Mojo.Widget.steModeReplaceOff:null;
var emoticons=this.controller.attributes.emoticons?Mojo.Widget.steModeEmoticonsOn:null;

if(this.controller.attributes.maxLength!==undefined){
if(originalValue&&originalValue.length>this.controller.attributes.maxLength){
originalValue=originalValue.substring(0,this.controller.attributes.maxLength);
}
}
if(this.usePasswordTemplate&&originalValue){
newOriginalValue=originalValue;
maskedValue=this.buildHiddenInput(originalValue.length);
}else{
newOriginalValue=originalValue;
}

if(this._isNewSteControls()){
if(this.controller.attributes.textCase){
txtModesString=this._addSteString(txtModesString,this.controller.attributes.textCase);
}
txtModesString=this._addSteString(txtModesString,emoticons);
txtModesString=this._addSteString(txtModesString,autoReplace);
autoCaps="";


if(txtModesString&&txtModesString.length>0){
txtModesString+="'";
}

}else{
if(this.textReplacement===false){
txtReplace='x-palm-disable-ste-all="true"';
}
if(this.controller.attributes.autoCapitalization){
autoCaps='x-palm-title-cap="true"';
}
}

if(this.controller.model[this.modelProperty]){
showHint='display:none;';
}



if(this.autoFocus&&!this.disabled&&this.editable){
showRead='display:none;';
}else{
showWrite='display:none;';
}


model={
'hintTextName':this.divPrefix+'_hintText',
'textFieldName':textFieldName,
'divPrefix':this.divPrefix,
'mode':this.controller.attributes.modifierState,
'hiddenTextFieldName':textFieldName||this.divPrefix+'_textField',
'unmaskedOriginalValue':originalValue,
'maskedValue':maskedValue,
'maxLength':this.controller.attributes.maxLength,
'txtReplace':txtModesString||txtReplace,
'showHint':showHint,
'showWrite':showWrite,
'showRead':showRead,
'autoCaps':autoCaps
};

if(this.usePasswordTemplate){
template='/password/passwordfield';
}else if(this.controller.attributes.multiline){
template='/textfield/textfield';
}else{
template='/textfield/textfield-single';
}

content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath(template),object:model});
this.controller.element.innerHTML=content;

this.inputArea=this.controller.get(this.divPrefix+"-write");
this.inputArea.value=newOriginalValue;

this.inputAreaDiv=this.controller.get(this.divPrefix+"-read");
this.setInputAreaDivText(newOriginalValue);



this.inputArea.originalFocus=this.inputArea.focus;
this.inputArea.focus=this.focus.bind(this);
this.inputArea.mojo={};
this.inputArea.mojo.setText=this.setText.bind(this);

this.blurInputArea=this.blurInputArea.bind(this);
this.controller.listen(this.inputArea,'blur',this.blurInputArea);
this.focusInputArea=this.focusInputArea.bind(this);
this.controller.listen(this.inputArea,'focus',this.focusInputArea,true);
this.focusDiv=this.focusDiv.bind(this);
this.controller.listen(this.inputAreaDiv,'focus',this.focusDiv);

this.hintTextArea=this.controller.get(model.hintTextName);
if(hintText){
this.hintTextArea.innerText=hintText;
}

offsetLeft=this.inputAreaDiv.offsetLeft;
if(this.inputAreaDiv.visible()&&offsetLeft!==0){
this.hintTextArea.style.left=offsetLeft+'px';
}



if(this.controller.attributes.requiresEnterKey){
this.inputArea.setAttribute(Mojo.Gesture.consumesEnterAttribute,"true");
}

if(this.autoFocus&&!this.disabled&&this.editable){
this.focus();
}else if(this.disabled){

this.updateEnabledState();
this.swap(false);
}else if(this.controller.attributes.holdToEdit){

this.updateEditableState();
this.swap(false);
}else{
this.swap(false);
}
return;
},

makeVisible:function(element){
if(!element.visible()){
return element;
}

var ancestors=element.ancestors();
var ancestorsLength=ancestors.length;
for(var i=0;i<ancestorsLength;i++){
var e=ancestors[i];
if(!e.visible()){
return e;
}
}
return undefined;
},



swapMultiline:function(isEditMode){
var top;

if(isEditMode){

if(this.inputAreaDiv.visible()){
this.inputAreaDiv.hide();
}

if(!this.inputArea.visible()){
this.inputArea.show();
}
}else{

if(this.inputAreaDiv.visible()){
this.inputAreaDiv.hide();
}
if(!this.inputArea.visible()){
this.inputArea.show();
}
top=this.inputArea.offsetTop;
this.inputArea.hide();
this.inputAreaDiv.show();

}
},



swapSingleline:function(isEditMode){
if(isEditMode){


this.inputAreaDiv.hide();
this.inputArea.show();
}else{


this.inputArea.hide();
this.setInputAreaDivText(this.inputArea.value);
if(!this.usePasswordTemplate){
this.inputAreaDiv.setStyle('width:'+this.inputDivOriginalSize+"px");
}
this.inputAreaDiv.show();
}
},


applyFocusClass:function(target){
var parentTarget=Mojo.View.findParentByAttribute(target,this.controller.document,Mojo.Widget.focusAttribute);
if(parentTarget){
this.focusedParentElement=parentTarget;
Element.addClassName(parentTarget,'focused');
}
},


focusInputArea:function(event){
if(!this.disabled&&this.editable){
this.focused=true;
this.remeasure();
this.disabled=this.controller.model[this.disabledProperty];
if(this.focusMode===Mojo.Widget.focusSelectMode){
this.inputArea.select();
}else if(this.focusMode===Mojo.Widget.focusAppendMode){

this.inputArea.selectionStart=this.inputArea.value.length;
this.inputArea.selectionEnd=this.inputArea.value.length;
}else{

if(this.inputArea.value&&this.inputArea.value.length>0){
if(this.downX!==undefined&&this.downY!==undefined){
Mojo.Gesture.simulateClick(this.controller.element,this.downX,this.downY);
}else{

this.inputArea.selectionStart=this.inputArea.value.length;
this.inputArea.selectionEnd=this.inputArea.value.length;
}
}
this.downX=undefined;
this.downY=undefined;
}
this.startValue=this.inputArea.value;
return false;
}else{
return true;
}
},


tapController:function(event){
if(!this.disabled&&this.editable){

this.downX=event.down.pageX;
this.downY=event.down.pageY;


if(event.target.id!==this.inputArea.id){
Event.stop(event);
}
this.focus();
}
},

removeFocusClass:function(){
Element.removeClassName(this.focusedParentElement,'focused');
this.focusedParentElement=undefined;
},


blurInputArea:function(event){
if(this.focused){
var originalEvent=this.originalEventOverride||event;
this.originalEventOverride=undefined;
this.removeFocusClass();
this.swap(false);
this.inputArea.wasSelected=false;
this.maybeSendPropertyChangeEvent(originalEvent);
this.focused=false;

if(this.controller.attributes.holdToEdit){
this.editable=false;
}
this.updateEnabledState();
this.updateEditableState();
}
return false;
},

sendPropertyChangeEvent:function(originalEvent,value,originalValue){
this.controller.model[this.modelProperty]=value||this.inputArea.value;
Mojo.Event.sendPropertyChangeEvent(this.controller.element,this.controller.model,this.modelProperty,this.controller.model[this.modelProperty],originalValue,originalEvent);
},


maybeSendPropertyChangeEvent:function(originalEvent){
var value,originalValue;

if(this.controller.attributes.changeOnKeyPress){
return;
}
value=this.inputArea.value;

if(this.inputArea.value===this.startValue){
return;
}

originalValue=this.startValue;

this.startValue=this.inputArea.value;
this.sendPropertyChangeEvent(originalEvent,value,originalValue);

return false;
},

sendChanges:function(triggeringEvent){

if(!Mojo.View.getParentWithAttribute(triggeringEvent.target,'x-mojo-element','CharSelector')){
this.maybeSendPropertyChangeEvent(triggeringEvent);
}
},


resetHintText:function(){
this.hintTextArea.show();
},


handleFirstKeyInputArea:function(){
this.hintTextArea.hide();
},




handleDeleteKeyPreEvent:function(){
if(this.inputArea.value.length===0){

if(!this.hintTextArea.visible()){
this.hintTextArea.show();
}
return true;
}
return false;
},


handleKeyPressEvent:function(event){
var code=event.keyCode;
var success=false;
if(this.controller.attributes.charsAllow){
success=this.controller.attributes.charsAllow(code);
if(!success){
Event.stop(event);
return false;
}
}

if(this.controller.attributes.multiline&&Mojo.Char.isValidWrittenAsciiChar(code)){
this._maybePredictiveResize(String.fromCharCode(event.keyCode));
}

return false;
},

handleSelectionEvent:function(event){
this.range=this.controller.window.getSelection();
this.range=(this.range&&this.range.toString().length)||0;
},


handleKeyUpEvent:function(event){
var code=event.keyCode;
var ret=false;


this.maybeUpdateTextAreaWidth();

if(code===Mojo.Char.enter&&(!this.controller.attributes.multiline||
(this.controller.attributes.multiline&&this.controller.attributes.enterSubmits))){
this.originalEventOverride=event;
ret=true;



if(this.controller.attributes.enterSubmits&&this.controller.attributes.multiline&&!this.controller.attributes.requiresEnterKey){
this.advanceFocus();
}else{
this.inputArea.blur();
}
}


this._handleHintText(code);
this._maybeSendChangeOnKeyPress(event);

return ret;
},


_handleHintText:function(code){
if(code===Mojo.Char.deleteKey||code===Mojo.Char.backspace){
this.handleDeleteKeyPreEvent();
}else if(Mojo.Char.isValid(code)){
this.handleFirstKeyInputArea();
}
},

_maybeSendChangeOnKeyPress:function(event){
var originalValue;
if(this.controller.attributes.changeOnKeyPress&&((event&&event.keyCode===Mojo.Char.enter)||this.startValue!==this.inputArea.value)){
originalValue=this.startValue;
this.startValue=this.inputArea.value;
this.sendPropertyChangeEvent(event,this.inputArea.value,originalValue);
}
},

_maybePredictiveResize:function(newChar){
var value=this.inputArea.value;
var start=this.inputArea.selectionStart;
var end=this.inputArea.selectionEnd;

if(newChar===undefined){
if(start!==end){
this.inputArea.value=value.substring(0,start)+value.substring(end,value.length);
}else{
this.inputArea.value=value.substring(0,start-1)+value.substring(end,value.length);
}
}else{
this.inputArea.value=value.substring(0,start)+newChar+value.substring(end,value.length);
}
this.maybeUpdateTextAreaHeight();
this.inputArea.value=value;
this.inputArea.selectionStart=start;
this.inputArea.selectionEnd=end;
},

advanceFocus:function(){
Mojo.View.advanceFocus(this.controller.scene.sceneElement,this.inputArea);
},


handleKeyDownEvent:function(event){
var code=event.keyCode;
var target=event.target;
var ret=false;


if(code===Mojo.Char.enter){
if(!this.controller.attributes.multiline||(this.controller.attributes.enterSubmits&&this.controller.attributes.multiline)){
Event.stop(event);
ret=true;
}
}

this._handleHintText(code);


if(this.controller.attributes.multiline&&(code===Mojo.Char.deleteKey||code===Mojo.Char.backspace)){
this._maybePredictiveResize();
}

if(this.controller.attributes.multiline&&!this.controller.attributes.enterSubmits&&code===Mojo.Char.enter){
this._maybePredictiveResize("\n");
}

return ret;
},


buildHiddenInput:function(len){
var hidden="";
for(var i=0;i<len;i++){
hidden+="&#8226;";
}
return hidden;
},

maybeUpdateTextAreaWidthFunc:function(originalWidth,element,shill,limitResize){
var regX;
var s=element.value;
var length=Math.max(s.length,this.CHAR_MIN);
var shillwidth=length*this.INPUT_WIDTH;
if(shillwidth===0||(limitResize&&shillwidth<originalWidth)){
return;
}
element.setStyle({
width:shillwidth+"px"
});
},

cleanup:function(){
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.deactivate);
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.commitChanges,this.commitChanges);
this.controller.stopListening(this.inputArea,'paste',this.clipboardEvent);
this.controller.stopListening(this.inputArea,'cut',this.clipboardEvent);

this.controller.stopListening(this.controller.element,"keydown",this.handleKeyDownEvent);
this.controller.stopListening(this.controller.element,"keyup",this.handleKeyUpEvent);
this.controller.stopListening(this.controller.element,"keypress",this.handleKeyPressEvent);
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.tapController,true);

if(this.controller.attributes.holdToEnable){
this.controller.stopListening(this.controller.element,Mojo.Event.holdEnd,this.enableTextfield);
this.controller.stopListening(this.controller.element,Mojo.Event.hold,this.enableTextfield);
}

if(this.controller.attributes.holdToEdit){
this.controller.stopListening(this.controller.element,Mojo.Event.hold,this.makeTextfieldEditable);
}

this.controller.stopListening(this.inputArea,'blur',this.blurInputArea);
this.controller.stopListening(this.inputArea,'focus',this.focusInputArea,true);
this.controller.stopListening(this.inputAreaDiv,'focus',this.focusDiv);
},

maybeUpdateTextAreaHeightFunc:function(element,limitResize,originalHeight){
var wasVisible=element.visible();
var maxedOut=(element.clientHeight===originalHeight&&limitResize);


element.setStyle({'height':'auto'});
if(!wasVisible){
element.show();
}



while(element.rows>1&&element.scrollHeight<=element.clientHeight){
element.rows--;
}

while(element.scrollHeight>(element.clientHeight+1)&&!maxedOut){
element.rows++;
if(element.clientHeight===originalHeight&&limitResize){
maxedOut=true;
}
}


this.inputAreaDiv.style.width=(Mojo.View.getDimensions(element).width-6)+"px";


if(element.rows>1){
element.style.marginTop="13px";
this.inputAreaDiv.style.paddingBottom="13px";
}else{
element.style.marginTop="12px";
this.inputAreaDiv.style.paddingBottom="16px";
}


this.inputAreaDiv.innerText=element.value;

if(!wasVisible){
element.hide();
}
},

makeWidthGrowable:function(element,limitResize){
var shillElm;
var styleSetter={};
var oldShill;
var maybeUpdate;
var visible=element.visible();
var origWidth;
var st;

if(!visible){
element.show();
}

this.originalWidth=element.offsetWidth;
shillElm=new Element('div');
shillElm.className="TextAreaShill";
oldShill=this.controller.get(element.id+"_shill");

if(oldShill){
shillElm.innerText=oldShill.innerText;
oldShill.remove();
}

shillElm.id=element.id+"_shill";
element.parentNode.insert({top:shillElm});
shillElm.hide();

['width','font-size','font'].each(function(style){
st=element.getStyle(style);
styleSetter[style]=element.getStyle(style);
});
shillElm.setStyle(styleSetter);
origWidth=this.originalWidth||0;
maybeUpdate=this.maybeUpdateTextAreaWidthFunc;
this.maybeUpdateTextAreaWidth=maybeUpdate.bind(this,origWidth,element,shillElm,limitResize);


if(!visible){
element.hide();
}
},


makeHeightGrowable:function(element,limitResize){
var maybeUpdate;
var visible=element.visible();
var originalHeight;

if(!visible){
element.show();
}


if(limitResize){
originalHeight=this.controller.element.getStyle('max-height');
if(originalHeight){
originalHeight=parseInt(originalHeight,10);
}
element.setStyle({'max-height':originalHeight+'px'});
this.inputAreaDiv.setStyle({'max-height':originalHeight+'px'});
}



if(!this.controller.attributes.preventResize){
element.rows=element.rows||1;
element.setStyle({'overflow':'hidden'});
maybeUpdate=this.maybeUpdateTextAreaHeightFunc;
this.maybeUpdateTextAreaHeight=maybeUpdate.bind(this,element,limitResize,originalHeight);
}
if(!visible){
element.hide();
}
}
});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.Widget.ProgressPill=Class.create({
MODEL_START_PROPERTY:'modelStartProperty',

initialize:function(){

},

setup:function(){

Mojo.require(this.controller.model,"ProgressPill widget requires a model.");
this.initializeDefaultValues();
this.renderWidget();
this.controller.exposeMethods(['reset','cancelProgress']);
},

cleanup:function(){
if(this.iconContent){
this.controller.stopListening(this.iconContent,Mojo.Event.tap,this.iconTapped);
}
},

initializeDefaultValues:function(){
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.progressBarMaxWidth=500;
this.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.modelStartProperty=this.controller.attributes.modelStartProperty||this.MODEL_START_PROPERTY;
if(this.isProgressBar){
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-bar/progress-pill');
}else if(this.isProgress){
this.titleTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/title-content');
this.imageTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/image-content');
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/progress-pill');
this.iconTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/icon-content');
}else if(this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){
this.titleTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/title-content');
this.imageTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/image-content');
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/progress-pill');
this.iconTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/icon-content');
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];
}else{
this.isProgressPill=true;
this.titleTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/title-content');
this.imageTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/image-content');
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/progress-pill');
this.iconTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/icon-content');

this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];
}


this.oldWidth=0;
this.oldLeft=0;
},


renderWidget:function(){
var titleContent,imageContent,content,widthStyle,model;
this.title=this.controller.valueFromModelOrAttributes("title",'');

if(this.isProgressPill){
if(this.isProgressPill&&(!this.title||this.title.blank())){
Mojo.Log.warn("A title is required for correct progress pill use and layout.");
}
}

this.titleRight=this.controller.valueFromModelOrAttributes("titleRight",'');
this.image=this.controller.valueFromModelOrAttributes("image",'');
this.icon=this.controller.model.icon||this.controller.model.iconPath;
model={
divPrefix:this.divPrefix,
title:this.title,
image:this.image,
icon:this.icon,
iconPath:this.controller.model.iconPath,
titleRight:this.titleRight
};
if(this.title&&!this.isProgressBar){
titleContent=Mojo.View.render({object:model,template:this.titleTemplate});
}
if(this.image&&!this.isProgressBar){
imageContent=Mojo.View.render({object:model,template:this.imageTemplate});
}


model.titleContent=titleContent||'';
model.imageContent=imageContent||'';

content=Mojo.View.render({object:model,template:this.widgetTemplate});
this.controller.element.innerHTML=content;
this.progressDiv=this.controller.get(this.divPrefix+'_progress');
this.iconContent=this.controller.get(this.divPrefix+"_iconContent");
if(this.iconContent){
this.iconTapped=this.iconTapped.bind(this);
this.controller.listen(this.iconContent,Mojo.Event.tap,this.iconTapped);
if(!this.icon){
this.iconContent.hide();
}
}
this.progressPill=this.controller.get(this.divPrefix+'_downloadPill');


this._updateInactiveState();

this.remeasure();

if(this.isProgressPill&&this.controller.model[this.modelProperty]===undefined){
this.progressDiv.hide();
this.progressPill.addClassName("button-mode");
}

this.imageContent=this.controller.get(this.divPrefix+'_imageContent');
if(!this.image&&this.imageContent){
this.imageContent.hide();
}

if(this.isProgressPill||this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){
this._updateDisabledState();
}
},


getSanitizedPercent:function(){
var percent=this.controller.model[this.modelProperty];
if(percent>1){
percent=1;
}
if(percent<0){
percent=0;
}
return percent;
},

remeasure:function(e){
var percent,width;

this.progressBarMaxWidth=this.progressPill.getDimensions().width;
percent=this.getSanitizedPercent();
width=percent*this.progressBarMaxWidth;
this.setProgressBarStyles(width);


if(this.isProgressPill&&this.progressDiv.visible()){
this.allContent=this.controller.get(this.divPrefix+'_content');
this.allContent.style.width=this.progressDiv.clientWidth;
}
},

setProgressBarStyles:function(width){
var style='',left,height;

if(this.isProgressBar){
height=Mojo.View.getDimensions(this.progressDiv).height;
style='clip: rect(0px, '+width+'px, '+height+'px, 0px)';
}else if(this.isProgress){

left=this._getStartPosition();
width=this._correctWidth(left,width);
style='width: '+width+"px";
}else if(this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){

left=this._getStartPosition();
width=this._correctWidth(left,width);
style='margin-right: '+(this.progressBarMaxWidth-width)+"px;margin-left: "+left+"px;width:auto;";
}else{
style='clip: rect(0px, '+this.progressBarMaxWidth+'px, 48px, '+width+'px)';
}
this.progressDiv.setStyle(style);
},

reset:function(){
this.progressDiv.setStyle({'clip':''});
},

iconTapped:function(event){
Mojo.Event.send(this.controller.element,Mojo.Event.progressIconTap,{model:this.controller.model});
},

cancelProgress:function(){
if(this.icon){
this.icon.hide();
}
this.setProgressBarStyles(this.progressBarMaxWidth);
},


maybeUpdateProgress:function(percent){
var width,style='',left,height;


if(this.disabled){
return;
}

try{
if(percent===1){
if(this.cancelButton){
this.cancelButton.hide();
}
Mojo.Event.send(this.controller.element,Mojo.Event.progressComplete);
}
else if(percent===0){
if(this.cancelButton){
this.cancelButton.show();
}
}else{
if(this.cancelButton){
this.cancelButton.show();
}
}


width=percent*this.progressBarMaxWidth;

if(this.isProgressBar){
height=Mojo.View.getDimensions(this.progressDiv).height;
Mojo.Animation.animateClip(this.progressDiv,'left','bezier',{from:this.oldWidth,to:width,duration:0.2,corner:'left',clip:{top:0,left:this.oldWidth,bottom:height,right:0},curve:this.overrideCurve||'ease-in-out'});

}else if(this.isProgress){

if(percent>0){
this.progressDiv.show();
this.progressPill.removeClassName("inactive");
}

left=this._getStartPosition();


width=this._correctWidth(left,width);


if(left){
Mojo.Animation.animateStyle(this.progressDiv,'margin-left','bezier',{from:this.oldLeft,to:left,duration:0.2,curve:'ease-in-out'});
this.oldLeft=left;
}



Mojo.Animation.animateStyle(this.progressDiv,'width','bezier',{from:this.oldWidth,to:width,duration:0.2,curve:'ease-in-out'});


}else if(this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){

left=this._getStartPosition()||0;



if(left){
Mojo.Animation.animateStyle(this.progressDiv,'margin-left','bezier',{from:this.oldLeft,to:left,duration:0.2,curve:'ease-in-out'});
this.oldLeft=left;
}
width=this.progressBarMaxWidth-width;

Mojo.Animation.animateStyle(this.progressDiv,'margin-right','bezier',{from:this.oldWidth,to:width,duration:0.2,curve:'ease-in-out'});

}else{
if(percent>=0){
if(!this.progressDiv.visible()){
this.progressDiv.show();
this.progressPill.removeClassName("button-mode");
}
Mojo.Animation.animateClip(this.progressDiv,'right','bezier',{from:this.oldWidth,to:width,duration:0.2,corner:'right',clip:{top:0,left:this.progressBarMaxWidth,bottom:48,right:this.oldWidth},curve:this.overrideCurve||'ease-in-out'});
}else{
this.progressDiv.hide();
this.progressPill.addClassName("button-mode");
}
}

this.oldWidth=width;
}
catch(e){
Mojo.Log.logException(e,"_setProgressDiv");
}
},

_getStartPosition:function(){
var left=this.controller.model[this.modelStartProperty]||0;
left=left*this.progressBarMaxWidth;
return left;
},

_correctWidth:function(left,width){
if((left+width)>this.progressBarMaxWidth){
width=this.progressBarMaxWidth-left;
}
if(width>this.progressBarMaxWidth){
width=this.progressBarMaxWidth;
}
return width;
},

handleModelChanged:function(){



this.maybeReRenderWidget();
this.maybeUpdateProgress(this.getSanitizedPercent());
},

maybeReRenderWidget:function(){
var titleContent='',imageContent='',iconContent="";
var model;
var newTitle,newImage,newIcon,newTitleRight;


newTitle=this.controller.valueFromModelOrAttributes("title");
newTitleRight=this.controller.valueFromModelOrAttributes("titleRight","");
newImage=this.controller.valueFromModelOrAttributes("image");
newIcon=this.controller.model.icon||this.controller.model.iconPath;

model={
divPrefix:this.divPrefix,
title:newTitle,
image:newImage,
icon:newIcon,
iconPath:this.controller.model.iconPath,
titleRight:newTitleRight
};

if(this.titleTemplate&&this.title!==newTitle){
if(this.isProgressPill&&(!newTitle||newTitle.blank())){
Mojo.Log.warn("A title is required for correct progress pill use and layout.");
}

this.title=newTitle;
titleContent=Mojo.View.render({object:model,template:this.titleTemplate});
this.controller.get(this.divPrefix+'_titleContent').innerHTML=titleContent;
}
if(this.titleRight!==newTitleRight){
this.titleRight=newTitleRight;
this.controller.get(this.divPrefix+'_titleRightContent').innerHTML=this.titleRight;
}
if(this.imageTemplate&&this.image!==newImage&&this.imageContent){
this.image=newImage;
imageContent=Mojo.View.render({object:model,template:this.imageTemplate});
this.imageContent.innerHTML=imageContent;
if(!this.image){
this.imageContent.hide();
}else{
this.imageContent.show();
}
}
if(this.icon!==newIcon){
this.iconContent.removeClassName(this.icon);
this.iconContent.addClassName(newIcon);
this.icon=newIcon;
if(this.icon){
this.iconContent.show();
}else{
this.iconContent.hide();
}
}

if(this.isProgressPill||this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){
this.disabled=this.controller.model[this.disabledProperty];
this._updateDisabledState();
}

this._updateInactiveState();

},


_updateInactiveState:function(){
if(this.isProgress&&this.controller.model[this.modelProperty]===0){
this.progressDiv.hide();
this.progressPill.addClassName("inactive");
}
},

_updateDisabledState:function(){
if(this.disabled){
this.progressPill.addClassName("disabled");
}else{
this.progressPill.removeClassName("disabled");
}
}

});

Mojo.Widget.ProgressPill.slider="slider";/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.ProgressBar=function(){
this.isProgressBar=true;
Mojo.Widget.ProgressPill.apply(this);
};

Mojo.Widget.ProgressBar.prototype=Mojo.Widget.ProgressPill.prototype;


Mojo.Widget.Progress=function(){
this.isProgress=true;
Mojo.Widget.ProgressPill.apply(this);
};

Mojo.Widget.Progress.prototype=Mojo.Widget.ProgressPill.prototype;/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */











Mojo.Contact={};

Mojo.Contact.numberFields=['imAvailability','contactCount','isMe'];
Mojo.Contact.DEFAULT_LIST_AVATAR="images/generic-list-view-avatar.png";
Mojo.Contact.DEFAULT_DETAILS_AVATAR="images/generic-details-view-avatar.png";
Mojo.Contact.PREFIXES=["mr","miss","mrs","ms","dr"];
Mojo.Contact.SUFFIXES=["jr","sr","i","ii","iii","iv","v","vi","phd","md"];



Mojo.Contact.fixup=function(c){

c.firstNameFormatted=c.firstName||"";
c.middleNameFormatted=c.middleName||"";
c.lastNameFormatted=c.lastName||"";
c.companyNameFormatted=c.companyName||"";
c.displayTextFormatted=c.displayText||"";


Mojo.Contact.numberFields.each(function(field){
if(c[field]){
c[field]=parseInt(c[field],10);
}
});




if(c.pictureLoc){
c.pic=c.pictureLoc;
}else if(c.imAvatarLoc){
c.pic=c.imAvatarLoc;
}else{
c.hasPic="default-pic";
c.pic=Mojo.Contact.DEFAULT_DETAILS_AVATAR;
c.listPic=Mojo.Contact.DEFAULT_LIST_AVATAR;
}

if(c.contactCount>1){
c.isClipped="clipped";
c.listIsClipped="clipped";
if(c.pic===Mojo.Contact.DEFAULT_DETAILS_AVATAR){
c.listPic="";
}else{
c.listPic=c.pic;
}
}else{
if(c.pictureLoc||c.imAvatarLoc){
c.listPic=c.pic;
c.listIsClipped="unclipped";
}else{
c.listPic="";
c.listIsClipped="";
}
}
};







Mojo.ContactsPalmService=Class.create({


list:function(sceneController,filter,callback,subscriberId,offset,limit){
var params={offset:offset,limit:limit,filter:filter};
if(subscriberId){
params.subscriberId=subscriberId;
return new Mojo.Service.Request(Mojo.ContactsPalmService.identifier,{
method:'newList',
parameters:params,
onSuccess:callback
});

}else{
params.subscribe=true;
return sceneController.serviceRequest(Mojo.ContactsPalmService.identifier,{
method:'newList',
parameters:params,
onSuccess:callback
});
}
},


count:function(sceneController,filter,callback){
return sceneController.serviceRequest(Mojo.ContactsPalmService.identifier,{
method:'newCount',
parameters:{filter:filter},
onSuccess:callback
});
},


getSortOrder:function(sceneController,callback){
return sceneController.serviceRequest(Mojo.ContactsPalmService.identifier,{
method:'getSortOrder',
parameters:{},
onSuccess:callback
});
}
});

Mojo.ContactsPalmService.identifier='palm://com.palm.contacts';

Mojo.ContactFormatter=Class.create({

_getDividerText:function(text){
return text[0];
},


_createContactDisplay:function(c){
if(c.firstNameFormatted){
c.display=c.firstNameFormatted;
if(c.lastNameFormatted){
c.display+=" ";
}
}
if(c.lastNameFormatted){
c.display+=c.lastNameFormatted;
}
if(c.display.blank()){
c.display=c.companyNameFormatted||"";
}
if(c.display.blank()){
c.display=c.displayTextFormatted||"";
}
},


_formatLastFirstSort:function(c,filter){
if(c.lastNameFormatted){
c.dividerText=this._getDividerText(c.lastNameFormatted);
}
if(!c.display){
this._createContactDisplay(c);
}
if(!c.dividerText){
c.dividerText=this._getDividerText(c.display);
}
},


_formatFirstLastSort:function(c,filter){
if(c.firstNameFormatted){
c.dividerText=this._getDividerText(c.firstNameFormatted);
}
if(!c.display){
this._createContactDisplay(c);
}
if(!c.dividerText){
c.dividerText=this._getDividerText(c.display);
}
},


_getCompanyDividerText:function(c){
return c.companyNameFormatted||"NONE";
},



_formatCompanyLastFirstSort:function(c,filter){
if(!c.display){
this._createContactDisplay(c);
}
c.dividerText=this._getCompanyDividerText(c);
},


_formatCompanyFirstLastSort:function(c,filter){
this._formatCompanyLastFirstSort(c,filter);
},



formatListItem:function(c,filter,sortOrder){
c.dividerText=undefined;
c.display=c.displayTextFormatted;

switch(sortOrder){
case Mojo.Widget.sortLastFirst:
this._formatLastFirstSort(c,filter);
break;
case Mojo.Widget.sortFirstLast:
this._formatFirstLastSort(c,filter);
break;
case Mojo.Widget.sortCompanyLastFirst:
this._formatCompanyLastFirstSort(c,filter);
break;
case Mojo.Widget.sortCompanyFirstLast:
this._formatCompanyFirstLastSort(c,filter);
break;
default:
Mojo.Log.error("UNKNOWN SORT ORDER: "+sortOrder);
break;
}


c.formattedText=Mojo.PatternMatching.addContactMatchFormatting(c.display,filter);
}
});



var IMName=Class.create({
initialize:function(imStr){
this.value=imStr;
}
});


IMName.NO_PRESENCE=6;
IMName.PENDING=5;
IMName.OFFLINE=4;
IMName.INVISIBLE=3;
IMName.BUSY=2;
IMName.IDLE=2;
IMName.STEPPED_OUT=2;
IMName.BE_RIGHT_BACK=2;
IMName.NOT_AT_MY_DESK=2;
IMName.ON_THE_PHONE=2;
IMName.OUT_TO_LUNCH=2;
IMName.MOBILE=1;
IMName.FREE_FOR_CHAT=0;
IMName.ONLINE=0;







Mojo.Widget.PeoplePicker=Class.create({

DELAY:1,
LOOKAHEAD:30,
RENDER_LIMIT:30,
SCROLL_THRESHOLD:400,


setup:function(){
this.initializeDefaultValues();
this.renderWidget();
this.setupEventObservers();
this.controller.exposeMethods(['reset']);
},

formatPresence:function(presence){
var formatted;
switch(presence){
case IMName.BUSY:
formatted=$LL('busy');
break;
case IMName.IDLE:
formatted=$LL('idle');
break;
case IMName.ONLINE:
formatted=$LL('available');
break;
case IMName.OFFLINE:
formatted=$LL('offline');
break;
}
return formatted;
},


getItems:function(filter,listWidget,offset,limit){
if(this.initialSearch){
this.curOffset=offset;
this.curLimit=limit;
}
if(this.filter===undefined||this.filter!==filter){
this.curFilter=filter;
filter=this.initialSearch||filter;
this.filter=filter;
this.dataSource.setParam(filter);
this.dataSource.setDoCount(!filter||filter.length===0);

}
if(Mojo.Host.current===Mojo.Host.browser){
var service=new Mojo.Widget.MockContactsService(this.transformListResults.bind(this));
service.setParam(filter);
service.list(listWidget,offset,limit);
}else{
this.dataSource.fetchItems(listWidget,offset,limit);
}
},


renderWidget:function(){
var model={
divPrefix:this.divPrefix
};
var content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('people-picker/list-scene'),object:model});
var formatters={
imAvailability:this.formatPresence.bind(this)
};
this.listAttrs=this.controller.attributes;
this.listAttrs.itemTemplate=Mojo.Widget.getSystemTemplatePath('people-picker/contact_entry');
this.listAttrs.filterFunction=this.getItems.bind(this);
this.listAttrs.formatters=formatters;
this.listAttrs.delay=this.DELAY;
this.listAttrs.optimizedOptIn=true;
this.listAttrs.lookahead=this.LOOKAHEAD;
this.listAttrs.renderLimit=this.RENDER_LIMIT;
this.listAttrs.scrollThreshold=this.SCROLL_THRESHOLD;
this.listAttrs.dividerTemplate=Mojo.Widget.getSystemTemplatePath('people-picker/group_separator');
this.listAttrs.dividerFunction=this.getDivider;

this.controller.element.innerHTML=content;

this.emptyDiv=this.controller.get(this.divPrefix+'-list-empty');
this.emptyDiv.hide();

this.controller.scene.setupWidget(this.filterList,this.listAttrs,this.filterListModel);
this.controller.instantiateChildWidgets(this.controller.element);
this.filterListWidget=this.controller.get(this.filterList);
},


handleSortOrder:function(response){
var template;
this.sortOrder=response.order;

template=(this.sortOrder===Mojo.Widget.sortCompanyFirstLast||this.sortOrder===Mojo.Widget.sortCompanyLastFirst)?'people-picker/multiline-separator':'people-picker/group_separator';
this.listAttrs.dividerTemplate=Mojo.Widget.getSystemTemplatePath(template);
},



setSortOrder:function(){
if(this.controller.model.sortOrder){
this.sortOrder=this.controller.model.sortOrder;
}else if(Mojo.Host.current===Mojo.Host.browser){
this.sortOrder=Mojo.Widget.sortLastFirst;
}else{
this.contactsService.getSortOrder(this.controller.scene,this.handleSortOrder);
}
},



reset:function(){
delete this.sortOrder;
this.setSortOrder();
this.dataSource.doUpdate();
},

initializeDefaultValues:function(){
this.exclusion=this.controller.attributes.exclusion;
this.handleSortOrder=this.handleSortOrder.bind(this);
this.initialSearch=this.controller.attributes.initialSearch;
this.contactsService=new Mojo.ContactsPalmService();
this.setSortOrder();
this.divPrefix=Mojo.View.makeUniqueId();


this.filterList=this.divPrefix+'-ppl-filterlist';

this.filterListModel={};

this.dataSource=new Mojo.ActiveRecordListBridge(
this.contactsService.list.curry(this.controller.scene),
this.contactsService.count.curry(this.controller.scene),
this.transformListResults.bind(this)
);

this.formatter=new Mojo.ContactFormatter();
},


setupEventObservers:function(){
this.handleSelection=this.handleSelection.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.listTap,this.handleSelection);
},


handleSelection:function(event){
var targetRow=this.controller.get(event.item);
var itemId;
if(targetRow){

itemId=targetRow.id;
Mojo.Event.send(this.controller.element,Mojo.Event.peoplePickerSelected,{item:itemId});
}
},



getDivider:function(item){
if(!item.exclude&&item.dividerText){
return item.dividerText.toUpperCase();
}
},



transformListResults:function(data){
var list=data.list;
var that=this;
var offset=this.curOffset,limit=this.curLimit,filter=this.curFilter;

if(!list){
Mojo.Log.error("Transformlistresults did not receive a list of data. Bailing out.");
return;
}

if(this.initialSearch){

this.initialSearch=undefined;
this.curOffset=undefined;
this.curLimit=undefined;
this.curFilter=undefined;



if(list.length===0){
this.getItems(filter,this.filterListWidget,offset,limit);
return;
}
}


list.each(function(contact){
if(that.exclusion){

if(that.exclusion.indexOf(contact.id)!=-1){
contact.exclude='exclude';
}
}
Mojo.Contact.fixup(contact);
that.formatter.formatListItem(contact,that.filter,that.sortOrder);
});

if(data.offset===0&&list.length===0){
this.emptyDiv.show();
}else{
this.emptyDiv.hide();
}
},


cleanup:function(){

this.dataSource.cleanup();
this.controller.stopListening(this.controller.element,Mojo.Event.listTap,this.handleSelection);
}
});






/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */


var contactsListResponse={"list":[],"count":12};



Mojo.Widget.MockContactsService=Class.create({
initialize:function(formatter,exclusionList){
this.formatter=formatter;
this.exclusion=exclusionList;
this.filterString="";
},


setParam:function(filter){
this.filter=filter;
},

list:function(filterListWidget,offset,count){
var data={
list:contactsListResponse.list.slice(offset,offset+count),
count:contactsListResponse.count
};
this.formatter(data);
filterListWidget.mojo.noticeUpdatedItems(offset,data.list);
filterListWidget.mojo.setLength(data.count);
filterListWidget.mojo.setCount(data.count);
}
});




/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.RadioButton=Class.create({

setup:function setup(){

if((this.controller.model.choices===undefined||this.controller.attributes.choices===undefined)&&
(this.controller.model.options!==undefined||this.controller.attributes.options!==undefined)){
Mojo.Log.error("WARNING: RadioButton attributes now use 'choices' instead of 'options'.");
}

this._clickHandler=this._clickHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this._clickHandler);
this.valueName=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this._buildFromModel();


if(this.controller.model===undefined||this.controller.model===this.controller.attributes){
this.controller.model={};
}
},

cleanup:function(){
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this._clickHandler);
},


handleModelChanged:function(){
this._buildFromModel();
},


_buildFromModel:function _buildFromModel(){
var el=this.controller.element;


this.choices=this.controller.model.choices||this.controller.attributes.choices||this.controller.model.options||this.controller.attributes.options;
var wrapperTemplate=Mojo.Widget.getSystemTemplatePath("radio-button/radio-button-wrapper");
var itemTemplate=Mojo.Widget.getSystemTemplatePath("radio-button/radio-button");
this.listItemsParent=Mojo.Widget.Util.renderListIntoDiv(el,this.controller.attributes,wrapperTemplate,
this.choices,itemTemplate);


if(this.controller.model[this.valueName]!==undefined){
var children=this.listItemsParent.childElements();
if(children.length==2){
this.listItemsParent.addClassName("two");
}else if(children.length==3){
this.listItemsParent.addClassName("three");
}
for(var i=0;i<children.length;i++){
var child=children[i];
if(child._mojoListIndex!==undefined){
if(this.choices[child._mojoListIndex].value==this.controller.model[this.valueName]){
child.addClassName("selected");
this.currentItem=child;
break;
}
}
}
}
this.hiddenInput=el.querySelector('input');
this.hiddenInput.value=this.controller.model[this.valueName];
this.hiddenInput.name=this.valueName;



this.disabled=this.disabledProperty?this.controller.model[this.disabledProperty]:false;
},


_getButtonCell:function(elem){
while(elem!==this.controller.element){
if(elem.parentNode===this.listItemsParent){
return elem;
}
elem=elem.parentNode;
}
return undefined;
},


_clickHandler:function(e){
var clicked=this._getButtonCell(e.target);
if(clicked===undefined||clicked===this.currentItem||this.disabled){
return;
}

e.stop();

if(this.currentItem){
this.currentItem.removeClassName("selected");
}

clicked.addClassName("selected");

this.currentItem=clicked;
this.hiddenInput.value=this.choices[clicked._mojoListIndex].value;
this.controller.model[this.valueName]=this.choices[clicked._mojoListIndex].value;
Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,
{property:this.valueName,
value:this.choices[clicked._mojoListIndex].value,
model:this.controller.model
});
}
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.Pager=Class.create({


setup:function(){
Mojo.assert(this.controller.element,"Mojo.Widget.Pager requires an element");
Mojo.assert(this.controller.model,"Mojo.Widget.Pager requires a model");
this.scroller=Mojo.View.getScrollerForElement(this.controller.element);
this.addAsScrollListener=this.addAsScrollListener.bind(this);
this.controller.listen(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener);
this.pageDimensions=this.scroller.getDimensions();
var pagedItem=this.controller.element.firstDescendant();
var pagedItemDimensions=this.controller.model.getDimensions();
pagedItem.remove();
var enclosingItem=pagedItem.wrap();
this.controller.element.insert({top:enclosingItem});
enclosingItem.setStyle({height:pagedItemDimensions.height+'px',width:pagedItemDimensions.width+'px'});
this.pagedItem=enclosingItem.firstDescendant();
this.pagedItem.makePositioned();
var img=this.pagedItem.firstDescendant();
img.makePositioned();
this.pagedItem.setStyle({height:this.pageDimensions.height+'px',width:this.pageDimensions.width+'px',overflow:'hidden'});


this.moved=Mojo.Widget.Scroller.createThreshholder(this.movedEnough.bind(this),this.controller.element,100);
},

cleanup:function(){
this.controller.stopListening(this.scroller,Mojo.Event.scrollStarting,this.addAsScrollListener);
},

addAsScrollListener:function(event){
event.scroller.addListener(this);
},

movedEnough:function(){
var offset=this.scroller.mojo.getScrollPosition();
var dimensions=this.controller.element;
offset.left=-offset.left;
offset.top=-offset.top;
var w2=this.pageDimensions.width/2;
var h2=this.pageDimensions.height/2;
var pageLocation={
left:(offset.left-w2),
top:(offset.top-h2),
right:(offset.left+this.pageDimensions.width+w2),
bottom:(offset.top+this.pageDimensions.height+h2)
};
pageLocation.top=Math.max(0,pageLocation.top);
pageLocation.left=Math.max(0,pageLocation.left);
var h=pageLocation.bottom-pageLocation.top;
var w=pageLocation.right-pageLocation.left;
this.pagedItem.setStyle({left:pageLocation.left+'px',top:pageLocation.top+'px',width:w+'px',height:h+'px'});
this.controller.model.scrollTo(pageLocation.left,pageLocation.top);
}

});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.Spinner=Class.create({

setupOptional:true,
defaultModelProperty:'spinning',
DEFAULT_FPS:12,
DEFAULT_FRAMECOUNT:12,
DEFAULT_FRAMEHEIGHT:32,
LARGE_FRAMEHEIGHT:128,

initializeDefaultValues:function(){

this.controller.attributes=this.controller.attributes||{};
this.controller.model=this.controller.model||{};
this.superClass=this.controller.attributes.superClass;
this.spinningPropName=this.controller.attributes.modelProperty||this.controller.attributes.property||this.defaultModelProperty;
this.controller.attributes.spinnerSize=this.controller.attributes.spinnerSize||Mojo.Widget.spinnerSmall;

if(this.controller.attributes.mainFrameCount){
this.spinnerMode='custom';


this.fps=this.controller.attributes.fps||this.DEFAULT_FPS;

this.startFrameCount=this.controller.attributes.startFrameCount;
this.mainFrameCount=this.controller.attributes.mainFrameCount;
this.finalFrameCount=this.controller.attributes.finalFrameCount||0;
this.frameHeight=this.controller.attributes.frameHeight||this.DEFAULT_FRAMEHEIGHT;
if(typeof this.frameHeight==='string'){
if(this.frameHeight===Mojo.Widget.spinnerLarge){
this.frameHeight=this.LARGE_FRAMEHEIGHT;
}else{
this.frameHeight=this.DEFAULT_FRAMEHEIGHT;
}
}
}else{
if(this.controller.attributes.spinnerSize===Mojo.Widget.spinnerSmall){

this.spinnerMode='defaultSmall';
this.fps=this.DEFAULT_FPS;
this.mainFrameCount=this.DEFAULT_FRAMECOUNT;
this.frameHeight=this.DEFAULT_FRAMEHEIGHT;
}else if(this.controller.attributes.spinnerSize===Mojo.Widget.spinnerLarge){

this.spinnerMode='defaultLarge';
this.fps=this.DEFAULT_FPS;
this.mainFrameCount=this.DEFAULT_FRAMECOUNT;
this.frameHeight=this.LARGE_FRAMEHEIGHT;
}
this.finalFrameCount=0;
}

this.drawInterval=Math.max(1,Mojo.Animation.targetFPS/this.fps);

this.startLastFrame=this.startFrameCount||0;
this.mainLastFrame=this.startLastFrame+this.mainFrameCount;
this.finalLastFrame=this.mainLastFrame+this.finalFrameCount;

if(this.startFrameCount){
this.spinnerPhase="start";
}else{
this.spinnerPhase="main";
}

},

subtreeShown:function(){
if(this.controller.model[this.spinningPropName]){
this.start();
}else{
this.stop();
}
},


setup:function(){
var i;

Mojo.assert(this.controller.element,"Mojo.Widget.Spinner requires an element");
this.initializeDefaultValues();




this.frameOffset=['0px 0px'];

this.renderWidget();

this.controller.exposeMethods(['start','stop','toggle']);
this.frameIndex=1;

this.queue=Mojo.Animation.queueForElement(this.controller.element);
this.frameHeight=this.frameHeight||this.controller.attributes.frameHeight||Mojo.View.getDimensions(this.controller.element).height;

for(i=0;i<this.finalLastFrame;i++){
this.frameOffset[i]='0px '+String(-this.frameHeight*i)+'px';
}

},


cleanup:function(){
this.shouldStop=true;
this.stopAnimate();
},


renderWidget:function(){
if(this.superClass!==undefined){
Element.addClassName(this.controller.element,this.superClass);
}else{
if(this.spinnerMode=='defaultLarge'){
this.controller.element.addClassName('palm-activity-indicator-large');
}else{
this.controller.element.addClassName('palm-activity-indicator-small');
}
}
this.setFrame(1);
Element.hide(this.controller.element);
},


start:function(){
if(!this.isSpinning){
Element.show(this.controller.element);
this.frameHeight=this.frameHeight||Mojo.View.getDimensions(this.controller.element).height;
Mojo.require(this.frameHeight,"frame height must be defined. Is the spinner widget currently hidden?");

this.shouldStop=false;
this.spinnerPhase="start";
this.drawCount=0;
this.controller.model[this.spinningPropName]=true;
this.isSpinning=true;
this.queue.add(this);
this.frameIndex=1;
}
},


stop:function(){
if(this.isSpinning){
this.controller.model[this.spinningPropName]=false;
this.shouldStop=true;
this.stopAnimate();
this.spinnerPhase="done";
}
},

toggle:function(){
if(this.isSpinning){
this.stop();
}else{
this.start();
}
},

stopAnimate:function(){
if(this.isSpinning&&this.shouldStop){
this.isSpinning=false;
Element.hide(this.controller.element);
this.queue.remove(this);
}
},

handleModelChanged:function(){
if(this.controller.model[this.spinningPropName]){
this.start();
}else{
this.stop();
}
},

setFrame:function(frameNum){
this.controller.element.style['background-position']=this.frameOffset[frameNum-1];
},



updateFrameIndex:function(){
var overLastFrame;
this.frameIndex++;
overLastFrame=(this.frameIndex>this[this.spinnerPhase+"LastFrame"]);
if(overLastFrame||(this.shouldStop&&
this.spinnerPhase==="main"&&
!this.finalFrameCount)){
if(this.spinnerPhase==="start"){
if(this.shouldStop){
this.spinnerPhase="final";
this.frameIndex=this.mainLastFrame+1;
}else{
this.spinnerPhase="main";
}
}else if(this.spinnerPhase==="main"){
if(this.shouldStop){
if(this.finalFrameCount){
this.spinnerPhase="final";
}else{

this.spinnerPhase="done";
}
}else{
this.frameIndex=this.startLastFrame+1;
}
}else if(this.spinnerPhase==="final"){
this.stopAnimate();
this.spinnerPhase="done";
}
}
return this.spinnerPhase;
},


animate:function(){
if(this.drawCount<this.drawInterval){
this.drawCount++;
}else{
this.drawCount-=this.drawInterval;
this.updateFrameIndex();

if(!(this.spinnerPhase==="done")){
this.setFrame(this.frameIndex);
}
}
}
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.ToggleButton=Class.create({
YSALT:10,

initialize:function(){
},

setup:function(){
this.initializeDefaultValues();
this.toggleState=this.toggleState.bind(this);
this.renderWidget();
this._setDisabledState();
},

initializeDefaultValues:function(){
this.controller.attributes.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.fieldId=this.divPrefix+"hiddenField";
this.trueValue=this.controller.attributes.trueValue||true;
this.trueLabel=this.controller.attributes.trueLabel||$LL('On');
this.falseValue=this.controller.attributes.falseValue||false;
this.falseLabel=this.controller.attributes.falseLabel||$LL('Off');
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;

if(this.isCheckbox){
this.template=Mojo.Widget.getSystemTemplatePath('/checkbox/checkbox');
this.toggleDivName=this.divPrefix+"-checkboxDiv";
}else{
this.template=Mojo.Widget.getSystemTemplatePath('/toggle-button/toggle-button');
this.toggleDivName=this.divPrefix+"-toggleDiv";
this.toggle=this.toggle.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.dragging,this.toggle);
this.toggleStateStart=this.toggleStateStart.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.dragStart,this.toggleStateStart);
}
},

cleanup:function(){
this.controller.stopListening(this.controller.element,Mojo.Event.dragStart,this.toggleStateStart);
this.controller.stopListening(this.controller.element,Mojo.Event.dragging,this.toggle);
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.toggleState);
},



_getState:function(){
return this.trueValue===this.controller.model[this.controller.attributes.modelProperty];
},


toggleStateStart:function(event){
if(this.disabled){
return;
}
var filteredDistance=event.filteredDistance;
var shouldToggle=(filteredDistance.x>filteredDistance.y);
this.interestedInDrags=shouldToggle;
if(shouldToggle){
if(this.direction){
delete this.direction;
}
event.stop();
}
},




toggle:function(event){
var move=event.move;
var start=event.down;
var state=this._getState();
var direction;

if(this.disabled||!start||!move||!this.interestedInDrags){
return;
}

if(move.x>start.x){
direction="right";
}else{
direction="left";
}

if(this.direction!==direction){
if(!state&&direction==='right'){
this.toggleState(event);
}else if(state&&direction==='left'){
this.toggleState(event);
}
this.direction=direction;
}
event.stop();
},

renderWidget:function(){
var state,label;
if(this.controller.model[this.controller.attributes.modelProperty]==this.trueValue){
state=true;
label=this.trueLabel;
}else{
state=false;
label=this.falseLabel;
}
var model={
fieldName:this.controller.attributes.inputName||this.controller.attributes.fieldName,
fieldId:this.fieldId,
divPrefix:this.divPrefix,
state:state,
value:this.controller.model[this.controller.attributes.modelProperty],
label:label
};
var content=Mojo.View.render({template:this.template,object:model});
this.controller.element.innerHTML=content;
this.toggleDiv=this.controller.get(this.toggleDivName);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.toggleState);
this.inputField=this.controller.get(model.fieldId);
this.labelDiv=this.controller.get(this.divPrefix+'-labelDiv');
},

setState:function(state){
if(state){
this.toggleDiv.removeClassName(false);
this.toggleDiv.addClassName(true);
if(this.labelDiv){
this.labelDiv.innerHTML=this.trueLabel;
}
}else{
this.toggleDiv.removeClassName(true);
this.toggleDiv.addClassName(false);

if(this.labelDiv){
this.labelDiv.innerHTML=this.falseLabel;
}
}
},

toggleState:function(event){
if(this.disabled){
return;
}
var state=!this.toggleDiv.hasClassName("true");
this.setState(state);
this.handlePropertyChanged(state);
event.stop();
return true;
},

_setDisabledState:function(){
var disabledVal=this.controller.model[this.disabledProperty];
if(disabledVal!==this.disabled){
this.disabled=disabledVal;
if(this.disabled){
this.toggleDiv.addClassName("disabled");
}else{
this.toggleDiv.removeClassName("disabled");
}
}
},

handleModelChanged:function(what,model){
this._setDisabledState();
this.setState(this._getState());
this.inputField.value=this.controller.model[this.controller.attributes.modelProperty];
},

handlePropertyChanged:function(value){

if(value){
this.controller.model[this.controller.attributes.modelProperty]=this.trueValue;
}else{
this.controller.model[this.controller.attributes.modelProperty]=this.falseValue;
}
this.inputField.value=this.controller.model[this.controller.attributes.modelProperty];

Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,{model:this.controller.model,property:this.controller.attributes.modelProperty,value:this.controller.model[this.controller.attributes.modelProperty]});
}
});/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.CheckBox=function(){
this.isCheckbox=true;
Mojo.Widget.ToggleButton.apply(this);
};


Mojo.Widget.CheckBox.prototype=Mojo.Widget.ToggleButton.prototype;/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */


if(Mojo.WebView===undefined){
Mojo.WebView={
MouseModeSelect:0,
MouseModeScroll:1
};
}

Mojo.WebView.Rectangle=Class.create({

initialize:function(left,top,right,bottom){
this.left=left;
this.top=top;
this.right=right;
this.bottom=bottom;
},

equals:function(rect){
return this.left===rect.left&&this.top===rect.top&&
this.right===rect.right&&this.bottom===rect.bottom;
},

offset:function(dx,dy){
this.left+=dx;
this.right+=dx;
this.top+=dy;
this.bottom+=dy;
},

toString:function(){
return"L: "+this.left+", T: "+this.top+", R: "+this.right+", B: "+this.bottom;
}
});


Mojo.WebView.HistoryItem=Class.create({

initialize:function(url,scrollX,scrollY,width,height,zoom){
this.url=url;
this.scrollX=scrollX||0;
this.scrollY=scrollY||0;
this.width=width||320;
this.height=height||480;
this.zoom=zoom||1.0;
}
});

Mojo.WebView.MetaViewport=Class.create({

initialize:function(initialScale,minimumScale,maximumScale,width,height,userScalable){
this.initialScale=initialScale;
this.minimumScale=minimumScale;
this.maximumScale=maximumScale;
this.width=width;
this.height=height;
this.userScalable=userScalable;
}
});


Mojo.Event.webViewFirstPaintComplete='mojo-webview-first-paint-complete';


Mojo.Widget.WebView=Class.create({

smartZoomScaleSlopFactor:1.05,
mouseDownEventType:0,
mouseUpEventType:1,
mouseMoveEventType:2,
maxScaleFactor:2.0,
adapterNum:0,
formAutoZoomScaleFactor:1.4,

initialize:function(){
this.useAdapter=Mojo.Host.current===Mojo.Host.palmSysMgr;
this.adapter=0;
this.sceneScroller=null;
this.tapIndex=0;
this.currScale=1.0;
this.currPageWidth=0;
this.currPageHeight=0;
this.fitWidth=true;
this.metaViewport=undefined;
this.adapterConnected=true;
this.zoomAtGestureStart=this.currScale;
this.offsetAtGestureStart={left:0,top:0};
this.javascriptDialog=null;
this.useMouseEvents=false;
this.mouseScrollsNode=false;
this.userCanAlwaysScale=true;
this.formAutoZoom=true;
this.historyInfo={};
this._lastTapEvent=undefined;
this._deleteLastTapEvent=this._deleteLastTapEvent.bind(this);
this.lastUrl=null;
this.pageManipulated=false;
this._lastTapElementInfo={};
this._lastMousemoveEvent=undefined;


this.prevWindowSize={width:0,height:0};
this.prevScrollPosition={x:0,y:0};

this.inPinchZoom=false;
this.pinchZoomRecordedScales=[];
this.pinchZoomRecordedCenterX=[];
this.pinchZoomRecordedCenterY=[];
this.pinchZoomAvgWeights=[1,2,4,8];

this.pluginSpotlightMode=undefined;
this.pluginSpotlightOn=false;
this.pluginSpotlightRemoveTimer=undefined;
this.pluginSpotlightRect=undefined;
this.pluginSpotlightScrim={fullscreen:255,partial:130};
this.pluginSpotlightAllowMetaGestures=false;
this.pluginSpotlightViewportAtStart={canRestore:false,scale:this.currScale,scrollPos:{left:0,top:0},height:0,width:0};

this.hasFocus=true;
this.topMargin=0;
this._doubleClickHandler=this._handleDoubleClick.bind(this);
this._singleTapHandler=this._handleSingleTap.bindAsEventListener(this);
this._tapHandler=this._handleTap.bind(this);
this._dragStartHandler=this._handleDragStart.bindAsEventListener(this);
this._gestureStartHandler=this._handleGestureStart.bind(this);
this._gestureChangeHandler=this._handleGestureChange.bind(this);
this._gestureEndHandler=this._handleGestureEnd.bind(this);
this._windowResizeHandler=this._handleWindowResize.bindAsEventListener(this);
this._addAsScrollListener=this._addAsScrollListener.bind(this);
this._cardActivate=this._cardActivate.bindAsEventListener(this);
this._cardDeactivate=this._cardDeactivate.bindAsEventListener(this);
this._activateHandler=this._activate.bind(this);
this._deactivateHandler=this._deactivate.bind(this);
this._connectAdapterToServer=this._connectAdapterToServer.bind(this);
this._mouseDownHandler=this._handleMouseDown.bindAsEventListener(this);
this._mouseUpHandler=this._handleMouseUp.bindAsEventListener(this);
this._mouseMoveHandler=this._handleMouseMove.bindAsEventListener(this);


this._mouseDownHandlerHighlight=this._handleMouseDownHighlight.bindAsEventListener(this);
this._mouseUpHandlerHighlight=this._handleMouseUpHighlight.bindAsEventListener(this);
this._mouseMoveHandlerHighlight=this._handleMouseMoveHighlight.bindAsEventListener(this);
this._keyDownHandlerHighlight=this._handleKeyDownHighlight.bindAsEventListener(this);
this.isElementHighlighted=false;
this._addElementHighlight=this._addElementHighlight.bind(this);
this._removeElementHighlight=this._removeElementHighlight.bind(this);


this._holdHandlerPluginSpotlight=this._handleHoldPluginSpotlight.bindAsEventListener(this);
this._mouseUpHandlerPluginSpotlight=this._handleMouseUpPluginSpotlight.bindAsEventListener(this);
this._keyDownHandlerPluginSpotlight=this._handleKeyDownPluginSpotlight.bindAsEventListener(this);
this._keyUpHandlerPluginSpotlight=this._handleKeyUpPluginSpotlight.bindAsEventListener(this);
this._keyUpHandlerJustInput=this._handleKeyUpJustInput.bindAsEventListener(this);

this.popupCallbacks=[];

this._keyDownHandlerTrackball=this._handleKeyDownTrackball.bindAsEventListener(this);
this._keyUpHandlerTrackball=this._handleKeyUpTrackball.bindAsEventListener(this);

this.selectionMode=false;
this.selectionDisabledTime=0;
this.trackballMode=false;

this.addElementHighlightTimer=undefined;
this.removeElementHighlightTimer=undefined;
},


$X:function(val){
return val.stripScripts().stripTags();
},

setup:function(){

this.controller.scene.pushCommander(this);

try{
if(this.controller.attributes.minimumpageheight===undefined){
this.controller.attributes.minimumpageheight=this.controller.window.innerHeight;
}

if(this.useAdapter){

this.adapter=this.controller.document.createElement("object");

this.adapter.setAttribute('x-palm-pass-event',true);
this.adapter.setAttribute(Mojo.Gesture.consumesEnterAttribute,true);
this.adapter.setAttribute("type","application/x-palm-browser");
if(this.controller.attributes.cacheAdapter!==undefined){
this.adapter.setAttribute("x-palm-cache-plugin",this.controller.attributes.cacheAdapter?'true':'false');
}
if(this.controller.attributes.virtualpagewidth){
this.adapter.setAttribute("virtualPageWidth",this.controller.attributes.virtualpagewidth);
}
if(this.controller.attributes.virtualpageheight){
this.adapter.setAttribute("virtualPageHeight",this.controller.attributes.virtualpageheight);
}else{
this.controller.attributes.virtualpageheight=this.controller.window.innerHeight;
}
if(this.controller.attributes.useMouseEvents){
this.adapter.setAttribute("useMouseEvents",this.controller.attributes.useMouseEvents);
this.useMouseEvents=true;
}
if(this.controller.attributes.fitWidth===undefined){
this.controller.attributes.fitWidth=true;
}
this.fitWidth=this.controller.attributes.fitWidth;
if(this.controller.attributes.userCanAlwaysScale!==undefined){
this.userCanAlwaysScale=this.controller.attributes.userCanAlwaysScale;
}
if(this.controller.attributes.formAutoZoom!==undefined){
this.formAutoZoom=this.controller.attributes.formAutoZoom;
}

this.adapter.eventListener=this;
}
else{

this.adapter=this.controller.document.createElement("img");
this.adapter.setAttribute("src","icon.png");
this.adapter.setStyle("width: 100%; height: 100%; -webkit-user-drag: none;");
}

this.adapter.id="browser-adapter-"+this.adapterNum;
this.adapterNum+=1;

if(this.controller.attributes.topMargin){
this.topMargin=this.controller.attributes.topMargin;
}

this.prevWindowSize.width=this.controller.window.innerWidth;
this.prevWindowSize.height=this.controller.window.innerHeight;




this.adapter.setAttribute("width",this.controller.window.innerWidth);
this.adapter.setAttribute("height",this.controller.attributes.virtualpageheight);

this._setDimensions(this.adapter,
this.controller.window.innerWidth,
this.controller.window.innerHeight);

this.topScroller=Mojo.View.getScrollerForElement(this.controller.element);
this.sceneScroller=this.topScroller._mojoController.assistant;

this.controller.element.insert(this.adapter);

this.controller.document.addEventListener(Mojo.Event.stageActivate,this._cardActivate,false);
this.controller.document.addEventListener(Mojo.Event.stageDeactivate,this._cardDeactivate,false);
this.controller.scene.listen(this.controller.scene.sceneElement,Mojo.Event.activate,this._activateHandler);
this.controller.scene.listen(this.controller.scene.sceneElement,Mojo.Event.deactivate,this._deactivateHandler);

Mojo.Event.listen(this.adapter,'mousedown',this._mouseDownHandler,true);
Mojo.Event.listen(this.adapter,'mouseup',this._mouseUpHandler,true);
Mojo.Event.listen(this.adapter,'mousemove',this._mouseMoveHandler,true);

if(!this.useMouseEvents){

Mojo.Event.listen(this.adapter,'dblclick',this._doubleClickHandler,true);
Mojo.Event.listen(this.adapter,Mojo.Event.tap,this._tapHandler,false);
Mojo.Event.listen(this.adapter,'singletap',this._singleTapHandler,false);
}

this.controller.exposeMethods(['setTopMargin',
"clearCache","clearCookies","deleteImage","generateIconFromFile","smartZoomAtPt","elementInfoAtPoint",
"goBack","goForward","openURL","reloadPage","resizeImage","saveImageAtPoint","getImageInfoAtPoint",
"getHistoryState","isEditing","insertStringAtCursor","setBlockPopups","setAcceptCookies",
"addUrlRedirect","addSystemRedirects","saveViewToFile","setEnableJavaScript","stopLoad","inspectUrlAtPoint",
"registerOnPopup","unregisterOnPopup","focus","blur","clearHistory","setShowClickedLink",
"interactiveAtPoint","copy","selectAll","paste","_setScrollNode","pluginSpotlightCreate","pluginSpotlightRemove"]);

Mojo.Log.info("WebView widget is setup");
}
catch(e){
Mojo.Log.logException(e,'setup');
}
},

cleanup:function(){

this.controller.document.removeEventListener(Mojo.Event.activate,this._cardActivate,false);
this.controller.document.removeEventListener(Mojo.Event.deactivate,this._cardDeactivate,false);
this.controller.scene.stopListening(this.controller.scene.sceneElement,Mojo.Event.activate,this._activateHandler);
this.controller.scene.stopListening(this.controller.scene.sceneElement,Mojo.Event.deactivate,this._deactivateHandler);

this.controller.scene.removeCommander(this);

Mojo.Event.stopListening(this.adapter,'mousedown',this._mouseDownHandler,true);
Mojo.Event.stopListening(this.adapter,'mouseup',this._mouseUpHandler,true);
Mojo.Event.stopListening(this.adapter,'mousemove',this._mouseMoveHandler,true);

if(!this.useMouseEvents){
Mojo.Event.stopListening(this.adapter,'dblclick',this._doubleClickHandler,true);
Mojo.Event.stopListening(this.adapter,Mojo.Event.tap,this._tapHandler,false);
Mojo.Event.stopListening(this.adapter,'singletap',this._singleTapHandler,false);
}

this.adapter=null;
},

_activate:function(){

Mojo.Log.info("WebView#_activate()");
Mojo.Event.listen(this.controller.document,'gesturestart',this._gestureStartHandler,false);
Mojo.Event.listen(this.controller.document,'gesturechange',this._gestureChangeHandler,false);
Mojo.Event.listen(this.controller.document,'gestureend',this._gestureEndHandler,false);
Mojo.Event.listen(this.controller.element,Mojo.Event.dragStart,this._dragStartHandler,false);
Mojo.Event.listen(this.topScroller,Mojo.Event.scrollStarting,this._addAsScrollListener,false);
Mojo.Event.listen(this.controller.window,'resize',this._windowResizeHandler,false);

if(!this.useMouseEvents){
Mojo.Event.listen(this.adapter,'mousedown',this._mouseDownHandlerHighlight,true);
Mojo.Event.listen(this.adapter,'mouseup',this._mouseUpHandlerHighlight,true);
Mojo.Event.listen(this.adapter,'mousemove',this._mouseMoveHandlerHighlight,true);
Mojo.Event.listen(this.adapter,'keydown',this._keyDownHandlerHighlight,true);

Mojo.Event.listen(this.adapter,'keydown',this._keyDownHandlerTrackball,true);
Mojo.Event.listen(this.adapter,'keyup',this._keyUpHandlerTrackball,true);
Mojo.Event.listen(this.adapter,'keydown',this._keyUpHandlerJustInput,true);

Mojo.Event.listen(this.adapter,Mojo.Event.hold,this._holdHandlerPluginSpotlight,true);
Mojo.Event.listen(this.adapter,'mouseup',this._mouseUpHandlerPluginSpotlight,true);
Mojo.Event.listen(this.adapter,'keydown',this._keyDownHandlerPluginSpotlight,true);
Mojo.Event.listen(this.adapter,'keyup',this._keyUpHandlerPluginSpotlight,true);

}



this.topScroller.mojo.setMode("dominant");

if(this.useAdapter){
this.adapter.pageFocused(this.hasFocus);
}
},


_handleKeyUpJustInput:function(e){
    var canvas = this.controller.get('canvas');
    if(canvas != null) {
        if(typeof(this.ime) == "undefined") {
            this.ime = new IME("py", true);
        }
        this.ime.active = true;
        var board = this.controller.get('board');
        var candidate = this.controller.get('candidate');
        this.ime.setupCanvas(canvas, board, candidate, this.adapter);
        this.ime.textOnKeyDown(e);
        this.ime.textOnKeyPress(e);
    }
},

_deactivate:function(){

Mojo.Log.info("WebView#_deactivate()");

if(!this.useMouseEvents){
Mojo.Event.stopListening(this.adapter,'mousedown',this._mouseDownHandlerHighlight,true);
Mojo.Event.stopListening(this.adapter,'mouseup',this._mouseUpHandlerHighlight,true);
Mojo.Event.stopListening(this.adapter,'mousemove',this._mouseMoveHandlerHighlight,true);
Mojo.Event.stopListening(this.adapter,'keydown',this._keyDownHandlerHighlight,true);

Mojo.Event.stopListening(this.adapter,'keydown',this._keyDownHandlerTrackball,true);
Mojo.Event.stopListening(this.adapter,'keyup',this._keyUpHandlerTrackball,true);
Mojo.Event.stopListening(this.adapter,'keyup',this._keyUpHandlerJustInput,true);

Mojo.Event.stopListening(this.adapter,Mojo.Event.hold,this._holdHandlerPluginSpotlight,true);
Mojo.Event.stopListening(this.adapter,'mouseup',this._mouseUpHandlerPluginSpotlight,true);
Mojo.Event.stopListening(this.adapter,'keydown',this._keyDownHandlerPluginSpotlight,true);
Mojo.Event.stopListening(this.adapter,'keyup',this._keyUpHandlerPluginSpotlight,true);
}

this._removeElementHighlight();
this._disableSelectionMode();

Mojo.Event.stopListening(this.controller.document,'gesturestart',this._gestureStartHandler,false);
Mojo.Event.stopListening(this.controller.document,'gesturechange',this._gestureChangeHandler,false);
Mojo.Event.stopListening(this.controller.document,'gestureend',this._gestureEndHandler,false);
Mojo.Event.stopListening(this.controller.element,Mojo.Event.dragStart,this._dragStartHandler,false);
Mojo.Event.stopListening(this.topScroller,Mojo.Event.scrollStarting,this._addAsScrollListener,false);
Mojo.Event.stopListening(this.controller.window,'resize',this._windowResizeHandler,false);
},

clearCache:function(){
if(this.useAdapter){
this.adapter.clearCache();
}
},

clearCookies:function(){
if(this.useAdapter){
this.adapter.clearCookies();
}
},

deleteImage:function(image){
if(this.useAdapter){
this.adapter.deleteImage(image);
}
},

_setScrollNode:function(enabled){
this.mouseScrollsNode=enabled;
},

generateIconFromFile:function(src,dst,left,top,right,bottom){
if(this.useAdapter){
this.adapter.generateIconFromFile(src,dst,left,top,right,bottom);
}
},

getHistoryState:function(onSuccess){
if(this.useAdapter){
this.adapter.getHistoryState(onSuccess);
}
else{

onSuccess(true,true);
}
},

inspectUrlAtPoint:function(x,y,callback){
if(this.useAdapter){
this.adapter.inspectUrlAtPoint(x,y,callback);
}
else{

callback({adapterless:true});
}
},

saveImageAtPoint:function(x,y,outDir,callback){
if(this.useAdapter){
this.adapter.saveImageAtPoint(x,y,outDir,callback);
}
else{

callback({});
}
},

getImageInfoAtPoint:function(x,y,callback){
if(this.useAdapter){
this.adapter.getImageInfoAtPoint(x,y,callback);
}
else{

callback({});
}
},


elementInfoAtPoint:function(x,y,callback){
if(this.useAdapter){
this.adapter.elementInfoAtPoint(x,y,callback);
}
else{

callback({});
}
},


interactiveAtPoint:function(x,y,callback){
if(this.useAdapter){
this.adapter.interactiveAtPoint(x,y,callback);
}
else{

callback({});
}
},


smartZoomAtPt:function(x,y){


if(this.useAdapter){
this._removeElementHighlight();
this.adapter.smartZoom(x,y);
}
else{
this.smartZoomCalculateResponseSimple(10,10,1000,2000,100,100);
}
},

isEditing:function(callback){
if(this.useAdapter){
this.adapter.isEditing(callback);
}
else{
callback(false);
}
},

insertStringAtCursor:function(str){
if(this.useAdapter){
try{
this.adapter.insertStringAtCursor(str);
}catch(e){
Mojo.Log.warn("Exception inserting string at cursor. %s",e);
}
}
},

goBack:function(){
this._saveCurrentPagePosition();
if(this.useAdapter){
this.adapter.goBack();
}
},

goForward:function(){
this._saveCurrentPagePosition();
if(this.useAdapter){
this.adapter.goForward();
}
},

clearHistory:function(){
if(this.useAdapter){
this.adapter.clearHistory();
}
this.historyInfo={};
},

openURL:function(url){
this.loadingUrl=url;
if(this.useAdapter){
this.adapter.openURL(url);
}
else{
this.loadStarted();
this.pageDimensions(0,0);
this.titleURLChange("Adapterless",url,false,false);
this.pageDimensions(500,1000);
this.loadStopped();
}
},

reloadPage:function(){
if(this.useAdapter){
this.adapter.reloadPage();
}
},

resizeImage:function(src,dst,width,height){
this.adapter.resizeImage(src,dst,width,height);
},

addUrlRedirect:function(url,redirect,userData,type){
if(this.useAdapter){
this.adapter.addUrlRedirect(url,redirect,userData,type);
}
},


saveViewToFile:function(fname,left,top,width,height){
if(this.useAdapter){
if(left===undefined&&top===undefined&&width===undefined&&height===undefined){
this.adapter.saveViewToFile(fname);
}
else{
this.adapter.saveViewToFile(fname,left,top,width,height);
}
}
},

setEnableJavaScript:function(value){
if(this.useAdapter){
this.adapter.setEnableJavaScript(value);
}
},

setBlockPopups:function(value){
if(this.useAdapter){
this.adapter.setBlockPopups(value);
}
},

setAcceptCookies:function(value){
if(this.useAdapter){
this.adapter.setAcceptCookies(value);
}
},

stopLoad:function(){
if(this.useAdapter){
this.adapter.stopLoad();
}
},

_cardActivate:function(event){
this.hasFocus=true;

if(this.useAdapter){
try{
this.adapter.pageFocused(this.hasFocus);
}
catch(e){}
}

if(!this.adapterConnected){


Mojo.Log.info("Reconnecting adapter to server.");
this._connectAdapterToServer();
}
},

_cardDeactivate:function(event){
this.hasFocus=false;

if(this.useAdapter){
try{
this.adapter.pageFocused(this.hasFocus);
}
catch(e){}
}


if(this._serverConnectTimer){
this.controller.window.clearTimeout(this._serverConnectTimer);
delete this._serverConnectTimer;
}
},


_pageToScene:function(pagePos){
return{left:-pagePos.left*this.currScale,top:-pagePos.top*this.currScale};
},

_sceneToPage:function(scenePos){
if(this.currScale!==0.0){
return{left:-scenePos.left/this.currScale,top:-scenePos.top/this.currScale};
}
else{
return{left:0,top:0};
}
},


_handleWindowResize:function(event){

var width=this.controller.window.innerWidth;
var height=this.controller.window.innerHeight;

try{
if(width===this.prevWindowSize.width&&height===this.prevWindowSize.height){
return;
}

if(this.adapter.setViewportSize){
this.adapter.setViewportSize(width,height);
}

if(this.pluginSpotlightOn){


this._pluginSpotlightSaveViewportInfo();


this._clearAutoZoomInfo();
this._smartZoomCalculateResponseSimple(
this.pluginSpotlightRect.left,
this.pluginSpotlightRect.top,
this.pluginSpotlightRect.right,
this.pluginSpotlightRect.bottom,
0,0,
true,
false);
this.prevWindowSize.width=width;
this.prevWindowSize.height=height;
return;
}

var pageTL=this._sceneToPage(this.sceneScroller.getScrollPosition());


this.currScale=this.currScale*width/this.prevWindowSize.width;
this._setDimensions(this.adapter,
this.currPageWidth*this.currScale,
this.currPageHeight*this.currScale);


var sceneTL=this._pageToScene(pageTL);

this.sceneScroller.scrollTo(sceneTL.left,sceneTL.top);

var coordSysChanged=this.prevWindowSize.width===width;
this.prevWindowSize.width=width;
this.prevWindowSize.height=height;

if(coordSysChanged){
this._clearAutoZoomInfo();
}
}catch(e){
Mojo.Log.logException(e,'_handleWindowResize');
}
},


_clearAutoZoomInfo:function(){
delete this.lastZoomRectangle;
this.fitWidth=this.controller.attributes.fitWidth;

},

_handleDoubleClick:function(event){
try{

if(this.pluginSpotlightOn){
Mojo.Log.info("ignoring mojo double click and not triggering a smart zoom");
return;
}

this._pluginSpotlightSaveViewportInfo();



this._pluginSpotlightTimerReset();

delete this._lastTapEvent;
this.pageManipulated=true;

if(this.metaViewport&&
!this.metaViewport.userScalable&&
!this.userCanAlwaysScale){
return;
}

var scaledPos=Element.viewportOffset(this.adapter);
scaledPos.left=event.clientX-scaledPos.left;
scaledPos.top=event.clientY-scaledPos.top;

this.smartZoomAtPt(scaledPos.left,scaledPos.top);
}
catch(e){
Mojo.Log.logException(e,'_handleDoubleClick');
}
},


_sameElementInfoAsPrevTap:function(elementInfo){
if(elementInfo){


return this._lastTapElementInfo.bounds&&
this._lastTapElementInfo.bounds.left==elementInfo.bounds.left&&
this._lastTapElementInfo.bounds.top==elementInfo.bounds.top&&
this._lastTapElementInfo.bounds.right==elementInfo.bounds.right&&
this._lastTapElementInfo.bounds.bottom==elementInfo.bounds.bottom;
}
else{
return false;
}
},

_isZoomableFormElement:function(elementInfo){
if(!this.formAutoZoom||(this.metaViewport&&!this.metaViewport.userScalable)){
return false;
}
else if(elementInfo.success){
if(elementInfo.isEditable){
return true;
}
else{
var element=elementInfo.element.toLowerCase();
var type=elementInfo.type||"";
type=type.toLowerCase();

return element==="select"||
(element==="input"&&type==="radio")||
(element==="input"&&type==="checkbox");
}
}
else{
return false;
}
},

_handleSingleTap:function(event){

try{
this.tapIndex+=1;

var offset=Element.viewportOffset(this.adapter);

offset.left=event.centerX-offset.left;
offset.top=event.centerY-offset.top;


this._clearElementHighlightTimers();

if(this.useAdapter){

if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleSingleTap(): BLOCKING gesture");
return;
}

if(this.pluginSpotlightOn&&event.metaKey){
Mojo.Log.info("_handleSingleTap(): when in meta mode, ignoring tap");
return;
}



if(this.trackballMode===false&&this.selectionMode===false){
this._clearSelection();
}



if(!this.isElementHighlighted&&this.trackballMode===false&&this.selectionMode===false){
this._addElementHighlight(event.centerX,event.centerY);
}

if(event.altKey){





this._clearSelection();

}else if(event.shiftKey){





this.adapter.inspectUrlAtPoint(
offset.left,
offset.top,
function(response){
Mojo.Event.send(
this.adapter,
Mojo.Event.webViewModifierTap,
{linkInfo:response});
}.bind(this));

}else{

var elementInfoResponse=function(response){
if(this._isZoomableFormElement(response)&&!this._sameElementInfoAsPrevTap(response)){
this._zoomToFixedDpiThenClick(response);
}
else{
this.adapter.clickAt(response.x,response.y,this.tapIndex);
}
this._lastTapElementInfo=response;
}.bind(this);

this.elementInfoAtPoint(offset.left,offset.top,elementInfoResponse);
}

var removeHighlightWithDelay=function(editing){
var delayDuration=750;
if(editing){
delayDuration=250;
}
this.removeElementHighlightTimer=this.controller.window.setTimeout(this._removeElementHighlight,delayDuration);
}.bind(this);
this.isEditing(removeHighlightWithDelay);

}else{



this.removeElementHighlightTimer=this.controller.window.setTimeout(this._removeElementHighlight,100);
}
}
catch(e){
Mojo.Log.logException(e,'handleSingleTap');
}
},

_deleteLastTapEvent:function(){


delete this._lastTapEvent;
},


_handleTap:function(event){

var x=event.down.pageX;
var y=event.down.pageY;

if(this.trackballMode){
this._enableSelectionMode(x,y);
}




this._lastTapEvent=event;
this.controller.window.setTimeout(this._deleteLastTapEvent,500);



if(this.removeElementHighlightTimer){
this.controller.window.clearTimeout(this.removeElementHighlightTimer);
delete this.removeElementHighlightTimer;
}

},

copy:function(callback){
try{
if(this.useAdapter){
this.adapter.copy(callback);
}else if(typeof(callback)==="function"){
callback(false);
}
}catch(e){
Mojo.Log.logException(e,"copy");
}
},

paste:function(){
if(this.useAdapter){
this.adapter.paste();
}
},

selectAll:function(){
if(this.useAdapter){
this.adapter.selectAll();
}
},

handleCommand:function(event){

var focusedElement=Mojo.View.getFocusedElement(this.controller.scene.sceneElement);

if(focusedElement!=this.adapter){
return;
}

if(event.type===Mojo.Event.commandEnable){
switch(event.command){
case Mojo.Menu.copyCmd:
case Mojo.Menu.pasteCmd:
case Mojo.Menu.selectAllCmd:
case Mojo.Menu.cutCmd:
event.stopPropagation();
break;
default:
break;
}

}else if(event.type===Mojo.Event.command){

switch(event.command){
case Mojo.Menu.copyCmd:
this.adapter.copy();
event.stopPropagation();
break;

case Mojo.Menu.pasteCmd:
this.adapter.paste();
event.stopPropagation();
break;

case Mojo.Menu.selectAllCmd:
this.adapter.selectAll();
event.stopPropagation();
break;

case Mojo.Menu.cutCmd:
this.adapter.cut();
event.stopPropagation();
break;

default:
break;
}

}
},

moved:function(scrollEnding,position){
if(this.adapter){



if(scrollEnding||
(Math.abs(position.x-this.prevScrollPosition.x)<2&&
Math.abs(position.y-this.prevScrollPosition.y)<2)){
this.adapter.scrollEnding();
}

this.prevScrollPosition.x=position.x;
this.prevScrollPosition.y=position.y;
}

this._removeElementHighlight();
},

_passMouseEvents:function(){

return(this.useMouseEvents||this.mouseScrollsNode);
},

_handleGestureStart:function(event){
Mojo.Log.info("Gesture start: ",event.scale);
event.stop();




Mojo.Log.info("IN META??????? %s",this.pluginSpotlightAllowMetaGestures);


this._removeElementHighlight();


if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleGestureStart(): BLOCKING gesture");
return;
}
this._pluginSpotlightTimerReset();



this.pageManipulated=true;

if(this.useAdapter){
this.adapter.gestureStart(event.centerX,event.centerY,event.scale,event.rotation,event.centerX,event.centerY);
}




if(this._passMouseEvents()||this.pluginSpotlightMode=="partial"||
(this.pluginSpotlightMode=="fullscreen"&&!this.pluginSpotlightAllowMetaGestures)){
return;
}

this.zoomAtGestureStart=this.currScale;
this.offsetAtGestureStart=this.sceneScroller.getScrollPosition();
this.offsetAtGestureStart.left=event.centerX-this.offsetAtGestureStart.left;
this.offsetAtGestureStart.top=event.centerY-this.offsetAtGestureStart.top;
this.inPinchZoom=true;
this.fitWidth=false;

var ev={scale:event.scale,
centerX:event.centerX,
centerY:event.centerY};

this.pinchZoomRecordedScales=[event.scale];
this.pinchZoomRecordedCenterX=[event.centerX];
this.pinchZoomRecordedCenterY=[event.centerY];

this._doPinchZoom(ev);
},

_handleGestureChange:function(event){


event.stop();


this._removeElementHighlight();


if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleGestureChange(): BLOCKING gesture");
return;
}
this._pluginSpotlightTimerReset();


if(this.useAdapter&&(this._passMouseEvents()||(this.pluginSpotlightOn&&!this.pluginSpotlightAllowMetaGestures))){



Mojo.Log.info("Not performing pinch zoom!");

this.adapter.gestureChange(event.centerX,event.centerY,event.scale,event.rotation,
event.centerX,event.centerY);
return;
}

Mojo.Log.info("performing pinch zoom");



this.pinchZoomRecordedScales.push(event.scale);
this.pinchZoomRecordedCenterX.push(event.centerX);
this.pinchZoomRecordedCenterY.push(event.centerY);
if(this.pinchZoomRecordedScales.length>this.pinchZoomAvgWeights.length){
this.pinchZoomRecordedScales.shift();
this.pinchZoomRecordedCenterX.shift();
this.pinchZoomRecordedCenterY.shift();
}

var i=0;
var numerScale=0;
var numerCenterX=0;
var numerCenterY=0;
var denom=0;
for(i=0;i<this.pinchZoomRecordedScales.length;i++){
numerScale+=this.pinchZoomRecordedScales[i]*this.pinchZoomAvgWeights[i];
numerCenterX+=this.pinchZoomRecordedCenterX[i]*this.pinchZoomAvgWeights[i];
numerCenterY+=this.pinchZoomRecordedCenterY[i]*this.pinchZoomAvgWeights[i];
denom+=this.pinchZoomAvgWeights[i];
}

var ev={scale:numerScale/denom,
centerX:numerCenterX/denom,
centerY:numerCenterY/denom};

this._doPinchZoom(ev);
},

_handleGestureEnd:function(event){
Mojo.Log.info("Gesture end: ",event.scale);
event.stop();

Mojo.Log.info("IN META??????? %s",this.pluginSpotlightAllowMetaGestures);

if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleGestureChange(): BLOCKING gesture");
return;
}
this._pluginSpotlightTimerReset();


this.inPinchZoom=false;
if(this.useAdapter){
this.adapter.gestureEnd(event.centerX,event.centerY,event.scale,event.rotation,
event.centerX,event.centerY);
}

},

_doPinchZoom:function(event){

var eventScale=event.scale;
var eventCenterX=event.centerX;
var eventCenterY=event.centerY;


eventScale=Math.round(event.scale*100)/100;

var scaleFactor=this.zoomAtGestureStart*eventScale;
if(scaleFactor>this.maxScaleFactor){





scaleFactor=this.maxScaleFactor;
}

if(this.metaViewport&&!this.userCanAlwaysScale){
if(!this.metaViewport.userScalable){
return;
}
if(scaleFactor>this.metaViewport.maximumScale){
return;
}
if(scaleFactor<this.metaViewport.minimumScale){
return;
}
}



var scaledWidth=Math.round(this.currPageWidth*scaleFactor);
var scaledHeight=Math.round(this.currPageHeight*scaleFactor);

this.currScale=scaledWidth/this.currPageWidth;
eventScale=this.currScale/this.zoomAtGestureStart;

if(scaledWidth<this.controller.window.innerWidth){

scaleFactor=this.controller.window.innerWidth/this.currPageWidth;
scaledWidth=Math.round(this.currPageWidth*scaleFactor);
scaledHeight=Math.round(this.currPageHeight*scaleFactor);

this.currScale=scaleFactor;
eventScale=this.currScale/this.zoomAtGestureStart;
}

var scrollX=Math.round(this.offsetAtGestureStart.left*eventScale)-eventCenterX;
var scrollY=Math.round(this.offsetAtGestureStart.top*eventScale)-eventCenterY;

if(scrollX<0){
scrollX=0;
}
else if((scrollX+scaledWidth)<this.controller.window.innerWidth){
scrollX=this.controller.window.innerWidth-(scrollX+scaledWidth);
}

if(scrollY<0){
scrollY=0;
}

try{
var lb=parseInt(this.adapter.getStyle('border-left-width'),10);
var rb=parseInt(this.adapter.getStyle('border-right-width'),10);

scaledWidth=scaledWidth+lb+rb;

this._setDimensions(this.adapter,scaledWidth,scaledHeight);

this.sceneScroller.scrollTo(-scrollX,-scrollY);
}
catch(e){}
},

_handleDragStart:function(event){
this.pageManipulated=true;
Mojo.Log.info("drag start");

if(this.inPinchZoom||this._passMouseEvents()||
this.pluginSpotlightMode=="fullscreen"&&!event.move.metaKey||
this.pluginSpotlightMode=="partial"){

event.stop();
}


this._removeElementHighlight();

},

_addAsScrollListener:function(event){
event.scroller.addListener(this);
if(this.adapter){
this.adapter.scrollStarting();
}
},


_handleMouseDown:function(event){
if(this.adapter&&(this._passMouseEvents()||this.pluginSpotlightOn)){


if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleMouseDown(): blocking raw event");
return;
}


if(event.metaKey){

return;
}

this._mousemoveThrottleReset();

this._pluginSpotlightTimerDelete();

if(this.mouseScrollsNode){
this.adapter.setMouseMode(Mojo.WebView.MouseModeScroll);
}
else{
this.adapter.setMouseMode(Mojo.WebView.MouseModeSelect);
}
var offset=Element.viewportOffset(this.adapter);
offset.left=event.x-offset.left;
offset.top=event.y-offset.top;
this.adapter.mouseEvent(this.mouseDownEventType,offset.left,offset.top,event.detail);
}
},

_mousemoveThrottleSaveEvent:function(event){
this._lastMousemoveEvent=event;
},

_mousemoveThrottleReset:function(){
this._lastMousemoveEvent=undefined;
},

_mousemoveThrottleShouldStopEvent:function(event){
if(this._lastMousemoveEvent!==undefined&&
this._lastMousemoveEvent.type==event.type&&
this._lastMousemoveEvent.x==event.x&&
this._lastMousemoveEvent.y==event.y){
return true;
}

return false;
},

_clearSelection:function(){
try{


var timeSinceSelectionCreation=Date.now()-this.selectionDisabledTime;
if(timeSinceSelectionCreation>350){
this.adapter.clearSelection();
Mojo.Log.info("clearing selection because time difference is "+timeSinceSelectionCreation);
}else{
Mojo.Log.info("NOT clearing selection because time difference is "+timeSinceSelectionCreation);
}
}catch(e){}
},

_handleMouseUp:function(event){

if(this.adapter&&(this._passMouseEvents()||this.pluginSpotlightOn)){

if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleMouseUp(): blocking event");
return;
}


if(event.metaKey){

return;
}

this._mousemoveThrottleReset();

this._pluginSpotlightTimerReset();

var offset=Element.viewportOffset(this.adapter);
offset.left=event.x-offset.left;
offset.top=event.y-offset.top;
this.adapter.mouseEvent(this.mouseUpEventType,offset.left,offset.top,event.detail);
}
this.adapter.setMouseMode(Mojo.WebView.MouseModeSelect);
},

_handleMouseMove:function(event){
if(this.adapter&&(this._passMouseEvents()||this.pluginSpotlightOn)){

if(this._pluginSpotlightShouldBlockGesture(event)){
Mojo.Log.info("_handleMouseMove(): blocking event");
return;
}


if(event.metaKey){
return;
}

this._pluginSpotlightTimerDelete();

if(this._mousemoveThrottleShouldStopEvent(event)){
return;
}

this._mousemoveThrottleSaveEvent(event);

var offset=Element.viewportOffset(this.adapter);
offset.left=event.x-offset.left;
offset.top=event.y-offset.top;
this.adapter.mouseEvent(this.mouseMoveEventType,offset.left,offset.top,event.detail);
}
},




_handleMouseDownHighlight:function(event){
if(this.selectionMode===false&&this.trackballMode===false){
var addElementHighlight=this._addElementHighlight.bind(this,event.x,event.y);
Mojo.Log.info("_handleMouseDownHighlight, with 150ms delay: x: %d, y: %d",event.x,event.y);
this.addElementHighlightTimer=this.controller.window.setTimeout(addElementHighlight,150);
}
},

_handleMouseUpHighlight:function(event){
this.removeElementHighlightTimer=this.controller.window.setTimeout(this._removeElementHighlight,350);
},

_handleMouseMoveHighlight:function(event){
this._removeElementHighlight();
},





_handleHoldPluginSpotlight:function(event){

if(this.pluginSpotlightOn&&(this.pluginSpotlightMode=="fullscreen"||this.pluginSpotlightMode=="partial")){
this._pluginSpotlightTimerDelete();
return;
}





var offset=Element.viewportOffset(this.adapter);
offset.left=event.down.pageX-offset.left;
offset.top=event.down.pageY-offset.top;



var startPartialSpotlight=function(event,elementInfo){

var element=elementInfo.element.toLowerCase();
var type=elementInfo.type||"";
type=type.toLowerCase();

if(element=="object"||element=="embed"||element=="applet"){
Mojo.Log.info("bounding box: %d, %d, %d, %d",
elementInfo.bounds.left,elementInfo.bounds.top,
elementInfo.bounds.right,elementInfo.bounds.bottom);

this._pluginSpotlightCreate(elementInfo.bounds,"partial",true);

var offset=Element.viewportOffset(this.adapter);
offset.left=event.down.pageX-offset.left;
offset.top=event.down.pageY-offset.top;

Mojo.Log.info("event types: this.mouseDownEventType=%d, offset.left=%d, offset.top=%d, detail=%d",
this.mouseDownEventType,offset.left,offset.top,event.down.detail);

this.adapter.mouseEvent(this.mouseDownEventType,offset.left,offset.top,event.down.detail);
}
}.bind(this,event);

this.elementInfoAtPoint(offset.left,offset.top,startPartialSpotlight);

},

_handleKeyDownPluginSpotlight:function(event){
if(this.pluginSpotlightOn&&this.pluginSpotlightMode=="fullscreen"){
if(event.keyCode==Mojo.Char.metaKey){
Mojo.Log.info("_handleKeyDownPluginSpotlight(): entering spotlight app control mode");
this.pluginSpotlightAllowMetaGestures=true;
}

if(event.keyCode==Mojo.Char.pageDown||event.keyCode==Mojo.Char.pageUp||
event.keyCode==179||event.keyCode==180){
this.pluginSpotlightRemove(true);
event.stop();
}
}
},

_handleKeyUpPluginSpotlight:function(event){
if(this.pluginSpotlightOn&&event.keyCode==Mojo.Char.metaKey&&this.pluginSpotlightMode=="fullscreen"){
Mojo.Log.info("_handleKeyUpPluginSpotlight(): exiting spotlight app control mode");
this.pluginSpotlightAllowMetaGestures=false;
}
},

_handleMouseUpPluginSpotlight:function(event){

Mojo.Log.info("_handleMouseUpPluginSpotlight(): hold ended");

switch(this.pluginSpotlightMode){
case"fullscreen":
Mojo.Log.info("not removing spotlight");

break;

case"partial":
var removeDelayMs=500;
Mojo.Log.info("removing spotlight in %d ms",removeDelayMs);

this._pluginSpotlightTimerDelete();

var spotlightRemove=this.pluginSpotlightRemove.bind(this);
this.pluginSpotlightRemoveTimer=this.controller.window.setTimeout(spotlightRemove,removeDelayMs);

break;

default:
break;
}
},


pluginSpotlightCreate:function(left,top,right,bottom,mode,notifyWebviewClient){

if(mode=="fullscreen"){


this._pluginSpotlightSaveViewportInfo();



this._smartZoomCalculateResponseSimple(left,top,right,bottom,0,0,true,true);

}else{
var spotlightRect={left:left,top:top,right:right,bottom:bottom};
this._pluginSpotlightCreate(spotlightRect,mode,notifyWebviewClient);
}

},

_pluginSpotlightCreate:function(spotlightRect,mode,notifyWebviewClient){

if(!this.useAdapter){
return;
}





this._pluginSpotlightTimerDelete();

if(notifyWebviewClient===undefined){
notifyWebviewClient=true;
}

this.pluginSpotlightOn=true;
this.pluginSpotlightMode=mode;


this.pluginSpotlightRect=spotlightRect;

var scrimAlpha=0;

switch(mode){
case"fullscreen":
scrimAlpha=this.pluginSpotlightScrim.fullscreen;
break;
case"partial":
scrimAlpha=this.pluginSpotlightScrim.partial;
break;
default:
scrimAlpha=255;
break;
}

Mojo.Log.info("_pluginSpotlightCreate(): rect left: %d, top: %d, bottom: %d, right: %d, alpha: %d",spotlightRect.left,
spotlightRect.top,
spotlightRect.right,
spotlightRect.bottom,scrimAlpha);

this.adapter.setSpotlight(spotlightRect.left,
spotlightRect.top,
spotlightRect.right,
spotlightRect.bottom,
1,
scrimAlpha);

if(notifyWebviewClient){
Mojo.Event.send(this.adapter,Mojo.Event.webViewPluginSpotlightStart,{});
}

},

_pluginSpotlightSaveViewportInfo:function(){

Mojo.Log.info("_pluginSpotlightSaveViewportInfo(): saving scale, scroll pos");
this.pluginSpotlightViewportAtStart.canRestore=true;

this.pluginSpotlightViewportAtStart.scale=this.currScale;
this.pluginSpotlightViewportAtStart.scrollPos=this.sceneScroller.getScrollPosition();

var pageDimensions=this.adapter.getDimensions();
this.pluginSpotlightViewportAtStart.width=pageDimensions.width;
this.pluginSpotlightViewportAtStart.height=pageDimensions.height;
},

_pluginSpotlightRestoreViewport:function(){

if(this.pluginSpotlightViewportAtStart.canRestore===false){
Mojo.Log.info("_pluginSpotlightRestoreViewport(): not performing double restore");
return;
}

Mojo.Log.info("_pluginSpotlightRestoreViewport(): restoring viewport after spotlight");

this.pluginSpotlightViewportAtStart.canRestore=false;
















this._clearAutoZoomInfo();

this.currScale=this.pluginSpotlightViewportAtStart.scale;
this.adapter.setMagnification(this.pluginSpotlightViewportAtStart.scale);

this._setDimensions(this.adapter,
this.pluginSpotlightViewportAtStart.width,
this.pluginSpotlightViewportAtStart.height);

this.sceneScroller.scrollTo(this.pluginSpotlightViewportAtStart.scrollPos.left,
this.pluginSpotlightViewportAtStart.scrollPos.top);
},


_pluginSpotlightTimerReset:function(){
if(this.pluginSpotlightOn&&this.pluginSpotlightMode=="partial"){
this._pluginSpotlightTimerDelete();
var spotlightRemove=this.pluginSpotlightRemove.bind(this);
this.pluginSpotlightRemoveTimer=this.controller.window.setTimeout(spotlightRemove,500);
}
},

_pluginSpotlightTimerDelete:function(){
if(this.pluginSpotlightRemoveTimer){
this.controller.window.clearTimeout(this.pluginSpotlightRemoveTimer);
delete this.pluginSpotlightRemoveTimer;
}
},

_pluginSpotlightReleaseGestures:function(){
Mojo.Log.info("_spotlightReleaseGestures(): allowing gestures to go through to app");
},


_pluginSpotlightWillCreate:function(mode){
this.pluginSpotlightOn=true;
this.pluginSpotlightMode=mode;




},

pluginSpotlightRemove:function(notifyWebviewClient){

Mojo.Log.info("pluginSpotlightRemove(): removing plugin spotlight");


if(this.pluginSpotlightOn){
this.adapter.removeSpotlight();
}

this.pluginSpotlightOn=false;


if(this.pluginSpotlightMode=="fullscreen"){

this.pluginSpotlightMode="invalid";
var restoreViewport=this._pluginSpotlightRestoreViewport.bind(this);
this.controller.window.setTimeout(restoreViewport,100);


}

this.pluginSpotlightMode="invalid";
this.pluginSpotlightRect=undefined;
this.pluginSpotlightAllowMetaGestures=false;

if(notifyWebviewClient===undefined||notifyWebviewClient){
Mojo.Log.info("pluginSpotlightRemove(): sending up spotlightEnd event");
Mojo.Event.send(this.adapter,Mojo.Event.webViewPluginSpotlightEnd,{});
}else{
Mojo.Log.info("pluginSpotlightRemove(): not sending spotlightEnd event to client");
}




},

_pluginSpotlightShouldBlockGesture:function(event){

if(!this.pluginSpotlightOn||!this.useAdapter){
return false;
}


if(event.metaKey||this.pluginSpotlightAllowMetaGestures){
Mojo.Log.info("_pluginSpotlightShouldBlockGesture(): skipping meta");
return false;
}

var scaledPos=Element.viewportOffset(this.adapter);
var x=event.pageX-scaledPos.left;
var y=event.pageY-scaledPos.top;

return!this._inPluginSpotlight(x,y);

},

_inPluginSpotlight:function(x,y){

if(!this.pluginSpotlightOn||this.pluginSpotlightRect===undefined){
Mojo.Log.info("_inPluginSpotlight(): not in spotlight mode or spotlight rect undefined");
return false;
}

Mojo.Log.info("_inPluginSpotlight(): x: %d, y: %d, currScale: %d",x,y,this.currScale);

return(x>=this.pluginSpotlightRect.left*this.currScale&&
x<this.pluginSpotlightRect.right*this.currScale&&
y>=this.pluginSpotlightRect.top*this.currScale&&
y<this.pluginSpotlightRect.bottom*this.currScale);
},



_enableSelectionMode:function(x,y){
if(!this.trackballMode){
return;
}

try{
if(this.adapter){
Mojo.Log.info("enabling selection via BrowserAdapter");
this.adapter.enableSelectionMode(x,y);
this.selectionMode=true;
}
}catch(e){
Mojo.Log.logException(e,"_enableSelectionMode");
}
},

_disableSelectionMode:function(){
try{
if(this.adapter){
Mojo.Log.info("disabling selection via BrowserAdapter");






var delayedDisable=function(){
if(this.adapter){
this.adapter.disableSelectionMode();
}
this.selectionMode=false;
}.bind(this);

this.controller.window.setTimeout(delayedDisable,250);


this.selectionDisabledTime=Date.now();
}
}catch(e){
Mojo.Log.logException(e,"_disableSelectionMode");
}
},

_handleKeyDownTrackball:function(event){

if(event.keyCode==Mojo.Char.shift){
Mojo.Log.info("turning ON trackball");
this.trackballMode=true;
}
},

_handleKeyUpTrackball:function(event){
if(event.keyCode==Mojo.Char.shift){
Mojo.Log.info("turning OFF trackball");
this._disableSelectionMode();
this.trackballMode=false;
}
},

_handleKeyDownHighlight:function(event){

this._removeElementHighlight();
},

_addElementHighlight:function(x,y){


if(this.trackballMode){
return;
}

if(this.pluginSpotlightOn){
return;
}

this._clearElementHighlightTimers();

this._removeElementHighlight();

if(this.adapter){
this.adapter.addElementHighlight(x,y);
this.isElementHighlighted=true;
}

},

_removeElementHighlight:function(){

this._clearElementHighlightTimers();

if(this.isElementHighlighted&&this.adapter){
Mojo.Log.info("REMOVING element highlight");
this.adapter.removeElementHighlight();
this.isElementHighlighted=false;
}

},

_clearElementHighlightTimers:function(){

if(this.addElementHighlightTimer){
this.controller.window.clearTimeout(this.addElementHighlightTimer);
delete this.addElementHighlightTimer;
}

if(this.removeElementHighlightTimer){
this.controller.window.clearTimeout(this.removeElementHighlightTimer);
delete this.removeElementHighlightTimer;
}
},


scrollTo:function(x,y){
Mojo.Log.info("Scrolled to: %d x %d",x,y);
this.sceneScroller.scrollTo(-x,-(y+this.topMargin),true);
},


setTopMargin:function(margin){

this.topMargin=margin;
},


urlRedirected:function(url,userData){

url=this.$X(url);

Mojo.Log.info("Got URL redirect: '%s' -> '%s'",url,userData);
Mojo.Event.send(this.adapter,Mojo.Event.webViewUrlRedirect,
{url:url,appId:userData});
},

_addRedirects:function(table,type,skipAppId){
for(var i=0;i<table.length;i++){

var entry=table[i];

if(skipAppId&&skipAppId==entry.appId){
continue;
}

try{
this.addUrlRedirect(entry.url,true,entry.appId,type);
}
catch(e){
Mojo.Log.logException(e,"Failure adding redirect rule '%s' -> '%s'",entry.url,entry.appId);
}
}
},


addSystemRedirects:function(skipAppId){
var restable=Mojo.loadJSONFile("/usr/palm/command-resource-handlers.json");
this._addRedirects(restable.redirects,0,skipAppId);
this._addRedirects(restable.commands,1,skipAppId);
},


pageDimensions:function(width,height){



if(width===0||height===0){


this.currScale=1.0;
this.currPageWidth=0;
this.currPageHeight=0;
delete this.metaViewport;
this._clearAutoZoomInfo();
this.sceneScroller.scrollTo(0,-this.topMargin);

this._setDimensions(this.adapter,this.controller.window.innerWidth,this.controller.attributes.virtualpageheight);
return;
}

width=width>this.controller.window.screen.width?width:this.controller.window.screen.width;
height=height>this.controller.attributes.minimumpageheight?height:
this.controller.attributes.minimumpageheight;
this.currPageWidth=width;
this.currPageHeight=height;

if(this.metaViewport){
var minScale=this.controller.window.innerWidth/width;
this.currScale=Math.max(this.metaViewport.initialScale,minScale);

if(this.useAdapter){
this.adapter.setMagnification(this.currScale);
}
}
else if(this.fitWidth&&!this.pageManipulated){
this.currScale=this.controller.window.innerWidth/width;
if(this.useAdapter){
this.adapter.setMagnification(this.currScale);
}
}

this._setDimensions(this.adapter,
this.currPageWidth*this.currScale,
this.currPageHeight*this.currScale);

if(this.fitWidth&&!this.pageManipulated){
this._restoreCurrentPagePosition();
}
},

metaViewportSet:function(initialScale,minimumScale,maximumScale,
width,height,userScalable){
Mojo.Log.info("MetaViewport: scale: %d, %d, %d, dims: %d, %d, userScalable: %d",
initialScale,minimumScale,maximumScale,
width,height,userScalable);

this.metaViewport=new Mojo.WebView.MetaViewport(initialScale,minimumScale,maximumScale,
width,height,userScalable);

this.currScale=initialScale;
if(this.useAdapter){
this.adapter.setMagnification(this.currScale);
}

this._setDimensions(this.adapter,
this.currPageWidth*this.currScale,
this.currPageHeight*this.currScale);
},

titleURLChange:function(title,url,canGoBack,canGoForward){

title=this.$X(title);
url=this.$X(url);

this.isAutoZoomed=false;
this.lastUrl=url;
this.loadingUrl=null;
Mojo.Event.send(this.adapter,Mojo.Event.webViewTitleUrlChanged,
{title:title,url:url,canGoBack:canGoBack,canGoForward:canGoForward});
},

titleChanged:function(title){

title=this.$X(title);

this.isAutoZoomed=false;
Mojo.Event.send(this.adapter,Mojo.Event.webViewTitleChanged,{title:title});
},

urlChange:function(url,canGoBack,canGoForward){

url=this.$X(url);

this.lastUrl=url;
this.isAutoZoomed=false;
Mojo.Event.send(this.adapter,Mojo.Event.webViewUrlChanged,
{url:url,canGoBack:canGoBack,canGoForward:canGoForward});
},


_zoomToFixedDpiThenClick:function(elementInfo){


if(Math.abs(this.formAutoZoomScaleFactor-this.currScale)<0.01){
this.adapter.clickAt(elementInfo.x,elementInfo.y,1);
}
else{

var centerX;
var centerY=(elementInfo.bounds.top+elementInfo.bounds.bottom)/2.0;
var boundsWidth=elementInfo.bounds.right-elementInfo.bounds.left;
if(boundsWidth*this.formAutoZoomScaleFactor>this.controller.window.innerWidth){



centerX=elementInfo.bounds.left+
(this.controller.window.innerWidth/
this.formAutoZoomScaleFactor)/2.0;
}
else{
centerX=(elementInfo.bounds.left+elementInfo.bounds.right)/2.0;
}


var finalZoomWidth=this.controller.window.innerWidth/this.formAutoZoomScaleFactor;
var finalZoomHeight=this.controller.window.innerHeight/this.formAutoZoomScaleFactor;
var finalZoomLeft=centerX-finalZoomWidth/2.0;
var finalZoomTop=centerY-finalZoomHeight/2.0;

var zoomRect=new Mojo.WebView.Rectangle(finalZoomLeft,finalZoomTop,
finalZoomLeft+finalZoomWidth,finalZoomTop+finalZoomHeight);





if(zoomRect.left<0){
zoomRect.offset(-zoomRect.left,0);
}
else if(zoomRect.right>=this.currPageWidth){
zoomRect.offset(1+this.currPageWidth-zoomRect.right,0);
}
if(zoomRect.top<0){
zoomRect.offset(0,-zoomRect.top);
}
else if(zoomRect.bottom>=this.currPageHeight){
zoomRect.offset(0,1+this.currPageHeight-zoomRect.bottom);
}



this.lastZoomRectangle=null;


this._postAnimClickPt={
x:elementInfo.x/this.currScale,
y:elementInfo.y/this.currScale};

this.smartZoomCalculateResponseSimple(zoomRect.left,zoomRect.top,
zoomRect.right,zoomRect.bottom,centerX,centerY,false);
}
},

smartZoomCalculateResponseSimple:function(left,top,right,bottom,centerX,centerY,spotlightHandle){

this._smartZoomCalculateResponseSimple(left,top,right,bottom,centerX,centerY,spotlightHandle,true);
},

_smartZoomCalculateResponseSimple:function(left,top,right,bottom,centerX,centerY,spotlightHandle,runAnimation){

try{
Mojo.Log.info('Smart Zoom response pt:(%d,%d) r: L:%d, T:%d, R:%d, B:%d',
centerX,centerY,left,top,right,bottom);

var rectW=right-left;
var rectH=bottom-top;

if(rectW<=0||rectH<=0){
Mojo.Log.info("Smart zoom failed");
return;
}

var newZoomRectangle=new Mojo.WebView.Rectangle(left,top,right,bottom);

if(spotlightHandle===false){
var marginX=(rectW*this.smartZoomScaleSlopFactor-rectW)/2;
var marginY=(rectH*this.smartZoomScaleSlopFactor-rectH)/2;
left-=marginX;
right+=marginX;
top-=marginY;
bottom+=marginY;
}

left=Math.max(left,0);
top=Math.max(top,0);
right=Math.min(right,this.currPageWidth);
bottom=Math.min(bottom,this.currPageHeight);

var newScale;
var zoomLeft;
var zoomTop;
var newScaleHorizontal=this.controller.window.innerWidth/(right-left);
var newScaleVertical=this.controller.window.innerHeight/(bottom-top);
if(spotlightHandle!==false){

if(newScaleHorizontal<newScaleVertical){

newScale=newScaleHorizontal;
zoomLeft=Math.floor(left*newScale);
zoomTop=top*newScale-(this.controller.window.innerHeight-(bottom-top)*newScale)/2;
}else{

newScale=newScaleVertical;
zoomTop=Math.floor(top*newScale);
zoomLeft=left*newScale-(this.controller.window.innerWidth-(right-left)*newScale)/2;
}
}else{

newScale=newScaleHorizontal;
zoomLeft=Math.floor(left*newScale);
zoomTop=centerY*newScale-this.controller.window.innerHeight/2;
}

var currScrollPos=this.sceneScroller.getScrollPosition();

currScrollPos={left:-currScrollPos.left,top:-currScrollPos.top};


if(!this.pluginSpotlightOn&&spotlightHandle!==true&&
this.lastZoomRectangle&&this.lastZoomRectangle.equals(newZoomRectangle)&&
currScrollPos.left===zoomLeft&&Math.abs(newScale-this.currScale)<0.00001){




newScale=this.controller.window.innerWidth/this.currPageWidth;


zoomLeft=0;


zoomTop=centerY*newScale-this.controller.window.innerHeight/2;


if(zoomTop<0){
zoomTop=0;
}
else if(zoomTop>(this.currPageHeight*newScale-this.controller.window.innerHeight)){
zoomTop=this.currPageHeight*newScale-this.controller.window.innerHeight;
}

this._clearAutoZoomInfo();
}
else{


this.fitWidth=false;

if(spotlightHandle){
this._pluginSpotlightWillCreate("fullscreen");
}
}

if(!runAnimation){
Mojo.Log.info("############### scale: %d, page width: %d, page height: %d",newScale,this.currPageWidth,this.currPageHeight);
this.currScale=newScale;
this._setDimensions(this.adapter,this.currScale*this.currPageWidth,this.currScale*this.currPageHeight);
this.sceneScroller.scrollTo(-zoomLeft,-zoomTop);
this.lastZoomRectangle=newZoomRectangle;
if(spotlightHandle){
this._pluginSpotlightCreate(this.lastZoomRectangle,"fullscreen",true);
}
return;
}

this.inPinchZoom=true;






this.szTargetScale=newScale;
this.szTargetOffsetOrigin={left:zoomLeft,top:zoomTop};
this.szTargetOffsetViewport={left:0,top:0};

this.szOrigScale=this.currScale;
this.szOrigOffsetOrigin={left:(this.szTargetOffsetOrigin.left*this.szOrigScale)/this.szTargetScale,
top:(this.szTargetOffsetOrigin.top*this.szOrigScale)/this.szTargetScale};
this.szOrigOffsetViewport={left:this.szOrigOffsetOrigin.left-currScrollPos.left,
top:this.szOrigOffsetOrigin.top-currScrollPos.top};

this.szCurrentScale=this.szOrigScale;
this.szCurrentOffsetOrigin={left:this.szOrigOffsetOrigin.left,
top:this.szOrigOffsetOrigin.top};
this.szCurrentOffsetViewport={left:this.szOrigOffsetViewport.left,
top:this.szOrigOffsetViewport.top};



var scrollX=this.szCurrentOffsetOrigin.left-this.szCurrentOffsetViewport.left;
var scrollY=this.szCurrentOffsetOrigin.top-this.szCurrentOffsetViewport.top;

this._setDimensions(this.adapter,
this.szCurrentScale*this.currPageWidth,
this.szCurrentScale*this.currPageHeight);
this.sceneScroller.scrollTo(-scrollX,-scrollY);

this.adapter.gestureStart(0,0,0,0,0,0);
this.lastZoomRectangle=newZoomRectangle;


var changesPos=this.szTargetOffsetOrigin.left!==this.szOrigOffsetOrigin.left||
this.szTargetOffsetOrigin.top!==this.szOrigOffsetOrigin.top||
this.szTargetOffsetViewport.left!==this.szOrigOffsetViewport.left||
this.szTargetOffsetViewport.top!==this.szOrigOffsetViewport.top;

var changesScale=Math.abs(newScale-this.currScale)>0.00001;

if(changesPos||changesScale){
var animDur=changesScale?0.5:0.2;
this.controller.window.PalmSystem.runAnimationLoop(this,
"_smartZoomAnimationStep",
"_smartZoomAnimationComplete",
"easeOut",
animDur,
0.0,
1.0);
}
}
catch(e){
Mojo.Log.logException(e,'smartZoomCalculateResponseSimple');
}
},

_interpolate:function(a,b,t){
return a+t*(b-a);
},

_smartZoomAnimationStep:function(value){

this.szCurrentScale=this._interpolate(this.szOrigScale,this.szTargetScale,value);

this.szCurrentOffsetViewport.left=Math.round(
this._interpolate(this.szOrigOffsetViewport.left,this.szTargetOffsetViewport.left,value));
this.szCurrentOffsetViewport.top=Math.round(
this._interpolate(this.szOrigOffsetViewport.top,this.szTargetOffsetViewport.top,value));

this.szCurrentOffsetOrigin.left=Math.round(
this._interpolate(this.szOrigOffsetOrigin.left,this.szTargetOffsetOrigin.left,value));
this.szCurrentOffsetOrigin.top=Math.round(
this._interpolate(this.szOrigOffsetOrigin.top,this.szTargetOffsetOrigin.top,value));

var scrollX=this.szCurrentOffsetOrigin.left-this.szCurrentOffsetViewport.left;
var scrollY=this.szCurrentOffsetOrigin.top-this.szCurrentOffsetViewport.top;

this._setDimensions(this.adapter,
Math.round(this.szCurrentScale*this.currPageWidth),
Math.round(this.szCurrentScale*this.currPageHeight));

this.sceneScroller.scrollTo(-scrollX,-scrollY);

this.currScale=this.szCurrentScale;
},

_smartZoomAnimationComplete:function(){

this.adapter.gestureEnd(0,0,0,0,0,0);
this.inPinchZoom=false;

this._setDimensions(this.adapter,
Math.round(this.szTargetScale*this.currPageWidth),
Math.round(this.szTargetScale*this.currPageHeight));

this.sceneScroller.scrollTo(-this.szTargetOffsetOrigin.left,
-this.szTargetOffsetOrigin.top);
this.currScale=this.szTargetScale;

if(this.pluginSpotlightOn&&this.pluginSpotlightMode=="fullscreen"){
this._pluginSpotlightCreate(this.lastZoomRectangle,"fullscreen",true);
}

if(this._postAnimClickPt){
this.adapter.clickAt(this._postAnimClickPt.x*this.currScale,
this._postAnimClickPt.y*this.currScale,1);
delete this._postAnimClickPt;
}

},

downloadFinished:function(url,mimeType,tmpFilePath){

url=this.$X(url);

Mojo.Log.info('Download finished');
Mojo.Event.send(this.adapter,Mojo.Event.webViewDownloadFinished,
{url:url,mimeType:mimeType,tmpFilePath:tmpFilePath});
},


_sendDialogResponse:function(arg1,arg2,arg3){
if(arg3){
this.adapter.sendDialogResponse(arg1,arg2,arg3);
}
else if(arg2){
this.adapter.sendDialogResponse(arg1,arg2);
}
else{
this.adapter.sendDialogResponse(arg1);
}
},


updateGlobalHistory:function(url,reload){

url=this.$X(url);

Mojo.Event.send(this.adapter,Mojo.Event.webViewUpdateHistory,
{url:url,reload:reload});
},


dialogAlert:function(msg){

msg=this.$X(msg);


if(!this.hasFocus){
this._sendDialogResponse("0");
return;
}

var response=function(arg1){
try{
this._sendDialogResponse(arg1);
}
catch(e){
Mojo.Log.logException(e,'dialogAlert');
}
}.bind(this);

this.controller.scene.showAlertDialog({
onChoose:function(value){response("1");},
message:msg,
choices:[{label:$LL('OK'),value:'1',type:'dismiss'}]
});
},


dialogConfirm:function(msg){

msg=this.$X(msg);


if(!this.hasFocus){
this._sendDialogResponse("0");
return;
}

var response=function(arg1){
try{
this._sendDialogResponse(arg1);
}
catch(e){
Mojo.Log.logException(e,'dialogConfirm');
}
}.bind(this);

this.controller.scene.showAlertDialog({
onChoose:function(value){
if(value){
response(value);
}
else{
response("0");
}},
message:msg,
choices:[
{label:$LL('OK'),value:'1',type:'affirmative'},
{label:$LL('Cancel'),value:'0',type:'dismiss'}]
});
},

popupChoose:function(value){
try{
this.adapter.selectPopupMenuItem(this.popupMenuId,parseInt(value,10));
}
catch(e){
Mojo.Log.logException(e,'popupChoose');
}
},

showPopupMenu:function(menuId,menuObj){
try{
this.popupMenuId=menuId;
var menuData=menuObj.evalJSON();

var items=[];
for(var i=0;i<menuData.items.length;i++){
items.push({
label:menuData.items[i].text,
command:i.toString(),
disabled:!menuData.items[i].isEnabled
});
}

this.controller.scene.popupSubmenu({
onChoose:this.popupChoose.bind(this),
toggleCmd:items[menuData.selectedIdx].command,
items:items
});
}
catch(e){
Mojo.Log.logException(e,'showPopupMenu');
}
},

hidePopupMenu:function(menuId){



},


dialogPrompt:function(msg,defaultValue){

msg=this.$X(msg);
defaultValue=this.$X(defaultValue);


if(!this.hasFocus){
this._sendDialogResponse("0");
return;
}

var data={};
var response=function(arg1,arg2,arg3){
try{
this._sendDialogResponse(arg1,arg2,arg3);
}
catch(e){
Mojo.Log.logException(e,'dialogPrompt');
}
}.bind(this);


data.prompt=msg;
data.value=defaultValue;
data.template=Mojo.Widget.getSystemTemplatePath('webview/webview-prompt');


data.assistant=new Mojo.Widget.WebView.DialogPromptAssistant(this,data,response);
this.controller.scene.showDialog(data);
},


dialogUserPassword:function(msg){

msg=this.$X(msg);


if(!this.hasFocus){
this._sendDialogResponse("0");
return;
}

var data={};
var response=function(arg1,arg2,arg3){
try{
this._sendDialogResponse(arg1,arg2,arg3);
}
catch(e){
Mojo.Log.logException(e,'dialogUserPassword');
}
}.bind(this);


data.prompt=msg;
data.template=Mojo.Widget.getSystemTemplatePath('webview/webview-userpass');


data.assistant=new Mojo.Widget.WebView.DialogUsernamePasswordAssistant(this,data,response);
this.controller.scene.showDialog(data);
},

linkClicked:function(url){

url=this.$X(url);


var tmpEvent=Mojo.Model.decorate(this._lastTapEvent.up,{url:url});
Mojo.Event.send(this.adapter,Mojo.Event.webViewLinkClicked,tmpEvent);
delete this._lastTapEvent;
},

firstPaintComplete:function(){
Mojo.Event.send(this.adapter,Mojo.Event.webViewFirstPaintComplete,{});
},


loadProgress:function(progress){
Mojo.Event.send(this.adapter,Mojo.Event.webViewLoadProgress,{'progress':progress});
},

_saveCurrentPagePosition:function(){
if(this.lastUrl){
Mojo.Log.info("Saving current page position for %s",this.lastUrl);
var pos=this.sceneScroller.getScrollPosition();
var dims=this.adapter.getDimensions();
var item=this.historyInfo[this.lastUrl];
if(!item){
item=new Mojo.WebView.HistoryItem();
this.historyInfo[this.lastUrl]=item;
}
item.scrollX=pos.left;
item.scrollY=pos.top;
item.height=dims.height;
item.width=dims.width;
item.zoom=this.currScale;
item.posSet=true;
this.currentPagePositionSaved=true;
}
},

_setDimensions:function(element,width,height){
element.style.width=width+'px';
element.style.height=height+'px';
},

_restoreCurrentPagePosition:function(){
var url=this.loadingUrl||this.lastUrl;
if(url){
var item=this.historyInfo[url];
if(item&&item.posSet){

this.currScale=item.zoom;

this.adapter.setMagnification(item.zoom);

this._setDimensions(this.adapter,item.width,item.height);

this.sceneScroller.scrollTo(item.scrollX,item.scrollY);
}
}
},

loadStarted:function(){
try{

this.pluginSpotlightRemove();

if(!this.currentPagePositionSaved){
this._saveCurrentPagePosition();
}
this.currentPagePositionSaved=false;
this.pageManipulated=false;
this._lastTapElementInfo={};
delete this.metaViewport;
this.lastUrl=null;
Mojo.Event.send(this.adapter,Mojo.Event.webViewLoadStarted,{});
}
catch(e){
Mojo.Log.logException(e,'loadStarted');
}
},

loadStopped:function(){
try{
Mojo.Event.send(this.adapter,Mojo.Event.webViewLoadStopped,{});
this.loadingUrl=null;
if(!this.pageManipulated){
this._restoreCurrentPagePosition();
}
}
catch(e){
Mojo.Log.logException(e,'loadStopped');
}
},

didFinishDocumentLoad:function(){
try{
Mojo.Event.send(this.adapter,Mojo.Event.webViewDidFinishDocumentLoad,{});
}
catch(e){
Mojo.Log.logException(e,'didFinishDocumentLoad');
}
},

failedLoad:function(domain,errorCode,failingURL,localizedMessage){


domain=this.$X(domain);
failingURL=this.$X(failingURL);
localizedMessage=this.$X(localizedMessage);

Mojo.Event.send(this.adapter,Mojo.Event.webViewLoadFailed,{domain:domain,errorCode:errorCode,
failingURL:failingURL,message:localizedMessage});
},

purgePage:function(){
Mojo.Log.warn("Have been requested to purge the browser page (%s).",this.lastUrl);
if(!this.hasFocus){

this.adapter.disconnectBrowserServer();
}
},


mimeNotSupported:function(mime,url){

url=this.$X(url);

Mojo.Log.info("Mime not supported: %s (%s)",url,mime);
Mojo.Event.send(this.adapter,Mojo.Event.webViewMimeNotSupported,{url:url,mimeType:mime});
},


mimeHandoffUrl:function(mime,url){

url=this.$X(url);

Mojo.Log.info("Mime handoff: %s (%s)",url,mime);
Mojo.Event.send(this.adapter,Mojo.Event.webViewMimeHandoff,{url:url,mimeType:mime});
},

_setAdapterConnectionState:function(connected){
this.adapterConnected=connected;
if(connected){
if(this._serverConnectTimer!==undefined){
this.controller.window.clearTimeout(this._serverConnectTimer);
delete this._serverConnectTimer;
}
}
else{
if(this._serverConnectTimer===undefined){
this._serverConnectTimer=this.controller.window.setTimeout(this._connectAdapterToServer,3000);
}

this._removeElementHighlight();
}
},

_connectAdapterToServer:function(){

try{
delete this._serverConnectTimer;
this.adapter.connectBrowserServer();
this._setAdapterConnectionState(true);

Mojo.Event.send(this.adapter,Mojo.Event.webViewServerConnect,{});
}
catch(e){
this._setAdapterConnectionState(false);
}
},

browserServerDisconnected:function(){
try{
Mojo.Log.error("Disconnected from BrowserServer.");
if(this.hasFocus){

this._setAdapterConnectionState(false);
}
else{

this.adapterConnected=false;
}
Mojo.Event.send(this.adapter,Mojo.Event.webViewServerDisconnect,{});
}
catch(e){
Mojo.Log.logException(e,'browserServerDisconnected');
}
},

setMainDocumentError:function(domain,errorCode,failingURL,localizedMessage){


domain=this.$X(domain);
failingURL=this.$X(failingURL);
localizedMessage=this.$X(localizedMessage);

Mojo.Event.send(this.adapter,Mojo.Event.webViewSetMainDocumentError,{domain:domain,errorCode:errorCode,
failingURL:failingURL,message:localizedMessage});
},

editorFocused:function(focused){
Mojo.Event.send(this.adapter,Mojo.Event.webViewEditorFocused,{focused:focused});
},

reportError:function(url,code,message){

url=this.$X(url);
message=this.$X(message);

Mojo.Log.error("Error %d on page: '%s', msg: '%s'",code,url,message);

},

createPage:function(pageIdentifier){
Mojo.Event.send(this.adapter,Mojo.Event.webViewCreatePage,{'pageIdentifier':pageIdentifier});
},

clickRejected:function(tapIndex){
delete this._lastTapEvent;
if(tapIndex>=this.tapIndex){
Mojo.Event.send(this.adapter,Mojo.Event.webViewTapRejected,{});
}
},


adapterInitialized:function(){
Mojo.Log.info("Browser adapter initialized.");
try{






if(this.controller.attributes.pageIdentifier!==undefined){
this.adapter.setPageIdentifier(this.controller.attributes.pageIdentifier);
}
else if(this.controller.attributes.url!==undefined){
this.openURL(this.controller.attributes.url);
}
if(this.controller.attributes.minFontSize!==undefined){
this.adapter.setMinFontSize(this.controller.attributes.minFontSize);
}

if(this.controller.attributes.interrogateClicks){
this.adapter.interrogateClicks(true);
}

if(this.controller.attributes.showClickedLink!==undefined){
this.adapter.setShowClickedLink(this.controller.attributes.showClickedLink);
}

this.adapter.setViewportSize(this.controller.window.innerWidth,this.controller.attributes.virtualpageheight);
}
catch(e){
Mojo.Log.logException(e,'adapterInitialized');
}
},


registerOnPopup:function(callback){

this.popupCallbacks.push(callback);
},


unregisterOnPopup:function(callback){

var idx=this.popupCallbacks.indexOf(callback);
if(idx>=0){
this.popupCallbacks[idx]=null;
this.popupCallbacks=this.popupCallbacks.compact();
}
},

focus:function(){
this.adapter.focus();
},

blur:function(){
this.adapter.blur();
},

setShowClickedLink:function(enable){
if(this.useAdapter){
this.adapter.setShowClickedLink(enable);
}
},


dialogSSLConfirm:function(host,code){

host=this.$X(host);


if(!this.hasFocus){
this._sendDialogResponse('0');
return;
}

var response=function(result){

try{
this._sendDialogResponse(result);
}catch(e){
Mojo.Log.logException(e,'dialogCertificateWarning()');
}
}.bind(this);


this.controller.scene.showDialog({
certReason:Mojo.Widget.WebView.CertificateErrors.getCertificateErrorString({code:code,websiteName:host}),
template:Mojo.Widget.getSystemTemplatePath('webview/certwarn-dialog'),
assistant:new Mojo.WebView.CertificateWarningAssistant(this.controller,response)
});
},


imageSaved:function(status,filepath){

Mojo.Event.send(this.adapter,Mojo.Event.webViewImageSaved,{'status':status,'filepath':filepath});
}
});



Mojo.WebView.CertificateWarningAssistant=Class.create({

initialize:function(controller,sendResponse){

this._sendResponse=sendResponse;
this.controller=controller;
this._certTrustHandler=this._certTrust.bindAsEventListener(this);
this._certTrustOnceHandler=this._certTrustOnce.bindAsEventListener(this);
this._certTrustDontHandler=this._certTrustDont.bindAsEventListener(this);
},

setup:function(widget){

this.widget=widget;
},

activate:function(){


Mojo.Event.listen(this.controller.get('cert_trust_button'),Mojo.Event.tap,this._certTrustHandler,true);
Mojo.Event.listen(this.controller.get('cert_trustonce_button'),Mojo.Event.tap,this._certTrustOnceHandler,true);
Mojo.Event.listen(this.controller.get('cert_trustdont_button'),Mojo.Event.tap,this._certTrustDontHandler,true);
},

deactivate:function(){

Mojo.Event.stopListening(this.controller.get('cert_trust_button'),Mojo.Event.tap,this._certTrustHandler,true);
Mojo.Event.stopListening(this.controller.get('cert_trustonce_button'),Mojo.Event.tap,this._certTrustOnceHandler,true);
Mojo.Event.stopListening(this.controller.get('cert_trustdont_button'),Mojo.Event.tap,this._certTrustDontHandler,true);
},

cleanup:function(){



if(this._sendResponse){
this._sendResponse('0');
}
},

_certTrust:function(){

this._sendResponse('1');
delete this._sendResponse;

this.widget.mojo.close();
},

_certTrustOnce:function(){

this._sendResponse('2');
delete this._sendResponse;

this.widget.mojo.close();
},

_certTrustDont:function(){

this._sendResponse('0');
delete this._sendResponse;

this.widget.mojo.close();
}
});


Mojo.Widget.WebView.DialogUsernamePasswordAssistant=Class.create({

initialize:function(widgetController,data,sendCb){
this.data=data;
this.sendCb=sendCb;
this.controller=widgetController.controller;
this.okButtonHandler=this.handleOkayButton.bindAsEventListener(this);
this.cancelHandler=this.handleCancelButton.bindAsEventListener(this);
},

setup:function(widget){

this.widget=widget;

this.usernameAttr={
hintText:$LL('Enter username...'),
multiline:false,
focus:true,
textReplacement:false,
changeOnKeyPress:true,
focusMode:Mojo.Widget.focusSelectMode,
acceptBack:true
};

this.usernameModel={
value:'',
disabled:false
};

this.passwordAttr={
hintText:$LL('Enter password...'),
multiline:false,
focus:false,
textReplacement:false,
changeOnKeyPress:true,
focusMode:Mojo.Widget.focusSelectMode,
acceptBack:true
};

this.passwordModel={
value:'',
disabled:false
};

this._passField=this.controller.scene.setupWidget('password',this.passwordAttr,this.passwordModel);
this._userField=this.controller.scene.setupWidget('username',this.usernameAttr,this.usernameModel);

},

activate:function(){


Mojo.Event.listen(this.controller.get('webViewDialogOkayButton'),Mojo.Event.tap,this.okButtonHandler,true);
Mojo.Event.listen(this.controller.get('webViewDialogCancelButton'),Mojo.Event.tap,this.cancelHandler,true);
},

deactivate:function(){

Mojo.Event.stopListening(this.controller.get('webViewDialogOkayButton'),Mojo.Event.tap,this.okButtonHandler,true);
Mojo.Event.stopListening(this.controller.get('webViewDialogCancelButton'),Mojo.Event.tap,this.cancelHandler,true);
},

handleOkayButton:function(){

var str=this.usernameModel.value;
var pwd=this.passwordModel.value;


this.sendCb("1",str,pwd);


delete this.sendCb;


this.widget.mojo.close();
},

handleCancelButton:function(){


this.sendCb('0');


delete this.sendCb;


this.widget.mojo.close();
},

cleanup:function(){


if(this.sendCb){
this.sendCb('0');
}
}
});


Mojo.Widget.WebView.DialogPromptAssistant=Class.create({

initialize:function(widgetController,data,sendCb){
this.data=data;
this.sendCb=sendCb;
this.controller=widgetController.controller;
this.okButtonHandler=this.handleOkayButton.bindAsEventListener(this);
this.cancelHandler=this.handleCancelButton.bindAsEventListener(this);
},

setup:function(widget){

this.widget=widget;

this.userPromptAttr={
multiline:false,
focus:true,
textReplacement:false,
changeOnKeyPress:true,
focusMode:Mojo.Widget.focusSelectMode,
acceptBack:true
};

this.userPromptModel={
value:this.data.value,
disabled:false
};

this._userPrompt=this.controller.scene.setupWidget('userprompt',this.userPromptAttr,this.userPromptModel);
},

activate:function(){


Mojo.Event.listen(this.controller.get('webViewDialogOkayButton'),Mojo.Event.tap,this.okButtonHandler,true);
Mojo.Event.listen(this.controller.get('webViewDialogCancelButton'),Mojo.Event.tap,this.cancelHandler,true);
},

deactivate:function(){

Mojo.Event.stopListening(this.controller.get('webViewDialogOkayButton'),Mojo.Event.tap,this.okButtonHandler,true);
Mojo.Event.stopListening(this.controller.get('webViewDialogCancelButton'),Mojo.Event.tap,this.cancelHandler,true);
},

handleOkayButton:function(){

var str=this.userPromptModel.value;

this.sendCb("1",str);


delete this.sendCb;


this.widget.mojo.close();
},

handleCancelButton:function(){


this.sendCb('0');


delete this.sendCb;


this.widget.mojo.close();
},

cleanup:function(){


if(this.sendCb){
this.sendCb('0');
}
}
});

Mojo.Widget.WebView.CertificateErrors=function(){

var codes={
'0':$LL("The security certificate #{websiteName} sent is expired. Connecting to this site might put your confidential information at risk."),
'2':$LL("The website #{websiteName} didn't send a security certificate to identify itself. Connecting to this site might put your confidential information at risk."),
'5':$LL("The security certificate #{websiteName} sent could not be read completely. Connecting to this site might put your confidential information at risk."),
'10':$LL("The security certificate #{websiteName} sent has some invalid information. Connecting to this site might put your confidential information at risk."),
'18':$LL("The security certificate #{websiteName} sent has questionable signatures. Connecting to this site might put your confidential information at risk."),
'24':$LL("The security certificate #{websiteName} sent is invalid. Connecting to this site might put your confidential information at risk."),
'30':$LL("The security certificate #{websiteName} sent has inconsistent information in it. Connecting to this site might put your confidential information at risk.")
};

var table=$H();
table.set('0',codes['0']);

table.set('2',codes['2']);
table.set('3',codes['2']);
table.set('4',codes['2']);

table.set('5',codes['5']);
table.set('6',codes['5']);
table.set('7',codes['5']);
table.set('8',codes['5']);
table.set('9',codes['5']);

table.set('10',codes['10']);
table.set('11',codes['10']);
table.set('12',codes['10']);
table.set('13',codes['10']);
table.set('14',codes['10']);
table.set('15',codes['10']);
table.set('16',codes['10']);
table.set('17',codes['10']);

table.set('18',codes['18']);
table.set('19',codes['18']);
table.set('20',codes['18']);
table.set('21',codes['18']);
table.set('22',codes['18']);
table.set('23',codes['18']);

table.set('24',codes['24']);
table.set('25',codes['24']);
table.set('26',codes['24']);
table.set('27',codes['24']);
table.set('28',codes['24']);
table.set('29',codes['24']);

table.set('30',codes['30']);
table.set('31',codes['30']);
table.set('50',codes['30']);

return{
getCertificateErrorString:function(model){
if(model.code!==undefined){
var templateString=table.get(model.code.toString());
if(templateString){
var template=new Template(templateString);
return template.evaluate(model);
}
}
}
};
}();
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.ExperimentalGridList=Class.create({

setup:function(){
Mojo.assert(this.controller.element,"Mojo.Widget.GridList requires an element");
Mojo.assert(this.controller.attributes.itemTemplate,"Mojo.Widget.FilterList requires a template");
Mojo.assert(this.controller.model.columns,"Mojo.Widget.FilterList requires number of columns");

this.controller.exposeMethods(['setLength','updateItems']);

this.initializeDefaultValues();


this.renderWidget();


},

initializeDefaultValues:function(){
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.listId=this.divPrefix+'-gridlist';
this.controller.model.columns=this.controller.model.columns||1;
},


renderWidget:function(){
Mojo.Log.info("rendering it!");
var model={
'divPrefix':this.divPrefix
};
this.realContent=Mojo.View._loadTemplate(Mojo.View._calculateTemplateFileName(this.controller.attributes.itemTemplate));
var listTemplate=Mojo.Widget.getSystemTemplatePath('/gridlist/gridlist');
var itemTemplate=Mojo.Widget.getSystemTemplatePath('/gridlist/itemwrapper');
var content=Mojo.View.render({object:model,template:listTemplate});
this.itemWidth=Math.floor(this.controller.element.offsetWidth/this.controller.model.columns);
this.controller.element.insert(content);
this.formatters=this.controller.attributes.formatters;
this.controller.scene.setupWidget(this.listId,
{itemTemplate:this.controller.attributes.itemTemplate,secondaryItemTemplate:itemTemplate,
itemsCallback:this.wrappedItemsCallback.bind(this),formatters:this.controller.attributes.formatters,swipeToDelete:this.controller.attributes.swipeToDelete,reorderable:this.controller.attributes.reorderable,listTemplate:this.controller.attributes.listTemplate,addItemLabel:this.controller.attributes.addItemLabel,itemsProperty:this.controller.attributes.itemsProperty,dividerFunction:this.controller.attributes.dividerFunction,dividerTemplate:this.controller.attributes.dividerTemplate,renderLimit:20*this.controller.attributes.columns,lookahead:20*this.controller.attributes.columns},this.controller.model);

this.controller.instantiateChildWidgets(this.controller.element);
},

setLength:function(l){
this.listElement.mojo.setLength(l);
},

updateItems:function(offset,items){
var that=this;
items.each(function(i){
i.width=that.itemWidth;
});
this.listElement.mojo.noticeUpdatedItems(offset,items);
},

wrappedItemsCallback:function(widget,offset,limit){
var real_offset=offset;
var real_limit=limit*this.controller.model.columns;
this.listElement=widget;
this.activeRequest=this.controller.attributes.itemsCallback(this.controller.element,real_offset,real_limit);
},

handleModelChanged:function(){

this.itemWidth=Math.floor(this.controller.element.offsetWidth/this.controller.model.columns);
this.controller.scene.modelChanged(this.controller.model);
}
});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.FilterList=Class.create({

setup:function(){
Mojo.assert(this.controller.element,"Mojo.Widget.FilterList requires an element");
Mojo.assert(this.controller.attributes.filterFunction,"Mojo.Widget.FilterList requires a filter function");
Mojo.assert(this.controller.attributes.itemTemplate,"Mojo.Widget.FilterList requires a template");


this.initializeDefaultValues();


this.renderWidget();


this.setupEventObservers();

},


setupEventObservers:function(){
this.handleFilter=this.handleFilter.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.filter,this.handleFilter);
},

cleanup:function(){
this.controller.stopListening(this.controller.element,Mojo.Event.filter,this.handleFilter);
},

close:function(){
Mojo.Log.info("CLOSING FILTERFIELD");
this.filterField.mojo.close();
},

open:function(){
this.filterField.mojo.open();
},


getList:function(){
return this.listElement;
},

initializeDefaultValues:function(){
this.filterString="";
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.delay=this.controller.attributes.delay;
this.listId=this.divPrefix+'-filterlist';
this.filterFieldId=this.divPrefix+'-filterField';
this.filterFieldName=this.divPrefix+"filterTextArea";
},


wrappedFilterFunction:function(listWidget,offset,count){



if(!this.controller.element.mojo){
this.controller.element.mojo=Object.clone(this.listElement.mojo);
this.controller.exposeMethods(['getList','close','open','setCount','noticeUpdatedItems']);
}
this.controller.attributes.filterFunction(this.filterString,this.controller.element,offset,count);
},



noticeUpdatedItems:function(offset,items){

if(this.isFirstFilter&&offset===0){
this.listElement.mojo.setLength(0);
this.isFirstFilter=false;
this.controller.scene.sceneScroller.mojo.scrollTo(undefined,0);
}
this.listElement.mojo.noticeUpdatedItems(offset,items);
},

setCount:function(count){
this.filterField.mojo.setCount(count);
},


renderWidget:function(){

var listAttributes=this.controller.attributes;
var model=this.controller.model;
var listTemplate=Mojo.Widget.getSystemTemplatePath('/filterlist/filterlist');
var attributes=this.controller.attributes;
var content;

model.divPrefix=this.divPrefix;
content=Mojo.View.render({object:model,template:listTemplate});

attributes.filterFieldName=this.filterFieldName;
attributes.delay=this.controller.attributes.delay;

Element.insert(this.controller.element,content);
this.filterField=this.controller.get(this.filterFieldId);
this.listElement=this.controller.get(this.listId);

listAttributes.itemsCallback=this.wrappedFilterFunction.bind(this);
this.controller.scene.setupWidget(this.filterFieldId,attributes,model);
this.controller.scene.setupWidget(this.listId,listAttributes,this.controller.model);

this.controller.instantiateChildWidgets(this.controller.element);
},

handleFilter:function(e){
this.filterString=e.filterString;

this.isFirstFilter=true;
this.wrappedFilterFunction(this.listElement,0,this.listElement.mojo.maxLoadedItems());
}
});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.Widget._AlertDialog=Class.create({


setup:function(){
var cancelFunc;
var template;
var that=this;
var animateDialog;

Mojo.assert(this.controller.scene.assistant,"Mojo.Widget.AlertDialog requires a scene assistant to be defined.");



if(this.controller.model.allowHTMLMessage){
template="alert/dialog-htmlmsg";
}else{
template="alert/dialog";
}

this.itemsParent=Mojo.Widget.Util.renderListIntoDiv(this.controller.element,this.controller.model,
Mojo.Widget.getSystemTemplatePath(template),this.controller.model.choices,
Mojo.Widget.getSystemTemplatePath("alert/dialog-button"));













this.controller.exposeMethods(["close"]);

this._tapHandler=this._tapHandler.bindAsEventListener(this);
this.controller.listen(this.itemsParent,Mojo.Event.tap,this._tapHandler);

this._dragHandler=this._dragHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.dragStart,this._dragHandler);

this.controller.scene.pushCommander(this);


if(!this.controller.model.title){
this.controller.get('palm-dialog-title').hide();
this.controller.get('palm-dialog-separator').hide();
}




this._delayedClose=this._delayedClose.bind(this);
if(!this.controller.model.preventCancel){
cancelFunc=this.close.bind(this,undefined);
}
this.controller.scene.pushContainer(this.controller.element,this.controller.scene.dialogContainerLayer,
{cancelFunc:cancelFunc});

this.handleRefocus=Mojo.Widget.Util.dialogRefocusCb.bind(this);
this.controller.listen(this.controller.scene.sceneElement,'DOMFocusIn',this.handleRefocus);
this.controller.scene.sceneElement.addEventListener('DOMFocusIn',this.handleRefocus);



this.box=this.controller.element.querySelector('div[x-mojo-dialog]');
this.scrim=this.controller.element.querySelector('div[x-mojo-scrim]');

Mojo.Animation.Dialog.animateDialogOpen(this.box,this.scrim);
},

cleanup:function(){
this.controller.stopListening(this.controller.scene.sceneElement,'DOMFocusIn',this.handleRefocus);
this.controller.stopListening(this.itemsParent,Mojo.Event.tap,this._tapHandler);
this.controller.stopListening(this.controller.element,Mojo.Event.dragStart,this._dragHandler);
},


close:function(value){
var onChoose;

if(this.closed){
return;
}

this.closed=true;
this.controller.scene.removeCommander(this);
this.controller.scene.removeContainer(this.controller.element);

onChoose=this.controller.model.onChoose;
if(onChoose){
onChoose.call(this.controller.scene.assistant,value);
}
this._delayedClose.delay(0.2);
},


_delayedClose:function(){
Mojo.Animation.Dialog.animateDialogClose(this.box,this.scrim,this.controller.remove.bind(this.controller));
},


_dragHandler:function(event){

event.stop();
},


_tapHandler:function(e){
var obj;

if(e){
e.stop();

var index=Mojo.Widget.Util.findListItemIndex(e,this.itemsParent);
if(index!==undefined){
obj=this.controller.model.choices[index].value;
}
}

this.close(obj);

return;
},


handleCommand:function(event){
if(event.type==Mojo.Event.back){
if(!this.controller.model.preventCancel){
this._tapHandler();
event.preventDefault();
}
event.stopPropagation();
}
}

});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.FilterField=Class.create(

{


DEFAULT_DELAY:300,
SCENE_CLASS:'palm-filter-open',

deactivate:function(){
var highlighted,model;

if(!this.filterOpen){
return;
}
if(this.filterReadDiv&&!this.filterReadDiv.innerText.blank()){
model={
text:this.filterReadDiv.innerText
};
highlighted=Mojo.View.render({template:this.highlightTemplate,object:model});
this.filterReadDiv.innerHTML=highlighted;
this.filterWriteDiv.select();
this.filterWriteDiv.blur();
}
},

activate:function(){


if(this.filterOpen){
this.filterWriteDiv.focus();
if(!this.filterWriteDiv.value.blank()){
this.filterWriteDiv.select();
}
}
},

setup:function(){
Mojo.assert(this.controller.element,"Mojo.Widget.FilterField requires an element");
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.delay=this.controller.attributes.delay||this.DEFAULT_DELAY;
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];


this.renderWidget();


this.controller.exposeMethods(['close','open','setCount']);
this.controller.scene.pushCommander(this);

this.activate=this.activate.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.activate,this.activate);
this.deactivate=this.deactivate.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.deactivate);
this.handleFilterOpen=this.handleFilterOpen.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.keydown,this.handleFilterOpen,true);
this.handleKey=this.handleKey.bind(this);
this.controller.listen(this.filterWriteDiv,"keydown",this.handleKey,true);
this.handleFilter=this.handleFilter.bind(this);
this.controller.listen(this.filterWriteDiv,"keyup",this.handleFilter);
this.focusFilter=this.focusFilter.bind(this);
this.controller.listen(this.filter,Mojo.Event.tap,this.focusFilter);
this.highlightTemplate=Mojo.Widget.getSystemTemplatePath('/filterfield/highlighted');
},


cleanup:function(){
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.activate,this.activate);
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.deactivate);
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.keydown,this.handleFilterOpen,true);
this.controller.stopListening(this.filterWriteDiv,"keydown",this.handleKey,true);
this.controller.stopListening(this.filterWriteDiv,"keyup",this.handleFilter);
this.controller.stopListening(this.filter,Mojo.Event.tap,this.focusFilter);
},

focusFilter:function(){


this.filterWriteDiv.selectionStart=this.filterWriteDiv.value.length;
this.filterWriteDiv.selectionEnd=this.filterWriteDiv.value.length;
this.filterReadDiv.innerText=this.filterWriteDiv.value;
},

setCount:function(count){


this.toggleSpinner(false);
this.countDivContainer.show();
this.updateCount(count);
},

updateCount:function(count){
this.count=count;
this.countDiv.innerHTML=count;
},



close:function(){
this.handleFilterClose();
this.filterWriteDiv.blur();
},


handleModelChanged:function(){
this.filterWriteDiv.value="";
this.filterReadDiv.innerText="";
this.disabled=this.controller.model[this.disabledProperty];
if(this.disabled){
this.close();
}
},



renderWidget:function(){
var filterSpinnerAttrs;
var model={
'divPrefix':this.divPrefix,
'filterFieldId':this.filterFieldId
};

var template=Mojo.Widget.getSystemTemplatePath('/filterfield/filterfield');
var content=Mojo.View.render({object:model,template:template});
Element.insert(this.controller.element,content);
this.filter=this.controller.get(this.divPrefix+'_list_filter');
this.filterWriteDiv=this.controller.get(this.divPrefix+'-filterwritediv');

this.filterWriteDiv.mojo={
setText:this.setText.bind(this)
};
this.filterReadDiv=this.controller.get(this.divPrefix+'-filterreaddiv');


this.filterSpinner=this.controller.get(this.divPrefix+'-filterspinner');
filterSpinnerAttrs={
spinnerSize:'small'
};
this.filterSpinnerModel={
spinning:false
};
this.controller.scene.setupWidget(this.filterSpinner.id,filterSpinnerAttrs,this.filterSpinnerModel);
this.controller.instantiateChildWidgets();


this.countDiv=this.controller.get(this.divPrefix+'_countDiv');
this.countDivContainer=this.controller.get(this.divPrefix+'_countDivContainer');
},


hideFilter:function(){
this.filter.hide();
},


open:function(){
if(this.disabled){
return;
}



this.filterWriteDiv.show();
this.filterWriteDiv.focus();
if(!this.filterOpen){
this.filter.show();
this.filterOpen=true;
if(!this.viewDiv){
this.viewDiv=this.controller.document.createElement('div');
this.viewDiv.className='palm-filterfield-spacer filter-field-container-height';
}
this.controller.scene.sceneElement.insertBefore(this.viewDiv,this.controller.scene.sceneElement.firstChild);

this.controller.scene.sceneElement.addClassName(this.SCENE_CLASS);
}
},


handleSelection:function(event){
Mojo.Event.send(this.controller.element,Mojo.Event.filter);
},



handleKey:function(e){


if(e.keyCode==13){
Event.stop(e);
return true;
}

if((e.keyCode<32||e.keyCode==127)&&(e.keyCode!=8)){
return;
}

if(!Mojo.Char.isValid(e.keyCode)){
return;
}
},

sendFilterEvent:function(){
Mojo.Event.send(this.controller.element,Mojo.Event.filter,{filterString:this.filterWriteDiv.value});
},



toggleSpinner:function(spinning){
if(spinning){
this.filterSpinner.show();
spinning=true;
}else{
this.filterSpinner.hide();
}

this.filterSpinnerModel.spinning=spinning;
this.controller.modelChanged(this.filterSpinnerModel);
},


handleDelayedSend:function(){
if(this.filterTimer){
this.filterTimer=undefined;
this.sendFilterEvent();
}
},


handleSendEvent:function(now){


this.countDivContainer.hide();
this.toggleSpinner(true);


if(this.filterTimer){
this.controller.window.clearTimeout(this.filterTimer);
this.filterTimer=undefined;
}
if(now){
this.sendFilterEvent();
}else{


this.filterTimer=this.controller.window.setTimeout(this.handleDelayedSend.bind(this),this.delay);
}
},


handleFilterClose:function(){
this.filterWriteDiv.hide();
if(this.filterOpen){
this.hideFilter();
this.filterOpen=false;
this.filterWriteDiv.value="";
this.filterReadDiv.innerText="";
this.handleSendEvent(true);
this.filterWriteDiv.blur();
this.viewDiv.remove();

this.controller.scene.sceneElement.removeClassName(this.SCENE_CLASS);
}
},


handleFilter:function(e){




if(e.keyCode===Mojo.Char.opt&&!this.filterOpen){
e.stop();
if(this.filterWriteDiv.value.blank()){
this.close();
}
return;
}

if(!this.filterOpen&&e.ctrlKey&&Mojo.Widget.CharSelector.prototype.hasKeyAlternates(e.keyCode)){
this.open();
}


this.filterWriteDiv.focus();

if(Mojo.Char.isEnterKey(e.keyCode)){
Event.stop(e);
return true;
}

if((e.ctrlKey||e.keyCode<32||e.keyCode===127)&&(e.keyCode!==Mojo.Char.backspace)&&!Mojo.Char.isDeleteKey(e.keyCode)){
return;
}

this._updateFilter();
},

_updateFilter:function(){

this.filterReadDiv.innerText=this.filterWriteDiv.value;


Mojo.Event.send(this.controller.element,Mojo.Event.filterImmediate,{filterString:this.filterWriteDiv.value});



if(this.filterReadDiv.innerText.blank()){
this.handleFilterClose();
}else{

this.handleSendEvent();
}

},

setText:function(value){
this.filterWriteDiv.value=value;
this._updateFilter();
},


handleFilterOpen:function(e){
var keyCode;

if(this.filterOpen&&!Mojo.View.isTextField(e.originalEvent.target)){
this.filterWriteDiv.focus();
return;
}

keyCode=e.originalEvent.keyCode;


if(!Mojo.View.isTextField(e.originalEvent.target)&&e.originalEvent.ctrlKey){
this.filterWriteDiv.show();
this.filterWriteDiv.focus();
return;
}
if(e.originalEvent.target!==this.controller.document.body){
return;
}
if(!Mojo.Char.isValid(keyCode)){
return;
}
this.open();
},


handleCommand:function(event){
if(event.type===Mojo.Event.back){
if(this.filterOpen){
this.filterWriteDiv.value='';
Mojo.Event.send(this.controller.element,Mojo.Event.filterImmediate,{filterString:this.filterWriteDiv.value});
this.sendFilterEvent();
this.handleFilterClose();
event.preventDefault();
event.stopPropagation();
}
}
}
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.TextField=Class.create({
INPUT_WIDTH:17,
CHAR_MIN:3,


initialize:function(){
},


setup:function(){
var timing=Mojo.Timing;
timing.resume('scene#textField#setup');
Mojo.require(this.controller.element,"Mojo.Widget.TextField requires an element");
Mojo.require(!(this.controller.attributes.multiline&&this.usePasswordTemplate),"Error: Multiline password fields are not supported.");
Mojo.require(!(this.controller.attributes.multiline&&this.controller.attributes.maxLength),"Error: MaxLength is not supported in multiline text fields.");
this.initializeDefaultValues();

this.renderWidget();
this.handleKeyDownEvent=this.handleKeyDownEvent.bind(this);
this.controller.listen(this.controller.element,"keydown",this.handleKeyDownEvent);
this.handleKeyUpEvent=this.handleKeyUpEvent.bind(this);
this.controller.listen(this.controller.element,"keyup",this.handleKeyUpEvent);
this.handleKeyPressEvent=this.handleKeyPressEvent.bind(this);
this.controller.listen(this.controller.element,"keypress",this.handleKeyPressEvent);


this.tapController=this.tapController.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.tapController,true);

this.deactivate=this.deactivate.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.deactivate);

if(this.controller.attributes.holdToEnable){
this.enableTextfield=this.enableTextfield.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.holdEnd,this.enableTextfield);
this.controller.listen(this.controller.element,Mojo.Event.hold,this.enableTextfield);
}

if(this.controller.attributes.holdToEdit){
this.makeTextfieldEditable=this.makeTextfieldEditable.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.hold,this.makeTextfieldEditable);
}

this.commitChanges=this.commitChanges.bind(this);
this.controller.listen(this.controller.scene.sceneElement,Mojo.Event.commitChanges,this.commitChanges);

this.controller.exposeMethods(['focus','blur','getValue','setText','setValue','getCursorPosition','setCursorPosition','setConsumesEnterKey']);
this.startValue=this.inputArea.value;

timing.pause('scene#textField#setup');



this.clipboardEvent=this.clipboardEvent.bind(this);
this.controller.listen(this.inputArea,'paste',this.clipboardEvent);
this.controller.listen(this.inputArea,'cut',this.clipboardEvent);

this.updateText=this.updateText.bind(this);
},

setConsumesEnterKey:function(requires){
if(requires){
this.inputArea.setAttribute(Mojo.Gesture.consumesEnterAttribute,"true");
}else{
this.inputArea.setAttribute(Mojo.Gesture.consumesEnterAttribute,"false");
}
},


setText:function(text){
this.setValue(text);
},

setValue:function(text){
this.inputArea.value=text;
this.updateText();
},

updateText:function(){
var value=this.inputArea.value;

if(this.inputArea.value.length===0){
this.hintTextArea.show();
}else{
this.hintTextArea.hide();
}

this.setInputAreaDivText(value);

this._maybeSendChangeOnKeyPress();


this.maybeUpdateTextAreaHeight();
this.maybeUpdateTextAreaWidth();
},

setInputAreaDivText:function(value){
if(this.usePasswordTemplate){
value=this.buildHiddenInput(value.length);
this.inputAreaDiv.innerHTML=value;
}else{
this.inputAreaDiv.innerText=value;
}
},

clipboardEvent:function(e){

if(this.disabled){
return;
}
this.updateText.defer();
},


deactivate:function(){
if(this.focused){
this.inputArea.blur();
}
},

commitChanges:function(e){


if(this.focused){
this.maybeSendPropertyChangeEvent(e);
}
},

remeasureCleanup:function(divVisible,inputVisible,hintVisible,originalFloat,timing){

if(divVisible){
this.inputAreaDiv.show();
}else{
this.inputAreaDiv.hide();
}

if(inputVisible){
this.inputArea.show();
}else{
this.inputArea.hide();
}

if(hintVisible){
this.hintTextArea.show();
}else{
this.hintTextArea.hide();
}

if(originalFloat!=='none'){
this.controller.element.style["float"]=originalFloat;
}


this.maybeUpdateTextAreaWidth();
this.maybeUpdateTextAreaHeight();
timing.pause('scene#textField#remeasure');
},

remeasure:function(e){
var timing=Mojo.Timing;
timing.resume('scene#textField#remeasure');

var forWidth,forHeight;
var divVisible,inputVisible,hintVisible,divWidth;
var originalFloat;
var offsetLeft;

if(!this.focused){
return;
}


if(!this.controller.element.visible()){
timing.pause('scene#textField#remeasure');
return;
}


divVisible=this.inputAreaDiv.visible();
inputVisible=this.inputArea.visible();
hintVisible=this.hintTextArea.visible();


this.inputAreaOriginalSize=Mojo.View.getDimensions(this.inputArea).width||0;

if(hintVisible){
this.hintTextArea.hide();
}

if(!divVisible){
this.inputAreaDiv.show();
}


offsetLeft=this.inputAreaDiv.offsetLeft;
if(this.hintTextArea.style.left!==offsetLeft&&offsetLeft!==0){
this.hintTextArea.style.left=offsetLeft+'px';
}


this.inputAreaDiv.style.width='auto';

originalFloat=this.controller.element.style['float'];
if(originalFloat&&!originalFloat.blank()&&originalFloat!=='none'){
this.controller.element.style["float"]='none';
}
divWidth=Mojo.View.getDimensions(this.inputAreaDiv).width||(this.INPUT_WIDTH*this.CHAR_MIN);
this.inputAreaDiv.style.width='';



if(divWidth===this.inputDivOriginalSize&&!this.controller.attributes.multiline){
this.remeasureCleanup(divVisible,inputVisible,hintVisible,originalFloat,timing);
return;
}


if(this.inputDivOriginalSize!==divWidth){
this.inputDivOriginalSize=divWidth;

divWidth=Mojo.View.getDimensions(this.inputAreaDiv).width;
if(divWidth===0){
divWidth=this.inputDivOriginalSize;
}
this.inputArea.setStyle("width:"+divWidth+"px");
if(this.growWidth){
this.makeWidthGrowable(this.inputArea,this.controller.attributes.limitResize);
}
}


if(this.controller.attributes.multiline){
this.makeHeightGrowable(this.inputArea,this.controller.attributes.limitResize);
}

this.remeasureCleanup(divVisible,inputVisible,hintVisible,originalFloat,timing);
},


focusDiv:function(){
this.focus();
},

blur:function(){
this.inputArea.blur();
},

getValue:function(){
return this.inputArea.value;
},



focus:function(){

if(!this.focused&&!this.disabled&&this.editable){

this.applyFocusClass(this.inputArea);
this.swap(true);
this.inputArea.originalFocus();
}
},

initializeDefaultValues:function(){

this.autoFocus=this.controller.attributes.focus||this.controller.attributes.autoFocus;
this.growWidth=this.controller.attributes.autoResize||this.controller.attributes.growWidth;
this.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.hintText=this.controller.attributes.hintText;
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];
this.editable=!this.controller.attributes.holdToEdit;
this.focusMode=this.controller.attributes.focusMode||Mojo.Widget.focusInsertMode;

if(this.controller.attributes.multiline){
this.swap=this.swapMultiline.bind(this);
}else{
this.swap=this.swapSingleline.bind(this);
}

this.textReplacement=true;

if(this.controller.attributes.autoReplace===false){
this.textReplacement=false;
}else if(this.controller.attributes.textReplacement===false){
this.textReplacement=this.controller.attributes.textReplacement;
}else{
this.textReplacement=true;
}


this.maybeUpdateTextAreaHeight=Mojo.doNothing;
this.maybeUpdateTextAreaWidth=Mojo.doNothing;
},

enableTextfield:function(event){
if(event.type===Mojo.Event.holdEnd){
if(this.disabled&&this.controller.attributes.holdToEnable){
this.disabled=false;
this.updateEnabledState();
this.focus();
}
}else if(event.type===Mojo.Event.hold&&this.disabled&&this.controller.attributes.holdToEnable){
event.stop();
}
},

makeTextfieldEditable:function(event){
var highlightTarget;
if(this.controller.attributes.holdToEdit){
this.editable=true;
highlightTarget=Mojo.Gesture.highlightTarget;
if(highlightTarget){
highlightTarget.removeClassName('selected');
}
this.updateEditableState();
this.focus();
}
},



getCursorPosition:function(value){
var selectionStart,selectionEnd;

if(!this.inputArea.value||this.inputArea.value.length===0){

selectionStart=value.length;
selectionEnd=value.length;
}else{
selectionStart=this.inputArea.selectionStart;
selectionEnd=this.inputArea.selectionEnd;
}
return{'selectionStart':selectionStart,'selectionEnd':selectionEnd};
},

setCursorPosition:function(start,end){

this.inputArea.selectionStart=start;
this.inputArea.selectionEnd=end;
},



handleModelChanged:function(){
var forWidth=false,forHeight=false;
var value=this.controller.model[this.modelProperty]||'';
var originalValue=this.inputArea.value;
var positions;

if(value!==this.inputArea.value){
positions=this.getCursorPosition(value);
this.inputArea.value=value;


if(positions.selectionStart===positions.selectionEnd&&this.focused){
this.setCursorPosition(positions.selectionStart,positions.selectionEnd);
}


this.setInputAreaDivText(value);
}




if(this.focused&&value!==originalValue){
this.remeasure();
}

if(this.controller.model[this.modelProperty]&&this.controller.model[this.modelProperty].length>0){
this.hintTextArea.hide();
}else{
this.hintTextArea.show();
}


if(this.disabled!=this.controller.model[this.disabledProperty]){
this.disabled=this.controller.model[this.disabledProperty];
this.updateEnabledState();
}

this.startValue=this.inputArea.value;


if(this.hintText!==this.controller.attributes.hintText){

this.hintTextArea.innerText=(this.controller.attributes.hintText||'');
this.hintText=this.controller.attributes.hintText;
}
},

updateEnabledState:function(){
if(this.disabled){
Mojo.View.makeNotFocusable(this.inputAreaDiv);
if(this.focused){
this.inputArea.blur();
}
this.inputAreaDiv.addClassName('palm-textfield-disabled');
}else{
Mojo.View.makeFocusable(this.inputAreaDiv);
this.inputAreaDiv.removeClassName('palm-textfield-disabled');
}
},


updateEditableState:function(){
if(!this.editable){
Mojo.View.makeNotFocusable(this.inputAreaDiv);
}else{
Mojo.View.makeFocusable(this.inputAreaDiv);
}
},


_addSteString:function(inString,mode){
var txtModesString=inString;
if(!mode){
return inString;
}
if(txtModesString.length>0){
txtModesString+=" ";
}else{
txtModesString="'x-palm-ste-mode='";
}
txtModesString+=mode;
return txtModesString;
},

_isNewSteControls:function(){

if((this.controller.attributes.textCase!==undefined||this.controller.attributes.emoticons!==undefined||this.controller.attributes.autoReplace!==undefined)||
(this.controller.attributes.textReplacement===undefined&&this.controller.attributes.autoCapitalization===undefined)){
return true;
}
return false;
},



renderWidget:function(){
var hintText=this.hintText;
var model;
var content;
var textFieldName=this.controller.attributes.inputName||this.controller.attributes.textFieldName||this.divPrefix+'_textField';
var originalValue=this.controller.model[this.modelProperty]||'';
var newOriginalValue='',maskedValue='';
var template;
var forWidth=false,forHeight=false;
var txtReplace='',autoCaps='';
var showHint,showRead,showWrite;
var offsetLeft;
var txtModesString="";
var autoReplace=(this.controller.attributes.autoReplace===false)?Mojo.Widget.steModeReplaceOff:null;
var emoticons=this.controller.attributes.emoticons?Mojo.Widget.steModeEmoticonsOn:null;

if(this.controller.attributes.maxLength!==undefined){
if(originalValue&&originalValue.length>this.controller.attributes.maxLength){
originalValue=originalValue.substring(0,this.controller.attributes.maxLength);
}
}
if(this.usePasswordTemplate&&originalValue){
newOriginalValue=originalValue;
maskedValue=this.buildHiddenInput(originalValue.length);
}else{
newOriginalValue=originalValue;
}

if(this._isNewSteControls()){
if(this.controller.attributes.textCase){
txtModesString=this._addSteString(txtModesString,this.controller.attributes.textCase);
}
txtModesString=this._addSteString(txtModesString,emoticons);
txtModesString=this._addSteString(txtModesString,autoReplace);
autoCaps="";


if(txtModesString&&txtModesString.length>0){
txtModesString+="'";
}

}else{
if(this.textReplacement===false){
txtReplace='x-palm-disable-ste-all="true"';
}
if(this.controller.attributes.autoCapitalization){
autoCaps='x-palm-title-cap="true"';
}
}

if(this.controller.model[this.modelProperty]){
showHint='display:none;';
}



if(this.autoFocus&&!this.disabled&&this.editable){
showRead='display:none;';
}else{
showWrite='display:none;';
}


model={
'hintTextName':this.divPrefix+'_hintText',
'textFieldName':textFieldName,
'divPrefix':this.divPrefix,
'mode':this.controller.attributes.modifierState,
'hiddenTextFieldName':textFieldName||this.divPrefix+'_textField',
'unmaskedOriginalValue':originalValue,
'maskedValue':maskedValue,
'maxLength':this.controller.attributes.maxLength,
'txtReplace':txtModesString||txtReplace,
'showHint':showHint,
'showWrite':showWrite,
'showRead':showRead,
'autoCaps':autoCaps
};

if(this.usePasswordTemplate){
template='/password/passwordfield';
}else if(this.controller.attributes.multiline){
template='/textfield/textfield';
}else{
template='/textfield/textfield-single';
}

content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath(template),object:model});
this.controller.element.innerHTML=content;

this.inputArea=this.controller.get(this.divPrefix+"-write");
this.inputArea.value=newOriginalValue;

this.inputAreaDiv=this.controller.get(this.divPrefix+"-read");
this.setInputAreaDivText(newOriginalValue);



this.inputArea.originalFocus=this.inputArea.focus;
this.inputArea.focus=this.focus.bind(this);
this.inputArea.mojo={};
this.inputArea.mojo.setText=this.setText.bind(this);

this.blurInputArea=this.blurInputArea.bind(this);
this.controller.listen(this.inputArea,'blur',this.blurInputArea);
this.focusInputArea=this.focusInputArea.bind(this);
this.controller.listen(this.inputArea,'focus',this.focusInputArea,true);
this.focusDiv=this.focusDiv.bind(this);
this.controller.listen(this.inputAreaDiv,'focus',this.focusDiv);

this.hintTextArea=this.controller.get(model.hintTextName);
if(hintText){
this.hintTextArea.innerText=hintText;
}

offsetLeft=this.inputAreaDiv.offsetLeft;
if(this.inputAreaDiv.visible()&&offsetLeft!==0){
this.hintTextArea.style.left=offsetLeft+'px';
}



if(this.controller.attributes.requiresEnterKey){
this.inputArea.setAttribute(Mojo.Gesture.consumesEnterAttribute,"true");
}

if(this.autoFocus&&!this.disabled&&this.editable){
this.focus();
}else if(this.disabled){

this.updateEnabledState();
this.swap(false);
}else if(this.controller.attributes.holdToEdit){

this.updateEditableState();
this.swap(false);
}else{
this.swap(false);
}
return;
},

makeVisible:function(element){
if(!element.visible()){
return element;
}

var ancestors=element.ancestors();
var ancestorsLength=ancestors.length;
for(var i=0;i<ancestorsLength;i++){
var e=ancestors[i];
if(!e.visible()){
return e;
}
}
return undefined;
},



swapMultiline:function(isEditMode){
var top;

if(isEditMode){

if(this.inputAreaDiv.visible()){
this.inputAreaDiv.hide();
}

if(!this.inputArea.visible()){
this.inputArea.show();
}
}else{

if(this.inputAreaDiv.visible()){
this.inputAreaDiv.hide();
}
if(!this.inputArea.visible()){
this.inputArea.show();
}
top=this.inputArea.offsetTop;
this.inputArea.hide();
this.inputAreaDiv.show();

}
},



swapSingleline:function(isEditMode){
if(isEditMode){


this.inputAreaDiv.hide();
this.inputArea.show();
}else{


this.inputArea.hide();
this.setInputAreaDivText(this.inputArea.value);
if(!this.usePasswordTemplate){
this.inputAreaDiv.setStyle('width:'+this.inputDivOriginalSize+"px");
}
this.inputAreaDiv.show();
}
},


applyFocusClass:function(target){
var parentTarget=Mojo.View.findParentByAttribute(target,this.controller.document,Mojo.Widget.focusAttribute);
if(parentTarget){
this.focusedParentElement=parentTarget;
Element.addClassName(parentTarget,'focused');
}
},


focusInputArea:function(event){
if(!this.disabled&&this.editable){
this.focused=true;
this.remeasure();
this.disabled=this.controller.model[this.disabledProperty];
if(this.focusMode===Mojo.Widget.focusSelectMode){
this.inputArea.select();
}else if(this.focusMode===Mojo.Widget.focusAppendMode){

this.inputArea.selectionStart=this.inputArea.value.length;
this.inputArea.selectionEnd=this.inputArea.value.length;
}else{

if(this.inputArea.value&&this.inputArea.value.length>0){
if(this.downX!==undefined&&this.downY!==undefined){
Mojo.Gesture.simulateClick(this.controller.element,this.downX,this.downY);
}else{

this.inputArea.selectionStart=this.inputArea.value.length;
this.inputArea.selectionEnd=this.inputArea.value.length;
}
}
this.downX=undefined;
this.downY=undefined;
}
this.startValue=this.inputArea.value;
return false;
}else{
return true;
}
},


tapController:function(event){
if(!this.disabled&&this.editable){

this.downX=event.down.pageX;
this.downY=event.down.pageY;


if(event.target.id!==this.inputArea.id){
Event.stop(event);
}
this.focus();
}
},

removeFocusClass:function(){
Element.removeClassName(this.focusedParentElement,'focused');
this.focusedParentElement=undefined;
},


blurInputArea:function(event){
if(this.focused){
var originalEvent=this.originalEventOverride||event;
this.originalEventOverride=undefined;
this.removeFocusClass();
this.swap(false);
this.inputArea.wasSelected=false;
this.maybeSendPropertyChangeEvent(originalEvent);
this.focused=false;

if(this.controller.attributes.holdToEdit){
this.editable=false;
}
this.updateEnabledState();
this.updateEditableState();
}
return false;
},

sendPropertyChangeEvent:function(originalEvent,value,originalValue){
this.controller.model[this.modelProperty]=value||this.inputArea.value;
Mojo.Event.sendPropertyChangeEvent(this.controller.element,this.controller.model,this.modelProperty,this.controller.model[this.modelProperty],originalValue,originalEvent);
},


maybeSendPropertyChangeEvent:function(originalEvent){
var value,originalValue;

if(this.controller.attributes.changeOnKeyPress){
return;
}
value=this.inputArea.value;

if(this.inputArea.value===this.startValue){
return;
}

originalValue=this.startValue;

this.startValue=this.inputArea.value;
this.sendPropertyChangeEvent(originalEvent,value,originalValue);

return false;
},

sendChanges:function(triggeringEvent){

if(!Mojo.View.getParentWithAttribute(triggeringEvent.target,'x-mojo-element','CharSelector')){
this.maybeSendPropertyChangeEvent(triggeringEvent);
}
},


resetHintText:function(){
this.hintTextArea.show();
},


handleFirstKeyInputArea:function(){
this.hintTextArea.hide();
},




handleDeleteKeyPreEvent:function(){
if(this.inputArea.value.length===0){

if(!this.hintTextArea.visible()){
this.hintTextArea.show();
}
return true;
}
return false;
},


handleKeyPressEvent:function(event){
var code=event.keyCode;
var success=false;
if(this.controller.attributes.charsAllow){
success=this.controller.attributes.charsAllow(code);
if(!success){
Event.stop(event);
return false;
}
}

if(this.controller.attributes.multiline&&Mojo.Char.isValidWrittenAsciiChar(code)){
this._maybePredictiveResize(String.fromCharCode(event.keyCode));
}

return false;
},

handleSelectionEvent:function(event){
this.range=this.controller.window.getSelection();
this.range=(this.range&&this.range.toString().length)||0;
},


handleKeyUpEvent:function(event){
var code=event.keyCode;
var ret=false;


this.maybeUpdateTextAreaWidth();

if(code===Mojo.Char.enter&&(!this.controller.attributes.multiline||
(this.controller.attributes.multiline&&this.controller.attributes.enterSubmits))){
this.originalEventOverride=event;
ret=true;



if(this.controller.attributes.enterSubmits&&this.controller.attributes.multiline&&!this.controller.attributes.requiresEnterKey){
this.advanceFocus();
}else{
this.inputArea.blur();
}
}


this._handleHintText(code);
this._maybeSendChangeOnKeyPress(event);

return ret;
},


_handleHintText:function(code){
if(code===Mojo.Char.deleteKey||code===Mojo.Char.backspace){
this.handleDeleteKeyPreEvent();
}else if(Mojo.Char.isValid(code)){
this.handleFirstKeyInputArea();
}
},

_maybeSendChangeOnKeyPress:function(event){
var originalValue;
if(this.controller.attributes.changeOnKeyPress&&((event&&event.keyCode===Mojo.Char.enter)||this.startValue!==this.inputArea.value)){
originalValue=this.startValue;
this.startValue=this.inputArea.value;
this.sendPropertyChangeEvent(event,this.inputArea.value,originalValue);
}
},

_maybePredictiveResize:function(newChar){
var value=this.inputArea.value;
var start=this.inputArea.selectionStart;
var end=this.inputArea.selectionEnd;

if(newChar===undefined){
if(start!==end){
this.inputArea.value=value.substring(0,start)+value.substring(end,value.length);
}else{
this.inputArea.value=value.substring(0,start-1)+value.substring(end,value.length);
}
}else{
this.inputArea.value=value.substring(0,start)+newChar+value.substring(end,value.length);
}
this.maybeUpdateTextAreaHeight();
this.inputArea.value=value;
this.inputArea.selectionStart=start;
this.inputArea.selectionEnd=end;
},

advanceFocus:function(){
Mojo.View.advanceFocus(this.controller.scene.sceneElement,this.inputArea);
},


handleKeyDownEvent:function(event){
var code=event.keyCode;
var target=event.target;
var ret=false;


if(code===Mojo.Char.enter){
if(!this.controller.attributes.multiline||(this.controller.attributes.enterSubmits&&this.controller.attributes.multiline)){
Event.stop(event);
ret=true;
}
}

this._handleHintText(code);


if(this.controller.attributes.multiline&&(code===Mojo.Char.deleteKey||code===Mojo.Char.backspace)){
this._maybePredictiveResize();
}

if(this.controller.attributes.multiline&&!this.controller.attributes.enterSubmits&&code===Mojo.Char.enter){
this._maybePredictiveResize("\n");
}

return ret;
},


buildHiddenInput:function(len){
var hidden="";
for(var i=0;i<len;i++){
hidden+="&#8226;";
}
return hidden;
},

maybeUpdateTextAreaWidthFunc:function(originalWidth,element,shill,limitResize){
var regX;
var s=element.value;
var length=Math.max(s.length,this.CHAR_MIN);
var shillwidth=length*this.INPUT_WIDTH;
if(shillwidth===0||(limitResize&&shillwidth<originalWidth)){
return;
}
element.setStyle({
width:shillwidth+"px"
});
},

cleanup:function(){
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.deactivate,this.deactivate);
this.controller.stopListening(this.controller.scene.sceneElement,Mojo.Event.commitChanges,this.commitChanges);
this.controller.stopListening(this.inputArea,'paste',this.clipboardEvent);
this.controller.stopListening(this.inputArea,'cut',this.clipboardEvent);

this.controller.stopListening(this.controller.element,"keydown",this.handleKeyDownEvent);
this.controller.stopListening(this.controller.element,"keyup",this.handleKeyUpEvent);
this.controller.stopListening(this.controller.element,"keypress",this.handleKeyPressEvent);
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.tapController,true);

if(this.controller.attributes.holdToEnable){
this.controller.stopListening(this.controller.element,Mojo.Event.holdEnd,this.enableTextfield);
this.controller.stopListening(this.controller.element,Mojo.Event.hold,this.enableTextfield);
}

if(this.controller.attributes.holdToEdit){
this.controller.stopListening(this.controller.element,Mojo.Event.hold,this.makeTextfieldEditable);
}

this.controller.stopListening(this.inputArea,'blur',this.blurInputArea);
this.controller.stopListening(this.inputArea,'focus',this.focusInputArea,true);
this.controller.stopListening(this.inputAreaDiv,'focus',this.focusDiv);
},

maybeUpdateTextAreaHeightFunc:function(element,limitResize,originalHeight){
var wasVisible=element.visible();
var maxedOut=(element.clientHeight===originalHeight&&limitResize);


element.setStyle({'height':'auto'});
if(!wasVisible){
element.show();
}



while(element.rows>1&&element.scrollHeight<=element.clientHeight){
element.rows--;
}

while(element.scrollHeight>(element.clientHeight+1)&&!maxedOut){
element.rows++;
if(element.clientHeight===originalHeight&&limitResize){
maxedOut=true;
}
}


this.inputAreaDiv.style.width=(Mojo.View.getDimensions(element).width-6)+"px";


if(element.rows>1){
element.style.marginTop="13px";
this.inputAreaDiv.style.paddingBottom="13px";
}else{
element.style.marginTop="12px";
this.inputAreaDiv.style.paddingBottom="16px";
}


this.inputAreaDiv.innerText=element.value;

if(!wasVisible){
element.hide();
}
},

makeWidthGrowable:function(element,limitResize){
var shillElm;
var styleSetter={};
var oldShill;
var maybeUpdate;
var visible=element.visible();
var origWidth;
var st;

if(!visible){
element.show();
}

this.originalWidth=element.offsetWidth;
shillElm=new Element('div');
shillElm.className="TextAreaShill";
oldShill=this.controller.get(element.id+"_shill");

if(oldShill){
shillElm.innerText=oldShill.innerText;
oldShill.remove();
}

shillElm.id=element.id+"_shill";
element.parentNode.insert({top:shillElm});
shillElm.hide();

['width','font-size','font'].each(function(style){
st=element.getStyle(style);
styleSetter[style]=element.getStyle(style);
});
shillElm.setStyle(styleSetter);
origWidth=this.originalWidth||0;
maybeUpdate=this.maybeUpdateTextAreaWidthFunc;
this.maybeUpdateTextAreaWidth=maybeUpdate.bind(this,origWidth,element,shillElm,limitResize);


if(!visible){
element.hide();
}
},


makeHeightGrowable:function(element,limitResize){
var maybeUpdate;
var visible=element.visible();
var originalHeight;

if(!visible){
element.show();
}


if(limitResize){
originalHeight=this.controller.element.getStyle('max-height');
if(originalHeight){
originalHeight=parseInt(originalHeight,10);
}
element.setStyle({'max-height':originalHeight+'px'});
this.inputAreaDiv.setStyle({'max-height':originalHeight+'px'});
}



if(!this.controller.attributes.preventResize){
element.rows=element.rows||1;
element.setStyle({'overflow':'hidden'});
maybeUpdate=this.maybeUpdateTextAreaHeightFunc;
this.maybeUpdateTextAreaHeight=maybeUpdate.bind(this,element,limitResize,originalHeight);
}
if(!visible){
element.hide();
}
}
});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.ToggleButton=Class.create({
YSALT:10,

initialize:function(){
},

setup:function(){
this.initializeDefaultValues();
this.toggleState=this.toggleState.bind(this);
this.renderWidget();
this._setDisabledState();
},

initializeDefaultValues:function(){
this.controller.attributes.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.fieldId=this.divPrefix+"hiddenField";
this.trueValue=this.controller.attributes.trueValue||true;
this.trueLabel=this.controller.attributes.trueLabel||$LL('On');
this.falseValue=this.controller.attributes.falseValue||false;
this.falseLabel=this.controller.attributes.falseLabel||$LL('Off');
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;

if(this.isCheckbox){
this.template=Mojo.Widget.getSystemTemplatePath('/checkbox/checkbox');
this.toggleDivName=this.divPrefix+"-checkboxDiv";
}else{
this.template=Mojo.Widget.getSystemTemplatePath('/toggle-button/toggle-button');
this.toggleDivName=this.divPrefix+"-toggleDiv";
this.toggle=this.toggle.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.dragging,this.toggle);
this.toggleStateStart=this.toggleStateStart.bind(this);
this.controller.listen(this.controller.element,Mojo.Event.dragStart,this.toggleStateStart);
}
},

cleanup:function(){
this.controller.stopListening(this.controller.element,Mojo.Event.dragStart,this.toggleStateStart);
this.controller.stopListening(this.controller.element,Mojo.Event.dragging,this.toggle);
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.toggleState);
},



_getState:function(){
return this.trueValue===this.controller.model[this.controller.attributes.modelProperty];
},


toggleStateStart:function(event){
if(this.disabled){
return;
}
var filteredDistance=event.filteredDistance;
var shouldToggle=(filteredDistance.x>filteredDistance.y);
this.interestedInDrags=shouldToggle;
if(shouldToggle){
if(this.direction){
delete this.direction;
}
event.stop();
}
},




toggle:function(event){
var move=event.move;
var start=event.down;
var state=this._getState();
var direction;

if(this.disabled||!start||!move||!this.interestedInDrags){
return;
}

if(move.x>start.x){
direction="right";
}else{
direction="left";
}

if(this.direction!==direction){
if(!state&&direction==='right'){
this.toggleState(event);
}else if(state&&direction==='left'){
this.toggleState(event);
}
this.direction=direction;
}
event.stop();
},

renderWidget:function(){
var state,label;
if(this.controller.model[this.controller.attributes.modelProperty]==this.trueValue){
state=true;
label=this.trueLabel;
}else{
state=false;
label=this.falseLabel;
}
var model={
fieldName:this.controller.attributes.inputName||this.controller.attributes.fieldName,
fieldId:this.fieldId,
divPrefix:this.divPrefix,
state:state,
value:this.controller.model[this.controller.attributes.modelProperty],
label:label
};
var content=Mojo.View.render({template:this.template,object:model});
this.controller.element.innerHTML=content;
this.toggleDiv=this.controller.get(this.toggleDivName);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.toggleState);
this.inputField=this.controller.get(model.fieldId);
this.labelDiv=this.controller.get(this.divPrefix+'-labelDiv');
},

setState:function(state){
if(state){
this.toggleDiv.removeClassName(false);
this.toggleDiv.addClassName(true);
if(this.labelDiv){
this.labelDiv.innerHTML=this.trueLabel;
}
}else{
this.toggleDiv.removeClassName(true);
this.toggleDiv.addClassName(false);

if(this.labelDiv){
this.labelDiv.innerHTML=this.falseLabel;
}
}
},

toggleState:function(event){
if(this.disabled){
return;
}
var state=!this.toggleDiv.hasClassName("true");
this.setState(state);
this.handlePropertyChanged(state);
event.stop();
return true;
},

_setDisabledState:function(){
var disabledVal=this.controller.model[this.disabledProperty];
if(disabledVal!==this.disabled){
this.disabled=disabledVal;
if(this.disabled){
this.toggleDiv.addClassName("disabled");
}else{
this.toggleDiv.removeClassName("disabled");
}
}
},

handleModelChanged:function(what,model){
this._setDisabledState();
this.setState(this._getState());
this.inputField.value=this.controller.model[this.controller.attributes.modelProperty];
},

handlePropertyChanged:function(value){

if(value){
this.controller.model[this.controller.attributes.modelProperty]=this.trueValue;
}else{
this.controller.model[this.controller.attributes.modelProperty]=this.falseValue;
}
this.inputField.value=this.controller.model[this.controller.attributes.modelProperty];

Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,{model:this.controller.model,property:this.controller.attributes.modelProperty,value:this.controller.model[this.controller.attributes.modelProperty]});
}
});/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.ProgressSlider=Class.create({

DEFAULT_PROGRESS_PROPERTY:'progress',
DEFAULT_SLIDER_PROPERTY:'slider',

initialize:function(){

},

updateDisabledState:function(){
this.disabled=this.controller.model[this.disabledProperty];
if(this.disabled){
this.controller.element.addClassName("disabled");
}else{
this.controller.element.removeClassName("disabled");
}
},

handleModelChanged:function(){
this.updateDisabledState();
},

setup:function(){
this.initializeDefaultValues();
this.originalMax=this.controller.model.maximumValue||this.controller.model.maxValue;
this.originalMin=this.controller.model.minimumValue||this.controller.model.minValue;
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.renderWidget();
this.controller.exposeMethods(['reset']);
this.controller.scene.pushCommander(this);
this.updateDisabledState();
},

reset:function(){
this.progressPill.mojo.reset();
},

initializeDefaultValues:function(){
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.controller.model=this.controller.model||{};
this.controller.attributes=this.controller.attributes||{};
this.progressPillId=this.divPrefix+'-progressPill';
this.sliderId=this.divPrefix+'-slider';
},

renderWidget:function(){
var model;

var content;

model={
divPrefix:this.divPrefix
};
content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/progress-slider/progress-slider-widget'),object:model});

this.controller.element.innerHTML=content;
this.progressPill=this.controller.get(this.progressPillId);
this.slider=this.controller.get(this.sliderId);


this.sliderAttributes={};
this.sliderAttributes.maxValue=this.originalMax;
this.sliderAttributes.minValue=this.originalMin;
this.sliderAttributes.modelProperty=this.controller.attributes.sliderProperty||this.DEFAULT_SLIDER_PROPERTY;
this.sliderAttributes.round=this.controller.attributes.round;
this.sliderAttributes.labels=this.controller.attributes.labels;
this.sliderAttributes.backgroundElement=this.progressPill;
this.sliderAttributes.updateInterval=this.controller.attributes.updateInterval;
this.sliderModel=this.controller.model;
this.controller.scene.setupWidget(this.sliderId,this.sliderAttributes,this.sliderModel);


this.progressPillAttributes={
modelProperty:this.controller.attributes.progressProperty||this.DEFAULT_PROGRESS_PROPERTY,
modelStartProperty:this.controller.attributes.progressStartProperty,
type:Mojo.Widget.ProgressPill.slider,
cancellable:this.controller.attributes.cancellable,
completeFunction:this.onComplete.bind(this)
};
this.progressPillModel=this.controller.model;
this.controller.scene.setupWidget(this.progressPillId,this.progressPillAttributes,this.progressPillModel);

this.controller.instantiateChildWidgets(this.controller.element);
},

onComplete:function(){


this.slider.mojo.updateBackgroundElement(this.progressPill.select('div.stream-buffered')[0]);
}
});
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.Button=Class.create({

setup:function(){
this.initializeDefaultValues();
this.renderWidget();

this.updateDisabledState();

this.maybeConsumeTap=this.maybeConsumeTap.bind(this);
this.controller.listen(this.button,Mojo.Event.tap,this.maybeConsumeTap);
this.controller.exposeMethods(['activate','deactivate']);
},


cleanup:function(){
this.controller.stopListening(this.button,Mojo.Event.tap,this.maybeConsumeTap);
},


activate:function(){
this.active=true;
this.startSpinner();
},


deactivate:function(){
this.active=false;
this.stopSpinner();
},


startSpinnerFunc:function(){
this.spinner.mojo.start();
},


stopSpinnerFunc:function(){
this.spinner.mojo.stop();
},


maybeConsumeTap:function(e){
var focusedElement;

if(this.disabled){
Event.stop(e);
}else{

focusedElement=Mojo.View.getFocusedElement(this.controller.scene.sceneElement);
if(focusedElement){
focusedElement.blur();
}

if(!this.active&&(this.buttonType===Mojo.Widget.activityButton)){
this.active=true;

this.startSpinner();
}
}
},


updateDisabledState:function(){
this.disabled=this.controller.model[this.disabledProp];

if(this.disabled){
this.button.removeAttribute('x-mojo-tap-highlight');
this.button.addClassName('disabled');
}else{
this.button.setAttribute('x-mojo-tap-highlight','momentary');
this.button.removeClassName('disabled');
}
},


initializeDefaultValues:function(){
var labelProp=this.controller.attributes.labelProperty||'label';
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.buttonClass=this.controller.model.buttonClass||'';
this.buttonLabel=this.controller.model[labelProp]||this.controller.model.buttonLabel||this.controller.attributes.label||'';
this.buttonType=this.controller.attributes.type||Mojo.Widget.defaultButton;
this.startSpinner=Mojo.doNothing;
this.stopSpinner=Mojo.doNothing;
this.disabledProp=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
},


renderWidget:function(){
var model;
var buttonContent;
var spinnerContent;
var spinnerAttrs;

if(this.buttonType===Mojo.Widget.activityButton){

spinnerContent=Mojo.View.render({object:model,template:Mojo.Widget.getSystemTemplatePath('/button/button-spinner'),attributes:{divPrefix:this.divPrefix}});
}
model={
divPrefix:this.divPrefix,
label:this.buttonLabel,
type:this.buttonClass,
spinnerContent:spinnerContent
};

buttonContent=Mojo.View.render({object:model,template:Mojo.Widget.getSystemTemplatePath('/button/button-widget')});
this.controller.element.innerHTML=buttonContent;
this.buttonLabel=this.controller.get(this.divPrefix+"-buttonLabel");
this.button=this.controller.get(this.divPrefix+"-button");
this.spinner=this.controller.get(this.divPrefix+"-activity-spinner");

if(this.spinner){
spinnerAttrs={
spinnerSize:Mojo.Widget.spinnerSmall
};
this.controller.scene.setupWidget(this.spinner.id,spinnerAttrs,{});
this.controller.instantiateChildWidgets(this.controller.element);
this.startSpinner=this.startSpinnerFunc.bind(this);
this.stopSpinner=this.stopSpinnerFunc.bind(this);
}
},



handleModelChanged:function(){
var labelProp=this.controller.attributes.labelProperty||'label';
if(this.controller.model.buttonClass!==this.buttonClass){
this.button.removeClassName(this.buttonClass);
this.buttonClass=this.controller.model.buttonClass;
this.button.addClassName(this.buttonClass);
}
if(!this.controller.attributes.label){

this.buttonLabel.innerHTML=this.controller.model[labelProp]||this.controller.model.buttonLabel||'';
}

this.updateDisabledState();
}
});/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.Widget._Dialog=Class.create({

kAnimationDuration:0.15,


setup:function(){
var content,cancelFunc,closedFunc;
var activate;


Mojo.assert(this.controller.model.assistant,"Mojo.Widget._Dialog requires an assistant to be defined in the model.");
Mojo.assert(this.controller.model.template,"Mojo.Widget._Dialog requires a template to be defined in the model.");
this.assistant=this.controller.model.assistant;


content=Mojo.View.render({object:this.controller.model,template:this.controller.model.template});
content=Mojo.View.render({object:{content:content},template:Mojo.Widget.getSystemTemplatePath("modal-dialog")});
this.controller.element.innerHTML=content;


this.controller.exposeMethods(["close"]);




this._delayedClose=this._delayedClose.bind(this);
if(!this.controller.model.preventCancel){
cancelFunc=this.close.bind(this,undefined);
}
closedFunc=this.isClosed.bind(this);
this.controller.scene.pushContainer(this.controller.element,this.controller.scene.dialogContainerLayer,
{cancelFunc:cancelFunc,isClosedFunc:closedFunc});


this.controller.scene.pushCommander(this);

if(this.assistant.handleCommand){
this.controller.scene.pushCommander(this.assistant);
}



if(this.assistant.setup){
this.assistant.setup(this.controller.element);
}

this.controller.instantiateChildWidgets(this.controller.element);


this.box=this.controller.element.querySelector('div[x-mojo-dialog]');
this.scrim=this.controller.element.querySelector('div[x-mojo-scrim]');

activate=this._activateWrapper.bind(this);

Mojo.Animation.Dialog.animateDialogOpen(this.box,this.scrim,activate);

this.handleRefocus=Mojo.Widget.Util.dialogRefocusCb.bind(this);
this.controller.listen(this.controller.scene.sceneElement,'DOMFocusIn',this.handleRefocus);

this._dragHandler=this._dragHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.dragStart,this._dragHandler);
},

_activateWrapper:function(){
if(this.assistant.activate){
try{
this.assistant.activate();
}catch(e){
Mojo.Log.warn("Activate called on the dialog controller failed. Continuing other setup. %s ",e);
}
}
},

handleCommand:function(event){
if(event.type==Mojo.Event.back){

if(!this.controller.model.preventCancel){
Event.stop(event);
this.close();
}else{
event.stopPropagation();
}
}
},

cleanup:function(){
this.controller.stopListening(this.controller.scene.sceneElement,'DOMFocusIn',this.handleRefocus);
this.controller.stopListening(this.controller.element,Mojo.Event.dragStart,this._dragHandler);
if(this.assistant.handleCommand){
this.controller.scene.removeCommander(this.assistant);
}

this.controller.scene.removeCommander(this);
this.controller.scene.removeContainer(this.controller.element);

if(this.assistant.cleanup){
this.assistant.cleanup();
}
},




_delayedClose:function(){
Mojo.Animation.Dialog.animateDialogClose(this.box,this.scrim,this.controller.remove.bind(this.controller));
},

close:function(){
if(this.isClosed()){
return;
}

this.closed=true;

if(this.assistant.deactivate){
try{
this.assistant.deactivate();
}catch(e){
Mojo.Log.warn("Deactivate called on the dialog controller failed. Continuing other cleanup. %s ",e);
}
}
this._delayedClose.delay(0.2);
},

isClosed:function(){
return!!this.closed;
},


_dragHandler:function(event){

event.stop();
}


});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Widget.ExperimentalComboBox=Class.create({


setup:function(){
this.initializeDefaultValues();

this._renderWidget();

this._setupTextField();

this._setupButtons();
this.handleMouseEvent=this.handleMouseEvent.bind(this);
this.controller.listen(this.controller.document,Mojo.Event.tap,this.handleMouseEvent);
this.handleKeyEvent=this.handleKeyEvent.bind(this);
this.controller.listen(this.inputDiv,"keydown",this.handleKeyEvent);
this.handlePropertyChangedEvent=this.handlePropertyChangedEvent.bind(this);
this.controller.listen(this.inputDiv,Mojo.Event.propertyChange,this.handlePropertyChangedEvent);
this.controller.scene.pushCommander(this);
if(this.controller.attributes.focus){
this.enterFocusedState();
}

this.controller.exposeMethods(['setValue']);
},

cleanup:function(){
this.controller.stopListening(this.controller.document,Mojo.Event.tap,this.handleMouseEvent);
this.controller.stopListening(this.inputDiv,"keydown",this.handleKeyEvent);
this.controller.stopListening(this.inputDiv,Mojo.Event.propertyChange,this.handlePropertyChangedEvent);
this.controller.stopListening(this.showAllButton,Mojo.Event.tap,this.handleButtonPress);
this.controller.stopListening(this.commitButton,Mojo.Event.tap,this.selectDefaultEntry);
this.controller.stopListening(this.list,Mojo.Event.listTap,this.handleSelection);
},

setValue:function(value){
this.textFieldModel.value=value;
this.controller.modelChanged(this.textFieldModel);
this.enterUnfocusedState();
},

_setupButtons:function(){
this.commitButton=this.controller.get(this.divPrefix+'-'+'commit_button');
this.showAllButton=this.controller.get(this.divPrefix+'-'+'show_all_button');
this.handleButtonPress=this.handleButtonPress.bind(this);
this.controller.listen(this.showAllButton,Mojo.Event.tap,this.handleButtonPress);
this.commitButton.hide();
this.selectDefaultEntry=this.selectDefaultEntry.bind(this);
this.controller.listen(this.commitButton,Mojo.Event.tap,this.selectDefaultEntry);
},

enterShowAllState:function(){
Mojo.Log.info("STATE = COMBOBOX_WIDGET_SHOWALLSTATE");
this._cancelSearch();
this.STATE=this.COMBOBOX_WIDGET_SHOWALLSTATE;
this.showAllButton.show();
this.showAllButton.removeClassName('showall');
this.showAllButton.addClassName('showall-open');
this.inputDiv.mojo.focus();
this.hide();
this.show();
this.search('',true);
},

hideHintText:function(){
this.textFieldAttributes.hintText='';
this.textFieldModel.value=this.inputArea.value;
this.controller.modelChanged(this.textFieldModel);
},

showHintText:function(){
this.textFieldAttributes.hintText=this.controller.model.hintText;
this.textFieldModel.value=this.inputArea.value;
this.controller.modelChanged(this.textFieldModel);
},

enterFilterState:function(){
Mojo.Log.info("STATE = COMBOBOX_WIDGET_FILTERSTATE");
this._cancelSearch();
this.STATE=this.COMBOBOX_WIDGET_FILTERSTATE;
this.showAllButton.hide();
this.showAllButton.removeClassName('showall-open');
this.showAllButton.addClassName('showall');
this.hideHintText();
this.hide();
this.show();
this.commitButton.show();
this.filteredSearch();
},

updateFilterState:function(){
Mojo.Log.info("STATE = UPDATING FILTERED STATE"+this.inputArea.value);
this._cancelSearch();
this.filteredSearch();
},

enterUnfocusedState:function(){
Mojo.Log.info("STATE = COMBOBOX_WIDGET_UNFOCUSED");
this._cancelSearch();
this.STATE=this.COMBOBOX_WIDGET_UNFOCUSED;
this.showAllButton.show();
this.hide();
this.commitButton.hide();
this.inputDiv.mojo.focus();
},

enterFocusedState:function(){
if(this.inputArea.value.length>0){
this.enterFilterState();
return;
}
Mojo.Log.info("STATE = COMBOBOX_WIDGET_FOCUSED");
this._cancelSearch();
this.STATE=this.COMBOBOX_WIDGET_FOCUSED;
this.showAllButton.show();
this.commitButton.hide();
this.inputArea.mojo.focus();
this.hide();
},

search:function(text,force){
Mojo.Log.info("SUBMITTING SEARCH");
if(!force&&(!text||text.length===0)){
return;
}
this.filterString=text;
this.controller.scene.modelChanged(this.listModel);
},


submitFilteredSearch:function(){

this.search(this.inputArea.value);
this.filterTimer=null;
},

handleButtonPress:function(event){
Mojo.Log.info("GOT CLICK ON SHOW ALL");
if(this.STATE!==this.COMBOBOX_WIDGET_SHOWALLSTATE){
this.enterShowAllState();
}else{
this.enterUnfocusedState();
}
event.stop();
},


filteredSearch:function(){


if(!this.filterTimer){
this.filterTimer=window.setTimeout(this.submitFilteredSearch.bind(this),300);
}
},

handlePropertyChangedEvent:function(event){
this.enterUnfocusedState();
Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,{value:event.value});
},

isEventInInputArea:function(e){
if(e.target.up("div#"+this.inputDiv.id)){
return true;
}
return false;
},

handleMouseEvent:function(event){
switch(this.STATE){
case this.COMBOBOX_WIDGET_UNFOCUSED:
if(this.isEventInInputArea(event)){
this.enterFocusedState();
event.stop();
}
break;
case this.COMBOBOX_WIDGET_FOCUSED:
if(this.isEventInShowAll(event)){
break;
}else if(!this.isEventInInputArea(event)&&!this.isEventInPopup(event)){
this.enterUnfocusedState();
event.stop();
break;
}
break;
case this.COMBOBOX_WIDGET_FILTERSTATE:
if(this.isEventInShowAll(event)){
break;
}else if(!this.isEventInInputArea(event)&&!this.isEventInPopup(event)){
this.selectDefaultEntry();
this.enterUnfocusedState();
event.stop();
break;
}
break;
case this.COMBOBOX_WIDGET_SHOWALLSTATE:
if(this.isEventInShowAll(event)){
break;
}else if(!this.isEventInInputArea(event)&&!this.isEventInPopup(event)){
this.selectDefaultEntry();
this.enterUnfocusedState();
event.stop();
break;
}
break;
default:
break;
}
},

selectDefaultEntry:function(){
var value='default';
this.textFieldModel.value=value;
this.controller.modelChanged(this.textFieldModel);
this.enterFocusedState();
},

_cancelSearch:function(){
if(this.filterTimer){
window.clearTimeout(this.filterTimer);
this.filterTimer=null;
}
},

handleKeyEvent:function(event){
var chr=event.keyCode;
switch(this.STATE){
case this.COMBOBOX_WIDGET_UNFOCUSED:
break;
case this.COMBOBOX_WIDGET_FOCUSED:
if(Mojo.Char.isDeleteKey(chr)){
break;
}else if(Mojo.Char.isCommitKey(chr)){

break;
}else if(Mojo.Char.isValidWrittenAsciiChar(chr)){
Mojo.Log.info("got key event for filtering");
this.enterFilterState();
break;
}
break;
case this.COMBOBOX_WIDGET_FILTERSTATE:
if(Mojo.Char.isEnterKey(chr)){
this.selectDefaultEntry();
this.enterUnfocusedState();
break;
}else if(Mojo.Char.isDeleteKey(chr)){
if(this.inputArea.value.length===0||this.selectedItems===0){
this.enterFocusedState();
break;
}else{
this.updateFilterState();
break;
}
break;
}else if(Mojo.Char.isCommitKey(chr)){
this.selectDefaultEntry();
this.enterUnfocusedState();
break;
}else{
this.updateFilterState();
break;
}
break;
case this.COMBOBOX_WIDGET_SHOWALLSTATE:
if(Mojo.Char.isEnterKey(chr)){
this.selectDefaultEntry();
this.enterUnfocusedState();
break;
}else if(Mojo.Char.isDeleteKey(chr)){
this.enterUnfocusedState();
break;
}else if(Mojo.Char.isCommitKey(chr)){

break;
}else{
this.enterFilterState();
break;
}
break;
default:
break;
}
},

initializeDefaultValues:function(){
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.textFieldName=this.controller.attributes.inputName||this.controller.attributes.textFieldName||this.divPrefix+'-'+'input_area';

this.COMBOBOX_WIDGET_UNFOCUSED=0;
this.COMBOBOX_WIDGET_FILTERSTATE=1;
this.COMBOBOX_WIDGET_SHOWALLSTATE=2;
this.COMBOBOX_WIDGET_FOCUSED=3;

this.STATE=this.COMBOBOX_WIDGET_UNFOCUSED;


},


filterFunction:function(listWidget,offset,limit){
var callback=this.updateItems.bind(this);
this.controller.attributes.filterFunction(this.filterString,listWidget,offset,limit,callback);
},

updateItems:function(listWidget,offset,data,limit){
listWidget.mojo.setLength(limit);
listWidget.mojo.noticeUpdatedItems(offset,data);
},


charsAllow:function(){
return true;
},

_renderWidget:function(){
var content;
var model={
divPrefix:this.divPrefix
};
if(this.controller.attributes.labelText){
this.controller.attributes.inputLabel=Mojo.View.render({object:model,template:
Mojo.Widget.getSystemTemplatePath('/combobox/combobox_input_label')});
}

content=Mojo.View.render({object:model,
template:Mojo.Widget.getSystemTemplatePath('/combobox/combobox_widget')
});
this.controller.element.insert(content);
},

_setupTextField:function(){
var model;
Mojo.Log.info("div prefix"+this.divPrefix);
this.textFieldAttributes={
textFieldName:this.textFieldName,
focus:this.controller.attributes.focus,
hintText:this.controller.attributes.hintText,
label:this.controller.attributes.labelText,
className:' ',
charsAllow:this.charsAllow.bind(this),
acceptBack:true,
requiresEnterKey:true
};

this.textFieldModel={
value:''
};
this.controller.scene.setupWidget(this.divPrefix+'-'+'input_area_div',this.textFieldAttributes,this.textFieldModel);


model={
divPrefix:this.divPrefix
};
this.popupContainer=this.controller.get(this.divPrefix+'-popup');
this.popupScroller=this.controller.get(this.divPrefix+'-scroller');
this._setupPopupScroller();
this._setPopupHeight();

this.list=this.controller.get(this.divPrefix+'-'+'results-container');
this.listModel={
};
this.listAttrs=
{
itemTemplate:this.controller.attributes.template,
itemsCallback:this.filterFunction.bind(this),
formatters:this.controller.attributes.formatters
};
this.controller.scene.setupWidget(this.list.id,this.listAttrs,this.listModel);
this.controller.instantiateChildWidgets(this.controller.element);
this.inputArea=this.controller.element.querySelector("[name="+this.textFieldName+"]");
this.inputDiv=this.controller.get(this.divPrefix+'-'+'input_area_div');
this.inputAreaOriginalSize=this.inputArea.getWidth();
this.handleSelection=this.handleSelection.bindAsEventListener(this);
this.controller.listen(this.list,Mojo.Event.listTap,this.handleSelection);
},


handleSelection:function(event){
var item=event.item;
},

show:function(){
Mojo.Log.info("SHOWING POPUP");
this.popupContainer.show();
this._setPopupHeight();
},


_setPopupHeight:function(){
var offset=this.controller.element.offsetTop;
var inputHeight=this.controller.element.offsetHeight;
var maxHeight=Mojo.View.getViewportDimensions(this.controller.document).height;
var style='max-height: '+(maxHeight-(offset+inputHeight)-24)+'px;';


if(!this.inputArea){
return;
}


this.popupScroller.setStyle(style);
this.popupContainer.setStyle({'position':'absolute'});
},

_setupPopupScroller:function(){
var popupscroller;
this.controller.scene.setupWidget(this.popupScroller);
popupscroller=new Mojo.Controller.WidgetController(this.popupScroller,this.controller.scene,{mode:'vertical'});
},

hide:function(){
Mojo.Log.info("HIDING POPUP");
if(this.popupContainer){
this.popupContainer.hide();
}
},

handleCommand:function(event){
if(event.type==Mojo.Event.back){
if(this.STATE!=this.COMBOBOX_WIDGET_UNFOCUSED){
this.textFieldModel.value="";
this.controller.scene.modelChanged(this.textFieldModel);
this.enterUnfocusedState();
event.preventDefault();
event.stopPropagation();
}
}
},


isEventInPopup:function(event){
var target=event.target;
if(this.popupContainer&&(target.id==this.popupContainer.id||target.up('div#'+this.popupContainer.id))){
return true;
}
return false;
},

isEventInShowAll:function(event){
var target=event.target;
if(target.id==this.showAllButton.id){
return true;
}
return false;
}

});/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.ListSelector=Class.create({


setup:function(){
Mojo.assert(this.controller.model,"Mojo.Widget.ListSelector requires a model. Did you call controller.setupWidgetModel() with the name of this widget?");


this.valueName=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;


Element.addClassName(this.controller.element,'palm-list-selector');

this.updateFromModel();


this.hiddenInput.value=this.controller.model[this.valueName];


this.clickHandler=this.clickHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.clickHandler);
this.controller.listen(this.controller.element,Mojo.Event.hold,this.clickHandler);
},

cleanup:function(){
this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.clickHandler);
this.controller.stopListening(this.controller.element,Mojo.Event.hold,this.clickHandler);
},



updateFromModel:function(){
var renderObj;


var display=this.controller.model[this.valueName];
this.choices=this.controller.model.choices||this.controller.attributes.choices;
for(var i=0;i<this.choices.length;i++){
if(display==this.choices[i].value){
display=this.choices[i].label;
break;
}
}



if(this.disabled!==this.controller.model[this.disabledProperty]){
this.disabled=this.controller.model[this.disabledProperty];
if(this.disabled){
this.controller.element.addClassName('disabled');
}else{
this.controller.element.removeClassName('disabled');
}
}


renderObj={label:this.controller.attributes.label,name:this.valueName,value:display};
if(!this.controller.attributes.multiline){
renderObj.truncatingText='truncating-text';
}

if(this.controller.attributes.labelPlacement===Mojo.Widget.labelPlacementLeft){
Element.addClassName(this.controller.element,'right');
}

this.controller.element.innerHTML=Mojo.View.render({object:renderObj,
template:Mojo.Widget.getSystemTemplatePath("list-selector")});


this.hiddenInput=this.controller.element.querySelector('input');
if(this.controller.model[this.valueName]!==undefined){
this.hiddenInput.value=this.controller.model[this.valueName];
}
},


closeSelector:function(){

this.openElement.mojo.close();
},


openSelector:function(){

if(!this.disabled){
this.openElement=this.controller.scene.popupSubmenu({
onChoose:this.popupChoose.bind(this),
placeNear:this.controller.element,


toggleCmd:this.controller.model[this.valueName],
popupClass:'palm-list-selector-popup',
items:this.choices.map(this.selectorChoiceToMenuItem)
});
}
},



handleModelChanged:function(){
if(this.openElement){
this.closeSelector();
this.updateFromModel();
this.openSelector();
}else{
this.updateFromModel();
}
},



clickHandler:function(event){
Event.stop(event);
this.openSelector();
},


selectorChoiceToMenuItem:function(choice){
choice=Mojo.Model.decorate(choice);
choice.command=choice.value;
return choice;
},


popupChoose:function(value){

var oldValue=this.controller.model[this.valueName];

this.openElement=undefined;

if(value===undefined||value==oldValue){
return;
}



this.controller.model[this.valueName]=value;


this.hiddenInput.value=value;


Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,
{property:this.valueName,
value:value,
model:this.controller.model
});

if(this.controller.model[this.valueName]!=oldValue){


this.updateFromModel();
this.controller.modelChanged();
}



this.hiddenInput.value=this.controller.model[this.valueName];

}

});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Model.BigArray=Class.create({

loggingEnabled:false,



initialize:function(itemsCallback,options){

this._itemsCallback=itemsCallback;

this._options=options||{};
this._pageSize=this._options.pageSize||20;
this._lookahead=this._options.lookahead||15;
this._lookaheadTrigger=this._lookahead*(this._options.lookaheadTrigger||0.5);

this._windowSize=this._pageSize+(2*this._lookahead);


this._windowOffset=0;
this._preferredWindowOffset=this._windowOffset;





this._items=[];

this.length=0;
},



requestFullWindow:function(){



this._requestItems(this._windowOffset,this._windowSize,true);

},



cleanup:function cleanup(){
delete this._itemsCallback;
},







slice:function(start,end,movewindow){
var result;
var pinnedStart,pinnedEnd;


if(movewindow){
this._updateWindow(start,end);
}


start=Math.max(start,0);
end=Math.min(end,this.length);
if(start>=end){
return[];
}


if(end<this._windowOffset||start>this._windowOffset+this._items.length){
result=[];
while(start<end){
result.push(null);
start++;
}
}
else{

pinnedStart=Math.max(start,this._windowOffset);
pinnedEnd=Math.min(end,this._windowOffset+this._items.length);

result=this._items.slice(pinnedStart-this._windowOffset,pinnedEnd-this._windowOffset);


while(pinnedStart>start){
result.unshift(null);
pinnedStart--;
}

while(pinnedEnd<end){
result.push(null);
pinnedEnd++;
}
}

return result;
},



noticeAddedItems:function(offset,items){
var spliceItems;


this.length+=items.length;


if(offset<this._windowOffset){
this._windowOffset+=items.length;
this._preferredWindowOffset+=items.length;
return;
}else if(offset>this._windowOffset+this._windowSize){
return;
}



spliceItems=items.slice(0);
spliceItems.unshift(offset-this._windowOffset,0);


this._items.splice.apply(this._items,spliceItems);

this._updateWindow();
},



noticeRemovedItems:function(offset,limit){
var count;
var pinnedRange;


if(offset+limit>this.length){
limit=this.length-offset;
}
this.length-=limit;


if(offset<this._windowOffset){
count=Math.min(this._windowOffset-offset,limit);
this._windowOffset-=count;
this._preferredWindowOffset-=count;
offset+=count;
limit-=count;
}


pinnedRange=this._pinOffsetLimit(offset,limit);
offset=pinnedRange.offset;
limit=pinnedRange.limit;

if(limit>0){

this._items.splice(offset-this._windowOffset,limit);


this._updateWindow();
}
},



noticeUpdatedItems:function(itemsOffset,itemsArray){
var startIndex=0;
var endIndex=itemsArray.length;
var newItems;

this.log('got noticeUpdatedItems:'+itemsOffset+", +"+itemsArray.length);


if(itemsOffset+itemsArray.length>this.length){



this.length=itemsOffset+itemsArray.length;
this._updateWindow(undefined,undefined,true);
}


if(itemsOffset<this._windowOffset){
startIndex=this._windowOffset-itemsOffset;
}

if(itemsOffset+itemsArray.length>this._windowOffset+this._windowSize){
endIndex=this._windowOffset+this._windowSize-itemsOffset;
}



if(endIndex>startIndex){



newItems=itemsArray.slice(startIndex,endIndex);
Mojo.assert(endIndex-startIndex==newItems.length,"newItems length is incorrect.");
newItems.unshift(itemsOffset-this._windowOffset+startIndex,endIndex-startIndex);
this._items.splice.apply(this._items,newItems);
}

},






invalidateItems:function(offset,limit){
var pinnedRange;
var i;

if(limit===undefined){
limit=this.length-offset;
}

pinnedRange=this._pinOffsetLimit(offset,limit);
offset=pinnedRange.offset;
limit=pinnedRange.limit;

if(limit>0){









this._requestItems(offset,limit);
return true;
}

return false;
},





reorderItem:function(oldIndex,newIndex){
var oldInWindow=this.indexInWindow(oldIndex);
var newInWindow=this.indexInWindow(newIndex);
var localOld=oldIndex-this._windowOffset;
var localNew=newIndex-this._windowOffset;
var item;



if(oldInWindow&&newInWindow){
item=this._items[localOld];
this._items.splice(localOld,1);
this._items.splice(localNew,0,item);



return true;
}
else{





this.invalidateItems(0);
}
},

indexInWindow:function(index){
return(index>=this._windowOffset&&index<this._windowOffset+this._windowSize);
},




getLoadedItemRange:function(){
return{offset:this._windowOffset,limit:this._items.length};
},


maxLoadedItems:function(){
return this._windowSize;
},





setLength:function(length){
this.length=length;
this._updateWindow();
},



setLengthAndInvalidate:function(length){
this.length=length;
this._updateWindow(undefined,undefined,true);
this.invalidateItems(0);
},







_pinOffsetLimit:function(offset,limit){
var delta;


if(offset<this._windowOffset){
limit-=this._windowOffset-offset;
offset=this._windowOffset;
}


limit=Math.min(limit,(this._windowOffset+this._windowSize-offset));
limit=Math.min(limit,(this.length-offset));
limit=Math.max(limit,0);

return{offset:offset,limit:limit};
},



_updateWindow:function(start,end,suppressRequests){
var newOffset=this._preferredWindowOffset;
var oldOffset=this._windowOffset;
var i;
var itemCount;
var requestOffset;
var extraItems;



if(start!==undefined){

if(start<this._windowOffset+this._lookaheadTrigger){
newOffset=start-this._lookahead;
}else if(end>this._windowOffset+this._lookahead+this._pageSize+this._lookaheadTrigger){
newOffset=end-this._pageSize-this._lookahead;
}


if(newOffset<0){
newOffset=0;
}
this._preferredWindowOffset=newOffset;
}


newOffset=Math.min(newOffset,this.length-this._windowSize);
newOffset=Math.max(newOffset,0);

this._windowOffset=newOffset;

itemCount=Math.abs(newOffset-oldOffset);



if(itemCount>=this._windowSize){
this._items=[];
requestOffset=this._windowOffset;
itemCount=this._windowSize;
}

else if(newOffset<oldOffset){


for(i=0;i<itemCount;i++){
this._items.unshift(null);
}


requestOffset=newOffset;
}
else if(newOffset>oldOffset){






extraItems=this._items.length-this._windowSize;
for(i=0;i<itemCount-extraItems;i++){
this._items.push(null);
}


this._items.splice(0,itemCount);

requestOffset=newOffset+this._items.length-itemCount+extraItems;
itemCount=itemCount-extraItems;
}

else if(this._items.length<this._windowSize&&this._windowOffset+this._items.length<this.length){
itemCount=Math.min(this.length-(this._windowOffset+this._items.length),
this._windowSize-this._items.length);
for(i=0;i<itemCount;i++){
this._items.push(null);
}
requestOffset=this._items.length-itemCount;
}




this._trimWindow();

if(!suppressRequests&&requestOffset!==undefined){
this._requestItems(requestOffset,itemCount);
}

},


_trimWindow:function(){
var maxSize=Math.min(this._windowSize,this.length);
if(this._items.length>maxSize){
this._items.splice(maxSize,this._items.length-maxSize);
}
},





_requestItems:function(offset,limit,force){
var extraItems;

this.log("_requestItems: @"+offset+", +"+limit);
if(limit<1&&!force){
return;
}


if(offset<0){
limit+=offset;
offset=0;
}


limit=Math.min(limit,this._windowSize);

if(this._itemsCallback){
this._itemsCallback(offset,limit);
}
}

});

Mojo.Log.addLoggingMethodsToClass(Mojo.Model.BigArray);
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */




Mojo.Widget.List=Class.create({

loggingEnabled:false,

kReorderDragClass:'palm-reorder-element',
kDeleteDragClass:'palm-delete-element',

kMaxSpacerHeight:10000000,

kDeletedItemSwiped:0.5,
kDeletedItemConfirmed:true,
kDeletedItemCancelled:false,









focusItem:function(itemModel,focusSelector){
var node,input;
var index=this.listItems.indexOf(itemModel);

if(index>=0){
node=this.getNodeByIndex(index+this.renderOffset);

input=(focusSelector&&node.querySelector(focusSelector))||node.querySelector('input[type=text]')||node.querySelector('textarea');
if(input){
if(input.focus){
input.focus();
}else if(input.mojo&&input.mojo.focus){
input.mojo.focus();
}
}
}

return input;
},


showAddItem:function(show){
var item;

if(!this.addItemNode){
Mojo.Log.error('WARNING: List.mojo.addItemNode is null. Please verify that you supplied addItemLabel in the widget attributes.');
return;
}

this.addItemVisible=show;

if(this.bigItemsList.length===0){
this.updateListItems();
}

if(this.addItemNode){
item=this.findPrevListItem();
if(!show&&this.addItemNode.parentNode){
this.addItemNode.parentNode.removeChild(this.addItemNode);
}
else if(show&&!this.addItemNode.parentNode){
this.listItemsParent.appendChild(this.addItemNode);
}

this.updateListClasses();
}

},



getItems:function(offset,limit){
return this.bigItemsList.slice(offset,offset+limit,false);
},




noticeRemovedItems:function noticeRemovedItems(offset,limit){
var needUpdate,updated,needToRenderItems;
var node,windowShift;
this.log("noticeRemovedItems @",offset,", +",limit);

this.bigItemsList.noticeRemovedItems(offset,limit);


needUpdate=(offset+limit>this.renderOffset)&&(offset<this.renderOffset+this.listItems.length);


if(offset<this.renderOffset){
this.renderOffset=Math.max(0,this.renderOffset-limit);
}




if(needUpdate&&limit===1){


node=this.getNodeByIndex(offset);
this.removeListItemNode(node);


this.renumberListItems();


if(this.renderLimit<this.bigItemsList.length){
needToRenderItems=true;


this.saveAnchorPosition();


windowShift=0;
if(this.renderOffset+this.renderLimit>this.bigItemsList.length){
windowShift=this.renderOffset;
this.renderOffset=Math.max(0,this.bigItemsList.length-this.renderLimit);
windowShift=this.renderOffset-windowShift;
}
}


this.listItems=this.bigItemsList.slice(this.renderOffset,this.renderOffset+this.renderLimit,true);

if(needToRenderItems){

if(windowShift<0){

this.renderItemsBefore([this.listItems[0]],this.findNextListItem());
}else{

this.renderItemsBefore([this.listItems[this.listItems.length-1]],this.bottomSpacer);
}



this.updateSpacers();

}else{


this.updateDividers();
this.updateListClasses();
}
}
else{




updated=this.moveWindowIfInvalid();

if(needUpdate){
this.updateListItems();
}else if(!updated){
this.saveAnchorPosition();
this.updateSpacers();
}
}


if(this.scroller&&this.scroller.mojo){
this.scroller.mojo.validateScrollPosition();
}

},


addItems:function addItems(offset,items){
Mojo.Log.error('WARNING: List.mojo.addItems() has been renamed to List.mojo.noticeAddedItems().  Please update your code.');
this.noticeAddedItems(offset,items);
},


removeItems:function removeItems(offset,limit){
Mojo.Log.error('WARNING: List.mojo.removeItems() has been renamed to List.mojo.noticeRemovedItems().  Please update your code.');
this.noticeRemovedItems(offset,limit);
},


updateItems:function updateItems(offset,items){
Mojo.Log.error('WARNING: List.mojo.updateItems() has been renamed to List.mojo.noticeUpdatedItems().  Please update your code.');
this.noticeUpdatedItems(offset,items);
},


noticeAddedItems:function noticeAddedItems(offset,items){
var adjustWindow;
var needUpdate;

this.log("noticeAddedItems @",offset,", +",items.length);



adjustWindow=this.renderOffset+this.renderLimit>=this.bigItemsList.length;




needUpdate=(offset>=this.renderOffset)&&offset<(this.renderOffset+this.renderLimit);

this.bigItemsList.noticeAddedItems(offset,items);

if(offset<this.renderOffset){
this.renderOffset+=items.length;
}





if(adjustWindow){
this.adjustRenderWindow();
}




if(needUpdate){
this.updateListItems();
}


this.completeLazySetup();


if(this.scroller&&this.scroller.mojo){
this.scroller.mojo.validateScrollPosition();
}
},



noticeUpdatedItems:function(offset,items){
var limit=items.length;
this.log('got noticeUpdatedItems: offset ',offset,", limit ",limit);


this.bigItemsList.noticeUpdatedItems(offset,items);



if(offset+limit<this.renderOffset||
offset>this.renderOffset+this.renderLimit){
this.log('noticeUpdatedItems: return without rendering.');
return;
}










this.listItems=this.bigItemsList.slice(this.renderOffset,this.renderOffset+this.renderLimit,false);


limit=Math.min(this.renderOffset+this.listItems.length,offset+limit);
offset=Math.max(this.renderOffset,offset);
limit-=offset;



this.rerenderSomeItems(offset,limit);



this.measureItemHeights();







this.completeLazySetup();
this.log("List: noticeUpdatedItems done.");


if(this.scroller&&this.scroller.mojo){
this.scroller.mojo.validateScrollPosition();
}
},



invalidateItems:function(offset,limit){
this.bigItemsList.invalidateItems(offset,limit);

},



getNodeByIndex:function(index){
var node;

if(index<this.renderOffset||index>=this.renderOffset+this.listItems.length){
return undefined;
}

index-=this.renderOffset;
for(node=this.listItemsParent.firstChild;node;node=node.nextSibling){
if(node._mojoListIndex===index){
return node;
}
}

return undefined;
},


getItemByNode:function(node){
node=Mojo.Widget.Util.findListItemNode(node,this.listItemsParent);
return node&&this.listItems[node._mojoListIndex];
},



getLoadedItemRange:function(){
return this.bigItemsList.getLoadedItemRange();
},


maxLoadedItems:function(){
return this.bigItemsList.maxLoadedItems();
},



getMaxLoadedItems:function(){
return this.bigItemsList.maxLoadedItems();
},



setInitialSize:function(length){

Mojo.Log.error('WARNING: List.mojo.setInitialSize() has been deprecated.  Use setLength() instead.');




if(this.bigItemsList.length===0&&length>0){
this.setLength(length);
}
},


setLength:function(length){
this._setLengthInternal(length,false);
},



setLengthAndInvalidate:function(length){
this._setLengthInternal(length,true);
},


_setLengthInternal:function(length,inval){
var forceUpdate,movedWindow;

this.log("List: Setting length to",length,", inval=",inval);

if(inval){
this.bigItemsList.setLengthAndInvalidate(length);
}else if(length===this.bigItemsList.length){


this.completeLazySetup();
return;
}else{
this.bigItemsList.setLength(length);
}




forceUpdate=this.bigItemsList.length<this.renderLimit||!this.listItemsParent;


movedWindow=this.moveWindowIfInvalid();

if(forceUpdate){
this.updateListItems();
}else if(!movedWindow&&!this.adjustRenderWindow()){

this.saveAnchorPosition();
this.updateSpacers();
}

this.completeLazySetup();
},




getLength:function(){
return this.bigItemsList.length;
},


revealItem:function(index,animate){
var node=this.getNodeByIndex(index);
var top;


if(node){
top=Mojo.View.viewportOffset(node).top;

}else{


if(index<this.renderOffset/2){
top=Mojo.View.viewportOffset(this.topSpacer).top+(index*this.averageItemHeight);
}


else if(index<this.renderOffset){
top=Mojo.View.viewportOffset(this.topSpacer).top+this.topSpacerHeight-((this.renderOffset-index)*this.averageItemHeight);
}


else{
top=Mojo.View.viewportOffset(this.bottomSpacer).top;
top+=(index-(this.renderOffset+this.listItems.length))*this.averageItemHeight;
}



}

this.scroller.mojo.scrollTo(undefined,this.scroller.mojo.getState().top+this.kRevealTopMargin-top,animate);
},


elementOffset:function(element){
return Mojo.View.viewportOffset(element);
},






kRevealTopMargin:200,

kListDeleteCmdAttr:'x-mojo-list-delete-cmd',
kDefaultDeletedProperty:'deleted',



setup:function(){
var defaultListTemplate;
var spacers;
var attributes=this.controller.attributes;
var deleteTemplateName;



Mojo.assert(this.controller.scene.assistant,"Mojo.Widget.List requires a scene assistant to be defined.");
Mojo.assert(attributes&&this.controller.model,"Mojo.Widget.List requires a model. Did you call controller.setupWidgetModel() for "+this.controller.widgetName+"?");





this.itemsProperty=attributes.itemsProperty||'items';


if(!this.controller.attributes.itemsCallback&&!this.controller.attributes.itemsProperty&&
!this.controller.model.items&&this.controller.model.listItems){
this.itemsProperty='listItems';
Mojo.Log.error("WARNING: The default model property for List widget items is now 'items' instead of 'listItems'.  Please update your code.");
}

this.lookahead=attributes.lookahead;

defaultListTemplate=Mojo.Widget.getSystemTemplatePath("list/plain");
this.listTemplate=attributes.listTemplate||defaultListTemplate;
this.dividerTemplate=attributes.dividerTemplate||Mojo.Widget.getSystemTemplatePath('list/divider');
this.onItemRendered=attributes.onItemRendered;

this.deletedProperty=attributes.deletedProperty||this.kDefaultDeletedProperty;
this.preventDeleteProperty=attributes.preventDeleteProperty;


this.uniquenessProperty=attributes.uniquenessProperty;
if(this.uniquenessProperty!==undefined){
this._deletedItems={};
}

this.emptyTemplate=attributes.emptyTemplate;





if(this.controller.model===attributes){
this.controller.model={};
}


this.itemsCallback=attributes.itemsCallback;




if(!this.itemsCallback){
this.itemsCallback=this.loadItemsFromModel;
}else{

this.aboutToActivate=this.aboutToActivate.bindAsEventListener(this);
Mojo.listen(this.controller.scene.sceneElement,Mojo.Event.aboutToActivate,this.aboutToActivate);
}

Mojo.requireFunction(this.itemsCallback,"itemsCallback must be a function.");


this.loadItemsForBigArray=this.loadItemsForBigArray.bind(this);



this.initialAverageRowHeight=attributes.initialAverageRowHeight||60;
this.averageItemHeight=this.initialAverageRowHeight;
this.heightSamples=0;


this.addAsScrollListener=this.addAsScrollListener.bind(this);
this.scroller=Mojo.View.getScrollerForElement(this.controller.element);
Mojo.require(this.scroller,"Failed to find scroller for element, although one might wonder why it is a requirement.");
this.scroller.addEventListener(Mojo.Event.scrollStarting,this.addAsScrollListener,false);
this.scrollThreshold=attributes.scrollThreshold||100;






spacers=Mojo.View.convertToNodeList("<div name='topSpacer' style='background-color:#e4e4e2;'></div><div name='bottomSpacer' style='background-color:#e4e4e2;'></div>",this.controller.document);
this.topSpacer=spacers[0];
this.bottomSpacer=spacers[1];
Element.remove(this.topSpacer);
Element.remove(this.bottomSpacer);

this.contentDiv=this.controller.element;


this.listItems=[];
this.renderOffset=0;
this.renderLimit=attributes.renderLimit||20;
this.savedScrollPos={};



this.handleTap=this.handleTap.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.tap,this.handleTap);
this.handleChange=this.handleChange.bindAsEventListener(this);
this.controller.listen(this.controller.element,'change',this.handleChange);


if(attributes.reorderable){
this.holdHandler=this.holdHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.hold,this.holdHandler);
}


if(attributes.swipeToDelete){
this.dragStartHandler=this.dragStartHandler.bindAsEventListener(this);
this.controller.listen(this.controller.element,Mojo.Event.dragStart,this.dragStartHandler);





if(attributes.autoconfirmDelete){

deleteTemplateName="list/spacer-item";
}else{

deleteTemplateName="list/delete-item";
}
this.deleteTemplateNode=Mojo.View.convertToNode(
Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath(deleteTemplateName)}),
this.controller.document);





if(this.controller.scene._mojoListDeleteCookie===undefined){
this.controller.scene._mojoListDeleteCookie=Math.random()+1;
}
this.deleteTruth=this.controller.scene._mojoListDeleteCookie;
}


this.nullItemTemplate=attributes.nullItemTemplate||Mojo.Widget.getSystemTemplatePath("list/null-item");


if(attributes.swipeToDelete||attributes.reorderable){
Mojo.Drag.setupDropContainer(this.controller.element,this);
this.dragDatatype=attributes.dragDatatype;
}


this.controller.exposeMethods(['focusItem','showAddItem','updateItems','noticeUpdatedItems','getItems','addItems','noticeAddedItems',
'removeItems','noticeRemovedItems','getNodeByIndex','invalidateItems','getLoadedItemRange','getMaxLoadedItems','maxLoadedItems',
'setInitialSize','setLength','setLengthAndInvalidate','getLength','revealItem','getItemByNode']);


if(attributes.addItemLabel){
this.addItemNode=Mojo.View.convertToNode(Mojo.View.render({object:{addItemLabel:attributes.addItemLabel},
template:Mojo.Widget.getSystemTemplatePath("list/add-item")}),this.controller.document);

if(this.addItemNode){
this.addItemVisible=true;
}else{
Mojo.Log.error('WARNING: List.mojo.addItemNode is null. Please verify that you supplied addItemLabel in the widget attributes.');
}
}

this.setupBigList();

},

completeLazySetup:function(){

this.lazySetupComplete=true;


if(this.bigItemsList.length===0&&this.emptyTemplate){
this.updateListItems();
}


if(this.activateContinuationFunc){
this.activateContinuationFunc();
delete this.activateContinuationFunc;
}

},


setupBigList:function(){
if(this.bigItemsList){
this.bigItemsList.cleanup();
}

this.bigItemsList=new Mojo.Model.BigArray(this.loadItemsForBigArray,
{pageSize:this.renderLimit,lookahead:this.lookahead});



if(this.itemsCallback===this.loadItemsFromModel){
this.bigItemsList.setLength(this.controller.model[this.itemsProperty].length);
}
else{

this.bigItemsList.requestFullWindow();
}



if(this.bigItemsList.length===0){
this.renderFromModel();
}

},


cleanup:function(){

this.scroller.removeEventListener(Mojo.Event.scrollStarting,this.addAsScrollListener);

this.controller.stopListening(this.controller.element,Mojo.Event.tap,this.handleTap);
this.controller.stopListening(this.controller.element,'change',this.handleChange);

if(this.controller.attributes.reorderable){
this.controller.stopListening(this.controller.element,Mojo.Event.hold,this.holdHandler);
}


if(this.controller.attributes.swipeToDelete){
this.controller.stopListening(this.controller.element,Mojo.Event.dragStart,this.dragStartHandler);
}
},





renderFromModel:function renderFromModel(){

var attrs=this.controller.attributes;
var model=this.controller.model;
var itemModel;
var item;


if(this.bigItemsList.length===0&&!this.addItemVisible){
if(this.emptyTemplate&&this.lazySetupComplete){
this.contentDiv.innerHTML=Mojo.View.render({object:model,template:this.emptyTemplate,attributes:attrs});
}else{
this.contentDiv.innerHTML='';
}
this.listItemsParent=undefined;
this.log("List: renderFromModel rendering empty list");
return;
}


this.log("************************ WARNING: renderFromModel is slow");

this.renderContainer();

this.setupItemsParent();



this.renderItemsBefore(this.listItems,this.bottomSpacer);




this.updateSpacers();


},


setupItemsParent:function(){
this.log("setupItemsParent");


if(this.topSpacer.parentNode){
Element.remove(this.topSpacer);
Element.remove(this.bottomSpacer);
}
this.listItemsParent.insertBefore(this.topSpacer,this.listItemsParent.firstChild);
this.listItemsParent.appendChild(this.bottomSpacer);


if(this.addItemNode){
if(this.addItemNode.parentNode){
Element.remove(this.addItemNode);
}
if(this.addItemVisible){
this.listItemsParent.appendChild(this.addItemNode);
}
}

return;
},


renderContainer:function(){
var placeholder;

this.log("List: renderContainer");


var obj=Mojo.Model.format(this.controller.model,this.controller.attributes.formatters);
obj.listElements="<div id='MojoListItemsParentMarker'></div>";

this.contentDiv.innerHTML=Mojo.View.render({object:obj,template:this.listTemplate});


placeholder=this.contentDiv.querySelector('#MojoListItemsParentMarker');
this.listItemsParent=placeholder.parentNode;
this.listItemsParent.removeChild(placeholder);

return;
},




rerenderSomeItems:function(offset,limit){
var node,i,newNode;

this.log('List: rerenderSomeItems: offset ',offset,", limit ",limit);


if(!this.listItemsParent){
this.updateListItems();
return;
}

this.saveAnchorPosition();




node=this.getNodeByIndex(offset);
if(node){


for(i=0;i<limit&&node;i++){
newNode=this.findNextListItem(node);
this.removeListItemNode(node);
node=newNode;
}
}


if(!node){
node=this.bottomSpacer;
}


offset-=this.renderOffset;
this.renderItemsBefore(this.listItems.slice(offset,offset+limit),node);

this.updateSpacers();

},


removeListItemNode:function(node){
var spacer=node._mojoDeleteSpacer;
if(spacer&&spacer._mojoListIndex===undefined&&spacer.parentNode){
spacer.remove();
}

if(node.parentNode){
node.remove();
}
},



_maybeRemeasureChildWidgets:function(){
if(this.maybeVisible){
this.controller.scene.showWidgetContainer(this.controller.element);
}
},


subtreeShown:function(){






this.maybeVisible=true;

},

subtreeHidden:function(){
this.maybeVisible=false;
},


renderItemsBefore:function renderItemsBefore(itemModels,beforeNode){


var attrs=this.controller.attributes;
var divFunc=attrs.dividerFunction;
var content,nullContent;
var i,formattedObj;
var itemTemplate=attrs.itemTemplate;
var renderedItems,itemContent,itemNode,itemModel,modelIndex,formattedModels;
var confirmedDeletes;

this.log("renderItemsBefore");



renderedItems=[];
formattedModels=[];

for(i=0;i<itemModels.length;i++){

itemModel=itemModels[i];
if(itemModel===null){
nullContent=nullContent||Mojo.View.render({object:{averageItemHeight:this.averageItemHeight},template:this.nullItemTemplate});
itemContent=nullContent;
formattedObj=null;
}else{
formattedObj=Mojo.Model.format(itemModel,attrs.formatters);
itemContent=Mojo.View.render({object:formattedObj,template:itemTemplate});
}


if(this.controller.attributes.secondaryItemTemplate&&itemModel){

formattedObj.secondaryContent=itemContent;
itemContent=Mojo.View.render({object:formattedObj,template:this.controller.attributes.secondaryItemTemplate});
}

formattedModels.push(formattedObj);
renderedItems.push(itemContent);
}





content=renderedItems.join('');
content=$A(Mojo.View.convertToNodeList(content,this.controller.document));






modelIndex=0;
for(i=0;i<content.length;i++){
itemNode=content[i];
if(itemNode&&itemNode.nodeType===itemNode.ELEMENT_NODE){
itemNode._mojoListIndex=-1;
itemModel=itemModels[modelIndex];
formattedObj=formattedModels[modelIndex];
modelIndex++;


if(divFunc&&formattedObj){
itemNode._mojoListDividerLabel=divFunc(formattedObj);
}

this.listItemsParent.insertBefore(itemNode,beforeNode);
if(itemModel){
itemNode._mojoListItemModel=itemModel;
if(this.preventDeleteProperty){
itemNode._ignoreSwipeToDelete=!!itemModel[this.preventDeleteProperty];
}
this.controller.instantiateChildWidgets(itemNode,itemModel);
}


if(itemModel&&this.onItemRendered){
this.onItemRendered(this.controller.element,itemModel,itemNode);
}


if(this.controller.attributes.swipeToDelete&&itemModel&&this.isModelDeleted(itemModel)){

this.replaceWithDeleteSpacer(itemNode);




if(this.isModelDeleteConfirmed(itemModel)||this.controller.attributes.autoconfirmDelete){
itemNode._mojoDeleteSpacer.style.height="0px";
confirmedDeletes=confirmedDeletes||[];
confirmedDeletes.push(itemNode._mojoDeleteSpacer);
}

}

}
}





this.renumberListItems();




this.updateDividers();



this.updateListClasses();







this._maybeRemeasureChildWidgets();




if(confirmedDeletes){
for(i=0;i<confirmedDeletes.length;i++){
this.deleteDraggedItemWithEvent(confirmedDeletes[i]);
}
}


return;
},



applyDeltaToListItems:function(delta){
var newItems;
var node;
var index;
var count=Math.abs(delta);
var loadIndex,insertType,removeIndex,beforeNode,nodeIterator;

this.log("applyDeltaToListItems: ",delta,", new offset: ",(this.renderOffset+delta));

if(count===0){
return;
}





if(delta>0){
loadIndex=this.renderOffset+delta+this.listItems.length-count;
insertType='push';
removeIndex=0;
nodeIterator=this.findNextListItem;

}else{
loadIndex=this.renderOffset+delta;
insertType='unshift';
removeIndex=this.listItems.length-count;
nodeIterator=this.findPrevListItem;
}



newItems=this.bigItemsList.slice(loadIndex,loadIndex+count,true);


this.listItems.splice(removeIndex,count);
this.listItems[insertType].apply(this.listItems,newItems);


this.renderOffset+=delta;





for(node=nodeIterator.call(this);node&&count>0;count--){


if(node._mojoListIndex<delta||node._mojoListIndex>=this.renderLimit+delta){
this.removeListItemNode(node);
}else{
break;
}
node=nodeIterator.call(this);
}




if(delta>0){
beforeNode=this.bottomSpacer;
}else{
beforeNode=this.topSpacer.nextSibling;



while(beforeNode.nextSibling&&(beforeNode.nextSibling._mojoListDivider||beforeNode.nodeType!=beforeNode.ELEMENT_NODE)){
beforeNode=beforeNode.nextSibling;
}
}
this.renderItemsBefore(newItems,beforeNode);


this.updateSpacers();


},



updateListClasses:function(){
var node,count;

if(!this.listItemsParent){
return;
}


node=this.listItemsParent.firstChild;
count=0;
while(node){

if(node._mojoListIndex!==undefined){


if(node.nextSibling&&node.nextSibling._mojoListDivider){

if(count===0){
this.setListClasses(node,true,false,false);
}else{
this.setListClasses(node,false,false,true);
}
}else{

if(count===0){
this.setListClasses(node,false,true,false);
}else{
this.setListClasses(node,false,false,false);
}
}

count++;

}else if(node._mojoListDivider){
count=0;
}

node=node.nextSibling;
}


if(this.renderOffset===0&&this.bigItemsList.length===1){
node=this.findNextListItem();
if(node){

if(!this.addItemVisible){
this.setListClasses(node,true,false,false);
}else if(this.addItemVisible&&this.addItemNode){
this.setListClasses(node,false,true,false);
}
}
}


if(this.renderOffset+this.listItems.length===this.bigItemsList.length&&
this.bigItemsList.length>1&&!this.addItemVisible){
node=this.findPrevListItem();
if(node){

if(node.previousSibling&&node.previousSibling._mojoListDivider){
this.setListClasses(node,true,false,false);
}else{
this.setListClasses(node,false,false,true);
}
}
}
},


setListClasses:function(node,single,first,last){
this.twiddleClassName(node,single,'_mojoListSingle','single');
this.twiddleClassName(node,first,'_mojoListFirst','first');
this.twiddleClassName(node,last,'_mojoListLast','last');
},


copyListClasses:function(targetNode,srcNode){
this.twiddleClassName(targetNode,!!srcNode._mojoListSingle,'_mojoListSingle','single');
this.twiddleClassName(targetNode,!!srcNode._mojoListFirst,'_mojoListFirst','first');
this.twiddleClassName(targetNode,!!srcNode._mojoListLast,'_mojoListLast','last');
},


twiddleClassName:function(node,apply,propName,className){
if(apply&&!node[propName]){
Element.addClassName(node,className);
node[propName]=true;
}else if(!apply&&node[propName]){
Element.removeClassName(node,className);
delete node[propName];
}
},


updateDividers:function updateDividers(){
var node,curDivider,prevDivider,dupDivider;
var newDivider,itemModel;
var template;


if(!this.listItemsParent||!this.controller.attributes.dividerFunction){
return;
}




template=this.controller.attributes.dividerTemplate||this.dividerTemplate;





node=this.listItemsParent.firstChild;
while(node){


if(node._mojoListIndex!==undefined||node._mojoListDivider){


if(node._mojoListIndex!==undefined){
itemModel=this.listItems[node._mojoListIndex];


if(itemModel){




if(node._mojoListDividerLabel!==undefined&&prevDivider&&prevDivider._mojoListDividerLabel!=node._mojoListDividerLabel){
prevDivider.parentNode.removeChild(prevDivider);
prevDivider=undefined;
curDivider=undefined;
}




if(node._mojoListDividerLabel!==undefined&&(!curDivider||curDivider._mojoListDividerLabel!=node._mojoListDividerLabel)){
newDivider=Mojo.Model.decorate(itemModel);
newDivider.dividerLabel=node._mojoListDividerLabel;
newDivider=Mojo.View.render({object:newDivider,template:template});
newDivider=Mojo.View.convertToNode(newDivider,this.controller.document);
newDivider._mojoListDividerLabel=node._mojoListDividerLabel;
newDivider._mojoListDivider=true;
this.listItemsParent.insertBefore(newDivider,node);
curDivider=newDivider;
}
}
}


if(node._mojoListDivider){


if(prevDivider){
prevDivider.parentNode.removeChild(prevDivider);
}


if(curDivider&&curDivider._mojoListDividerLabel==node._mojoListDividerLabel){
dupDivider=node;
node=node.previousSibling;
dupDivider.parentNode.removeChild(dupDivider);
}else{
curDivider=node;
prevDivider=curDivider;
}
}else{
prevDivider=undefined;
}
}

node=node.nextSibling;
}





if(curDivider&&(!curDivider.nextSibling||curDivider.nextSibling._mojoListIndex===undefined)){
curDivider.remove();
}
},




renumberListItems:function(){
var i=0;
var node=this.listItemsParent.firstChild;

while(node){
if(node._mojoListIndex!==undefined){





if(this.reorderDummyNode&&this.reorderDummyNode!==node&&
this.reorderDummyNode._mojoAbsoluteListIndex===this.renderOffset+i){
node.parentNode.replaceChild(this.reorderDummyNode,node);
node=this.reorderDummyNode;
}

node._mojoListIndex=i;
i++;
}
node=node.nextSibling;
}
},


handleModelChanged:function(){
this.log("List: handleModelChanged");
this.renderOffset=0;
this.savedScrollPos={};
this.listItems.clear();
this.listItemsParent=undefined;
this.controller.element.innerHTML='';

this.setupBigList();
this.updateSpacers();
this.log("List: handleModelChanged done.");


if(this.scroller&&this.scroller.mojo){
this.scroller.mojo.validateScrollPosition();
}
},



findNextListItem:function(node,skipReorderDummy){
if(!this.listItemsParent){
return null;
}
node=node?node.nextSibling:this.listItemsParent.firstChild;
while(node&&(node._mojoListIndex===undefined||(skipReorderDummy&&node===this.reorderDummyNode))){
node=node.nextSibling;
}
return node;
},



findPrevListItem:function(node,skipReorderDummy){
if(!this.listItemsParent){
return null;
}
node=node?node.previousSibling:this.listItemsParent.lastChild;
while(node&&(node._mojoListIndex===undefined||(skipReorderDummy&&node===this.reorderDummyNode))){
node=node.previousSibling;
}
return node;
},




_findDataObj:function(event){
var index=Mojo.Widget.Util.findListItemIndex(event,this.listItemsParent);

if(index===undefined){
return undefined;
}

return this.listItems[index];
},








handleTap:function(event){
var index,dataObj,node,isAddNode;


if(Mojo.View.isTextField(event.target)){
return;
}


isAddNode=(event.target?(event.target.getAttribute('name')==="palm-add-item"):false);


node=Mojo.Widget.Util.findListItemNode(event.target,this.listItemsParent);
if(!isAddNode&&(!node||node._mojoDeletedListNode||node._mojoSwipeDeleteDragger)){
return;
}


if(node){
index=node._mojoListIndex;
if(index!==undefined){
dataObj=this.listItems[index];
}
}



if(dataObj){
Event.stop(event);
Mojo.Event.send(this.controller.element,Mojo.Event.listTap,
{model:this.controller.model,item:dataObj,index:index+this.renderOffset,originalEvent:event});
}

else if(isAddNode){
Event.stop(event);
Mojo.Event.send(this.controller.element,Mojo.Event.listAdd,{model:this.controller.model,originalEvent:event});
}

},


handleChange:function(event){
var index=Mojo.Widget.Util.findListItemIndex(event,this.listItemsParent);
var dataObj;

if(index!==undefined){
dataObj=this.listItems[index];
}

if(dataObj){
Event.stop(event);
Mojo.Event.send(this.controller.element,Mojo.Event.listChange,
{model:this.controller.model,item:dataObj,index:index+this.renderOffset,originalEvent:event});
}
},


aboutToActivate:function(event){



if(!this.lazySetupComplete){
this.activateContinuationFunc=event.synchronizer.wrap(Mojo.doNothing);
}

Mojo.stopListening(this.controller.scene.sceneElement,Mojo.Event.aboutToActivate,this.aboutToActivate);
},



addAsScrollListener:function(event){
event.scroller.addListener(this);
},



dragStartHandler:function(event){
var node;


if(!this.controller.attributes.swipeToDelete){
return;
}

if(Math.abs(event.filteredDistance.x)>2*Math.abs(event.filteredDistance.y)){


node=Mojo.Widget.Util.findListItemNode(event.target,this.listItemsParent);

if(node&&!node._ignoreSwipeToDelete){

if(!node._mojoDeletedListNode&&!node._mojoSwipeDeleteDragger){




node.removeClassName(Mojo.Gesture.kSelectedClassName);



node._mojoSwipeDeleteDragger=true;
node._mojoOriginalHeight=Element.getHeight(node);

node._mojoSwipeDeleteDragger=Mojo.Drag.startDragging(this.controller.scene,node,event.down,
{preventVertical:true,
draggingClass:this.kDeleteDragClass,
preventDropReset:true});

event.stop();
}
}
}
},


holdHandler:function(event){
var dragger,node,dummyNode;


node=Mojo.Widget.Util.findListItemNode(event.target,this.listItemsParent);
if(node&&!node._mojoDeletedListNode){

Element.removeClassName(node,'selected');



node._mojoAbsoluteListIndex=node._mojoListIndex+this.renderOffset;



dummyNode=this.controller.document.createElement('div');
dummyNode.style.height='0px';
this.listItemsParent.insertBefore(dummyNode,node);

dummyNode._mojoListIndex=node._mojoListIndex;
dummyNode._mojoListItemModel=node._mojoListItemModel;
dummyNode._mojoAbsoluteListIndex=node._mojoAbsoluteListIndex;



this.reorderDummyNode=dummyNode;



node._mojoListIndex=undefined;


this.beginningReorder=true;

dragger=Mojo.Drag.startDragging(this.controller.scene,node,event.down,
{preventHorizontal:true,allowExit:!!this.dragDatatype,
draggingClass:this.kReorderDragClass,
dragDatatype:this.dragDatatype,autoscroll:true});


node.style.marginLeft='6px';
}



},







dragEnter:function(el){

var elHeight;

if(this.controller.attributes.fixedHeightItems){
elHeight=this.averageItemHeight;
}else{
elHeight=el.getHeight();
}
this.dragHeight=elHeight;
this.dragAdjNode=undefined;


if(el._mojoSwipeDeleteDragger){
this.handleSwipeDeleteEnter(el);
}else{



if(el.parentNode===this.listItemsParent){
this.dragAdjNode=el.nextSibling;
}

this.dragAdjNode=this.findAdjacentDragNode(el,-elHeight/2);


this.addSpacerBeforeNode(this.dragAdjNode,this.beginningReorder);
this.beginningReorder=undefined;
}

},


dragHover:function(el){
var newAdj;

if(!el._mojoSwipeDeleteDragger){
newAdj=this.findAdjacentDragNode(el);
if(newAdj&&newAdj!==this.dragAdjNode){
this.dragAdjNode=newAdj;
this.addSpacerBeforeNode(newAdj);
}
}

},



dragDrop:function(el,newItem){
var newPos;
var oldPos;
var itemModel,items;
var listEvent;


this.removeReorderDummyNode();


if(el._mojoSwipeDeleteDragger){
this.handleSwipeDeleteDrop(el);
return;
}

oldPos=el._mojoAbsoluteListIndex;
newPos=this.findDroppedIndex()+this.renderOffset;


delete el._mojoAbsoluteListIndex;


if(this.curDragSpacer){
this.curDragSpacer.parentNode.replaceChild(el,this.curDragSpacer);
this.curDragSpacer=undefined;
}

if(oldPos===undefined){
return;
}





if(newItem){
listEvent=Mojo.Event.send(this.controller.element,Mojo.Event.listAdd,
{model:this.controller.model,item:el._mojoListItemModel,index:newPos});

if(!listEvent.defaultPrevented){
this.noticeAddedItems(newPos,[el._mojoListItemModel]);

}
}

else{



if(newPos>oldPos){
newPos--;
}


el._mojoListIndex=newPos-this.renderOffset;



this.renumberListItems();

if(oldPos!=newPos){

Mojo.Event.send(this.controller.element,Mojo.Event.listReorder,
{model:this.controller.model,item:el._mojoListItemModel,
fromIndex:oldPos,toIndex:newPos});


if(this.bigItemsList.reorderItem(oldPos,newPos)){
this.updateListItems();
}
}
}

},



dragRemove:function(el){
this.removeReorderDummyNode();


this.deleteItemWithEvent(el,undefined);
},



dragLeave:function(el){
this.log("got leave");
this.removeCurDragSpacer();
},


removeCurDragSpacer:function(){
var f,spacer;

spacer=this.curDragSpacer;
this.curDragSpacer=undefined;

if(spacer){
f=function(el){
if(el.parentNode){
el.remove();
}
};

Mojo.Animation.animateStyle(spacer,'height','ease-out',{from:this.dragHeight,to:0,duration:0.1,onComplete:f});
}

},


removeReorderDummyNode:function(){
var node=this.reorderDummyNode;

if(node&&node.parentNode){
node.remove();
}

delete this.reorderDummyNode;
},


addSpacerBeforeNode:function(adjacentNode,startFullHeight){
var spacer;
var heightNodes;
var i,height;

this.removeCurDragSpacer();


if(!this.reorderTemplateNode){
this.reorderTemplateNode=Mojo.View.convertToNode(
Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath("list/spacer-item")}),
this.controller.document);
}

spacer=this.reorderTemplateNode.cloneNode(true);

heightNodes=spacer.querySelectorAll("div[x-mojo-set-height]");
height=this.dragHeight+'px';
for(i=0;i<heightNodes.length;i++){
heightNodes[i].style.height=height;
}


if(startFullHeight){
spacer.style.height=this.dragHeight+'px';
}

this.listItemsParent.insertBefore(spacer,adjacentNode);

if(!startFullHeight){
spacer.style.height='0px';
Mojo.Animation.animateStyle(spacer,'height','ease-out',{from:0,to:this.dragHeight,duration:0.1});
}

this.curDragSpacer=spacer;
},



findAdjacentDragNode:function(el,offset){
var elY=el.offsetTop+(this.dragHeight/2)+(offset||0);
var foundNode;
var curNode=this.findPrevListItem(this.dragAdjNode,true);


while(curNode){

if(curNode!==el){

if(elY>curNode.offsetTop+(curNode.offsetHeight*0.25)){
break;
}
foundNode=curNode;
}
curNode=this.findPrevListItem(curNode,true);
}


if(foundNode){
return foundNode;
}


curNode=this.dragAdjNode;
while(curNode){
if(curNode!==el){

if(elY<curNode.offsetTop+(curNode.offsetHeight*0.75)){
break;
}
foundNode=curNode;
}
curNode=this.findNextListItem(curNode,true);
}



if(foundNode){
return this.findNextListItem(foundNode,true)||this.addItemNode||this.bottomSpacer;
}



return this.dragAdjNode||this.addItemNode||this.bottomSpacer;
},



findDroppedIndex:function(el){
var index=0;
var nextNode=0;

if(this.curDragSpacer){
nextNode=this.findNextListItem(this.curDragSpacer);
if(nextNode){
index=nextNode._mojoListIndex;
}else{
nextNode=this.findPrevListItem(this.curDragSpacer);
if(nextNode){
index=nextNode._mojoListIndex+1;
}
}
}


return index;
},






isModelDeleted:function(itemModel){
var uniqueVal,val;
if(this.uniquenessProperty!==undefined){
uniqueVal=itemModel[this.uniquenessProperty];
return!!this._deletedItems[uniqueVal];
}

val=itemModel[this.deletedProperty];
return(val===this.deleteTruth||val===this.kDeletedItemConfirmed);
},


isModelDeleteConfirmed:function(itemModel){
var uniqueVal;
if(this.uniquenessProperty!==undefined){
uniqueVal=itemModel[this.uniquenessProperty];
return this._deletedItems[uniqueVal]===this.kDeletedItemConfirmed;
}

return(itemModel[this.deletedProperty]===this.kDeletedItemConfirmed);
},


markModelDeleted:function(itemModel,deleteState){
var uniqueVal;

if(!itemModel){
return;
}





if(this.uniquenessProperty!==undefined){
uniqueVal=itemModel[this.uniquenessProperty];
if(deleteState){
this._deletedItems[uniqueVal]=deleteState;
}else{
delete this._deletedItems[uniqueVal];
}
}else{

if(deleteState===this.kDeletedItemSwiped){
deleteState=this.deleteTruth;
}
itemModel[this.deletedProperty]=deleteState;





if(deleteState!==this.kDeletedItemConfirmed){
Mojo.Event.send(this.controller.element,Mojo.Event.propertyChange,
{property:this.deletedProperty,
value:itemModel[this.deletedProperty],
model:itemModel
});
}
}
},


purgeItemMark:function(itemModel){
if(this.uniquenessProperty!==undefined){
this.markModelDeleted(itemModel,this.kDeletedItemCancelled);
}else{
itemModel[this.deletedProperty]=this.kDeletedItemCancelled;
}
},



handleSwipeDeleteEnter:function(el){
this.insertDeleteSpacer(el);


el._mojoOrigOffsetLeft=el.offsetLeft;

},


handleSwipeDeleteDrop:function(el){
var f;
var delta=el.offsetLeft-el._mojoOrigOffsetLeft;
var inPos,outPos,deleteThreshold;

inPos=el._mojoOrigOffsetLeft;
outPos=delta>0?640:-640;





deleteThreshold=this.controller.window.innerWidth*0.65;
if(Math.abs(delta)>deleteThreshold){




inPos=el.offsetLeft;
if(delta>0){
outPos=inPos+(outPos-deleteThreshold);
}else{
outPos=inPos+(outPos+deleteThreshold);
}


f=this.completeSwipeDelete.bind(this,el,false);






Mojo.Animation.animateStyle(el,'left','ease-in',{from:inPos,to:outPos,duration:0.27,onComplete:f});











this.markModelDeleted(el._mojoListItemModel,this.kDeletedItemSwiped);



if(!this.controller.attributes.autoconfirmDelete){
this.confirmOtherDeletes(el._mojoDeleteSpacer);
}
}else{

f=this.completeSwipeDelete.bind(this,el,true);
Mojo.Animation.animateStyle(el,'left','ease-out',{from:outPos,to:inPos,duration:0.25,onComplete:f});
}

delete el._mojoOrigOffsetLeft;
},



completeSwipeDelete:function(el,cancelled){
var deleteSpacer;



el._mojoSwipeDeleteDragger.resetElement();
delete el._mojoSwipeDeleteDragger;


if(cancelled||el.parentNode!==this.listItemsParent){
deleteSpacer=el._mojoDeleteSpacer;
if(deleteSpacer.parentNode){
deleteSpacer.remove();
}
delete el._mojoDeleteSpacer;
}else{



this.replaceWithDeleteSpacer(el);


if(this.controller.attributes.autoconfirmDelete){
this.confirmDelete(el._mojoDeleteSpacer);
}else{






this.confirmOtherDeletes(el._mojoDeleteSpacer);
}
}

},


confirmOtherDeletes:function(newDeleteSpacer){
var deleteSpacer;



deleteSpacer=this.findNextListItem();
while(deleteSpacer){
if(deleteSpacer!==newDeleteSpacer&&deleteSpacer._mojoDeletedListNode){
this.confirmDelete(deleteSpacer);
}
deleteSpacer=this.findNextListItem(deleteSpacer);
}

},



confirmDelete:function(deleteSpacer){
var border;
var model=deleteSpacer._mojoDeletedListNode._mojoListItemModel;



if(!this.isModelDeleted(model)||this.isModelDeleteConfirmed(model)){
return;
}


this.markModelDeleted(model,this.kDeletedItemConfirmed);




Mojo.Animation.animateStyle(deleteSpacer,'height','linear',{from:deleteSpacer.offsetHeight,to:0,duration:0.15,onComplete:this.deferDeleteItemWithEvent.bind(this,deleteSpacer)});

},


deferDeleteItemWithEvent:function(deleteSpacer){
this.deleteDraggedItemWithEvent.bind(this,deleteSpacer).defer();
},


handleSwipeDeleteTap:function(event,itemNode){
var buttonNode,action;
var itemModel;

Event.stop(event);

buttonNode=Mojo.View.findParentByAttribute(event.target,undefined,this.kListDeleteCmdAttr);
action=buttonNode&&buttonNode.getAttribute(this.kListDeleteCmdAttr);


if(action!=="undo"&&action!=="delete"){
return;
}


if(action==="undo"){

this.cleanupSwipeDelete(itemNode);




itemModel=this.listItems[itemNode._mojoListIndex];
this.markModelDeleted(itemModel,this.kDeletedItemCancelled);

}else if(action==="delete"){
this.confirmDelete(itemNode._mojoDeleteSpacer);
}

},


deleteDraggedItemWithEvent:function(deleteSpacer){
var itemNode;
var ancestor;




ancestor=deleteSpacer.parentNode;
while(ancestor&&ancestor!==this.controller.scene.document){
ancestor=ancestor.parentNode;
}



if(!ancestor){
return;
}

itemNode=deleteSpacer._mojoDeletedListNode;
this.cleanupSwipeDelete(itemNode);
this.deleteItemWithEvent(itemNode);
},



deleteItemWithEvent:function(el,origEvent){
var deleteEvent;


this.purgeItemMark(el._mojoListItemModel);


deleteEvent=Mojo.Event.send(this.controller.element,Mojo.Event.listDelete,
{model:this.controller.model,item:el._mojoListItemModel,
index:el._mojoListIndex+this.renderOffset,
originalEvent:origEvent});








if(!deleteEvent.defaultPrevented){
this.noticeRemovedItems(el._mojoListIndex+this.renderOffset,1);
}
},



insertDeleteSpacer:function(itemNode){
var spacer=this.deleteTemplateNode.cloneNode(true);
var heightNodes,i,height;
this.listItemsParent.insertBefore(spacer,itemNode);
itemNode._mojoDeleteSpacer=spacer;



itemNode._mojoOriginalHeight=itemNode._mojoOriginalHeight||Element.getHeight(itemNode);

height=itemNode._mojoOriginalHeight+'px';
spacer.style.height=height;

heightNodes=spacer.querySelectorAll("div[x-mojo-set-height]");
for(i=0;i<heightNodes.length;i++){
heightNodes[i].style.height=height;
}

this.copyListClasses(spacer,itemNode);

},



replaceWithDeleteSpacer:function(itemNode){


if(!itemNode._mojoDeleteSpacer){
this.insertDeleteSpacer(itemNode);
}

itemNode._mojoDeleteSpacer._mojoDeletedListNode=itemNode;
itemNode._mojoDeleteSpacer._mojoListIndex=itemNode._mojoListIndex;
itemNode._mojoDeleteSpacer._mojoListDividerLabel=itemNode._mojoListDividerLabel;
itemNode._mojoListIndex=undefined;

if(itemNode.parentNode){
itemNode.remove();
}


if(!this.controller.attributes.autoconfirmDelete){
itemNode._mojoDeleteSpacer.addEventListener(Mojo.Event.tap,this.handleSwipeDeleteTap.bindAsEventListener(this,itemNode),false);
}
},


cleanupSwipeDelete:function(itemNode){
var spacer;

itemNode._mojoListIndex=itemNode._mojoDeleteSpacer._mojoListIndex;

spacer=itemNode._mojoDeleteSpacer;

if(spacer&&spacer.parentNode){
spacer.parentNode.insertBefore(itemNode,spacer);
spacer.remove();
}

delete itemNode._mojoDeleteSpacer;
delete spacer._mojoListIndex;

return;
},






loadItemsFromModel:function(listWidget,offset,count){
var items=this.controller.model[this.itemsProperty];
listWidget.mojo.noticeUpdatedItems(offset,items.slice(offset,offset+count));
},



loadItemsForBigArray:function(offset,count){
return this.itemsCallback(this.controller.element,offset,count);
},

moved:function(scrollEnding,position){
var lastScrollY;








if(!this.maybeVisible){
return;
}

lastScrollY=this.lastScrollY;
if(lastScrollY===undefined||scrollEnding||Math.abs(lastScrollY-position.y)>this.scrollThreshold){
this.adjustRenderWindow();




this.lastScrollY=this.scroller.mojo.getScrollPosition().top;
}else{
this._adjustDelta=0;
}






},





adjustRenderWindow:function adjustRenderWindow(){
var topIndex,anchorNode,anchorTop,anchorIndex;
var offsetDelta;







anchorNode=this.findNextListItem();
if(anchorNode){
anchorTop=this.elementOffset(anchorNode).top;
offsetDelta=anchorTop-anchorNode.offsetTop;





do{
anchorTop=anchorNode.offsetTop+offsetDelta;
anchorIndex=anchorNode._mojoListIndex;
anchorNode=this.findNextListItem(anchorNode);
}while(anchorNode&&anchorTop<0);


topIndex=this.renderOffset+anchorIndex+Math.floor(-anchorTop/this.averageItemHeight);


topIndex-=Math.max(Math.round((this.scrollThreshold+100)/this.averageItemHeight),3);





topIndex=Math.min(topIndex,this.bigItemsList.length-this.renderLimit);
topIndex=Math.max(topIndex,0);





if(topIndex!=this.renderOffset){

this.log("topIndex=",topIndex,", updating!");
offsetDelta=topIndex-this.renderOffset;



this.updateListItems(topIndex);






this._adjustDelta=offsetDelta;
return true;
}
}




this._adjustDelta=0;

return false;
},



moveWindowIfInvalid:function(){


if(this.renderOffset+this.renderLimit>this.bigItemsList.length){
return this.updateListItems(Math.max(0,this.bigItemsList.length-this.renderLimit));
}

return false;
},


updateListItems:function updateListItems(newRenderOffset){
var delta;

this.log('List: updateListItems: newRenderOffset=',newRenderOffset);




if(this.renderOffset===newRenderOffset){
return false;
}


this.saveAnchorPosition();



if(newRenderOffset!==undefined){
delta=newRenderOffset-this.renderOffset;
}else{
newRenderOffset=this.renderOffset;
}







if(delta!==undefined&&delta>-this.renderLimit&&delta<this.renderLimit){

this.applyDeltaToListItems(delta);

}else{
this.listItems=this.bigItemsList.slice(newRenderOffset,newRenderOffset+this.renderLimit,true);
this.renderOffset=newRenderOffset;
this.renderFromModel();
}

return true;

},



saveAnchorPosition:function(){
var node;


if(!this.topSpacer){
return;
}


node=this.findNextListItem();

if(node){
this.savedScrollPos.firstIndex=node._mojoListIndex+this.renderOffset;
this.savedScrollPos.firstTop=node.offsetTop;
}else{
this.savedScrollPos.firstIndex=undefined;
this.savedScrollPos.firstTop=undefined;
}

this.log('List: saveAnchorPosition ',this.savedScrollPos.firstIndex,", top=",this.savedScrollPos.firstTop);


node=this.findPrevListItem();

if(node){
this.savedScrollPos.lastIndex=node&&node._mojoListIndex+this.renderOffset;
this.savedScrollPos.lastTop=node&&node.offsetTop;
}else{
this.savedScrollPos.lastIndex=undefined;
this.savedScrollPos.lastTop=undefined;
}

},


updateSpacers:function updateSpacers(){
var oldTop,newTop,newNode;
var maxSpacerHeight;
var topHeight,bottomHeight;


if(this.savedScrollPos.firstIndex!==undefined){


newNode=this.getNodeByIndex(this.savedScrollPos.firstIndex);
if(newNode){
oldTop=this.savedScrollPos.firstTop;
}
else{
newNode=this.getNodeByIndex(this.savedScrollPos.lastIndex);
oldTop=this.savedScrollPos.lastTop;
}
}


if(newNode){
newTop=newNode.offsetTop;
this.topSpacerHeight-=newTop-oldTop;
this.log("List: updateSpacers using item ",(newNode._mojoListIndex+this.renderOffset));
}else{

this.topSpacerHeight=this.renderOffset*this.averageItemHeight;
}

this.log("List.updateSpacers: oldTop=",oldTop,", newTop=",newTop);









if((this.renderOffset===0&&this.topSpacerHeight!==0)||this.topSpacerHeight<0){
this.log('List.updateSpacers: Adjusting by',this.topSpacerHeight);
this.scroller.mojo.adjustBy(0,this.topSpacerHeight);
this.topSpacerHeight=0;
}


maxSpacerHeight=this.kMaxSpacerHeight;
if(this.topSpacerHeight>maxSpacerHeight){
this.log('Max exceeded, Adjusting by',(this.topSpacerHeight-maxSpacerHeight));
this.scroller.mojo.adjustBy(0,this.topSpacerHeight-maxSpacerHeight);
this.topSpacerHeight=maxSpacerHeight;
}


topHeight=this.topSpacer.offsetHeight;
bottomHeight=this.bottomSpacer.offsetHeight;

if(this.topSpacerHeight!==topHeight){
this.topSpacer.style.height=this.topSpacerHeight+'px';
}



this.bottomSpacerHeight=(this.bigItemsList.length-(this.renderOffset+this.listItems.length))*this.averageItemHeight;
this.bottomSpacerHeight=Math.min(this.bottomSpacerHeight,maxSpacerHeight);
if(bottomHeight!==this.bottomSpacerHeight){
this.bottomSpacer.style.height=this.bottomSpacerHeight+'px';
}

},



estimateHeight:function(start,end){
return Math.floor((end-start)*this.averageItemHeight);
},


_getTrueHeight:function(node){
var sibling=this.findNextListItem(node);
if(sibling){
return sibling.offsetTop-node.offsetTop;
}else if(this.bottomSpacer&&this.bottomSpacer.parentNode===this.listItemsParent){
return this.bottomSpacer.offsetTop-node.offsetTop;
}else{

return node.offsetHeight;
}
},


measureItemHeights:function(){
var node,height;

if(this.controller.attributes.fixedHeightItems){
if(!this._measuredFixedItem){
node=this.findNextListItem();
if(node){
height=this._getTrueHeight(node);
if(height&&height>0){
this.averageItemHeight=height;
this._measuredFixedItem=true;
}
}
}
return;
}




for(node=this.listItemsParent&&this.listItemsParent.firstChild;node;node=node.nextSibling){



if(node._mojoListIndex!==undefined){



height=this._getTrueHeight(node);
if(height>0){

if(this.heightSamples>30){
this.heightSamples--;
}



this.averageItemHeight=((this.heightSamples*this.averageItemHeight)+height)/(this.heightSamples+1);
this.heightSamples++;
}
}
}
}

});


Mojo.Log.addLoggingMethodsToClass(Mojo.Widget.List);

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */








Mojo.Widget.PasswordField=function(){
this.usePasswordTemplate=true;
Mojo.Widget.TextField.apply(this);
};

Mojo.Widget.PasswordField.prototype=Mojo.Widget.TextField.prototype;
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.ImageViewCrop=Class.create({
IMG_WIDTH_ADJUST:38,

initialize:function()
{
},


setup:function()
{
Mojo.assert(this.controller.element,
"Mojo.Widget.ImageViewCrop requires an element");
Mojo.assert(this.controller.model,
"Mojo.Widget.ImageViewCrop requires a model. "+
"Did you call controller.setupWidgetModel() for "+
this.controller.widgetName+"?");

Mojo.assert(this.controller.attributes.source,
"Mojo.Widget.ImageViewCrop requires source");
Mojo.assert(this.controller.attributes.callback,
"Mojo.Widget.ImageViewCrop requires callback");
Mojo.assert(this.controller.attributes.width,
"Mojo.Widget.ImageViewCrop requires width");
Mojo.assert(this.controller.attributes.height,
"Mojo.Widget.ImageViewCrop requires height");

this.source=this.controller.attributes.source;
this.targetWidth=this.controller.attributes.width;
this.targetHeight=this.controller.attributes.height;
this.limitZoom=(this.controller.attributes.limitZoom===undefined)?true:this.controller.attributes.limitZoom;
this.background=
this.controller.attributes.background||
this.controller.attributes.backgroundColor;
this.backgroundImage=
this.controller.attributes.backgroundImage;
this.element=this.controller.element;

this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;


this.element.innerHTML=Mojo.View.render({
object:{title:this.controller.attributes.text||""},
template:Mojo.Widget.getSystemTemplatePath(
'/imageviewcrop'),
attributes:{divPrefix:this.divPrefix}
});

this.heightElement=this.controller.get(this.divPrefix+'ViewportHeight');
this.widthElement=this.controller.get(this.divPrefix+'ViewportWidth');



this.imageViewWidget=this.element.down();
this.overlayElement=this.element.down().next(1);

this.buttonElement=this.element.down('.palm-button');

if(this.controller.attributes.html)
{
this.buttonElement.innerHTML=this.controller.attributes.html;
}

this.imageViewWidget.width=this.element.width;
this.imageViewWidget.height=this.element.height;
this.imageViewWidget.style.width=this.element.style.width;
this.imageViewWidget.style.height=this.element.style.height;

this.imageViewWidget.identify();


this.widthElement.style.width=(this.targetWidth-this.IMG_WIDTH_ADJUST)+"px";
this.heightElement.style.height=this.targetHeight+"px";
this.controller.scene.setupWidget(this.imageViewWidget.id,
{
noExtractFS:true,
limitZoom:this.limitZoom,
panInsetX:(this.element.width-this.targetWidth)/2,
panInsetY:(this.element.height-this.targetHeight)/2

},{
background:this.background,
backgroundImage:this.backgroundImage
});

this.controller.instantiateChildWidgets(this.element);

this.imageViewWidget.mojo.centerUrlProvided(this.source);

this.buttonElement.observe(Mojo.Event.tap,
this._callbackWrapper.bind(this));

this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,Mojo.Event.tap);
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,Mojo.Event.flick);
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,Mojo.Event.dragStart);
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,Mojo.Event.dragEnd);
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,Mojo.Event.dragging);
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,'gesturestart');
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,'gesturechange');
this._addPassthroughEvent(this.overlayElement,
this.imageViewWidget,'gestureend');

this.controller.exposeMethods(['manualSize']);
Mojo.Log.info("Setting up cropview widget!");
},

manualSize:function(width,height)
{
this.imageViewWidget.mojo.manualSize(width,height);
this.element.width=width;
this.element.height=height;
this.element.style.width=width+"px";
this.element.style.height=height+"px";
},

_addPassthroughEvent:function(sourceElement,targetElement,eventName)
{
sourceElement[eventName+'Handler_mojo']=function(name,event){
this._mojoController.assistant._cropHandler(
name,event);
}.bind(targetElement,eventName);

sourceElement.observe(eventName,sourceElement[eventName+'Handler_mojo']);
},

_removePassthroughEvent:function(sourceElement,eventName){
sourceElement.stopObserving(eventName,sourceElement[eventName+'Handler_mojo']);
},


cleanup:function()
{
this.buttonElement.stopObserving(Mojo.Event.tap);

this._removePassthroughEvent(this.overlayElement,Mojo.Event.tap);
this._removePassthroughEvent(this.overlayElement,Mojo.Event.flick);
this._removePassthroughEvent(this.overlayElement,Mojo.Event.dragStart);
this._removePassthroughEvent(this.overlayElement,Mojo.Event.dragEnd);
this._removePassthroughEvent(this.overlayElement,Mojo.Event.dragging);
this._removePassthroughEvent(this.overlayElement,'gesturestart');
this._removePassthroughEvent(this.overlayElement,'gesturechange');
this._removePassthroughEvent(this.overlayElement,'gestureend');
},

_callbackWrapper:function()
{
var state=this.imageViewWidget.mojo.getCurrentParams();

var viewedWidth=state.sourceWidth*state.scale;
var viewedHeight=state.sourceHeight*state.scale;

state.suggestedXSize=Math.round(
this.targetWidth/state.scale);
state.suggestedYSize=Math.round(
this.targetHeight/state.scale);

state.suggestedXSize=Math.min(state.suggestedXSize,
state.sourceWidth);
state.suggestedYSize=Math.min(state.suggestedYSize,
state.sourceHeight);

state.suggestedScale=Math.round(state.scale*100);
state.suggestedXTop=Math.round(
(state.sourceWidth*state.focusX)-
(state.suggestedXSize/2));
state.suggestedYTop=Math.round(
(state.sourceHeight*state.focusY)-
(state.suggestedYSize/2));

state.suggestedXTop=Math.max(0,state.suggestedXTop);
state.suggestedYTop=Math.max(0,state.suggestedYTop);

var overall=this.imageViewWidget.mojo.getCurrentParams();

overall.suggestedXSize=Math.round(
this.element.width/overall.scale);
overall.suggestedYSize=Math.round(
this.element.height/overall.scale);

overall.suggestedXSize=Math.min(overall.suggestedXSize,
overall.sourceWidth);
overall.suggestedYSize=Math.min(overall.suggestedYSize,
overall.sourceHeight);

overall.suggestedScale=Math.round(overall.scale*100);
overall.suggestedXTop=Math.round(
(overall.sourceWidth*overall.focusX)-
(overall.suggestedXSize/2));
overall.suggestedYTop=Math.round(
(overall.sourceHeight*overall.focusY)-
(overall.suggestedYSize/2));

overall.suggestedXTop=Math.max(0,overall.suggestedXTop);
overall.suggestedYTop=Math.max(0,overall.suggestedYTop);

return this.controller.attributes.callback(state,overall);
}

});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */



Mojo.Widget.ProgressPill=Class.create({
MODEL_START_PROPERTY:'modelStartProperty',

initialize:function(){

},

setup:function(){

Mojo.require(this.controller.model,"ProgressPill widget requires a model.");
this.initializeDefaultValues();
this.renderWidget();
this.controller.exposeMethods(['reset','cancelProgress']);
},

cleanup:function(){
if(this.iconContent){
this.controller.stopListening(this.iconContent,Mojo.Event.tap,this.iconTapped);
}
},

initializeDefaultValues:function(){
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.progressBarMaxWidth=500;
this.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.modelStartProperty=this.controller.attributes.modelStartProperty||this.MODEL_START_PROPERTY;
if(this.isProgressBar){
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-bar/progress-pill');
}else if(this.isProgress){
this.titleTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/title-content');
this.imageTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/image-content');
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/progress-pill');
this.iconTemplate=Mojo.Widget.getSystemTemplatePath('/progress-inline/icon-content');
}else if(this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){
this.titleTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/title-content');
this.imageTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/image-content');
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/progress-pill');
this.iconTemplate=Mojo.Widget.getSystemTemplatePath('/progress-slider/icon-content');
this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];
}else{
this.isProgressPill=true;
this.titleTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/title-content');
this.imageTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/image-content');
this.widgetTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/progress-pill');
this.iconTemplate=Mojo.Widget.getSystemTemplatePath('/progress-pill/icon-content');

this.disabledProperty=this.controller.attributes.disabledProperty||Mojo.Widget.defaultDisabledProperty;
this.disabled=this.controller.model[this.disabledProperty];
}


this.oldWidth=0;
this.oldLeft=0;
},


renderWidget:function(){
var titleContent,imageContent,content,widthStyle,model;
this.title=this.controller.valueFromModelOrAttributes("title",'');

if(this.isProgressPill){
if(this.isProgressPill&&(!this.title||this.title.blank())){
Mojo.Log.warn("A title is required for correct progress pill use and layout.");
}
}

this.titleRight=this.controller.valueFromModelOrAttributes("titleRight",'');
this.image=this.controller.valueFromModelOrAttributes("image",'');
this.icon=this.controller.model.icon||this.controller.model.iconPath;
model={
divPrefix:this.divPrefix,
title:this.title,
image:this.image,
icon:this.icon,
iconPath:this.controller.model.iconPath,
titleRight:this.titleRight
};
if(this.title&&!this.isProgressBar){
titleContent=Mojo.View.render({object:model,template:this.titleTemplate});
}
if(this.image&&!this.isProgressBar){
imageContent=Mojo.View.render({object:model,template:this.imageTemplate});
}


model.titleContent=titleContent||'';
model.imageContent=imageContent||'';

content=Mojo.View.render({object:model,template:this.widgetTemplate});
this.controller.element.innerHTML=content;
this.progressDiv=this.controller.get(this.divPrefix+'_progress');
this.iconContent=this.controller.get(this.divPrefix+"_iconContent");
if(this.iconContent){
this.iconTapped=this.iconTapped.bind(this);
this.controller.listen(this.iconContent,Mojo.Event.tap,this.iconTapped);
if(!this.icon){
this.iconContent.hide();
}
}
this.progressPill=this.controller.get(this.divPrefix+'_downloadPill');


this._updateInactiveState();

this.remeasure();

if(this.isProgressPill&&this.controller.model[this.modelProperty]===undefined){
this.progressDiv.hide();
this.progressPill.addClassName("button-mode");
}

this.imageContent=this.controller.get(this.divPrefix+'_imageContent');
if(!this.image&&this.imageContent){
this.imageContent.hide();
}

if(this.isProgressPill||this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){
this._updateDisabledState();
}
},


getSanitizedPercent:function(){
var percent=this.controller.model[this.modelProperty];
if(percent>1){
percent=1;
}
if(percent<0){
percent=0;
}
return percent;
},

remeasure:function(e){
var percent,width;

this.progressBarMaxWidth=this.progressPill.getDimensions().width;
percent=this.getSanitizedPercent();
width=percent*this.progressBarMaxWidth;
this.setProgressBarStyles(width);


if(this.isProgressPill&&this.progressDiv.visible()){
this.allContent=this.controller.get(this.divPrefix+'_content');
this.allContent.style.width=this.progressDiv.clientWidth;
}
},

setProgressBarStyles:function(width){
var style='',left,height;

if(this.isProgressBar){
height=Mojo.View.getDimensions(this.progressDiv).height;
style='clip: rect(0px, '+width+'px, '+height+'px, 0px)';
}else if(this.isProgress){

left=this._getStartPosition();
width=this._correctWidth(left,width);
style='width: '+width+"px";
}else if(this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){

left=this._getStartPosition();
width=this._correctWidth(left,width);
style='margin-right: '+(this.progressBarMaxWidth-width)+"px;margin-left: "+left+"px;width:auto;";
}else{
style='clip: rect(0px, '+this.progressBarMaxWidth+'px, 48px, '+width+'px)';
}
this.progressDiv.setStyle(style);
},

reset:function(){
this.progressDiv.setStyle({'clip':''});
},

iconTapped:function(event){
Mojo.Event.send(this.controller.element,Mojo.Event.progressIconTap,{model:this.controller.model});
},

cancelProgress:function(){
if(this.icon){
this.icon.hide();
}
this.setProgressBarStyles(this.progressBarMaxWidth);
},


maybeUpdateProgress:function(percent){
var width,style='',left,height;


if(this.disabled){
return;
}

try{
if(percent===1){
if(this.cancelButton){
this.cancelButton.hide();
}
Mojo.Event.send(this.controller.element,Mojo.Event.progressComplete);
}
else if(percent===0){
if(this.cancelButton){
this.cancelButton.show();
}
}else{
if(this.cancelButton){
this.cancelButton.show();
}
}


width=percent*this.progressBarMaxWidth;

if(this.isProgressBar){
height=Mojo.View.getDimensions(this.progressDiv).height;
Mojo.Animation.animateClip(this.progressDiv,'left','bezier',{from:this.oldWidth,to:width,duration:0.2,corner:'left',clip:{top:0,left:this.oldWidth,bottom:height,right:0},curve:this.overrideCurve||'ease-in-out'});

}else if(this.isProgress){

if(percent>0){
this.progressDiv.show();
this.progressPill.removeClassName("inactive");
}

left=this._getStartPosition();


width=this._correctWidth(left,width);


if(left){
Mojo.Animation.animateStyle(this.progressDiv,'margin-left','bezier',{from:this.oldLeft,to:left,duration:0.2,curve:'ease-in-out'});
this.oldLeft=left;
}



Mojo.Animation.animateStyle(this.progressDiv,'width','bezier',{from:this.oldWidth,to:width,duration:0.2,curve:'ease-in-out'});


}else if(this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){

left=this._getStartPosition()||0;



if(left){
Mojo.Animation.animateStyle(this.progressDiv,'margin-left','bezier',{from:this.oldLeft,to:left,duration:0.2,curve:'ease-in-out'});
this.oldLeft=left;
}
width=this.progressBarMaxWidth-width;

Mojo.Animation.animateStyle(this.progressDiv,'margin-right','bezier',{from:this.oldWidth,to:width,duration:0.2,curve:'ease-in-out'});

}else{
if(percent>=0){
if(!this.progressDiv.visible()){
this.progressDiv.show();
this.progressPill.removeClassName("button-mode");
}
Mojo.Animation.animateClip(this.progressDiv,'right','bezier',{from:this.oldWidth,to:width,duration:0.2,corner:'right',clip:{top:0,left:this.progressBarMaxWidth,bottom:48,right:this.oldWidth},curve:this.overrideCurve||'ease-in-out'});
}else{
this.progressDiv.hide();
this.progressPill.addClassName("button-mode");
}
}

this.oldWidth=width;
}
catch(e){
Mojo.Log.logException(e,"_setProgressDiv");
}
},

_getStartPosition:function(){
var left=this.controller.model[this.modelStartProperty]||0;
left=left*this.progressBarMaxWidth;
return left;
},

_correctWidth:function(left,width){
if((left+width)>this.progressBarMaxWidth){
width=this.progressBarMaxWidth-left;
}
if(width>this.progressBarMaxWidth){
width=this.progressBarMaxWidth;
}
return width;
},

handleModelChanged:function(){



this.maybeReRenderWidget();
this.maybeUpdateProgress(this.getSanitizedPercent());
},

maybeReRenderWidget:function(){
var titleContent='',imageContent='',iconContent="";
var model;
var newTitle,newImage,newIcon,newTitleRight;


newTitle=this.controller.valueFromModelOrAttributes("title");
newTitleRight=this.controller.valueFromModelOrAttributes("titleRight","");
newImage=this.controller.valueFromModelOrAttributes("image");
newIcon=this.controller.model.icon||this.controller.model.iconPath;

model={
divPrefix:this.divPrefix,
title:newTitle,
image:newImage,
icon:newIcon,
iconPath:this.controller.model.iconPath,
titleRight:newTitleRight
};

if(this.titleTemplate&&this.title!==newTitle){
if(this.isProgressPill&&(!newTitle||newTitle.blank())){
Mojo.Log.warn("A title is required for correct progress pill use and layout.");
}

this.title=newTitle;
titleContent=Mojo.View.render({object:model,template:this.titleTemplate});
this.controller.get(this.divPrefix+'_titleContent').innerHTML=titleContent;
}
if(this.titleRight!==newTitleRight){
this.titleRight=newTitleRight;
this.controller.get(this.divPrefix+'_titleRightContent').innerHTML=this.titleRight;
}
if(this.imageTemplate&&this.image!==newImage&&this.imageContent){
this.image=newImage;
imageContent=Mojo.View.render({object:model,template:this.imageTemplate});
this.imageContent.innerHTML=imageContent;
if(!this.image){
this.imageContent.hide();
}else{
this.imageContent.show();
}
}
if(this.icon!==newIcon){
this.iconContent.removeClassName(this.icon);
this.iconContent.addClassName(newIcon);
this.icon=newIcon;
if(this.icon){
this.iconContent.show();
}else{
this.iconContent.hide();
}
}

if(this.isProgressPill||this.controller.attributes.type===Mojo.Widget.ProgressPill.slider){
this.disabled=this.controller.model[this.disabledProperty];
this._updateDisabledState();
}

this._updateInactiveState();

},


_updateInactiveState:function(){
if(this.isProgress&&this.controller.model[this.modelProperty]===0){
this.progressDiv.hide();
this.progressPill.addClassName("inactive");
}
},

_updateDisabledState:function(){
if(this.disabled){
this.progressPill.addClassName("disabled");
}else{
this.progressPill.removeClassName("disabled");
}
}

});

Mojo.Widget.ProgressPill.slider="slider";/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Widget.CharSelector=Class.create({

HI_PADDING_TOP:40,

HI_PADDING_BOTTOM:20,

HI_PADDING_LEFT:20,

HI_PADDING_RIGHT:20,

HI_COLUMNS:5,

HI_MINIMUM_TOP:10,

HI_MAX_BOTTOM:5,


itemTemplate:Mojo.Widget.getSystemTemplatePath('/charselector/char'),


initialize:function(){
this.CHARSELECTOR_OPEN=0;
this.CHARSELECTOR_FILTERING_STATE=1;
this.CHARSELECTOR_CLOSED=2;
this.CHARSELECTOR_EMPTY=3;

this.state=this.CHARSELECTOR_OPEN;

this.charList=[];
this.localizedTable=Mojo.Locale.alternateCharacters;
this.localizedTableFull=Mojo.Locale.alternateCharactersFull;
},


setup:function(){
var model=this.controller.model;

this.controller.exposeMethods(['close','isOpen']);
if(this.controller.attributes.target){
this.target=this.controller.get(this.controller.attributes.target);
}else if(model.selectionTarget){
this.target=this.controller.get(model.selectionTarget);
}
this.divPrefix=Mojo.View.makeUniqueId();
this.currCode=this.controller.model.character;
if(this.currCode!==undefined){
this.chorded=true;
}

if(this.renderWidget(this.controller.model.character)){
this.handleKeyEvent=this.handleKeyEvent.bind(this);
this.handleKeyUpEvent=this.handleKeyUpEvent.bind(this);
this.handleMouseEvent=this.handleMouseEvent.bind(this);
this.controller.listen(this.target,"keydown",this.handleKeyEvent,true);
this.controller.listen(this.target,"keyup",this.handleKeyUpEvent,true);
this.controller.listen(this.controller.document,Mojo.Event.tap,this.handleMouseEvent,true);

if(this.chorded){

this.state=this.CHARSELECTOR_FILTERING_STATE;
}else{
this.enterOpenState();
}
this.controller.scene.pushContainer(this.controller.element,this.controller.scene.submenuContainerLayer,
{cancelFunc:this._emptyAndClose.bind(this)});
this.controller.scene.pushCommander(this);
}
},


cleanup:function(){


this.charPicker=undefined;
this.selectedIndex=undefined;
this.state=this.CHARSELECTOR_CLOSED;
this.cleanupEventListeners();
},





cleanupEventListeners:function(){
this.controller.stopListening(this.target,"keydown",this.handleKeyEvent,true);
this.controller.stopListening(this.target,"keyup",this.handleKeyUpEvent,true);
this.controller.stopListening(this.controller.document,Mojo.Event.tap,this.handleMouseEvent,true);
},


loadTable:function(chr){
var data,list;
var i=0;
var that=this;
var table;

this.charList=[];
if(chr){
table=this.localizedTable;
}else if(chr===undefined){
table=this.localizedTableFull;
}else{
return;
}

table.each(function(c){
if(chr){
if(c.keyCode==chr){
list=c.list;
}
}else{
list=c.list;
}
if(list){
list.each(function(item){
data={
index:i,
character:item
};
that.charList.push(data);
i++;
});
}
list=undefined;
});
},


_setPopupPositions:function(picker){
var top='',left='';
var cursorPos=Mojo.View.getCursorPosition(this.controller.window);
var targetLeft;
var pickerDims;
var viewDims;
var maxWidth,minWidth;

if(cursorPos){
targetLeft=this.target.offsetLeft;
viewDims=Mojo.View.getViewportDimensions(this.controller.document);


pickerDims=Mojo.View.getDimensions(picker);


if((pickerDims.height+this.HI_PADDING_BOTTOM+cursorPos.y)>viewDims.height){
top=cursorPos.y-(pickerDims.height+this.HI_PADDING_TOP);
if(top<this.HI_MINIMUM_TOP){
top=this.HI_MINIMUM_TOP;
}
}else{
top=cursorPos.y+cursorPos.height+this.HI_PADDING_BOTTOM;
if((top+pickerDims.height)>(viewDims.height-this.HI_MAX_BOTTOM)){
top=viewDims.height-this.HI_MAX_BOTTOM-pickerDims.height;
}
}

left=cursorPos.x;
maxWidth=viewDims.width-this.HI_PADDING_RIGHT;
minWidth=targetLeft+this.HI_PADDING_LEFT;

if((pickerDims.width+cursorPos.x)>maxWidth){

left=maxWidth-pickerDims.width;
}else if((cursorPos.x-pickerDims.width)<minWidth){

left=minWidth;
}

left+='px';
top+='px';
}else if(this.target.type==='application/x-palm-browser'){

}else{
left='0px';
top='0px';
}

this.charPicker.setStyle({'top':top,'left':left});
},


translateToRow:function(results){

var finished=false;
var result;
var newOffset=0;
var transformedResults=[];

while(!finished){
result={};


result.characters=Mojo.View.render({collection:results.slice(newOffset,newOffset+this.HI_COLUMNS),attributes:{divPrefix:this.divPrefix},template:this.itemTemplate});
newOffset+=this.HI_COLUMNS;
transformedResults.push(result);
if(newOffset>=results.length){
finished=true;
}
}
return transformedResults;
},


renderWidget:function(chr){
var data;
var charContent;
var charContentModel;
var pickerContent;
var parent;

this.loadTable(chr);
if(this.charList&&this.charList.length>0){

charContentModel={
divPrefix:this.divPrefix
};

this.itemsModel={items:this.translateToRow(this.charList)};
this.charPicker=undefined;
pickerContent=Mojo.View.render({object:charContentModel,template:Mojo.Widget.getSystemTemplatePath('/charselector/charselector')});

parent=Mojo.View.getScrollerForElement(this.target);
if(!parent){
parent=this.controller.scene.sceneElement;
}
if(this.controller.element.parentNode!==parent){
this.controller.reparent(parent);
}
this.controller.element.innerHTML=pickerContent;

this.charPicker=this.controller.get(this.divPrefix+'-char-selector-div');

this.controller.scene.setupWidget('char-list',
{itemTemplate:Mojo.Widget.getSystemTemplatePath('charselector/char-selector-row'),renderLimit:30},this.itemsModel);
this.controller.instantiateChildWidgets(this.charPicker);
this.controller.scene.showWidgetContainer(this.charPicker);
this._setPopupPositions(this.charPicker);

this.selectedIndex=0;
this._updateSelected(null,this._selectedIdxElem());
if(this._selectedIdxElem()){
this.perLine=Math.floor(Element.getWidth(this.charPicker)/Element.getWidth(this._selectedIdxElem()));
}else{
this.perLine=0;
}
return true;
}else{
if(!this.chorded){
this.exitSelector();
return false;
}else{
return true;
}
}
},


enterOpenState:function(){

this.state=this.CHARSELECTOR_OPEN;
},


_maybeRemoveCharpicker:function(){
if(this.charPicker){
if(this.charPicker.parentNode){
Element.remove(this.charPicker);
}
this.charPicker=undefined;
}
},


enterFilteringState:function(keyCode){

this.state=this.CHARSELECTOR_FILTERING_STATE;

if(this.currCode!==keyCode){
this.currCode=keyCode;

this._maybeRemoveCharpicker();
this.renderWidget(this.currCode);
}else{

this.advance();
}
},


handleModelChanged:function(model,what){
Element.show(this.charPicker);
if(Mojo.Char.isValid(this.controller.model.character)){
this.enterFilteringState(this.controller.model.character);
}
},


_emptyAndClose:function(){
this.state=this.CHARSELECTOR_EMPTY;
this.close();
},


close:function(){

if(this.state===this.CHARSELECTOR_FILTERING_STATE||this.state===this.CHARSELECTOR_OPEN){
this.exitSelector(this.getEntered());
return;
}

this._safeRemove();
},


isOpen:function(){
return this.state!==this.CHARSELECTOR_CLOSED;
},



exitSelector:function(chr){
var letter;
var characterVal,selection;
var tagName=this.target.tagName;
var selectionStart,selectionEnd;
var isWebView=false;


if(this.target.mojo&&this.target.mojo.insertStringAtCursor){
isWebView=true;
}

this.state=this.CHARSELECTOR_CLOSED;


if(chr){
letter=chr.character;
selection=this.controller.window.getSelection();

if(selection&&selection.rangeCount>0&&selection.getRangeAt(0)){
this.controller.document.execCommand("insertText",true,letter);
}else if(isWebView&&letter!==null&&letter!==undefined){
this.target.mojo.insertStringAtCursor(letter);
}


if(this.target.mojo&&this.target.mojo.setText){
selectionStart=this.target.selectionStart;
selectionEnd=this.target.selectionEnd;
this.target.mojo.setText(this.target.value||this.target.mojo.value);
this.target.selectionStart=selectionStart;
this.target.selectionEnd=selectionEnd;
}


this.cleanupEventListeners();
this._safeRemove.bind(this).delay(0.2);
}else{
this._safeRemove();
}

if(!isWebView){
this.target.focus();
}
},


_safeRemove:function(){
this.controller.scene.removeContainer(this.controller.element);
if(this.controller.element&&this.controller.element.parentNode){
Element.remove(this.controller.element);
}
},


_insertChar:function(origValue,letter,start,end){
var value='';
if(origValue){
value=origValue.substring(0,start);
value+=letter;
value+=origValue.substring(end,origValue.length);
}else{
value=letter;
}
return value;
},


advance:function(){
var old=this._selectedIdxElem();
var newElm;

if(this.selectedIndex+1>this.charList.length-1){
this.selectedIndex=0;
}else{
this.selectedIndex++;
}

newElm=this._selectedIdxElem();
this._updateSelected(old,newElm);
},


retreat:function(){
var old,newElm;

old=this._selectedIdxElem();
if(this.selectedIndex===0){
this.selectedIndex=this.charList.length-1;
}else{
this.selectedIndex=this.selectedIndex-1;
}
newElm=this._selectedIdxElem();
this._updateSelected(old,newElm);
},


_getMatching:function(element,query){
if(!element){
return;
}
return element.querySelector("[name='"+query+"']");
},


_updateSelected:function(oldSelection,newSelection){
var node;
if(oldSelection){
node=this._getMatching(oldSelection,oldSelection.getAttribute("name"));
if(node){
node.removeClassName("selected-char");
}
}
if(newSelection){
node=this._getMatching(newSelection,newSelection.getAttribute("name"));
if(node){
node.addClassName("selected-char");
}
}
},



moveDown:function(){
var old,newElm;
if(this.selectedIndex+this.perLine<this.charList.length){
old=this._selectedIdxElement();
this.selectedIndex=this.selectedIndex+this.perLine;
newElm=this._selectedIdxElement();
this._updateSelected(old,newElm);
}
},


moveUp:function(){
var old,newElm;
if(this.selectedIndex-this.perLine>=0){
old=this._selectedIdxElem();
this.selectedIndex=this.selectedIndex-this.perLine;
newElm=this._selectedIdxElem();
this._updatedSelected(old,newElm);
}
},


updatePosition:function(key){
switch(key){
case Mojo.Char.leftArrow:
this.retreat();
break;
case Mojo.Char.upArrow:
this.moveUp();
break;
case Mojo.Char.rightArrow:
this.advance();
break;
case Mojo.Char.downArrow:
this.moveDown();
break;
default:
break;
}

if(this.charPicker){
this.controller.get(this.divPrefix+'-char-selector').mojo.revealElement(this._selectedIdxElem());
}
},



handleKeyUpEvent:function(event){
var keyCode=event.keyCode;
var chr;

if(this.isSymKey(keyCode)){
if(this.state===this.CHARSELECTOR_FILTERING_STATE){
chr=this.getEntered();
}
this.exitSelector(chr);
Event.stop(event);
return;
}
},


handleKeyEvent:function(event){
var keyCode=event.keyCode;

if(Mojo.Char.isEnterKey(keyCode)){
this.exitSelector(this.getEntered());
Event.stop(event);

return;
}
if(Mojo.Char.isDeleteKey(keyCode)){
this.exitSelector();
Event.stop(event);
return;
}
if(this.isDirectionalKey(keyCode)){
this.updatePosition(keyCode);
Event.stop(event);
return;
}

if(!Mojo.Char.isValid(keyCode)){
return;
}

switch(this.state){
case this.CHARSELECTOR_OPEN:
case this.CHARSELECTOR_FILTERING_STATE:
case this.CHARSELECTOR_EMPTY:
this.enterFilteringState(keyCode);
Event.stop(event);
break;
default:
break;
}
},


handleMouseEvent:function(event){

switch(this.state){
case this.CHARSELECTOR_OPEN:
case this.CHARSELECTOR_FILTERING_STATE:
case this.CHARSELECTOR_SINGLEFILTER_STATE:
if(this.isInCharPicker(event.target)){
this.exitSelector(this.getSelected(event.target));
event.stop();
}else{
this.exitSelector();
}
break;
default:
break;
}
},


getEntered:function(){
return this.charList[this.selectedIndex];
},


getSelected:function(target){
var chr=target.getAttribute('name');

return this.charList[chr];
},






isDirectionalKey:function(key){
if(key==Mojo.Char.leftArrow||key==Mojo.Char.upArrow||key==Mojo.Char.rightArrow||key==Mojo.Char.downArrow){
return true;
}
return false;
},


isInCharPicker:function(target){
if(!this.charPicker){
return;
}
if(target.id==this.charPicker.id||Element.up(target,'div#'+this.charPicker.id)){
return true;
}
return false;
},


isSymKey:function(keyCode){
return keyCode===Mojo.Char.sym;
},


_selectedIdxElem:function(){
return this.controller.get(this.divPrefix+"-"+this.selectedIndex);
},


handleCommand:function(commandEvent){
if(commandEvent.type===Mojo.Event.back&&(this.state!==this.CHARSELECTOR_CLOSED&&this.state!==this.CHARSELECTOR_EMPTY)){
this.exitSelector();
Event.stop(commandEvent);
}
}
});



Mojo.Widget.CharSelector.prototype.hasKeyAlternates=function(keyCode){

var i=0;
var list=Mojo.Locale.alternateCharacters;
for(i=0;i<list.length;i++){
if(list[i].keyCode===keyCode){
return true;
}
}
return false;
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */






Mojo.Widget.Drawer=Class.create({

DRAWER_OPENER_OFFSET:48,




setOpenState:function(open){
this.controller.model[this.propName]=!!open;
this.updateFromModel();
},


getOpenState:function(){
return this.wasOpen;
},



toggleState:function(){
this.controller.model[this.propName]=!this.wasOpen;
this.updateFromModel();
},




setup:function(){
var content,elementContent,i;
var drawerOpenerOffset;
Mojo.assert(this.controller.model,"Mojo.Widget.Drawer requires a model. Did you call controller.setupWidgetModel() with the name of this widget?");

drawerOpenerOffset=this.controller.attributes.drawerOpenerOffset;


this.propName=this.controller.attributes.property||'open';
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;
this.unstyled=this.controller.attributes.unstyled;
this.drawerOpenerOffset=(drawerOpenerOffset===undefined)?this.DRAWER_OPENER_OFFSET:drawerOpenerOffset;
elementContent=this.controller.element.childElements();

content=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath("drawer/drawer-template"),attributes:{divPrefix:this.divPrefix}});
this.controller.element.innerHTML=content;



this.outerDiv=this.controller.get(this.divPrefix+"-outer");
this.contentDiv=this.controller.get(this.divPrefix+"-content");
this.wrapper=this.controller.get(this.divPrefix+"-wrapper");


this.wasOpen=this.controller.model[this.propName];
if(!this.wasOpen){
this.wrapper.setStyle({'height':'0px'});
}

for(i=0;i<elementContent.length;i++){
this.contentDiv.appendChild(elementContent[i]);
}



if(!this.unstyled){
this.outerDiv.addClassName('palm-drawer-container');
this.contentDiv.addClassName('palm-drawer-contents');
}else{
this.contentDiv.setStyle({'position':'relative'});

}


this.controller.exposeMethods(['setOpenState','getOpenState','updateHeight','toggleState']);
},



updateHeight:function(){
Mojo.Log.warn("drawer.mojo.updateHeight is deprecated.");
},

_updateScrollPosition:function(scroller,origScrollerHeight,pos){
if(scroller.mojo.scrollerSize().height===origScrollerHeight){
scroller.mojo.setScrollPosition({y:-pos});
}else{
this.scrollPosAnimator.cancel();
}

},


scrollIntoView:function(elementHeight){
var scrollToPos;

var scroller=Mojo.View.getScrollerForElement(this.controller.element);
var element=this.controller.element;

var currentTop=-scroller.mojo.getScrollPosition().top;
var scrollerHeight=scroller.mojo.scrollerSize().height;
var contentHeight=scroller.scrollHeight;
var maxScrollPos=contentHeight-scrollerHeight;

var currentBottom=currentTop+scrollerHeight;

var elementOffset=Element.positionedOffset(element);

var currentlyShowing=currentBottom-elementOffset.top;
var remainingToShow=elementHeight-currentlyShowing;

var newTop=currentTop+remainingToShow;

var newContentBottom=newTop+scroller.mojo.scrollerSize().height;
var newContentTop=newContentBottom-elementHeight;

var openerAdjust=this.drawerOpenerOffset;






newContentTop-=openerAdjust;

if(openerAdjust+elementHeight>scrollerHeight){
scrollToPos=newContentTop;
}else if(newContentBottom>currentBottom){
scrollToPos=newTop;
}else if(newContentTop<currentTop){
scrollToPos=newContentTop;
}

if(scrollToPos){
if(scrollToPos>maxScrollPos){
var details={
from:currentTop,
to:scrollToPos
};
this.scrollPosAnimator=Mojo.Animation.animateValue(Mojo.Animation.queueForElement(this.controller.element),'zeno',this._updateScrollPosition.bind(this,scroller,scrollerHeight),details);
}else{
scroller.mojo.scrollTo(undefined,-scrollToPos,true);
}
}

},


updateFromModel:function(){
var newHeight;
var currentValue=0;
var scroller;
var drawerHeight;
if(this.wasOpen!==this.controller.model[this.propName]){
this.wasOpen=this.controller.model[this.propName];
newHeight=this.contentDiv.offsetHeight;
scroller=Mojo.View.getScrollerForElement(this.controller.element);

if(!this.wasOpen){
currentValue=newHeight;
}
drawerHeight=(this.wasOpen&&newHeight)||0;
this.scrollIntoView(drawerHeight);
Mojo.Animation.animateStyle(this.wrapper,'height','bezier',
{from:0,to:newHeight,duration:0.33,currentValue:currentValue,reverse:!this.wasOpen,onComplete:this.animationComplete.bind(this,scroller,scroller.mojo.scrollerSize().height,drawerHeight),curve:'ease-in-out'});
}
},


animationComplete:function(scroller,origHeight,drawerHeight,el,cancelled){
if(!cancelled){
Mojo.Widget.Scroller.validateScrollPositionForElement(this.controller.element);
if(origHeight!==scroller.mojo.scrollerSize().height){
this.scrollIntoView(drawerHeight);
}
if(this.wasOpen){
this.wrapper.setStyle({'height':'auto'});
}
}
},


handleModelChanged:function(){
this.updateFromModel();
}

});

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.ExperimentalForm=Class.create({
ERROR_TEMPLATE:Mojo.Widget.getSystemTemplatePath('/form/error'),
ASYNC_DELAY:500,

setup:function(){
Mojo.require(this.controller.attributes.assistant,"You must specify an assistant.");
Mojo.require(this.controller.attributes.assistant.validate,"You must specify a validate function on your assistant.");
Mojo.require(this.controller.attributes.assistant.defaultAction,"You must specify a default action omn your assistant.");

this.assistant=this.controller.attributes.assistant;
this.required=this.controller.model.requiredItems.clone();
this.lastItem=this.controller.get(this.required[this.required.length-1]);
this.divPrefix=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;

this._renderWidget();
this._setupListeners();
this._setupCallbacks();
this._initializeHasContent();
},


_setupButton:function(){
var buttonType,buttonContent,buttonAttrs,buttonLabel;

buttonLabel=this.controller.valueFromModelOrAttributes('submitLabel');

if(buttonLabel&&!buttonLabel.blank()){
buttonAttrs={
type:Mojo.Widget.activityButton
};
this.buttonModel={
label:buttonLabel,
disabled:this.required.length?true:false
};
buttonContent=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/form/button'),attributes:{divPrefix:this.divPrefix}});
this.controller.element.insert({bottom:buttonContent});
this.button=this.controller.get(this.divPrefix+'-button');
this.controller.scene.setupWidget(this.button.id,buttonAttrs,this.buttonModel);
}
},


_setupGlobalError:function(){
var globalErrorContent=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/form/globalError'),attributes:{id:this.divPrefix+"_globalError"}});

if(this.button){
Element.insert(this.button,{before:globalErrorContent});
}else{
this.controller.element.insert({bottom:globalErrorContent});
}
this.globalError=this.controller.get(this.divPrefix+"_globalError");
this.globalErrorContent=this.controller.get(this.divPrefix+"_globalError_content");
},

_renderWidget:function(){
this._setupButton();
this._setupGlobalError();


this.controller.instantiateChildWidgets(this.controller.element);

this._setupLastItem();
},

_setupCallbacks:function(){
this._validateCallback=this._validateCallback.bind(this);
this._defaultActionComplete=this._defaultActionComplete.bind(this);
this._setButtonToSubmitState=this._setButtonToSubmitState.bind(this);
},

_setupListeners:function(){

this._propertyChangeListener=this._propertyChangeListener.bind(this);

for(var i=0;i<this.required.length;i++){
this.required[i]={id:this.required[i]};
this.controller.listen(this.required[i].id,Mojo.Event.propertyChange,this._propertyChangeListener);
}


if(this.button){
this.handleButtonTap=this.handleButtonTap.bind(this);
this.controller.listen(this.button,Mojo.Event.tap,this.handleButtonTap,true);
}

this._submitKeyListener=this._submitKeyListener.bind(this);
this.controller.listen(this.lastItem,"keydown",this._submitKeyListener);
},

handleButtonTap:function(event){
if(!this._takeFormAction()){
event.stop();
}
},

_takeFormAction:function(){
if(this.assistant.hasRequired){
if(this.assistant.hasRequired()){
this.validate();
}
}else if(this._doAllHaveContent()){
this.validate();
}else{
this._deactivateButton();
this.errorAction();
return false;
}
},

_propertyChangeListener:function(propertyChangeEvent){

var curError;

if(propertyChangeEvent.target!==this.lastItem){
this._updateHasContent(propertyChangeEvent.target.id,propertyChangeEvent.value);
curError=this._getMatchingError(propertyChangeEvent.target.id);
if(curError){
curError.hide();
}
this._updateSubmitState();
}
},

_setupLastItem:function(){
if(this.lastItem.mojo&&this.lastItem.mojo.setConsumesEnterKey){
this.lastItem.mojo.setConsumesEnterKey(true);
}else{
this.lastItem.setAttribute(Mojo.Gesture.consumesEnterAttribute,"true");
}
},

_submitKeyListener:function(keyEvent){
var value,curError;

curError=this._getMatchingError(this.lastItem.id);
if(curError){
curError.hide();
}

if(this.lastItem.mojo&&this.lastItem.mojo.getValue){
value=this.lastItem.mojo.getValue();
}else{
value=this.lastItem.value;
}
this._updateHasContent(this.lastItem.id,value);
this._updateSubmitState();

if(Mojo.Char.isEnterKey(keyEvent.keyCode)){


this._takeFormAction();
keyEvent.stop();
}
},


_getMatchingError:function(id){
return this.controller.get(this.divPrefix+id+'_error');
},

_updateSubmitState:function(){
if(this.assistant.hasRequired){
try{
if(this.assistant.hasRequired()){
this._activateButton();
}
}catch(e){
Mojo.Log.warn("There was an error calling the required function from the assistant. Please correct this. Framework continuing as usual. %s",e);
}
}else if(this._doAllHaveContent()){
this._activateButton();
}else{
this._deactivateButton();
}
},

_evalErrors:function(error){
var errors=(error&&error.errors);
var curErrorId,curError,curErrorContent,errorContent,item;
var existing=this.controller.element.querySelectorAll('[name='+this.divPrefix+'_error]');
var globalError=(error&&error.globalError);
var success=true;
var i=0;


if(existing){
for(i=0;i<existing.length;i++){
existing.item(i).hide();
}
}

if(this.globalError.visible()){
this.globalError.hide();
}

if(errors){
for(i=0;i<errors.length;i++){

curError=this._getMatchingError(errors[i].id);
if(!curError){
errorContent=Mojo.View.render({template:this.ERROR_TEMPLATE,attributes:{id:this.divPrefix+errors[i].id+'_error',name:this.divPrefix+'_error'}});
item=this.controller.get(errors[i].id);
Element.insert(item,{after:errorContent});
curError=this._getMatchingError(errors[i].id);
}
curErrorContent=this.controller.get(this.divPrefix+errors[i].id+'_error_content');
curErrorContent.innerHTML=errors[i].errorMessage;
curError.show();
}
this._deactivateButton();
success=false;
}

if(globalError){
this.globalErrorContent.innerHTML=error.globalError;
this.globalError.show();
this._deactivateButton();
success=false;
}
return success;
},

_validateCallback:function(errors){
if(this._evalErrors(errors)){
this._activateButton();
this.successAction();
}
},

validate:function(){
try{
this.assistant.validate(this.required,this._validateCallback);
}catch(e){
Mojo.Log.warn("There was an error calling validate specified by the assistant. Please correct this. %s",e);
}
},


_doAllHaveContent:function(){
for(var i=0;i<this.required.length;i++){
if(!this.required[i].hasContent){
return false;
}
}
return true;
},

_updateHasContent:function(id,value){
var item=this._findRequiredItem(id);
if(item){
item.hasContent=(value.length>0);
item.value=value;
return;
}
},

_findRequiredItem:function(id){
for(var i=0;i<this.required.length;i++){
if(id===this.required[i].id){
return this.required[i];
}
}
return null;
},

_activateButton:function(){
if(!this.button){
return;
}
this.buttonModel.disabled=false;
this.controller.modelChanged(this.buttonModel);
this.button.addClassName('focused');
},

_deactivateButton:function(){
if(!this.button){
return;
}
this.buttonModel.disabled=true;
this.controller.modelChanged(this.buttonModel);
this.button.removeClassName('focused');
},

errorAction:function(){

try{
if(this.assistant.errorAction){
this.assistant.errorAction();
}
}catch(e){
Mojo.Log.warn("There was an exception calling the error action specified by the assistant. Please correct this. %s",e);
}
},

handleModelChanged:function(){
if(this.button){
this.buttonModel.label=this.controller.valueFromModelOrAttributes('submitLabel');
this.controller.modelChanged(this.buttonModel);
}

this.required=this.controller.model.requiredItems.clone();
this._initializeHasContent();
},


_initializeHasContent:function(){
var value;
var item;

for(var i=0;i<this.required.length;i++){
item=this.controller.get(this.required[i].id);
if(item.mojo&&item.mojo.getValue){
value=item.mojo.getValue();
}else{
value=item.value;
}
this._updateHasContent(item.id,value);
}
},

_setButtonToSubmitState:function(){
if(this.button){
this.button.mojo.activate();
}
},

successAction:function(){

this.submitButtonUpdateDeferredId=this.controller.window.setTimeout(this._setButtonToSubmitState,this.ASYNC_DELAY);


this._deactivateButton();

try{
this.assistant.defaultAction(this._defaultActionComplete);
}catch(e){
Mojo.Log.warn("Error while calling the assistants default action. Please fix this. %s ",e);
this.controller.window.clearTimeout(this.submitButtonUpdateDeferred);
}
},

_defaultActionComplete:function(error){

this.controller.window.clearTimeout(this.submitButtonUpdateDeferredId);

this._evalErrors(error);

if(this.button){
this._activateButton();
this.button.mojo.deactivate();
}
},

cleanup:function(){
var that=this;
this.required.each(function(req){
that.controller.stopListening(req.id,Mojo.Event.propertyChange,that._propertyChangeListener);
});

if(this.button){
this.controller.stopListening(this.button,Mojo.Event.tap,this.handleButtonTap,true);
}
this.controller.stopListening(this.lastItem,"keydown",this._submitKeyListener);
}
});/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */





Mojo.Widget.ExperimentalDataDiv=Class.create({
setup:function(){
var content="";

this.modelProperty=this.controller.attributes.modelProperty||Mojo.Widget.defaultModelProperty;
this.modelFieldId=Mojo.View.makeUniqueId()+this.controller.scene.sceneId+this.controller.element.id;


if(this.controller.attributes.template){
content=Mojo.View.render({template:this.controller.attributes.template,object:this.controller.model});
}
content+=Mojo.View.render({template:Mojo.Widget.getSystemTemplatePath('/datadiv/datadiv'),attributes:{id:this.modelFieldId}});

this.controller.element.innerHTML=content;

this._createDataObject();

this._createElementFuncs();
},

_createElementFuncs:function(){
var that=this;

if(!this.controller.element.mojo){
this.controller.element.mojo={};
}
this.controller.element.mojo.__defineGetter__("model",function(){
return that.jsonModel;
});
this.controller.element.mojo.__defineSetter__("model",function(inModel){
that.controller.model=inModel;
that._createDataObject(inModel);
});
},

_createDataObject:function(){
var data=this.controller.model[this.modelProperty];
var jsonData;
var jsonField;


if(typeof data==='string'){
jsonData=Object.toJSON(data);
}else{
jsonData=data;
}

jsonField=this.controller.element.querySelector("#"+this.modelFieldId);
if(jsonField){
jsonField.value=jsonData;
}
this.jsonModel=jsonData;
},

getModel:function(){
return this.jsonModel;
},

cleanup:function(){

}
});/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */


Mojo.AccountManager={};

Mojo.AccountManager.NAME_PROPERTY_DEFAULT='name';
Mojo.AccountManager.USERNAME_PROPERTY_DEFAULT='username';
Mojo.AccountManager.PASSWORD_PROPERTY_DEFAULT='password';
Mojo.AccountManager.DOMAIN_PROPERTY_DEFAULT='domain';
Mojo.AccountManager.DEFAULTDISABLED_PROPERTY_DEFAULT='defaultDisabled';

Mojo.AccountManager.genericAccount={
iconClass:'generic',
title:Mojo.appInfo.title,
accountsNameProperty:Mojo.AccountManager.NAME_PROPERTY_DEFAULT,
accountsUsernameProperty:Mojo.AccountManager.USERNAME_PROPERTY_DEFAULT,
accountsPasswordProperty:Mojo.AccountManager.PASSWORD_PROPERTY_DEFAULT,
accountsDomainProperty:Mojo.AccountManager.DOMAIN_PROPERTY_DEFAULT,
accountsDefaultDisabledProperty:Mojo.AccountManager.DEFAULTDISABLED_PROPERTY_DEFAULT
};

Mojo.AccountManager.initAccountTypeAttributes=function(attributes){
var accountTypes=attributes.accountTypes;
if(!attributes.mojoAccountTypesInitialized){
Object.values(accountTypes).each(function(type){
type.accountsNameProperty=type.accountsNameProperty||Mojo.AccountManager.NAME_PROPERTY_DEFAULT;
type.accountsUsernameProperty=type.accountsUsernameProperty||Mojo.AccountManager.USERNAME_PROPERTY_DEFAULT;
type.accountsPasswordProperty=type.accountsPasswordProperty||Mojo.AccountManager.PASSWORD_PROPERTY_DEFAULT;
type.accountsDomainProperty=type.accountsDomainProperty||Mojo.AccountManager.DOMAIN_PROPERTY_DEFAULT;
type.accountsDefaultDisabledProperty=type.accountsDefaultDisabledProperty||Mojo.AccountManager.DEFAULTDISABLED_PROPERTY_DEFAULT;
type.title=type.title||Mojo.Controller.appInfo.title;
});
attributes.mojoAccountTypesInitialized=true;
}
};

Mojo.AccountManager.mapAccountProperties=function(accountTypes,accounts){
var accountType;
var mappedAccount;
var mappedAccounts;

if(!accounts){
return[];
}

mappedAccounts=accounts.collect(function(account){
accountType=accountTypes[account.type]||Mojo.AccountManager.genericAccount;
mappedAccount={
name:account[accountType.accountsNameProperty||Mojo.AccountManager.NAME_PROPERTY_DEFAULT],
username:account[accountType.accountsUsernameProperty||Mojo.AccountManager.USERNAME_PROPERTY_DEFAULT],
password:account[accountType.accountsPasswordProperty||Mojo.AccountManager.PASSWORD_PROPERTY_DEFAULT],
domain:account[accountType.accountsDomainProperty||Mojo.AccountManager.DOMAIN_PROPERTY_DEFAULT],
defaultDisabled:account[accountType.accountsDefaultDisabledProperty||Mojo.AccountManager.DEFAULTDISABLED_PROPERTY_DEFAULT],
type:account.type,
iconClass:account.iconClass,
iconPath:account.iconPath,
original:account
};
return mappedAccount;
});
return mappedAccounts;
};

Mojo.AccountManager.renderHeader=function(params){
params=params||{};


params.headerTemplate=params.headerTemplate||Mojo.Widget.getSystemTemplatePath('accounts/header');
params.object=params.object||this;
params.parent=params.parent||'account-header-placeholder';

var headerNode=this.insertContent(params.headerTemplate,params.object,params.parent);
Mojo.AccountManager.renderIconFromClassOrPath(headerNode,params.object);
};

Mojo.AccountManager.renderAccountIcon=function(widget,account,itemNode){
var accountType;
if(!account.type){
if(account.iconClass||account.iconPath){
accountType={
iconClass:account.iconClass,
iconPath:account.iconPath
};
}else{
accountType=Mojo.AccountManager.genericAccount;
}
}else{
accountType=this.globalAttributes.accountTypes[account.type]||{iconClass:account.type};
}

Mojo.AccountManager.renderIconFromClassOrPath(itemNode,accountType);
};


Mojo.AccountManager.renderIconFromClassOrPath=function(node,object){
var iconDiv=node.querySelector('div.palm-account-icon');
if(!iconDiv){
iconDiv=node.querySelector('div.synergy-accounts-icon');
}

if(object.iconClass){
iconDiv.addClassName(object.iconClass);
}else if(object.iconPath){
iconDiv.style['background-image']='url('+object.iconPath+')';
}
};


Mojo.AccountManager._showFirstLaunchScene=function(controller,attributes,model){
controller.showFrameworkScene(attributes.firstLaunch.sceneName,
'accounts/first-launch',
Mojo.Scene.AccountFirstLaunch,
{attributes:attributes,model:model});
};


Mojo.AccountManager._showPreferencesScene=function(controller,attributes,model){
controller.showFrameworkScene('','accounts/preferences',Mojo.Scene.AccountPreferences,{attributes:attributes,model:model});
};


Mojo.AccountManager._showSettingsScene=function(controller,attributes,model,accountIndex){
controller.showFrameworkScene('','accounts/settings',Mojo.Scene.AccountSettings,{attributes:attributes,model:model,accountIndex:accountIndex});
};


Mojo.AccountManager._showLoginScene=function(controller,attributes,model){
controller.showFrameworkScene('','accounts/login',Mojo.Scene.AccountLogin,{attributes:attributes,model:model});
};


Mojo.AccountManager._showAddScene=function(controller,attributes,model){
controller.showFrameworkScene('','accounts/add',Mojo.Scene.AccountAdd,{attributes:attributes,model:model});
};


Mojo.AccountManager.addUtilityMethodsToPrototype=function(targetObject){
var methods=['renderHeader','renderAccountIcon'];
var addToPrototype=function(functionName){
if(targetObject.prototype[functionName]!==undefined){
Mojo.Log.warn("Overwriting existing method with Mojo.AccountManager method ",functionName);
}
targetObject.prototype[functionName]=Mojo.AccountManager[functionName];
};
methods.each(addToPrototype);
};
/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */

Mojo.Scene={};


Mojo.Scene.insertContent=function(template,object,parentDiv){
var contentParent=this.controller.get(parentDiv);
if(contentParent){
var content=Mojo.View.render({template:template,object:object});
var node=Mojo.View.convertToNode(content,this.controller.document);
if(parentDiv.endsWith('-placeholder')){

Element.replace(contentParent,node);
}else{
contentParent.appendChild(node);
}
return node;
}
};


Mojo.Scene.setupButton=function(name,label,callback,buttonClass){
this.controller.setupWidget(name,{},{label:label,buttonClass:buttonClass});
this.connectListener(name,Mojo.Event.tap,callback);
};


Mojo.Scene.setupButtonFromTemplate=function(template,object,parentDiv,label,callback,buttonClass){
object.id=object.id||Mojo.View.makeUniqueId(window);
this.insertContent(template,object,parentDiv);
this.setupButton(object.id,label,callback,buttonClass);
};


Mojo.Scene.makeUniqueElementId=function(element){
return Mojo.View.makeUniqueId()+this.controller.sceneId+(Object.isString(element)?element:element.id);
};


Mojo.Scene.anonymizeElementId=function(element){
var id=this.makeUniqueElementId(element);
this.controller.get(element).id=id;
return id;
};


Mojo.Scene.connectListener=function(element,event,callback){
this.controller.listen(element,event,callback);
if(!this._listenerStack){
this._listenerStack=[];
}
this._listenerStack.push({element:element,event:event,callback:callback});
};


Mojo.Scene.cleanupListeners=function(){
if(this._listenerStack){
var that=this;
this._listenerStack.each(function(listener){
that.controller.stopListening(listener.element,listener.event,listener.callback);
});
delete this._listenerStack;
}
};


Mojo.Scene.setupAssistant=function(element){
this.assistant.controller=this.controller;

if(this.assistant.handleCommand){
this.controller.pushCommander(this.assistant);
}
if(this.assistant.setup){
this.assistant.setup(element);
}
};


Mojo.Scene.cleanupAssistant=function(){
if(this.assistant.handleCommand){
this.controller.removeCommander(this.assistant);
}
if(this.assistant.cleanup){
this.assistant.cleanup();
}
};


Mojo.Scene.activateAssistant=function(args){
if(this.assistant.activate){
try{
this.assistant.activate(args);
}catch(e){
Mojo.Log.warn("Activate called on the accounts assistant failed. Continuing other setup. %s ",e);
}
}
};


Mojo.Scene.deactivateAssistant=function(){
if(this.assistant.deactivate){
try{
this.assistant.deactivate();
}catch(e){
Mojo.Log.warn("Deactivate called on the accounts assistant failed. Continuing other cleanup. %s ",e);
}
}
};


Mojo.Scene.bindAssistantCallback=function(callbackName){
return(this.assistant[callbackName]&&this.assistant[callbackName].bind(this.assistant))||Mojo.doNothing;
};


Mojo.Scene.addUtilityMethodsToPrototype=function(targetObject){
var methods=["insertContent","setupButton","setupButtonFromTemplate","makeUniqueElementId","anonymizeElementId","connectListener","cleanupListeners","setupAssistant","cleanupAssistant","activateAssistant","deactivateAssistant","bindAssistantCallback"];
var addToPrototype=function(functionName){
if(targetObject.prototype[functionName]!==undefined){
Mojo.Log.warn("Overwriting existing method with Mojo.Scene method ",functionName);
}
targetObject.prototype[functionName]=Mojo.Scene[functionName];
};
methods.each(addToPrototype);
};




Mojo.Controller.StageController.prototype.showFirstLaunchScene=function(attributes,model){

var i=0;
var mappedAttributes={
firstLaunch:attributes,
accountTypes:attributes.accountTypes||{}
};


['account_manager','scene_accountfirstlaunch'].each(Mojo.loadScriptSync);

Mojo.AccountManager._showFirstLaunchScene(this,mappedAttributes,model);
};



Mojo.Controller.StageController.prototype.showAccountsScene=function(attributes,model,firstLaunch){
if(firstLaunch){
Mojo.AccountManager._showFirstLaunchScene(this,attributes,model);
}else{
Mojo.AccountManager._showPreferencesScene(this,attributes,model);
}
};


Mojo.Controller.StageController.prototype.pushAppSupportInfoScene=function(){
Mojo.loadScriptSync('scene_appsupportinfo');
this.showFrameworkScene('','appsupport/support',Mojo.Scene.AppSupportInfo);
};


Mojo.Controller.StageController.prototype.showFrameworkScene=function(name,template,constructor,sceneArgs){
this.pushScene({
name:(name&&name!=='')?name:Mojo.View.makeUniqueId(this.window),
sceneTemplate:Mojo.Widget.getSystemTemplatePath(template),
assistantConstructor:constructor
},sceneArgs);
};

/* Compressed by the perl version of jsmin. */
/* JavaScript::Minifier 0.02 */

Mojo.Scene.AccountFirstLaunch=function AccountFirstLaunch(args){
this.globalAttributes=args.attributes||{};
Mojo.AccountManager.initAccountTypeAttributes(this.globalAttributes);
this.model=args.model||{accounts:[]};
this.attributes=this.globalAttributes.firstLaunch||{};
this.mappedAccounts=Mojo.AccountManager.mapAccountProperties(this.globalAttributes.accountTypes,this.model.accounts);

this.iconClass=this.attributes.iconClass;
this.iconPath=!this.iconClass&&(this.attributes.iconPath||Mojo.Controller.appInfo.icon);
this.title=this.attributes.title||(new Template($LL('Your #{title} accounts'))).evaluate({title:Mojo.Controller.appInfo.title});
this.template=Mojo.Widget.getSystemTemplatePath('accounts/first-launch-label');
this.itemTemplate=Mojo.Widget.getSystemTemplatePath('accounts/first-launch-item'+(this.attributes.assistant.listTap?'-tappable':''));

this.addItemTemplate=Mojo.Widget.getSystemTemplatePath('accounts/add-item');

this.accountListModel={
items:$H(this.globalAttributes.accountTypes).findAll(function(a){
return!a.value.cannotBeAdded;
}).collect(function(a){
var b=Object.extend({},a.value);
b.typeId=a.key;
return b;
})
};


this.assistant=this.attributes.assistant||{};
this.assistant.model=this.model;
this.addCallback=this.bindAssistantCallback('addAccount');
this.doneCallback=this.bindAssistantCallback('done');
this.listTapCallback=this.bindAssistantCallback('listTap');
this.dividerTemplate=Mojo.Widget.getSystemTemplatePath('people-picker/multiline-separator');

if(this.attributes.dividerFunction){
this.dividerFunction=function(realFunc,itemModel){
return realFunc(itemModel.original);
}.bind(this,this.attributes.dividerFunction);
}

this._onAddAccountTapped=this._onAddAccountTapped.bind(this);
this._onDoneTapped=this._onDoneTapped.bind(this);
this.renderAccountIcon=this.renderAccountIcon.bind(this);
};

Mojo.Scene.AccountFirstLaunch.prototype.setup=function(){
var drawerDiv;
var buttonDiv;

this.renderHeader({
headerTemplate:Mojo.Widget.getSystemTemplatePath('accounts/synergy-header')
});

this.existingAccountsDiv=this.controller.get(this.anonymizeElementId('account-first-launch-existing-accounts'));
this.noAccountsDiv=this.controller.get(this.anonymizeElementId('account-first-launch-no-accounts'));

this.addButton=this.controller.get(this.anonymizeElementId('account-add-button'));
this.setupButton(this.addButton.id,$LL('Add an account'),this._onAddAccountTapped);
this.doneButton=this.controller.get(this.anonymizeElementId('account-done-button'));
this.setupButton(this.doneButton.id,$LL('Done'),this._onDoneTapped,'affirmative');
if(this.attributes.hideDoneButton){
this.doneButton.hide();
drawerDiv=this.existingAccountsDiv.querySelector('div.accounts-drawer');
drawerDiv.addClassName('done-disabled');
buttonDiv=this.existingAccountsDiv.querySelector('div.palm-drawer-shadow');
buttonDiv.addClassName('done-disabled');
}

this.listId=this.anonymizeElementId('account-first-launch-list');
this.controller.setupWidget(this.listId,{
itemTemplate:this.itemTemplate,
dividerFunction:this.dividerFunction,
dividerTemplate:this.dividerTemplate,
onItemRendered:this.renderAccountIcon,
itemsProperty:'mappedAccounts'
},this);
this.connectListener(this.listId,Mojo.Event.listTap,this.listTapCallback);

this.addListId=this.anonymizeElementId('account-add-list');
this.controller.setupWidget(this.addListId,{
itemTemplate:this.addItemTemplate,
onItemRendered:Mojo.AccountManager.renderAccountIcon
},this.accountListModel);
this.connectListener(this.addListId,Mojo.Event.listTap,this._onAddAccountTapped);

this._manageLists();

this.setupAssistant();

this.controller.watchModel(this.model,this,this._onModelChanged);
};

Mojo.Scene.AccountFirstLaunch.prototype.cleanup=function(){
this.cleanupListeners();
this.cleanupAssistant();
};

Mojo.Scene.AccountFirstLaunch.prototype.activate=function(args){
this.activateAssistant(args);
};

Mojo.Scene.AccountFirstLaunch.prototype.deactivate=function(){
this.deactivateAssistant();
};

Mojo.Scene.AccountFirstLaunch.prototype._onModelChanged=function(model,what){
this.mappedAccounts=Mojo.AccountManager.mapAccountProperties(this.globalAttributes.accountTypes,this.model.accounts);
this.controller.modelChanged(this);
this._manageLists();
};

Mojo.Scene.AccountFirstLaunch.prototype._onAddAccountTapped=function(event){
this.addCallback(event);
};

Mojo.Scene.AccountFirstLaunch.prototype._onDoneTapped=function(event){
this.doneCallback(event);
};

Mojo.Scene.AccountFirstLaunch.prototype._manageLists=function(){
if(this.mappedAccounts.length===0&&!this.attributes.hideAccountTypesList){

this.doneButton.show();
this.addButton.hide();
this.existingAccountsDiv.hide();
this.noAccountsDiv.show();
}else{

if(this.attributes.hideDoneButton){
this.doneButton.hide();
}
this.noAccountsDiv.hide();
this.addButton.show();
this.existingAccountsDiv.show();
}
};

Mojo.Scene.addUtilityMethodsToPrototype(Mojo.Scene.AccountFirstLaunch);
Mojo.AccountManager.addUtilityMethodsToPrototype(Mojo.Scene.AccountFirstLaunch);
}
}

const $palmInitFramework200_72 = palmInitFramework200_72;

function SetupFramework200_72() {
	%SetProperty(global, "palmInitFramework200_72", $palmInitFramework200_72, 5);
}

SetupFramework200_72();

