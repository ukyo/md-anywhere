define(function(require, exports, module) {

var $ = require('jquery'),
  EditSession = require('ace/edit_session').EditSession,
  fs = require('fs');


function Tab(fileEntry) {
  var isSaved, path, self;

  isSaved = true;
  path = 'New file';
  self = this;
  
  this.fileEntry = fileEntry;
  this.session = null;
  this.o = $({});

  Object.defineProperties(this, {
    isSaved: {
      get: function() { return isSaved; },
      set: function(x) {
        if (x === isSaved) return;
        isSaved = x;
        self.o.trigger('change:isSaved');
      }
    },
    path: {
      get: function() { return path; },
      set: function(x) {
        if (x === path) return;
        path = x;
        self.o.trigger('change:path');
      }
    }
  });
};

Tab.prototype.on = function(name, callback) {
  this.o.on(name, callback);
}

Tab.prototype.init = function() {
  var d = $.Deferred();

  function initSession(text) {
    this.session = new EditSession(text, 'ace/mode/markdown');
    this.session.on('change', function(e) {
      this.isSaved = false;
      this.o.trigger('change:isSaved');
    }.bind(this));
  }

  if (!this.fileEntry) {
    setTimeout(function() {
      initSession.call(this, '');
      d.resolve(this);
    }.bind(this), 0);
  } else {
    fs.readAsText(this.fileEntry)
    .then(initSession.bind(this))
    .then(function() {
      return fs.displayPath(this.fileEntry);
    }.bind(this))
    .then(function(path) {
      this.path = path;
      return this;
    }.bind(this))
    .then(d.resolve, d.reject);
  }

  return d.promise();
};


function TabView(tab) {
  var isActived, self;

  isActived = false;
  self = this;

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

  this.o = $({});
  this.tab = tab;
  this.$tab = $('<div class="tab"><div class="filename"></div><div class="close">x</div></div>');
  this.$filename = this.$tab.find('.filename');
  this.$close = this.$tab.find('.close');

  tab.on('change:isSaved', this.updateFilename.bind(this));
  tab.on('change:path', this.updateFilename.bind(this));

  this.$close.on('click', function(e) {
    this.$tab.remove();
    this.o.trigger('click:close');
  }.bind(this));

  this.$filename.on('click', function(e) {
    this.o.trigger('click:filename', [this]);
  }.bind(this));

  this.updateFilename();
}

TabView.prototype.updateFilename = function() {
  this.$filename.text(this.path2FileName());
}

TabView.prototype.path2FileName = function() {
  return this.tab.path.split('/').pop() + (this.tab.isSaved ? '' : '*');
}

TabView.prototype.on = Tab.prototype.on;


exports.Tab = Tab;
exports.TabView = TabView;

});