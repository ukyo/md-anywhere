define(function(require, exports, module) {

var $ = require('jquery'),
  EditSession = require('ace/edit_session').EditSession,
  fs = require('fs'),
  oop = require('ace/lib/oop'),
  Events = require('events');


function Tab(fileEntry) {
  var isSaved, path, self;

  isSaved = true;
  path = 'New file';
  self = this;
  Tab.super_.constructor.call(this);
  
  this.fileEntry = fileEntry;
  this.session = null;

  Object.defineProperties(this, {
    isSaved: {
      get: function() { return isSaved; },
      set: function(x) {
        if (x === isSaved) return;
        isSaved = x;
        self.trigger('change:isSaved');
      }
    },
    path: {
      get: function() { return path; },
      set: function(x) {
        if (x === path) return;
        path = x;
        self.trigger('change:path');
      }
    }
  });
}
oop.inherits(Tab, Events);

Tab.prototype.init = function() {
  var d, self;

  d = $.Deferred();
  self = this;

  function initSession(text) {
    self.session = new EditSession(text, 'ace/mode/markdown');
    self.session.on('change', function(e) {
      self.isSaved = false;
      self.trigger('change:isSaved');
    });
  }

  if (!this.fileEntry) {
    setTimeout(function() {
      initSession('');
      d.resolve(self);
    }, 0);
  } else {
    fs.readAsText(this.fileEntry)
    .then(initSession)
    .then(fs.displayPath.bind(null, this.fileEntry))
    .then(function(path) {
      self.path = path;
      return self;
    })
    .then(d.resolve, d.reject);
  }

  return d.promise();
};


function TabView(tab) {
  var isActived, self;

  isActived = false;
  self = this;
  TabView.super_.constructor.call(this);

  Object.defineProperties(this, {
    isActived: {
      get: function() { return isActived; },
      set: function(x) {
        isActived = x;
        if (isActived) {
          self.$tab.addClass('active');
          self.o.trigger('active', [self.path2FileName()]);
        } else {
          self.$tab.removeClass('active');
        }
      }
    }
  });

  this.tab = tab;
  this.$tab = $('<div class="tab"><div class="filename"></div><div class="close">x</div></div>');
  this.$filename = this.$tab.find('.filename');
  this.$close = this.$tab.find('.close');

  tab.on('change:isSaved', this.updateFilename.bind(this));
  tab.on('change:path', this.updateFilename.bind(this));

  this.$close.on('click', function(e) {
    this.$tab.remove();
    this.trigger('click:close');
  }.bind(this));

  this.$filename.on('click', function(e) {
    this.trigger('click:filename', [this]);
  }.bind(this));

  this.updateFilename();
}
oop.inherits(TabView, Events);

TabView.prototype.updateFilename = function() {
  this.$filename.text(this.path2FileName());
}

TabView.prototype.path2FileName = function() {
  var spliter = navigator.platform === 'Win32' ? '\\' : '/';
  return this.tab.path.split(spliter).pop() + (this.tab.isSaved ? '' : '*');
}


exports.Tab = Tab;
exports.TabView = TabView;

});