document.getElementById("save").addEventListener("click", save, false);
document.getElementById("restore").addEventListener("click", restore, false);
document.getElementById("download").addEventListener("click", download, false);
document.getElementById("import").addEventListener("click", addfile, false);

function changeApp(AppValue) {
	document.getElementById('Classroom').src = AppValue;
}

function save() {
  localStorage.setItem("document", document.getElementById('Notepad').innerHTML);
  localStorage.setItem("title", document.getElementById('title').value);
}

function restore() {
  document.getElementById('Notepad').innerHTML = localStorage.getItem("document");
  document.getElementById('title').value = localStorage.getItem("title");
}

function download() {
  function downloadInnerHtml(filename, elId, mimeType) {
    var elHtml = document.getElementById(elId).innerHTML;
    var link = document.createElement('a');
    mimeType = mimeType || 'text/plain';
    link.setAttribute('download', filename);
    link.setAttribute('href', 'data:' + mimeType  +  ';charset=utf-8,' + encodeURIComponent(elHtml));
    link.click(); 
  }
  var fileName = '' + document.getElementById('title').value + '.txt'; // You can use the .txt extension if you want
  downloadInnerHtml(fileName, 'Notepad','text/plain');
}

function addfile() {
  document.getElementById('Notepad').innerHTML += "<br><iframe src='KJV.txt' height='200' width='300' style='resize:both;'></iframe>";
}

function countWordsInDiv () {
  $('#TotalWords').text(returnWords($("#Notepad").text()));
  $('#TotalChars').text(returnChars($("#Notepad").text()));
}

function returnWords(str) {
  return str.replace( /[^\w ]/g, "" ).split( /\s+/ ).length;
}

function returnChars(str) {
  return str.length;
}