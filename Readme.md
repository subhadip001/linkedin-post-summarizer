# LinkedIn Post Summarizer Extension

This is a Chrome extension that summarizes LinkedIn posts using the Hugging Face API. It adds a "Summarize" button to posts that are longer than 250 characters.

## How to Use
1. Navigate to a LinkedIn post.
2. If the post is longer than 250 characters, a "Summarize" button will appear.
3. Click the "Summarize" button to get a summary of the post.

## How to Run Locally
1. Clone the repository to your local machine.
2. Open Google Chrome and navigate to `chrome://extensions`.
3. Enable "Developer mode" in the top right corner.
4. Click "Load unpacked" and select the directory where you cloned the repository.
5. The extension should now be available in your Chrome extensions.

## Code Overview
- **content.js:** This is the main script that interacts with the LinkedIn page. It observes new posts and adds a "Summarize" button to posts that are longer than 250 characters. It also contains the query and summarize functions that interact with the Hugging Face API.
- **manifest.json:** This file describes the extension, its permissions, and what scripts it runs.
- **popup.html:** This is the HTML for the popup that appears when you click on the extension icon in the Chrome toolbar.
- **popup.js:** This script runs when the popup is opened. It can send messages to content.js.

Please note that you need to replace the Authorization header in the query function in content.js with your own Hugging Face API key.