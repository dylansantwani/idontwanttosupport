"use strict";

const runButton = document.querySelector("#run");
const status = document.querySelector("#status");
const showStatus = (message) => { status.textContent = message; };

runButton.addEventListener("click", async () => {
  runButton.disabled = true;
  showStatus("Looking for an option on this page…");
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) throw new Error("No active tab is available.");

    const [result] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["dontsupport.js"]
    });
    showStatus(result.result.status === "clicked"
      ? `Clicked: ${result.result.label.trim()}`
      : "No visible, enabled support bypass option found.");
  } catch (error) {
    showStatus(`Could not run here: ${error.message}`);
  } finally {
    runButton.disabled = false;
  }
});
