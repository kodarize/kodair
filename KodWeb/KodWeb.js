document.getElementById('ActionInput').onkeypress = function(e) {
    if (e.keyCode == 13) {
        document.getElementById('ActionClick').click();
    }
}

function ChangeWebPage(NewSRC) {
    var SelectValue = document.getElementById("ActionType");
	var InputValue = document.getElementById("ActionInput");
    if (SelectValue.value == "Search" && InputValue.value.includes("https://")) {
		document.getElementById("MainWeb").src = NewSRC;
	} else if(SelectValue.value == "Search" && InputValue.value.includes("http://")) {
			document.getElementById("MainWeb").src = NewSRC;
	} else if (SelectValue.value == "Search") {
			document.getElementById("MainWeb").src = 'https://www.bing.com/search?q=' + NewSRC;
    } else if (SelectValue.value == "Repo") {
        document.getElementById("MainWeb").src = 'https://zollo.sanixdk.xyz/?q=' + NewSRC;
    } else if (SelectValue.value == "Search Wolfram Alpha") {
        document.getElementById("MainWeb").src = 'https://www.wolframalpha.com/widget/input/?input=' + NewSRC + '&id=1a23efcb39da8db7ca95ea8085d096a1';
    } else if (SelectValue.value == "Channel ID") {
        document.getElementById("MainWeb").src = 'http://www.youtube.com/embed/?listType=user_uploads&list=' + NewSRC;
    } else if (SelectValue.value == "Playlist ID") {
        document.getElementById("MainWeb").src = 'https://www.youtube.com/embed/videoseries?list=' + NewSRC;
    } else if (SelectValue.value == "Video ID") {
        document.getElementById("MainWeb").src = 'https://www.youtube.com/embed/' + NewSRC;
    } else if (SelectValue.value == "Project ID") {
        document.getElementById("MainWeb").src = 'https://phosphorus.github.io/app.html?id=' + NewSRC + '&turbo=false&full-screen=true';
    } else if (SelectValue.value == "Search Internet Archive") {
        document.getElementById("MainWeb").src = 'https://archive.org/search.php?query=' + NewSRC;
    } else if (SelectValue.value == "Search Amazon") {
        document.getElementById("MainWeb").src = 'https://www.amazon.com/s?k=' + NewSRC;
    } else if (SelectValue.value == "Search Artist Or Song") {
        document.getElementById("MainWeb").src = 'http://www.vanbasco.com/search.html?q=' + NewSRC;
    } else if (SelectValue.value == "Enter Full URL") {
        document.getElementById("MainWeb").src = NewSRC;
    } else {
        document.getElementById("MainWeb").src = 'https://www.bing.com/search?q=' + NewSRC;
    }
};

//Make the DIV element draggagle:
dragElement2(document.getElementById("DragToolbar2"));

function dragElement2(elmnt2) {
    var pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
    if (document.getElementById("Handle3")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById("Handle3").onmousedown = dragMouseDown2;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt2.onmousedown = dragMouseDown2;
    }
    if (document.getElementById("Handle4")) {
        /* if present, the header is where you move the DIV from:*/
        document.getElementById("Handle4").onmousedown = dragMouseDown2;
    } else {
        /* otherwise, move the DIV from anywhere inside the DIV:*/
        elmnt2.onmousedown = dragMouseDown2;
    }

    function dragMouseDown2(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement2;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag2;
    }

    function elementDrag2(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt2.style.top = (elmnt2.offsetTop - pos2) + "px";
        elmnt2.style.left = (elmnt2.offsetLeft - pos1) + "px";
    }

    function closeDragElement2() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

function QuickMove3() {
    left1 = "calc(100% - 25px)";
    if (document.getElementById("DragToolbar2").style.left == left1) {
        document.getElementById("DragToolbar2").style.left = "2%"
    } else {
        document.getElementById("DragToolbar2").style.left = left1;
    }
}

function QuickMove4() {
    document.getElementById("DragToolbar2").style.top = "4%";
    document.getElementById("DragToolbar2").style.left = "2%";
    document.getElementById("DragToolbar2").style.width = "96%";
}