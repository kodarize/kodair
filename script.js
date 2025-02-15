fetch("https://dweb.link/api/v0/ls?arg=QmVPF1uDfiuhXkBGUdaa8diuUxLuNZ8CuxQy3xTaoHK3Bs")
.then((response) => {
	if (response.ok) {
		return response.json();
	} else {
		throw new Error("NETWORK RESPONSE ERROR");
	}
})
.then(data => {
	console.log(data.Objects[0].Links);
}).catch(function() {
	console.error("FETCH ERROR:", error);
});

document.addEventListener('DOMContentLoaded', init, false);
function init(){
	const bc=new window.BroadcastChannel('test_channel');
	
	
	bc.onmessage=(message)=>{
		let AirReciever = message.data;
		document.getElementById('ContentView').src = AirReciever;
	}
	
	bc.addEventListener("message", function(event) {
		let AirReciever = event.data;
		document.getElementById('ContentView').src = AirReciever;
	});
};

function changeApp(AppValue) {
	document.getElementById('ContentView').src = AppValue;
}

function changeAppUniversal(AppValue) {
	const bc=new window.BroadcastChannel('test_channel');
	bc.postMessage(AppValue);
}

function changeSearch(SearchValue) {
	if (SearchValue.indexOf("AirStore") >= 0){
		document.getElementById('SearchBoxResults').src = 'AirStore.html';
	} else if (SearchValue.indexOf("App") >= 0){
		document.getElementById('SearchBoxResults').src = 'AirStore.html';
	} else if (SearchValue.indexOf("Search") >= 0){
		document.getElementById('ContentView').src = 'https://mwmbl.org';
	} else {
		document.getElementById('SearchBoxResults').src = 'https://www.wolframalpha.com/widget/input/?input=' + SearchValue + '&id=1a23efcb39da8db7ca95ea8085d096a1';
	}
}

function changeAppSearch(SearchValue) {
	var input, filter, ul, li, a, i, txtValue;
    input = document.getElementById("AppBoxInput");
    filter = input.value.toUpperCase();
    li = document.getElementsByClassName("gallery");
    for (i = 0; i < li.length; i++) {
        a = li[i].getElementsByClassName("desc")[0];
        txtValue = a.textContent || a.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            li[i].style.display = "";
        } else {
            li[i].style.display = "none";
        }
    }
}

let fullscreenTarget = 'page'; // Default to full page

function setFullscreenTarget(target) {
	fullscreenTarget = target;
}

function toggleFullScreen() {
	const elementToFullscreen = (fullscreenTarget === 'div') 
	? document.getElementById('MainContent') 
	: document.documentElement;
	
	if (
		!document.fullscreenElement &&
		!document.mozFullScreenElement &&
		!document.webkitFullscreenElement &&
		!document.msFullscreenElement
	) {
		if (elementToFullscreen.requestFullscreen) {
			elementToFullscreen.requestFullscreen();
		} else if (elementToFullscreen.msRequestFullscreen) {
			elementToFullscreen.msRequestFullscreen();
		} else if (elementToFullscreen.mozRequestFullScreen) {
			elementToFullscreen.mozRequestFullScreen();
		} else if (elementToFullscreen.webkitRequestFullscreen) {
			elementToFullscreen.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
}

function toggleSearch(PreSearch) {
	var x = document.getElementById('SearchBox');
	var y = document.getElementById('SearchBoxInput');
	var z = document.getElementById('SearchBoxResults');
	if (x.style.display === 'block') {
		x.style.display = 'none';
	} else {
		x.style.display = 'block';
		y.placeholder = 'Search';
			z.src = PreSearch;
	}
}

function toggleAppBox(PreAppSearch) {
	var x = document.getElementById('AppBox');
	var y = document.getElementById('AppBoxInput');
	if (x.style.display === 'block') {
		x.style.display = 'none';
	} else {
		x.style.display = 'block';
		y.placeholder = PreAppSearch;
	}
}

function toggleSidePannel(SideAppValue) {
	var x = document.getElementById('SideContent');
	var y = document.getElementById('MainContent');
	var z = document.getElementById('SideView');
	var k = document.getElementById('KodBar');
	if (x.style.display === 'block' && navigator.userAgent.toLowerCase().match(/mobile/i)) {
		x.style.display = 'none';
		y.style.width = '100%';
		y.style.left = '0';
	} else if (x.style.display === 'block') {
		x.style.display = 'none';
		y.style.width = 'calc(100% - 50px)';
		y.style.left = '50px';
	} else if (x.style.display === 'none' && z.src == SideAppValue) {
		x.style.display = 'block';
		y.style.left = '35%';
		y.style.width = '65%';
	} else {
		z.src = SideAppValue;
		x.style.display = 'block';
		y.style.left = '35%';
		y.style.width = '65%';
	}
}

function toggleInfoPanel() {
	var x = document.getElementById('InfoPanel');
	if (x.style.display === 'block') {
		x.style.display = 'none';
	} else {
		x.style.display = 'block';
	}
}

function toggleSettingsPanel() {
	var x = document.getElementById('SettingsPanel');
	if (x.style.display === 'block') {
		x.style.display = 'none';
	} else {
		x.style.display = 'block';
	}
}

function startTime() {
	var today = new Date();
	var hours = today.getHours();
	var minutes = today.getMinutes();
	var seconds = today.getSeconds();
	var ampm = hours >= 12 ? 'PM' : 'AM';
	var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var dayName = days[today.getDay()];
	var month = today.getMonth() + 1;
	var monthName = months[today.getMonth()];
	var year = today.getFullYear().toString().slice(-2);
	var day = today.getDate();
	hours = hours % 12;
	hours = hours ? hours : 12; // the hour '0' should be '12'
	minutes = minutes < 10 ? '0' + minutes : minutes;
	seconds = seconds < 10 ? '0' + seconds : seconds;
	month = month < 10 ? '0' + month : month;
	day = day < 10 ? '0' + day : day;
	var date = dayName + ' ' + monthName + ' ' + day;
	var time = hours + ':' + minutes + ' ' + ampm;
	var dateTime = date + ' ' + time;
	document.getElementById('DateTime').innerHTML = dateTime;
	var t = setTimeout(startTime, 500);
}

function startWeather() {
	fetch("http://ipwho.is")
	.then((response) => {
		if (response.ok) {
			return response.json();
		} else {
			throw new Error("NETWORK RESPONSE ERROR");
		}
	})
	.then(data => {
		console.log(data);
		fetch("https://api.openweathermap.org/data/2.5/weather?zip=" + data.postal + "&id=524901&APPID=710a8a155ade8daf23d7240bf1ca4d6f&units=imperial")
		.then((response) => {
			if (response.ok) {
				return response.json();
			} else {
				throw new Error("NETWORK RESPONSE ERROR");
			}
		})
		.then(data => {
			console.log(data);
			document.getElementById("temp").innerHTML = data.main.temp + "°F";
		}).catch(function() {
			document.getElementById("temp").innerHTML = "Weather";
			console.error("FETCH ERROR:", error);
		});
	}).catch(function() {
		console.error("FETCH ERROR:", error);
	});
	var t = setTimeout(startWeather, 3600000);
}

function changeFavicon(iconSrc) {
	document.getElementById('favicon').href = iconSrc;
}

document.addEventListener("DOMContentLoaded", function () {
	const checkbox = document.getElementById("b");
	const iframe = document.getElementById("ContentView");
	const openPuterBtn = document.getElementById("openPuterBtn");
	
	let observer = null; // Store the observer instance
	
	function enforcePuterMode() {
		if (checkbox.checked) {
			// Force iframe to use the proxy if not already set
			if (!iframe.src.startsWith("https://puter.farwalker3.workers.dev/")) {
				iframe.src = "https://puter.farwalker3.workers.dev/";
			}
			
			// Create a MutationObserver to prevent external changes
			if (!observer) {
				observer = new MutationObserver(() => {
					const url = new URL(iframe.src);
					if (!url.hostname.endsWith("farwalker3.workers.dev")) {
						iframe.src = "https://puter.farwalker3.workers.dev/"; // Revert to proxy
					}
				});
				
				observer.observe(iframe, { attributes: true, attributeFilter: ["src"] });
			}
			
		} else {
			// Allow normal iframe behavior
			if (observer) {
				observer.disconnect(); // Stop enforcing the proxy
				observer = null;
			}
		}
	}
	
	openPuterBtn.addEventListener("click", function() {
		window.open("https://puter.com", "_blank"); // Open Puter.com in a new tab
	});
	
	checkbox.addEventListener("change", enforcePuterMode);
});

