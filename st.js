define(function(require, exports, module) {
var $ = require('jquery');

function get(namespace, list) {
  var d = $.Deferred();
  chrome.storage[namespace].get(list, d.resolve);
  return d.promise();
}

function set(namespace, o) {
  var d = $.Deferred();
  chrome.storage[namespace].set(o, d.resolve);
  return d.promise();
}

return {
  local: {
    get: get.bind(null, 'local'),
    set: set.bind(null, 'local')
  },
  sync: {
    get: get.bind(null, 'sync'),
    set: set.bind(null, 'sync')
  }
};

});