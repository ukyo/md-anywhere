define(function(require, exports, module) {

var ace = require("ace/ace");
var EditSession = require("ace/edit_session").EditSession;
var UndoManager = require("ace/undomanager").UndoManager;
var fs = require('fs');
var st = require('st');
var $ = require("jquery");
var editor = ace.edit("editor");
var shortcut = require('shortcut');
var markdown = require('markdown');
var log = console.log.bind(console);
var bg = null;
var previewWindow = null;
var env = {
  fileEntry: null,
  _isSaved: true,
  path: 'untitled',
  options: require('defaultOptions')
};

editor.getSession().setMode('ace/mode/markdown');
require('gfm');

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

Object.defineProperty(env, 'isSaved', {
  get: function() {
    return env._isSaved;
  },
  set: function(v) {
    if (v === env._isSaved) return;
    env._isSaved = v;
    setTitle(env.path + (v ? '' : '*'));
    v ? $('#button-save').addClass('saved') : $('#button-save').removeClass('saved');
  }
});

function init() {
  st.local.get(Object.keys(env.options))
  .then(function(obj) {
    $.extend(env.options, obj);
    setOptions(env.options);
    setTitle(env.path);

    Object.keys(env.options).forEach(function(key) {
      var $elem = $('#' + key), o = {};
      $elem.val(obj[key]);
      $elem.on('change', function() {
        o[key] = $elem.val();
        st.local.set(o);
      });
    });

    chrome.runtime.getBackgroundPage(function(bgPage) {
      bg = bgPage;
    });
  });
}

function newFile() {
  env.path = 'untitled';
  env.isSaved = true;
  env.fileEntry = null;
  editor.setSession('', 'ace/mode/markdown');
}

// open a file.
function openFile(fileEntry) {
  return $.when(
    fs.readAsText(fileEntry),
    fs.displayPath(fileEntry)
  )
  .then(function(text, path) {
    var session = new EditSession(text, 'ace/mode/markdown');
    session.setUndoManager(new UndoManager);
    editor.setSession(session);
    env.path = path;
    env.isSaved = true;
    env.fileEntry = fileEntry;
    setOptions(env.options);
    setTitle(path);
    return fileEntry;
  });
}

function setTitle(title) {
  $('title').text(title + ' - md everywhere');
  $('#info').text(title);
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
});

function save() {
  if(!env.fileEntry) return saveAs();

  return fs.save(env.fileEntry, editor.getValue())
  .done(function() {
    env.isSaved = true;
  })
  .fail(log);
}

function saveAs() {
  var isNewFile = !env.fileEntry;

  return fs.saveAs(editor.getValue())
  .then(function(fileEntry) {
    if (isNewFile) env.fileEntry = fileEntry;
    return fs.displayPath(fileEntry);
  })
  .done(function(path) {
    if (isNewFile) env.path = path;
    env.isSaved = true;
  })
  .fail(log);
}

function open() {
  return fs.choose({type: 'openFile'}).then(openFile);
}

function preview() {
  return !previewWindow ? openPreview() : closePreview();
}

function updatePreview() {
  this.document.querySelector('article').innerHTML = markdown.toHTML(editor.getValue(), 'GFM');
}

function close() {
  var o = {
    main: {
      left: window.screenX,
      top: window.screenY,
      width: window.outerWidth,
      height: window.outerHeight
    }
  };

  $.when(
    st.local.set(o),
    closePreview()
  )
  .then(window.close.bind(window));
}

function openPreview() {
  if (previewWindow) return;

  return st.local.get('preview')
  .then(function(obj) {
    var o = obj.preview || {};
    chrome.app.window.create('preview.html', {
      left: o.left || 0,
      top: o.top || 0,
      width: o.width || 400,
      height: o.height || 500,
      frame: 'none'
    }, function(appWindow) {
      previewWindow = appWindow;
      previewWindow.contentWindow.onload = function() {
        updatePreview.call(this);
        var scrollbar = $('#editor .ace_scrollbar')[0];
        var body = this.document.body;
        this.onscroll = function() {
          scrollbar.scrollTop = Math.round((body.scrollTop / body.scrollHeight) * scrollbar.scrollHeight);
        }
      };
    });
  });
}

function closePreview() {
  if (!previewWindow) return;

  var w = previewWindow.contentWindow;

  return st.local.set({
    preview: {
      left: w.screenX,
      top: w.screenY,
      width: w.outerWidth,
      height: w.outerHeight
    }
  })
  .then(function() {
    previewWindow.close();
    previewWindow = null;
  });
}

function getOutlines() {
  var lines, sections, i, n, sectionRe, sectionRe2, result;

  lines = editor.getValue().replace(/\r\n/g, '\n').split(/\n/);
  sections = [];
  sectionRe = /^(#+)\s*(.*)\s*#*$/;
  sectionRe2 = /^(=|-)\1\1+$/;

  for (i = 0, n = lines.length; i < n; ++i) {
    if (result = lines[i].match(sectionRe)) {
      sections.push({
        level: result[1].length,
        text: result[2],
        line: i + 1
      });
    } else if((result = lines[i].match(sectionRe2)) && i > 0 && lines[i - 1].length) {
      sections.push({
        level: result[1] === '=' ? 1 : 2,
        text: lines[i - 1],
        line: i
      });
    }
  }

  return sections;
}

function confirmSave(callback) {
  return function() {
    if (env.isSaved) return callback.apply(null, arguments);

    var $confirm, $closeWithoutSaving, $cancel, $saveAndClose, args;

    $confirm = $('#confirm');
    $closeWithoutSaving = $('#confirm-button-close-without-saving');
    $cancel = $('#confirm-button-cancel');
    $saveAndClose = $('#confirm-button-save-and-close');
    args = arguments;

    $confirm.removeClass('disabled');

    function closeWithoutSaving() {
      exitConfirm();
      callback.apply(null, args);
    }

    function cancel() {
      exitConfirm();
    }

    function saveAndClose() {
      save();
      exitConfirm();
      callback.apply(null, args);
    }

    function exitConfirm() {
      $confirm.addClass('disabled');
      $closeWithoutSaving.off('click', closeWithoutSaving);
      $cancel.off('click', cancel);
      $saveAndClose.off('click', saveAndClose);
    }

    $closeWithoutSaving.on('click', closeWithoutSaving);
    $cancel.on('click', cancel);
    $saveAndClose.on('click', saveAndClose).focus();
  };
}

fs.onDropFile('body', confirmSave(openFile));

shortcut.add('Ctrl+S', save);
shortcut.add('Ctrl+Shift+S', saveAs);
shortcut.add('Ctrl+O', confirmSave(open));
shortcut.add('Ctrl+Alt+P', preview);
shortcut.add('Ctrl+N', confirmSave(newFile));

var $option = $('#option');
var $jump = $('#jump');

$(document)
.on('click', '#button-save', save)
.on('click', '#button-open', confirmSave(open))
.on('click', '#button-preview', preview)
.on('click', '#button-close', confirmSave(close))
.on('click', '#button-minimize', function() {
  bg.appWindow.minimize();
})
.on('click', '#button-maximize', function() {
  bg.appWindow.isMaximized() ?
    bg.appWindow.restore() :
    bg.appWindow.maximize();
})
.on('click', '#button-option', function() {
  $option.hasClass('disabled') ?
    $option.removeClass('disabled') :
    $option.addClass('disabled');
})
.on('click', '#button-jump', function() {
  if ($jump.hasClass('disabled')) {
    $jump.empty();
    getOutlines().forEach(function(outline){
      var s, $outline;
      s = '<div class="level-' + outline.level + '">' + outline.text + '</div>';
      $outline = $(s).on('click', function() {
        editor.gotoLine(outline.line);
      });
      $jump.append($outline);
    });
    $jump.removeClass('disabled');
  } else {
    $jump.addClass('disabled');
  }
})
.on('click', 'article', function(e) {
  var $target = $(e.target);
  if ($target.hasClass('button-option')) {
    $jump.addClass('disabled');
  } else if ($target.hasClass('button-jump')) {
    $option.addClass('disabled');
  } else {
    $jump.addClass('disabled');
    $option.addClass('disabled');
  }
});

editor.on('change', function() {
  env.isSaved = false;
  if (previewWindow) {
    updatePreview.call(previewWindow.contentWindow);
  }
});
editor.on('changeSession', function() {
  if (previewWindow) {
    updatePreview.call(previewWindow.contentWindow);
  }
});
$('#editor .ace_scrollbar').on('scroll', function() {
  if (previewWindow) {
    var body = previewWindow.contentWindow.document.body;
    body.scrollTop = Math.round((this.scrollTop / this.scrollHeight) * body.scrollHeight);
  }
});

init();

});