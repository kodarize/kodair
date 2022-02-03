function toggleKodTerms() {
	var x = document.getElementById('KodTerms');
	var y = document.getElementById('KodSlide');
	var z = document.getElementById('KodTracking');
	if (x.style.height === '50px') {
		x.style.height = 'calc(100% - 100px)';
		y.style.top = 'calc(100% - 100px)';
		z.style.top = 'calc(100% - 50px)';
		y.style.height = '50px';
		z.style.height = '50px';
	} else {
		x.style.height = '50px';
		y.style.top = '50px';
		z.style.top = 'calc(100% - 50px)';
		y.style.height = 'calc(100% - 100px)';
		z.style.height = '50px';
	}
}

function toggleKodTracking() {
	var x = document.getElementById('KodTerms');
	var y = document.getElementById('KodSlide');
	var z = document.getElementById('KodTracking');
	if (z.style.height === '50px') {
		z.style.height = 'calc(100% - 100px)';
		y.style.top = '50px';
		z.style.top = '100px';
		y.style.height = '50px';
		x.style.height = '50px';
	} else {
		x.style.height = '50px';
		y.style.top = '50px';
		z.style.top = 'calc(100% - 50px)';
		y.style.height = 'calc(100% - 100px)';
		z.style.height = '50px';
	}
}