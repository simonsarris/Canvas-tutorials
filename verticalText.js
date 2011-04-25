// Last updated April 2011 by Simon Sarris
// www.simonsarris.com
// sarris@acm.org
//
// Free to use and distribute at will
// So long as you are nice to people, etc

var can = document.getElementById('canvas1');
var ctx = can.getContext('2d');


// Two "classes", TextVertical and TextVerticalCanvas.
// The first one uses only drawText(), the second one uses drawText() to write
// to its own canvas, and uses drawImage() for each call to the main canvas.
// Initially created to test vertical text but you dont have to use that.
// You can simplify it by editing `drawVertical`
// If you do change it to draw normal lines of text, you'll have to also do some
// width measurements (measureText, etc), to size the extra canvases correctly.


// for laziness, font size will just be something we pass in

function TextVertical(text, font, fontsize) {
  this.text = text;
  this.font = font;
  this.fontsize = fontsize;
}

TextVertical.prototype.draw = function(context, x, y) {
  // We don't know what was drawn on the context last,
  // so we have to set this every time:
  context.font = this.font;
  
  drawVertical(context, this.text, x, y, this.fontsize);
}

function TextVerticalCanvas(text, font, fontsize) {
  this.text = text;
  this.font = font;
  this.fontsize = fontsize;
  // We need a new canvas for each instance of TextVerticalCanvas
  this.tempCanvas = document.createElement('canvas');
  this.tempCtx = this.tempCanvas.getContext('2d');
  
  // This is lazy. In the real world it should be an invalidation,
  // making the tempCanvas remeasure itself each time the text or font changed.
  // But for the test this will do.
  this.firstTime = true;
}

TextVerticalCanvas.prototype.draw  = function(context, x, y) {
  if (this.firstTime) {
    var buffer = 8; // some number of pixels for a buffer
    this.tempCanvas.width = this.fontsize + buffer;
    this.tempCanvas.height = (this.fontsize * this.text.length) + buffer;
    
    // We _do_ know what was drawn on the context last,
    // so we only have to do this the first time.
    this.tempCtx.font = this.font;
    this.tempCtx.fillStyle = context.fillStyle;
    
    // draw text onto the temporary context
    drawVertical(this.tempCtx, this.text, 0, 0, this.fontsize);
    this.firstTime = false;
  }
  context.drawImage(this.tempCanvas, x, y);
}

// The general method of drawing vertical text, called by both classes
function drawVertical(context, str, x, y, fontsize) {
  var l = str.length;
  for (var i = 0; i < l; i++) {
      context.fillText(str[i], x, y + fontsize*(i+1));
  }
}

// Provide:
// number of each object to initialize
// number of times to draw each object
// the text they will draw vertically
function test(initalizeNumber, drawNumber, text) {

ctx.fillStyle = 'black';

var svert = new Date().getTime();
// how many objects to initialize
for (var i = 0; i < initalizeNumber; i++) {
  var tv = new TextVertical(text, '72pt Georgia', 72);
  // how many times to draw
  for (var k = 0; k < drawNumber; k++) tv.draw(ctx, 0, 0);
}
var fvert = new Date().getTime();

ctx.fillStyle = 'lightblue'; // just to differentiate

var scan = new Date().getTime();
// how many objects to initialize
for (var i = 0; i < initalizeNumber; i++) {
  var tvc = new TextVerticalCanvas(text, '72pt Georgia', 72);
  // how many times to draw
  for (var k = 0; k < drawNumber; k++) tvc.draw(ctx, 40, 0); // draw it a little offset
}
var fcan = new Date().getTime();


console.log(fvert - svert);  // TextVertical
console.log(fcan - scan);    // TextVerticalCanvas
}

console.log('the first result is the text drawn with drawText, the second result is using drawImage');

console.log('1 object of 1 character, drawn 1000 times:');
test(1, 1000, 'T');

console.log('100 objects of 1 character, drawn 100 times:');
test(100, 100, 'T');

console.log('200 objects of one character drawn only 20 times:');
test(200, 20, 'T');

// Unlikely scenarios with respect to redrawing/animating:

console.log('200 objects of one character drawn once:');
test(200, 1, 'T');

console.log('200 objects of one character drawn twice:');
test(200, 2, 'T');

console.log('200 objects of one character drawn three times:');
test(200, 3, 'T');

// A vertical text scenario for posterity. Should be equivalent to the third test:

console.log('12 8-character strings drawn 100 times:');
test(12, 100, 'VITTORIA');