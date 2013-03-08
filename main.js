define(function(require, exports, module) {

var ace = require("ace/ace");
var EditSession = require("ace/edit_session").EditSession;
var fs = require('fs');
var Tab = require('tab').Tab;
var TabView = require('tab').TabView;
var $ = require("jquery");
var editor = ace.edit("editor");
var shortcut = require('shortcut');
var markdown = require('markdown');
var $tabs = $('#tabs');
var log = console.log.bind(console);
var env = {
  activeTab: null,
  tabs: [],
  options: require('defaultOptions')
};


$(window)
.on('resize', function() {
  chrome.storage.local.set({
    width: window.innerWidth,
    height: window.innerHeight
  }, log);
})
.on('close', log);


function init() {
  chrome.storage.local.get(Object.keys(env.options), function(obj) {
    $.extend(env.options, obj);
    setOptions(env.options);
    newTab();
  });
};


// open a file to new tab.
function newTab(fileEntry) {
  var tab, tabView, _setTitle, promise;

  tab = new Tab(fileEntry);
  tabView = new TabView(tab);
  _setTitle = function() {
    setTitle(tab.path + (tab.isSaved ? '' : '*'));
  };

  tab
  .on('change:isSaved', _setTitle)
  .on('change:path', _setTitle);
  
  tabView.on('active', function() {
    editor.setSession(tab.session);
    setOptions(env.options);
    env.tabs.forEach(function(item) {
      if (tabView !== item.view) item.view.isActived = false;
    });
    env.activeTab = tab;
    _setTitle();
  });
  
  tabView.on('click:close', function() {
    var index;
    // lookup the tab.
    env.tabs.some(function(item, i) {
      index = i;
      return item.tab === tab;
    });

    // remove the tab.
    env.tabs.splice(index, 1);
    
    // active the other tab or close the window.
    if (env.tabs.length) {
      env.tabs[0].view.isActived = true;
    } else {
      env.activeTab = null;
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
    $tabs.append(tabView.$tab);
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
        editor.setSession(tab.session);
        setOptions(env.options);
        return tab;
      });
    } else {
      promise = newTab(fileEntry);
    }
  }

  return promise;
}

function setOptions (options) {
  for (var key in options) {
    var value = options[key];
    env[key] = value;
    switch (key) {
      case 'theme':
        editor.setTheme('ace/theme/' + value);
        break;
      case 'font_size':
        editor.setFontSize(value);
        break;
      case 'show_invisibles':
        editor.setShowInvisibles(value);
        break;
      case 'display_indent_guides':
        editor.setDisplayIndentGuides(value);
        break;
      case 'show_gutter':
        editor.renderer.setShowGutter(value);
        break;
      case 'use_wrap_mode':
        editor.getSession().setUseWrapMode(value);
        break;
      case 'tab_size':
        editor.getSession().setTabSize(value);
        break;
      case 'highlight_active_line':
        editor.setHighlightActiveLine(value);
        break;
      case 'use_soft_tab':
        editor.getSession().setUseSoftTabs(value);
        break;
      // case 'font_family':
      //   document.getElementById('editor').style.fontFamily = value;
      //   break;
    }
  }
}

chrome.storage.onChanged.addListener(function(changes) {
  var o = {};
  for (var k in changes) {
    o[k] = changes[k].newValue;
  }
  $.extend(env.options, o);
  setOptions(o);
})

function setTitle(text) {
  document.querySelector('title').textContent = text;
}

function save() {
  if(!env.activeTab.fileEntry) return saveAs();

  fs.save(env.activeTab.fileEntry, editor.getValue())
  .done(function() {
    env.activeTab.isSaved = true;
  })
  .fail(function(e) {
    console.log(e);
  });
}

function saveAs() {
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

shortcut.add('Ctrl+S', save);
shortcut.add('Ctrl+Shift+S', saveAs);
shortcut.add('Ctrl+O', function() {
  fs.choose({type: 'openFile'}).then(openFile);
});
shortcut.add('Ctrl+Shift+O', function() {
  chrome.app.window.create('option.html', {
    'width': 300,
    'height': 280
  });
});
shortcut.add('Ctrl+Alt+P', function() {
  var $editor, $preview;

  $editor = $('#editor');
  $preview = $('#preview');

  if ($preview.hasClass('disabled')) {
    $editor.addClass('disabled');
    $preview
    .html(markdown.toHTML(editor.getValue()))
    .removeClass('disabled');
  } else {
    $editor.removeClass('disabled');
    $preview.addClass('disabled');
  }
});
shortcut.add('Ctrl+N', newTab.bind(null, null));

init();

});