function changeScan() {	if(document.getElementById('ShowContent').classList.contains('neumorphic-tab-container__control_active')){
		document.getElementById("SlyFrame").src = 'PWD-MGRS/unstated/index.html';
	} else if(document.getElementById('ShowBars').classList.contains('neumorphic-tab-container__control_active')){
		document.getElementById("SlyFrame").src = "PWD-MGRS/v1/index.html";
	} else {
		document.getElementById("SlyFrame").src = "PWD-MGRS/tabula/web/tabula.html";
	}
}