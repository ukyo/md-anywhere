define(function(require, exports, module) {
  var $ = require('jquery');

  function getWritableEntry(fileEntry) {
    var d = $.Deferred();
    chrome.fileSystem.getWritableEntry(fileEntry, d.resolve);
    return d.promise();
  }

  function createWriter(writableFileEntry) {
    var d = $.Deferred();
    writableFileEntry.createWriter(d.resolve, d.reject);
    return d.promise();
  }

  function write(data, writer) {
    var d = $.Deferred(),
      blob = new Blob([data], {type: 'text/plain'});
    writer.onerror = d.reject;
    writer.onwriteend = function() {
      writer.onwriteend = d.resolve;
      writer.write(blob);
    };
    writer.truncate(blob.size);
    return d.promise();
  }

  var fs = {
    displayPath: function(fileEntry) {
      var d = $.Deferred();
      chrome.fileSystem.getDisplayPath(fileEntry, d.resolve);
      return d.promise();
    },

    onDropFile: function(selector, callback) {
      var element = document.querySelector(selector);

      function cancel(e) { e.preventDefault() }
      
      element.ondragover = cancel;
      element.ondragenter = cancel;
      element.ondrop = function(e) {
        cancel(e);
        callback(e.dataTransfer.items[0].webkitGetAsEntry());
      };
    },

    choose: function(params) {
      var d = $.Deferred();
      chrome.fileSystem.chooseEntry(params, d.resolve);
      return d.promise();
    },

    save: function(fileEntry, data) {
      return (
        getWritableEntry(fileEntry)
        .then(createWriter)
        .then(write.bind(null, data))
      );
    },

    saveAs: function(data) {
      var d = $.Deferred();
      fs.choose({type: 'saveFile'})
      .then(function(fileEntry) {
        createWriter(fileEntry)
        .then(write.bind(null, data))
        .then(function(){ d.resolve(fileEntry) }, d.reject);
      });
      return d.promise();
    },

    readAsText: function(fileEntry) {
      var reader = new FileReader, d = $.Deferred();
      reader.onerror = d.reject;
      reader.onloadend = function() {
        d.resolve(reader.result);
      };
      fileEntry.file(function(file) {
        reader.readAsText(file);
      });
      return d.promise();
    }
  };

  $.extend(exports, fs);
});