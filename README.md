# arpadav/cgol
Conways Game of Life

Really shitty and slow forms of Conways game of life.

cgolold.js utilizes index-based storage for alive cells. Unique problems: indices r big big numbers with large 2d arrays, arrays are dynamic, computation is slow at high live counts.
cgol.js utilizes a binary array, 1 for alive and 0 for dead. Unique problems: iterating thru whole 2d array using for loops is excruciatingly slow, deep copying array from current generation to next is slow, but works more efficiently (overall) at high live counts than cgolold.js.

Problems with both:
* Object referencing (for array) and creating deep copies of arrays are very slow for each generation
* ctx.fillRect is slow and can be optimized (object wise)
* rather than iterating and checking each pixel, i am only checking neighboring^2 pixels and that algorithm, as it turns out, is less effective than just checking every pixel

Areas of improvement:
* creating two 1d unsigned arrays of lowest bit count (8) of specified size
* check each pixel neighbors
* alternate between both arrays rather than setting one equal to another each times
* have some soft of hashlife algorithm that optimizes the checking of still/oscillating Life
* GUI-wise, just add step button, RGB dead/alive selector, toggle create/erase cell, grid on/off, resize, zoom in/out, copy/paste premade life forms, export current state, etc.

cgolINTERESTING.js is just incorrect code that looks interesting.
