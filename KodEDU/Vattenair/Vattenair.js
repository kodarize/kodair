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

function toggleSlide() {
	if(document.getElementById('AgreeBox').checked) { 
		parent.document.getElementById('CapstoneSlideshow').src = "https://docs.google.com/presentation/d/e/2PACX-1vRRSTn6AoCJNJ0ScuEcOJX4LTqNQi3_TarBC6Hw2ids8czdEC_Pm8waeEgkWdOHy-0Sbi267yajJZ-T/embed?start=false&loop=true&delayms=60000";
	} else { 
		alert('Please indicate that you have read and agree to the Terms Service');
	}
}