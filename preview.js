define(function(require) {

var $ = require('jquery');
var isMouseDown = false;
var py, dy, body;

body = $('body')[0];
y = body.scrollTop;

$('article')
.on('mousedown', function() {
  isMouseDown = true;
})
.on('mouseup', function() {
  isMouseDown = false;
})
.on('mousemove', function() {
  if (!isMouseDown) return;

  
})

});