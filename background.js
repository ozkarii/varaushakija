// Create a context menu item
chrome.runtime.onInstalled.addListener(function() {
  chrome.contextMenus.create({
    "id": "searchShift",
    "title": "Hae Varaus",
    "contexts": ["link"],
    "documentUrlPatterns": ["https://www.tuni.fi/sportuni/*"]
  });
});
  
// Handle click on the context menu
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  if (info.menuItemId == "searchShift") {
      chrome.tabs.sendMessage(tab.id, {command: "onContextMenuClicked"});
  }
});

// Handle message from content script
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  
  if (request.command === "onContextMenuClicked") {
    chrome.tabs.create({url: request.url}, function(tab) {
      chrome.tabs.executeScript(tab.id, {file: 'search.js'});
    });
  }  
});