var i = document.getElementById('RCmenu').style;
if (document.addEventListener) {
	document.addEventListener(
		'contextmenu',
		function (e) {
			var posX = e.clientX;
			var posY = e.clientY;
			menu(posX, posY);
			e.preventDefault();
		},
		false
	);
	document.addEventListener('click', NoMenu(e), false);
} else {
	document.attachEvent('oncontextmenu', function (e) {
		var posX = e.clientX;
		var posY = e.clientY;
		menu(posX, posY);
		e.preventDefault();
	});
	document.attachEvent('onclick', NoMenu(e));
}

function menu(x, y) {
	i.top = y + 'px';
	i.left = x + 'px';
	i.visibility = 'visible';
	i.opacity = '1';
}

function NoMenu(e) {
	i.opacity = '0';
	setTimeout(function () {
		i.visibility = 'hidden';
	}, 501);
}