var appWindow;

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.storage.local.get('main', function(obj) {
    var o = obj.main || {};

    chrome.app.window.create('main.html', {
      'frame': 'none',
      left: o.left || 0,
      top: o.top || 0,
      width: o.width || 400,
      height: o.height || 500
    }, function(app) {
      appWindow = app;
    });
  });
});

