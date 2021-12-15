let isChoosingMax = true;

chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.sync.set({ isChoosingMax });
});
