define(function(require, exports, module) {

var ace = require("ace/ace");
var EditSession = require("ace/edit_session").EditSession;
var fs = require('fs');
var Tab = require('tab').Tab;
var TabView = require('tab').TabView;
var $ = require("jquery");
var env = {
  activeTab: null,
  tabs: [],
  $tabs: $('#tabs'),
  editor: ace.edit("editor")
};

$(window).on('resize', function() {
  chrome.storage.local.set({
    width: window.innerWidth,
    height: window.innerHeight
  }, function() {
    
  });
});

// open a file to new tab.
function newTab(fileEntry) {
  var tab, tabView, _setTitle, promise;

  tab = new Tab(fileEntry);
  tabView = new TabView(tab);
  _setTitle = function() {
    setTitle(tab.path + (tab.isSaved ? '' : '*'));
  };

  tab.on('change:isSaved', _setTitle);
  tab.on('change:path', _setTitle);
  
  tabView.on('active', function() {
    env.editor.setSession(tab.session);
    setOptions(defaultOptions);
    env.tabs.forEach(function(item) {
      if (item.view === tabView) return;
      item.view.isActived = false;
    });
    env.activeTab = tab;
    _setTitle();
  });
  
  tabView.on('click:close', function() {
    var index;
    // lookup closed tab.
    env.tabs.some(function(item, i) {
      index = i;
      return item.tab === tab;
    });
    env.tabs.splice(index, 1);
    if (env.tabs.length) {
      env.tabs[0].view.isActived = true;
    } else {
      window.close();
    }
  });

  tabView.on('click:filename', function() {
    tabView.isActived = true;
  });

  env.tabs.push({
    tab: tab,
    view: tabView
  });

  promise = tab.init()
  .then(function(tab) {
    env.$tabs.append(tabView.$tab);
    tabView.isActived = true;
    return tab;
  });

  return promise;
}

// open a file.
function openFile(fileEntry) {
  var promise;

  if (!env.tabs.length) {
    promise = newTab(fileEntry);
  } else {
    if (env.activeTab.fileEntry == null && env.activeTab.isSaved) {
      env.activeTab.fileEntry = fileEntry;
      promise = env.activeTab.init()
      .then(function(tab) {
        env.editor.setSession(tab.session);
        setOptions(defaultOptions);
        return tab;
      });
    } else {
      promise = newTab(fileEntry);
    }
  }

  return promise;
}


function init() {
  newTab();
};


var defaultOptions = {
  theme: 'twilight',
  font_size: 12,
  show_invisibles: true,
  display_indent_guides: false,
  show_gutter: true,
  use_wrap_mode: true,
  tab_size: 4,
  use_soft_tab: true,
  highlight_active_line: true
};

function setOptions (options) {
  for (var key in options) {
    var value = options[key];
    env[key] = value;
    switch (key) {
      case 'theme':
        env.editor.setTheme('ace/theme/' + value);
        break;
      case 'font_size':
        env.editor.setFontSize(value);
        break;
      case 'show_invisibles':
        env.editor.setShowInvisibles(value);
        break;
      case 'display_indent_guides':
        env.editor.setDisplayIndentGuides(value);
        break;
      case 'show_gutter':
        env.editor.renderer.setShowGutter(value);
        break;
      case 'use_wrap_mode':
        env.editor.getSession().setUseWrapMode(value);
        break;
      case 'tab_size':
        env.editor.getSession().setTabSize(value);
        break;
      case 'highlight_active_line':
        env.editor.setHighlightActiveLine(value);
        break;
      case 'use_soft_tab':
        env.editor.getSession().setUseSoftTabs(value);
        break;
    }
  }
}

function setTitle(text) {
  document.querySelector('title').textContent = text;
}

function save(editor) {
  if(!env.activeTab.fileEntry) return saveAs(editor);

  fs.save(env.activeTab.fileEntry, editor.getValue())
  .done(function() {
    env.activeTab.isSaved = true;
  })
  .fail(function(e) {
    console.log(e);
  });
}

function saveAs(editor) {
  var isNewFile = !env.activeTab.fileEntry;

  fs.saveAs(editor.getValue())
  .then(function(fileEntry) {
    if (isNewFile) env.activeTab.fileEntry = fileEntry;
    return fs.displayPath(fileEntry);
  })
  .done(function(path) {
    if (isNewFile) env.activeTab.path = path;
    env.activeTab.isSaved = true;
  })
  .fail(function(e) {
    console.log(e);
  });
}

fs.onDropFile('body', openFile);

env.editor.commands.addCommand({
  name: 'save',
  bindKey: {win: 'Ctrl-S', mac: 'Command-S'},
  exec: save
});

env.editor.commands.addCommand({
  name: 'save-as',
  bindKey: {win: 'Ctrl-Shift-S', mac: 'Command-Shift-S'},
  exec: saveAs
});

env.editor.commands.addCommand({
  name: 'open',
  bindKey: {win: 'Ctrl-O', mac: 'Command-O'},
  exec: function (editor) {
    fs.choose({type: 'openFile'})
    .then(openFile);
  }
});


env.editor.commands.addCommand({
  name: 'option',
  bindKey: {win: 'Ctrl-Shift-O', mac: 'Command-Shift-O'},
  exec: function (editor) {
    // TODO
  }
});

env.editor.commands.addCommand({
  name: 'preview',
  bindKey: {win: 'Ctrl-Shift-O', mac: 'Command-Shift-O'},
  exec: function (editor) {
    // TODO
  }
});

env.editor.commands.addCommand({
  name: 'new',
  bindKey: {win: 'Ctrl-N', mac: 'Command-N'},
  exec: newTab.bind(null, null)
});

init();

});