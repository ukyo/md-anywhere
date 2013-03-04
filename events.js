define(function(require, exports, module) {

var $ = require('jquery');

function Events() {
  this.o = $({});
}

Events.prototype.on = function(name, callback) {
  this.o.on(name, callback);
  return this;
};

Events.prototype.off = function(name, callback) {
  this.o.off(name, callback);
  return this;
};

Events.prototype.trigger = function(name, args) {
  this.o.trigger(name, args);
  return this;
};

return Events;

});