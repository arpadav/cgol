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

var curGenAliveCells = [];
var nextGenAliveCells = [];
init();

function init(){
  clear();
  document.getElementById("clear").onclick = clear;
  document.getElementById("run").onclick = run;
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
  nextGenAliveCells = [];
  for(var i = 0; i < curGenAliveCells.length; i++){ getCellsToCheck(curGenAliveCells[i]); }
  for(var i = 0; i < nextGenAliveCells.length; i++){
    testCells = surroundingCells(nextGenAliveCells[i]);
    testCells.splice(4, 1);
    numNeighbor = 0;
    for(var j = 0; j < testCells.length; j++){ if(curGenAliveCells.includes(testCells[j])){ numNeighbor++; } }
    if(curGenAliveCells.includes(nextGenAliveCells[i])){
      if(numNeighbor < 2 || numNeighbor > 3){ nextGenAliveCells.splice(i, 1); i--; }
    }else{
      if(numNeighbor != 3){ nextGenAliveCells.splice(i, 1); i--; }
    }
  }
  nextGenAliveCells = nextGenAliveCells.sort(function(x, y){ return x - y; });
  repaint();
  curGenAliveCells = nextGenAliveCells;
}

function surroundingCells(cell){
  return [cell - resolution - 1, cell - resolution, cell - resolution + 1,
          cell - 1,              cell,              cell + 1,
          cell + resolution - 1, cell + resolution, cell + resolution + 1];
}

function getCellsToCheck(cell){
  boundCells = surroundingCells(cell);
  // checking cells multiple times, can be more efficient
  for(var i = 0; i < boundCells.length; i++){ if(!nextGenAliveCells.includes(boundCells[i])){ nextGenAliveCells.push(boundCells[i]); } }
}

function repaint(){
  setFill(0);
  for(var i = 0; i < curGenAliveCells.length; i++){
    if(!nextGenAliveCells.includes(curGenAliveCells[i])){ fillPix(iToCoord(curGenAliveCells[i])); }
  }
  setFill(1);
  toPaint = nextGenAliveCells.diff(curGenAliveCells);
  for(var i = 0; i < toPaint.length; i++){ fillPix(iToCoord(toPaint[i])); }
}

function iToCoord(index){
  return [(index % resolution) * pxSize[0], Math.floor(index / resolution) * pxSize[1]];
}

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function onClick(e) {
  // console.log(curGenAliveCells);
  isMouseMove = false;

  canvas.onmousedown = function() {
    isMouseDown = true;
    coord = [e.layerX - (e.layerX % pxSize[0]), e.layerY - (e.layerY % pxSize[1])];
    fillPix(coord);
    addCoord(coord);
  };
  document.onmouseup = function() {
    isMouseDown = false;
    curGenAliveCells.sort(function(x, y){ return x - y; });
  };
  if(isMouseDown){
    coord = [e.layerX - (e.layerX % pxSize[0]), e.layerY - (e.layerY % pxSize[1])];
    fillPix(coord);
    addCoord(coord);
  }
}

function fillPix(coord){
  ctx.fillRect(coord[0], coord[1], pxSize[0], pxSize[1]);
}

function addCoord(coord){
  index = Math.round(resolution * (coord[1] * resolution + coord[0]) / cSize[0]);
  if(!curGenAliveCells.includes(index) && index < resolution ** 2){ curGenAliveCells.push(index); }
}

function clear(){
  curGenAliveCells = [];
  setFill(0);
  ctx.fillRect(0, 0, cSize[0], cSize[1]);
  setFill(1);
}

function setFill(alive){
  if(alive){ ctx.fillStyle = "rgba(" + aliveRGB[0] + "," + aliveRGB[1] + "," + aliveRGB[2] + "," + (aliveRGB[3] / 255) + ")"; }
  else { ctx.fillStyle = "rgba(" + deadRGB[0] + "," + deadRGB[1] + "," + deadRGB[2] + "," + (deadRGB[3] / 255) + ")"; }
}
