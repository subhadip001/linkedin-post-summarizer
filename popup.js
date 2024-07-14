document.addEventListener("DOMContentLoaded", function () {
  const activateButton = document.getElementById("activateButton");
  const statusElement = document.getElementById("status");
  const loginButton = document.getElementById("loginButton"); // Add this line

  // Add this function
  function onSignIn(googleUser) {
    var profile = googleUser.getBasicProfile();
    console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    console.log('Name: ' + profile.getName());
    console.log('Image URL: ' + profile.getImageUrl());
    console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  }

  // Add this event listener
  loginButton.addEventListener("click", function () {
    gapi.signin2.render('loginButton', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
      'onsuccess': onSignIn,
    });
  });

  activateButton.addEventListener("click", function () {
      // Send a message to the content script to activate summarization
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
          chrome.tabs.sendMessage(tabs[0].id, { action: "activateExtension" }, function(response) {
              if (chrome.runtime.lastError) {
                  // Handle error (e.g., content script not loaded)
                  statusElement.textContent = "Error: Make sure you're on a LinkedIn page.";
              } else if (response && response.status === "activated") {
                  statusElement.textContent = "Summarizer activated! Scroll to see 'Summarize' buttons on long posts.";
                  activateButton.style.display = "none";
              } else {
                  statusElement.textContent = "Activation failed. Please try again.";
              }
          });
      });
  });
});