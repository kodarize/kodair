function changeScan() {
   var val = document.getElementById("myRange").value;
	const content = ["KodscanRadio.html", "KodairRadio.html", "KodmasRadio.html", "KoshliptRadio.html", "https://www.youtube.com/embed/videoseries?list=PLIPIyISHz-TAf5ncf_CEU0yDnK6rfhsPe", "https://www.youtube.com/embed?listType=user_uploads&list=Chillhopdotcom", "https://www.theta.tv/", "https://pluto.tv", "KodTube/index.html"];
	const audio = ["http://stream.zeno.fm/c8p453rgec9uv", "http://stream.zeno.fm/svf0anerws8uv", "http://stream.zeno.fm/304s16vf698uv", "http://stream.zeno.fm/sh11amu3uc9uv", "", "", "", ""];
	const title = ["KodScan Radio", "Kodair Radio", "Kodmas Radio", "Koshlipt Radio", "KodTV", "Chillhop", "ThetaTv", "PlutoTv", "KodTube"];
document.getElementById("ScanAudio").src = audio[val];
document.getElementById("ScanTitle").innerHTML = title[val];	if(document.getElementById('ShowContent').classList.contains('neumorphic-tab-container__control_active')){
		document.getElementById("ScanView").src = content[val];
	} else if(document.getElementById('ShowBars').classList.contains('neumorphic-tab-container__control_active')){
		document.getElementById("ScanView").src = "KodVisualizer/KodVisualizer.html";
	} else {
		document.getElementById("ScanView").src = "KodRadio/KodRadio.html";
	}
}