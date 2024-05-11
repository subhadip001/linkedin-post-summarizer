document.addEventListener("DOMContentLoaded", function () {
    // Attach a click event listener to the button
    document.getElementById("actionButton").addEventListener("click", function () {
      // Send a message to the content script to trigger summarization
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { action: "summarize" });
      });
    });
  });