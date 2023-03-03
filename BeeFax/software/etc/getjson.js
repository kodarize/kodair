////////////////////////////////////////////////////////////////////////////////
// BEEFAX // ETC: GETJSON                                                     //
////////////////////////////////////////////////////////////////////////////////
// (C) 2022 - Benjamin Sykes. All rights reserved.                            //
// Please do not copy or rebrand my work.                                     //
////////////////////////////////////////////////////////////////////////////////

// Original: https://www.mertonium.com/vanilla-js-getjson
// Modified to work for my use case.

/*
 * Usage:
 * getJSON("https://jsonplaceholder.typicode.com/comments", { postId: 1})
 *  .then(data => {
 *    console.log(data);
 *  });
 */

function getJSON(url, qs_params) {
	function buildQueryString(params) {
	  	return Object.entries(params).map(d => `${d[0]}=${d[1]}`).join('&');
	}
  
	return new Promise((resolve, reject) => {
		const qs = qs_params ? '?' + buildQueryString(qs_params) : '';
		const xhr = new XMLHttpRequest();
		xhr.open('GET', `${url}${qs}`);
	
		xhr.onload = function() {
			if (xhr.status >= 200 && xhr.status < 400) {
			resolve(JSON.parse(xhr.responseText));
			} else {
			resolve(xhr.responseText);
			}
		};
		xhr.onerror = () => reject(xhr.statusText);
		xhr.send();
	});
}