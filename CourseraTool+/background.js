let isChoosingMax = true;
let isAutomatic = true;

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ isChoosingMax });
  chrome.storage.sync.set({ isAutomatic });
});
