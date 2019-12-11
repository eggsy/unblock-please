document.addEventListener('DOMContentLoaded', function () {
  const activated = localStorage.getItem("extActive") || "true";

  // Set the extActive to true so we don't have to mess with it everytime:
  if (!localStorage.getItem("extActive")) localStorage.setItem("extActive", true);

  // Update the switch so people can really see if it's on.
  activated == "true" ? document.querySelector("input").checked = true : document.querySelector("input").checked = false;

  // Get values from local storage:
  const unblocks = localStorage.getItem("imgurUnblocks"),
    latestUnblock = localStorage.getItem("latestUnblock");

  // Set if they're not existed:
  if (!unblocks) localStorage.setItem("imgurUnblocks", 0);
  if (!latestUnblock) localStorage.setItem("latestUnblock", "NEVER");

  // Setting pop-up fields:
  document.querySelector("#unblocks").textContent = unblocks ? `${unblocks} times` : "0 times";
  document.querySelector("#latest").textContent = latestUnblock && latestUnblock != "NEVER" ? new Date(parseInt(latestUnblock)).toLocaleString() : "NEVER";

  // Switch change function:
  document.querySelector("input").addEventListener("change", function () {
    localStorage.setItem("extActive", this.checked);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { active: localStorage.getItem("extActive") });
    });

    console.log(`Extension is now ${this.checked ? "active" : "disabled"}.`);
  });
});