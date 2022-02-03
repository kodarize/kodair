function newSrc(a) {
	var theSelect = document.getElementById('MediaChoice');
    var theIframe = document.getElementById('RadioFrame');
    var x = (a.value || a.options[a.selectedIndex].value);  //crossbrowser solution =)
    theIframe.src = x;
}
function webSrc() {
	var e = document.getElementById("MediaChoice");
    var theIframe = document.getElementById('RadioFrame');
	var x = e.options[e.selectedIndex].value;
    theIframe.src = x;
}
function barsSrc() {
    var theIframe = document.getElementById('RadioFrame');
    theIframe.src = "KodVisualizer/KodVisualizer.html";
}
function visualSrc() {
    var theIframe = document.getElementById('RadioFrame');
    theIframe.src = x;
}