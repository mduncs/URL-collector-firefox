// background.js
let urls = {};

// Listener for keyboard command
browser.commands.onCommand.addListener((command) => {
  if (command === "save-urls") {
    saveUrlsOfCurrentWindow();
  }
});

// Listener for messages from content scripts
browser.runtime.onMessage.addListener((message, sender) => {
  if (message.type === "url") {
    let windowId = sender.tab.windowId;
    if (!urls[windowId]) {
      urls[windowId] = [];
    }
    urls[windowId].push(message.url);
  }
});

// Function to save URLs of the current window to a text file
function saveUrlsOfCurrentWindow() {
    browser.windows.getCurrent({populate: false}).then((window) => {
        let currentWindowUrls = urls[window.id] || [];
        createAndDownloadFile(currentWindowUrls.join('\n'));
    });
}

// Function to create and trigger the download of the text file
function createAndDownloadFile(data) {
    var blob = new Blob([data], { type: 'text/plain' });
    var url = URL.createObjectURL(blob);

    var downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = "urls.txt";

    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);

    URL.revokeObjectURL(url);
}
