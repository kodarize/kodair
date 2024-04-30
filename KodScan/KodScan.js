function changeScan() {
   var val = document.getElementById("myRange").value;
	const content = ["rplayer/index.html", "KodscanRadio.html", "KodairRadio.html", "KodmasRadio.html", "KoshliptRadio.html", "https://fast.wistia.com/embed/channel/x9o30s7dep?wchannelid=x9o30s7dep", "https://www.youtube.com/embed?listType=user_uploads&list=Chillhopdotcom", "https://pluto.tv", "https://0xhtml.github.io/PrivacyTube/#/"];
	const audio = ["", "http://stream.zeno.fm/c8p453rgec9uv", "http://stream.zeno.fm/svf0anerws8uv", "http://stream.zeno.fm/304s16vf698uv", "http://stream.zeno.fm/sh11amu3uc9uv", "", "", "", ""];
	const title = ["rPlayer", "KodScan Radio", "Kodair Radio", "Kodmas Radio", "Koshlipt Radio", "KodTV", "Chillhop", "PlutoTv", "PrivacyTube"];
document.getElementById("ScanAudio").src = audio[val];
document.getElementById("ScanTitle").innerHTML = title[val];	if(document.getElementById('ShowContent').classList.contains('neumorphic-tab-container__control_active')){
		document.getElementById("ScanView").src = content[val];
	} else if(document.getElementById('ShowBars').classList.contains('neumorphic-tab-container__control_active')){
		document.getElementById("ScanView").src = "KodVisualizer/KodVisualizer.html";
	} else {
		document.getElementById("ScanView").src = "KodRadio/KodRadio.html";
	}
}