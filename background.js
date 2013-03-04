var width, height;

chrome.app.runtime.onLaunched.addListener(function() {
  chrome.storage.local.get(['width', 'height'], function(o) {
    chrome.app.window.create('window.html', {
      'width': o.width || 400,
      'height': o.height || 500
    });
  });
});

