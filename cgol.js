var canvas = document.getElementById("cgol");
var ctx = canvas.getContext("2d");

var resolution = 100;
var aliveRGB = [255, 255, 255, 255];
var deadRGB = [0, 0, 0, 255];
var cSize = [canvas.width, canvas.height];
var pxSize = [(cSize[0] / resolution), (cSize[1] / resolution)];
var isMouseDown;
var fq = 60;
var running = false;
var evoLoop;

var curGenCells, nextGenCells;
init();

function init(){
  clear();
  document.getElementById("clear").onclick = clear;
  document.getElementById("run").onclick = run;
  document.getElementById("test").onclick = test;
}

function test(){
  res = 1000;
  var x = new Array(res);
  for (var i = 0; i < x.length; i++) {
    x[i] = new Array(res);
    console.log("huh");
  }
  console.log(x);
}

function run(){
  if(!running){
    running = true;
    document.getElementById("run").innerHTML = "Stop"
    nextGenCells = copy(curGenCells);
    setEvoLoop();
  }else{
    running = false;
    document.getElementById("run").innerHTML = "Run"
    clearInterval(evoLoop);
  }
}

function setEvoLoop(){
  evoLoop = setInterval(function(){
    updateStates();
  }, (1000 / fq));
}

function updateStates(){
  checkedCell = [];
  for(var r = 0; r < resolution; r++){
    for(var c = 0; c < resolution; c++){
      if(curGenCells[r][c]){
        if(!(edge([r, c]))){
          for(var cR = -1; cR <= 1; cR++){
            for(var cC = -1; cC <= 1; cC++){
              numNeighbor = 0;
              index = (r + cR) * resolution + (c + cC);
              if(!checkedCell.includes(index)){
                for(var cRcR = -1; cRcR <= 1; cRcR++){
                  for(var cCcC = -1; cCcC <= 1; cCcC++){
                    if(curGenCells[r + cR + cRcR][c + cC + cCcC] & (cRcR | cCcC)){ numNeighbor++ }
                  }
                }
                checkedCell.push(index);
                if(curGenCells[r + cR][c + cC]){
                  if(numNeighbor < 2 || numNeighbor > 3){ nextGenCells[r + cR][c + cC] = 0; }
                }else if(numNeighbor == 3){
                  nextGenCells[r + cR][c + cC] = 1;
                }
              }
            }
          }
        }
        // else if(){
          // special cases when checking on edge
          // getCellsToCheck([r, c]);
        // }
      }
    }
  }
  repaint();
  curGenCells = copy(nextGenCells);
}

function copy(o) {
   var output, v, key;
   output = Array.isArray(o) ? [] : {};
   for (key in o) {
       v = o[key];
       output[key] = (typeof v === "object") ? copy(v) : v;
   }
   return output;
}

function edge([row, col]){
  return (row >= cSize[1] - 3 || row <= 2 || col >= cSize[0] - 3 || col <= 2);
}

function repaint(){
  var tempPixValue = nextGenCells[0][0];
  setFill(nextGenCells[0][0]);
  for(var r = 0; r < resolution; r++){
    for(var c = 0; c < resolution; c++){
      if(tempPixValue != nextGenCells[r][c]){
        tempPixValue = !tempPixValue;
        setFill(tempPixValue);
      }
      fillPix([c * pxSize[0], r * pxSize[1]]);
    }
  }
}

function resetCellArrays(){
  curGenCells = Array.from(Array(resolution), _ => Array(resolution).fill(0));
  nextGenCells = Array.from(Array(resolution), _ => Array(resolution).fill(0));
}

function onClick(e) {
  isMouseMove = false;

  canvas.onmousedown = function() {
    isMouseDown = true;
    coord = [e.layerX - (e.layerX % pxSize[0]), e.layerY - (e.layerY % pxSize[1])];
    setFill(1);
    fillPix(coord);
    addCoord(coord);
  };
  document.onmouseup = function() {
    isMouseDown = false;
    // curGenCells.sort(function(x, y){ return x - y; });
  };
  if(isMouseDown){
    coord = [e.layerX - (e.layerX % pxSize[0]), e.layerY - (e.layerY % pxSize[1])];
    setFill(1);
    fillPix(coord);
    addCoord(coord);
  }
}

function fillPix(coord){
  ctx.fillRect(coord[0], coord[1], pxSize[0], pxSize[1]);
}

function addCoord(coord){
  curGenCells[Math.round(coord[1]/pxSize[1])][Math.round(coord[0]/pxSize[0])] = 1;
}

function clear(){
  resetCellArrays();
  setFill(0);
  ctx.fillRect(0, 0, cSize[0], cSize[1]);
  setFill(1);
}

function setFill(alive){
  if(alive){ ctx.fillStyle = "rgba(" + aliveRGB[0] + "," + aliveRGB[1] + "," + aliveRGB[2] + "," + (aliveRGB[3] / 255) + ")"; }
  else { ctx.fillStyle = "rgba(" + deadRGB[0] + "," + deadRGB[1] + "," + deadRGB[2] + "," + (deadRGB[3] / 255) + ")"; }
}

// drawGrid(canvasSize[0], canvasSize[1], "cgol");

// function drawGrid(w, h, id) {
//     var canvas = document.getElementById(id);
//     var ctx = canvas.getContext('2d');
//     ctx.canvas.width  = w;
//     ctx.canvas.height = h;
//
//     var data = '<svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"> \
//         <defs> \
//             <pattern id="smallGrid" width=String(w/resolution) height="8" patternUnits="userSpaceOnUse"> \
//                 <path d="M 8 0 L 0 0 0 8" fill="none" stroke="black" stroke-width="0.5" /> \
//             </pattern> \
//             <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse"> \
//                 <rect width="80" height="80" fill="url(#smallGrid)" /> \
//                 <path d="M 80 0 L 0 0 0 80" fill="none" stroke="black" stroke-width="1" /> \
//             </pattern> \
//         </defs> \
//         <rect width="100%" height="100%" fill="url(#smallGrid)" /> \
//     </svg>';
//
//     var DOMURL = window.URL || window.webkitURL || window;
//
//     var img = new Image();
//     var svg = new Blob([data], {type: 'image/svg+xml;charset=utf-8'});
//     var url = DOMURL.createObjectURL(svg);
//
//     img.onload = function () {
//       ctx.drawImage(img, 0, 0);
//       DOMURL.revokeObjectURL(url);
//     }
//     img.src = url;
// }
