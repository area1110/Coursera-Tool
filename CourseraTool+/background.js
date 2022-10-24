let isChoosingMax = true;
let isAutomatic = true;
let commentContent = 'Comment';

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ isChoosingMax });
  chrome.storage.sync.set({ isAutomatic });
  chrome.storage.sync.set({ commentContent });
});
