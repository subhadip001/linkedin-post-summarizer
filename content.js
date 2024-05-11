function addSummarizeButton(postElement) {
  const button = document.createElement("button");
  button.textContent = "Summarize";
  button.style.padding = "2px 5px";
  button.style.borderRadius = "5px";
  button.style.border = "none";
  button.style.backgroundColor = "#0073b1";
  button.style.color = "white";
  button.style.cursor = "pointer";

  const summaryElement = document.createElement("p");

  const body = document.querySelector("body");
  body.style.scrollBehavior = "smooth";

  button.addEventListener("click", async () => {
    button.disabled = true;
    button.style.cursor = "not-allowed";
    button.textContent = "Summarizing...";
    const text = postElement.innerText;
    const summary = await summarize(text, button);
    summaryElement.textContent = summary;
    summaryElement.style.backgroundColor = "transparent";
    summaryElement.style.padding = "5px";
    summaryElement.style.border = "2px solid #0073b1";
    summaryElement.style.borderRadius = "5px";
    button.remove();
    postElement.append(summaryElement);
    postElement.scrollIntoView();
  });

  postElement.appendChild(document.createElement("br"));
  postElement.appendChild(document.createElement("br"));

  postElement.appendChild(button);
}

function activateExtension() {
  let allPostElements;
  const postElements = document.querySelectorAll(
    ".update-components-update-v2__commentary"
  );

  allPostElements = [...postElements];
  console.log(allPostElements);
  allPostElements.forEach((postElement) => {
    if (postElement.innerText.length > 250) {
      addSummarizeButton(postElement);
    }
  });
  console.log("Extension activated");
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action === "activateExtension") {
    activateExtension();
  }
});

function observeNewPosts() {
  const postContainer = document.querySelector(
    ".scaffold-finite-scroll__content"
  );
  if (!postContainer) {
    return;
  }
  const observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      if (mutation.addedNodes.length > 0) {
        const newPosts = Array.from(mutation.addedNodes).filter((node) =>
          node?.classList?.contains("update-components-update-v2__commentary")
        );

        newPosts.forEach((post) => {
          if (post.innerText.length > 250) {
            addSummarizeButton(post);
          }
        });
      }
    });
  });

  observer.observe(postContainer, {
    childList: true,
    subtree: true,
  });
}

activateExtension();
observeNewPosts();

const pegasus = "tuner007/pegasus_summarizer"
const distilbart = "sshleifer/distilbart-cnn-12-6"
const pszemraj = "pszemraj/long-t5-tglobal-base-16384-book-summary"
const azma = "Azma-AI/bart-conversation-summarizer"

async function query(data) {
  const response = await fetch(
    `https://api-inference.huggingface.co/models/${distilbart}`,
    {
      headers: {
        Authorization: "Bearer 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",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );
  const result = await response.json();
  console.log(result);
  return result;
}

function summarize(text) {
  return new Promise((resolve, reject) => {
    const data = {
      inputs: text,
    };

    query(data)
      .then((result) => {
        const summary = result[0]?.summary_text;
        //console.log(summary);
        resolve(summary);
      })
      .catch((error) => {
        console.log(error);
        reject(error);
      });
  });
}
