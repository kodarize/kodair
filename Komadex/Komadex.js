var mdp = window.markdownit({breaks:true , typographer:true});
ModelFile = "Models/Tanuki.glb";
InfoFile = "Factsheets/Komadex.md";
BuddyViewer.src = ModelFile;
render();
$.get(InfoFile, function(data, status) {
    $("#BuddyInfo").html(data);  //receive data and put into body element
    render(); //render data as MarkDown
});

var ModelFile;
var InfoFile;

searchBox = document.querySelector("#BuddySearch");
buddies = document.querySelector("#BuddySelect");
BuddyViewer = document.getElementById("BuddyViewer");
BuddyInfo = document.getElementById("BuddyInfo");
var when = "keyup"; //You can change this to keydown, keypress or change

searchBox.addEventListener("keyup", function (e) {
    var text = e.target.value; //searchBox value
    var options = buddies.options; //select options
    for (var i = 0; i < options.length; i++) {
        var option = options[i]; //current option
        var optionText = option.text; //option text ("Somalia")
        var lowerOptionText = optionText.toLowerCase(); //option text lowercased for case insensitive testing
        var lowerText = text.toLowerCase(); //searchBox value lowercased for case insensitive testing
        var regex = new RegExp("^" + text, "i"); //regExp, explained in post
        var match = optionText.match(regex); //test if regExp is true
        var contains = lowerOptionText.indexOf(lowerText) != -1; //test if searchBox value is contained by the option text
        if (match || contains) { //if one or the other goes through
            option.selected = true; //select that option
            ModelFile = "Models/" + option.value + ".glb";
            InfoFile = "Factsheets/" + option.value + ".md";
            BuddyViewer.src = ModelFile;
            render();
            $.get(InfoFile, function(data, status) {
                $("#BuddyInfo").html(data);  //receive data and put into body element
                render(); //render data as MarkDown
            });
            return; //prevent other code inside this event from executing
        }
        searchBox.selectedIndex = 0; //if nothing matches it selects the default option
        
    }
});

function ChangeInfo(Buddy){
    ModelFile = "Models/" + Buddy + ".glb";
    InfoFile = "Factsheets/" + Buddy + ".md";
    BuddyViewer.src = ModelFile;
    render();
    $.get(InfoFile, function(data, status) {
        $("#BuddyInfo").html(data);  //receive data and put into body element
        render(); //render data as MarkDown
    });
}

function render() {
    $("#BuddyInfo").html(mdp.render($("#BuddyInfo").html()));
}