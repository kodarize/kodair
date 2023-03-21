function changeApp(AppValue) {
	document.getElementById('ContentView').src = AppValue;
}

function changeSearch(SearchValue) {
	if (SearchValue.indexOf("AirStore") >= 0){
		document.getElementById('SearchBoxResults').src = 'AirStore.html';
	} else if (SearchValue.indexOf("App") >= 0){
		document.getElementById('SearchBoxResults').src = 'AirStore.html';
	} else if (SearchValue.indexOf("e621Browser") >= 0){
		document.getElementById('SearchBoxResults').src = 'NSFW.html';
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

function toggleFullScreen() {
	if (
		!document.fullscreenElement && // alternative standard method
		!document.mozFullScreenElement &&
		!document.webkitFullscreenElement &&
		!document.msFullscreenElement
	) {
		// current working methods
		if (document.documentElement.requestFullscreen) {
			document.documentElement.requestFullscreen();
		} else if (document.documentElement.msRequestFullscreen) {
			document.documentElement.msRequestFullscreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullscreen) {
			document.documentElement.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
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
	if (x.style.display === 'block') {
		x.style.display = 'none';
	} else {
		x.style.display = 'block';
		y.placeholder = 'Search';
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

function toggleInfoPannel() {
	var x = document.getElementById('InfoPannel');
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
	fetch("https://ipapi.co/json/")
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
			document.getElementById("temp").innerHTML = data.main.temp + "F";
		}).catch(function() {
			document.getElementById("temp").innerHTML = "Weather";
			console.error("FETCH ERROR:", error);
		});
	}).catch(function() {
		console.error("FETCH ERROR:", error);
	});
	var t = setTimeout(startWeather, 3600000);
}