define(function(require) {

var $ = require('jquery');
var defaultOptions = require('defaultOptions');
var log = console.log.bind(console);

$.extend($.valHooks, {
  checkbox: {
    get: function(elem) { return !!elem.checked; },
    set: function(elem, value) { return elem.checked = !!value; }
  },
  number: {
    get: function(elem) { return elem.valueAsNumber; },
    set: function(elem, value) { return elem.valueAsNumber = value; }
  }
});

chrome.storage.local.get(Object.keys(defaultOptions), function(obj) {
  var obj = $.extend(defaultOptions, obj);

  Object.keys(defaultOptions).forEach(function(id) {
    var $elem = $('#' + id), o = {};
    $elem.val(obj[id]);
    $elem.on('change', function() {
      o[id] = $elem.val();
      chrome.storage.local.set(o, log);
    });
  });
});

});