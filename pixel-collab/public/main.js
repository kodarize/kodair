let squaresX = 16;
let squaresY = 16;

let squareSize = 0;

let offsetX = 0;
let offsetY = 0;

let gridSize = 0;

let drawingAllowed = false;
let savingImage = false;

function saveImage() {
    drawingAllowed = false;
    savingImage = true;
    resizeCanvas(gridSize+gridWidth,gridSize+gridWidth);
    saveCanvas(canvas, 'MyPixelArt', 'png');
    resize();
    savingImage = false;
    drawingAllowed = true;
}

function setls(key, val) {
  return localStorage.setItem(key, val);
}

function getls(key) {
  return localStorage.getItem(key);
}

function loadSettings(settings) {
  let newSettings = JSON.parse(settings);
  updateGridWidth(newSettings.gridWidth);
  updateGridColor(newSettings.gridColor);
}

function saveSettings() {
  setls(
    "settings",
    '{"gridWidth": ' + gridWidth + ', "gridColor": ' + gridColor + "}"
  );
  drawingAllowed = false;
  setTimeout(function(){ drawingAllowed = true }, 10);
}

function is_touch_device() {  
  try {  
    document.createEvent("TouchEvent");  
    return true;  
  } catch (e) {  
    return false;  
  }  
}

var curOnline = 0;

window.onload = function () {
  if (getls("settings")) loadSettings(getls("settings"));
  else setls("settings", '{"gridWidth": 1, "gridColor": 0}');
};

setInterval(() => {
    if (width != window.innerWidth || height != window.innerHeight - bottomBarHeight() - topBarHeight()) {
        resize();
        console.log("RESIZED");
    }
}, 500);

function topBarHeight() {
  return document.getElementById("topbar").clientHeight + 4;
}

function bottomBarHeight() {
  return document.getElementById("bottombar").clientHeight + 4;
}

let canvasHeight = window.innerHeight - bottomBarHeight() - topBarHeight();

updateGrid();

function updateGrid() {
  let sidemargin = 14;
  offsetY = 0;

  canvasHeight = window.innerHeight - bottomBarHeight() - topBarHeight();

  if (canvasHeight > window.innerWidth) {
    squareSize = (window.innerWidth - sidemargin) / squaresX;
    offsetX = sidemargin / 2;
  } else {
    squareSize = (canvasHeight - sidemargin) / squaresX;
    offsetX = window.innerWidth / 2 - (squaresX * squareSize) / 2;
  }

  gridSize = squaresX * squareSize;
  offsetY = canvasHeight / 2 - gridSize / 2;
}

function resize() {
  resizeCanvas(window.innerWidth, canvasHeight);
  updateGrid();
}

//window.addEventListener("resize", resize);

var colorChoice = "#000000";

let colorInput = document.getElementById("color");

let mode = "";

function updMode(toMode) {
  let toolbtns = document.querySelectorAll(".toolbtn");
  mode = toMode;
  for (let i = 0; i < toolbtns.length; i++) {
    toolbtns[i].classList.remove("toolselect");

    if (toolbtns[i].id == toMode) toolbtns[i].classList.add("toolselect");
  }
}

updMode("pen");

let kcolorpicker = new KellyColorPicker({
  place: "picker",
  size: 200,
  userEvents: {
    change: function (self) {
      colorChoice = self.getCurColorHex();
      updMode("pen");
    },
  },
});

function swapColors(oldColor, newColor) {
  for (var x = 0; x < squaresX; x++) {
    for (var y = 0; y < squaresY; y++) {
      if (oldColor == "any") grid[x][y] = newColor;
      else if (grid[x][y] == oldColor) grid[x][y] = newColor;
    }
  }
}

var canvas;

function setup() {
  canvas = createCanvas(window.innerWidth, canvasHeight);
  canvas.position(0, topBarHeight());

  grid = create2DArray();

  for (var x = 0; x < squaresX; x++) {
    for (var y = 0; y < squaresY; y++) {
      grid[x][y] = 0;
    }
  }

}

function create2DArray() {
  var arr = new Array(squaresX);
  for (var x = 0; x < arr.length; x++) {
    arr[x] = new Array(squaresX);
  }

  return arr;
}

let gridWidth = 1;
let gridColor = 0;

function updateGridColor(newColor) {
  gridColor = newColor;
}

function updateGridWidth(newWidth) {
  document.getElementById("gridWidth").innerHTML = newWidth;
  document.getElementById("gridWidthRange").value = newWidth;
  gridWidth = JSON.parse(newWidth);
}

function fillGrid() {

  if (savingImage) translate(-offsetX+gridWidth,-offsetY+gridWidth);

  background("#1a1729");
  strokeWeight(0);
  stroke(0);

  fill(gridColor);

  if (gridWidth != 0)
    rect(
      offsetX - gridWidth,
      offsetY - gridWidth,
      squareSize * 16 +gridWidth,
      squareSize * 16 +gridWidth
    );
  else rect(
    offsetX - 1,
    offsetY - 1,
    squareSize * 16 +3,
    squareSize * 16 +3
  );

  for (var x = 0; x < squaresX; x++) {
    for (var y = 0; y < squaresY; y++) {
      if (grid[x][y] != 0) {
        let cell = grid[x][y];
        fill(cell);
      } else {
        fill(255);
      }
      let newGridWidth = gridWidth;
      if (gridWidth == 0) newGridWidth = -1;
      rect(
        x * squareSize + offsetX,
        y * squareSize + offsetY,
        squareSize - newGridWidth,
        squareSize - newGridWidth
      );
    }
  }

}

function draw() {
  fillGrid();
}

let databaseloaded = false;

document.getElementById("idInput").addEventListener("keyup", (e) => {
  if (e.keyCode == 13) connectionTry(document.getElementById("idInput").value);
});

let origMouseX = 0;
let origMouseY = 0;

function drawpixels() {
  for (var x = 0; x < squaresX; x++) {
    for (var y = 0; y < squaresY; y++) {
      if (
        mouseX > x * squareSize + offsetX &&
        mouseX < x * squareSize + squareSize + offsetX &&
        mouseY > y * squareSize + offsetY &&
        mouseY < y * squareSize + squareSize + offsetY &&
        databaseloaded
      ) {
        if (mode == "pen") {
          if(grid[x][y]!=colorChoice)
            deploy(x,y);

          if (colorChoice == "#ffffff")
            grid[x][y] = 0;
          else
            grid[x][y] = colorChoice;

        } else if (mode == "eraser") {

          if(grid[x][y]!=0)
            deploy(x,y,0);

          grid[x][y] = 0;

        } else if (mode == "dropper") {
          kcolorpicker.setColor(grid[x][y]);
          updMode("pen");
        }
        break;
      }
    }
  }
}

function arrayDiff(arr1,arr2) {
    let result = [];
    for (let x = 0; x < arr1.length; x++) {
        for (let y = 0; y < arr1.length; y++) {
            if ( arr1[x][y]!=arr2[x][y] ) {
                result.push({ color:arr1[x][y], x:x, y:y })
            }
        }
    }
    return result;
}

function dragDraw() {
  if (
    origMouseX > offsetX &&
    origMouseX < offsetX + gridSize &&
    origMouseY > offsetY &&
    origMouseY < offsetY + gridSize &&
    drawingAllowed
  ) {
    drawpixels();
  }
}

function tapDraw() {
  origMouseX = mouseX;
  origMouseY = mouseY;
  if (
    origMouseX > offsetX &&
    origMouseX < offsetX + gridSize &&
    origMouseY > offsetY &&
    origMouseY < offsetY + gridSize &&
    drawingAllowed
  ) {
    drawpixels();
}
}

if (is_touch_device) {
  function touchMoved() {
    dragDraw();
  }
  function touchStarted() {
    tapDraw();
  }
} else {
  function mouseDragged() {
    dragDraw();
  }
  function mouseClicked() {
    tapDraw();
  }
}


function dbRef(path) {
  return firebase.database().ref(path);
}

function boardData(data, id=BID) {
    return firebase.database().ref("pixelBoards/" + id + "/" + data);
}

function getCell(x,y,id=BID) {
    return firebase.database().ref("pixelBoards/" + id + "/cells/" + y + "/" + x);
}

function existsCallBack(id, exists) {
  if (exists) {
    connectB(id);
    invDisp("boardMenu");
    console.log(">> Connected to " + id);
  } else {
    alert('Canvas "' + id + '" does not exist...');
  }
}

function connectionTry(id) {
  console.log("Conection started...");
  boardData("name", BID).off();
  boardData("cells", BID).off();
  firebase
    .database()
    .ref("pixelBoards")
    .child(id)
    .once("value", function (snapshot) {
      var exists = snapshot.val() !== null;
      existsCallBack(id, exists);
    });
  console.log("Conection ended.");
}

function connectB(boardId = "") {
  if (boardId != "") {
      boardData("name", boardId).on("value", function (snapshot) {
          if (snapshot.val() != null) {
              document.getElementById("name").innerText = snapshot.val();
              canvas.position(0, topBarHeight());
          }
          else {
              boardData("name", boardId).set("New Name");
          }
      });
      boardData("cells", boardId).on("value", function (snapshot) {
          if (snapshot.val() != null) {
              //console.log("cells exist!");
              //console.log(snapshot.val());
              grid = snapshot.val();
              databaseloaded = true;
              BID = boardId;
          }
          else {
              console.log("cells not found...");
              boardData("cells", boardId).set(grid);
          }
      });
  }
}

function invDisp(elemId) {
  let elem = document.getElementById(elemId);

  if (elem.style.display == "none") {
    drawingAllowed = false;
    elem.style.display = "flex";
    document.getElementById('blackglass').style.display = "block";
  } else {
    drawingAllowed = true;
    elem.style.display = "none";
    document.getElementById('blackglass').style.display = "none";
  }
}

var BID = "";

console.log("Verion 2");

function deploy(x,y,color=colorChoice) {
  if (databaseloaded) {
    getCell(y, x).set(color);
    //console.log("Deployed:",x,y,color);
    //boardData("cells", BID).set(grid);
  }
}

function clicked(selector,func) {
  document.querySelectorAll(selector).forEach(elem => {
    if (is_touch_device()) {
      elem.addEventListener("touchstart", func)
    } else {
      elem.addEventListener("click", func);
    }
  });
}

clicked('#pen',function(){updMode('pen')});
clicked('#eraser',function(){updMode('eraser')});
clicked('#dropper',function(){updMode('dropper')});

clicked('#publicBtn1',function(){connectionTry('public1')});
clicked('#publicBtn2',function(){connectionTry('public2')});
clicked('#publicBtn3',function(){connectionTry('public3')});
clicked('#publicBtn4',function(){connectionTry('public4')});

clicked('#gridColorBlack',function(){updateGridColor(0)});
clicked('#gridColorWhite',function(){updateGridColor(255)});

clicked('#settings',function(){invDisp('settingsMenu')});
clicked('#savesettings',function(){invDisp('settingsMenu');saveSettings();});
clicked('#savepixelart',function(){saveImage()});

clicked('#name',function(){invDisp('boardMenu')});
