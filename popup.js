document.addEventListener("DOMContentLoaded", function () {
  const activateButton = document.getElementById("activateButton");
  const statusElement = document.getElementById("status");

  activateButton.addEventListener("click", function () {
      // Send a message to the content script to activate summarization
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "activateExtension" }, function(response) {
              if (chrome.runtime.lastError) {
                  // Handle error (e.g., content script not loaded)
                  statusElement.textContent = "Error: Make sure you're on a LinkedIn page.";
              } else if (response && response.status === "activated") {
                  statusElement.textContent = "Summarizer activated! Scroll to see 'Summarize' buttons on long posts.";
              } else {
                  statusElement.textContent = "Activation failed. Please try again.";
              }
          });
      });
  });
});