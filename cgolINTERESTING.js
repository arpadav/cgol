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
  // curGenCells[0][0] = 1;
}

function test(){
  // var testArray = Array(cSize[1]).map(x => Array.apply(null, Array(cSize[0])).map(Number.valueOf, 0));
  // var testArray = Array.apply(null, Array(cSize[1])).map(Array.prototype.valueOf, Array.apply(null, Array(cSize[0])).map(Number.prototype.valueOf, 0));
  // var test2Array = Array(cSize[1]).fill(0).map(x => testArray);
  console.log(curGenCells);
  // console.log();
}

function run(){
  if(!running){
    running = true;
    document.getElementById("run").innerHTML = "Stop"
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
  nextGenCells = curGenCells;
  // check where cells are alive from current gen
  for(var r = 0; r < resolution; r++){
    // console.log(r);
    for(var c = 0; c < resolution; c++){
      // console.log(r);
      // console.log(curGenCells[r][c] + " " + r + " " + c);
      if(curGenCells[r][c]){
        if(!(edge([r, c]))){
          for(var cR = -1; cR <= 1; cR++){
            for(var cC = -1; cC <= 1; cC++){
              numNeighbor = 0;
              // find num neighbors, push r + cR, c + cC to array as index
              for(var cRcR = -1; cRcR <= 1; cRcR++){
                for(var cCcC = -1; cCcC <= 1; cCcC++){
                  if(curGenCells[r + cR + cRcR][c + cC + cCcC]){ numNeighbor++ }
                }
              }
              if(curGenCells[r + cR][c + cC]){
                if(numNeighbor < 2 || numNeighbor > 3){ nextGenCells[r + cR][c + cC] = 0; }
              }else{
                if(numNeighbor == 3){ nextGenCells[r + cR][c + cC] = 1; }
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
  // for each alive, get surrounding cell indicies (cellsToCheck)
  // for each in cellsToCheck (AND not in checkedCell), find numNeighbor
  // if else w numNeighbor, setting = to 1 or 0
  // once done numNeighbor, PUSH INDEX INTO checkedCell
  // for(var i = 0; i < curGenCells.length; i++){ getCellsToCheck(curGenCells[i]); }
  // for(var i = 0; i < nextGenCells.length; i++){
  //   testCells = surroundingCells(nextGenCells[i]);
  //   testCells.splice(4, 1);
  //   numNeighbor = 0;
  //   for(var j = 0; j < testCells.length; j++){ if(curGenCells.includes(testCells[j])){ numNeighbor++; } }
  //   if(curGenCells.includes(nextGenCells[i])){
  //     if(numNeighbor < 2 || numNeighbor > 3){ nextGenCells.splice(i, 1); i--; }
  //   }else{
  //     if(numNeighbor != 3){ nextGenCells.splice(i, 1); i--; }
  //   }
  // }
  // nextGenCells = nextGenCells.sort(function(x, y){ return x - y; });
  repaint();
  curGenCells = nextGenCells;
}

// function surroundingCells(cell){
//   return [cell - resolution - 1, cell - resolution, cell - resolution + 1,
//           cell - 1,              cell,              cell + 1,
//           cell + resolution - 1, cell + resolution, cell + resolution + 1];
// }

// function getCellsToCheck(cell){
//   boundCells = surroundingCells(cell);
//   // checking cells multiple times, can be more efficient
//   for(var i = 0; i < boundCells.length; i++){ if(!nextGenCells.includes(boundCells[i])){ nextGenCells.push(boundCells[i]); } }
//   // this line is pointless ?? ^
// }

function edge([row, col]){
  return (row >= cSize[1] - 3 || row <= 2 || col >= cSize[0] - 3 || col <= 2);
}

function repaint(){
  var tempPixValue = nextGenCells[0][0];
  setFill(nextGenCells[0][0]);
  for(var r = 0; r < resolution; r++){
    for(var c = 0; c < resolution; c++){
      if(tempPixValue != nextGenCells[r][c]){
        tempPixValue = ~tempPixValue;
        setFill(tempPixValue);
      }
      fillPix([r * pxSize[1], c * pxSize[0]]);
    }
  }

  // setFill(0);
  // for(var i = 0; i < curGenCells.length; i++){
  //   if(!nextGenCells.includes(curGenCells[i])){ fillPix(iToCoord(curGenCells[i])); }
  // }
  // setFill(1);
  // toPaint = nextGenCells.diff(curGenCells);
  // for(var i = 0; i < toPaint.length; i++){ fillPix(iToCoord(toPaint[i])); }
}

// function iToCoord(index){
//   return [(index % resolution) * pxSize[0], Math.floor(index / resolution) * pxSize[1]];
// }

// Array.prototype.diff = function(a) {
//     return this.filter(function(i) {return a.indexOf(i) < 0;});
// };

function resetCellArrays(){
  nextGenCells = Array.from(Array(resolution), _ => Array(resolution).fill(0));
  // nextGenCells = Array.apply(null, Array(resolution)).map(Array.prototype.valueOf, Array.apply(null, Array(resolution)).map(Number.prototype.valueOf, 0));
  curGenCells = nextGenCells;
}

function onClick(e) {
  // console.log(curGenCells);
  isMouseMove = false;

  canvas.onmousedown = function() {
    isMouseDown = true;
    coord = [e.layerX - (e.layerX % pxSize[0]), e.layerY - (e.layerY % pxSize[1])];
    // console.log(coord);
    fillPix(coord);
    addCoord(coord);
  };
  document.onmouseup = function() {
    isMouseDown = false;
    curGenCells.sort(function(x, y){ return x - y; });
  };
  if(isMouseDown){
    coord = [e.layerX - (e.layerX % pxSize[0]), e.layerY - (e.layerY % pxSize[1])];
    // console.log(coord);
    fillPix(coord);
    addCoord(coord);
  }
}

function fillPix(coord){
  ctx.fillRect(coord[0], coord[1], pxSize[0], pxSize[1]);
}

function addCoord(coord){
  // console.log(curGenCells[Math.round(coord[0]/pxSize[0])][Math.round(coord[1]/pxSize[1])]);
  curGenCells[Math.round(coord[1]/pxSize[1])][Math.round(coord[0]/pxSize[0])] = 1;
  // index = Math.round(resolution * (coord[1] * resolution + coord[0]) / cSize[0]);
  // if(!curGenCells.includes(index) && index < resolution ** 2){ curGenCells.push(index); }
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
