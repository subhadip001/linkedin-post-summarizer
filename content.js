// Constants
const SUMMARIZE_BUTTON_CLASS = 'linkedin-summarizer-button';
const POST_SELECTOR = '.update-components-update-v2__commentary';
const MIN_POST_LENGTH = 250;
const HOSTED_API_URL = 'https://ujfosx6cdgcqun7gzkk2cs2d2m0kcpbf.lambda-url.ap-south-1.on.aws/api/v1/summarize';
const LOCAL_API_URL = 'http://localhost:9090/api/v1/summarize';

// Main function to initialize the extension
function initExtension() {
  addSummarizeButtonsToExistingPosts();
  observePageChanges();
  observeNewPosts();
}

// Function to add summarize buttons to existing posts
function addSummarizeButtonsToExistingPosts() {
  const posts = document.querySelectorAll(POST_SELECTOR);
  posts.forEach(addSummarizeButtonIfNeeded);
}

// Function to add a summarize button to a post if it meets the criteria
function addSummarizeButtonIfNeeded(postElement) {
  if (postElement.innerText.length > MIN_POST_LENGTH && !postElement.querySelector(`.${SUMMARIZE_BUTTON_CLASS}`)) {
    addSummarizeButton(postElement);
  }
}

// Function to create and add a summarize button to a post
function addSummarizeButton(postElement) {
  const button = createSummarizeButton();
  const summaryElement = document.createElement('p');
  
  button.addEventListener('click', async () => {
    button.disabled = true;
    button.innerHTML = '&#10024; Summarizing...';
    if (postElement.innerText === '' || postElement.innerText === undefined) {
      button.textContent = 'Post is empty';
      button.disabled = false;
      console.log(postElement);
      return;
    }
    try {
      const summary = await summarize(postElement.innerText);
      displaySummary(summaryElement, summary);
      postElement.appendChild(summaryElement);
      button.remove();
    } catch (error) {
      console.error('Summarization failed:', error);
      button.textContent = 'Summarization failed';
      button.disabled = false;
    }
  });

  postElement.appendChild(document.createElement('br'));
  postElement.appendChild(button);
}

// Function to create a summarize button
function createSummarizeButton() {
  const button = document.createElement('button');
  button.innerHTML = '&#10024; Summarize';
  button.className = SUMMARIZE_BUTTON_CLASS;
  button.style.cssText = `
    background-color: white;
    color: #0073b1;
    border: 2px solid #0073b1;
    padding: 6px 12px;
    font-size: 14px;
    font-weight: bold;
    cursor: pointer;
    border-radius: 5px;
    margin: 10px 0px;
    transition: background-color 0.3s;
  `;

  return button;
}

// Function to display the summary
function displaySummary(element, summary) {
  element.innerText = summary.replace(/\n/g, '\n');
  element.style.cssText = `
    background-color: #f3f6f8;
    padding: 10px;
    border-radius: 5px;
    margin-top: 10px;
  `;
}

// Function to observe page changes
function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' && isSignificantDOMChange(mutation.target)) {
        setTimeout(addSummarizeButtonsToExistingPosts, 1000);
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to check if a DOM change is significant
function isSignificantDOMChange(target) {
  return target.tagName === 'BODY' || target.id === 'main' || target.id === 'content';
}

// Function to observe new posts
function observeNewPosts() {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList') {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const posts = node.querySelectorAll(POST_SELECTOR);
            posts.forEach(addSummarizeButtonIfNeeded);
          }
        });
      }
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

// Function to summarize text using Hugging Face API
async function summarize(text) {
  const response = await fetch(HOSTED_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ post: text }),
  });

  if (!response.ok) {
    console.log(response);
    throw new Error(`API request failed with status ${response.status}`);
  }

  const result = await response.json();
  return result?.summarizedText || 'Summary not available.';
}

// Initialize the extension
initExtension();

// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "activateExtension") {
    console.log("Activation message received from popup");
    initExtension();
    sendResponse({status: "activated"});
    return true; // Indicates that the response will be sent asynchronously
  }
});

