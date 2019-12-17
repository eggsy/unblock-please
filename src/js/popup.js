document.addEventListener('DOMContentLoaded', function () {
  let activated = localStorage.getItem("extActive") || "true";

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

    console.log(`Extension is now ${this.checked ? "active" : "disabled"}.`);
  });

  document.getElementById("scanPage").addEventListener("click", function () {
    chrome.tabs.getSelected(null, function (tab) {
      chrome.tabs.executeScript(tab.id, { code }, function (result) { console.log(result) });
    });
  });

  document.getElementById("github").addEventListener("click", function () {
    chrome.tabs.create({ url: "https://github.com/eggsywashere/imgur-please" })
  });
});

const code = `(function update() {
  if (!document.location.href.includes("proxy.duckduckgo.com")) {
      const images = document.querySelectorAll("img");

      if (images) {
        let count = 0;

        console.log("Imgur Please has started to process the page!");

        for (let i in images) {
          if (images[i] && images[i].attributes && images[i].attributes.src && images[i].attributes.src.textContent.includes("imgur.com/") && !images[i].attributes.src.textContent.includes("proxy.duckduckgo.com")) {
          images[i].attributes.src.textContent = "https://proxy.duckduckgo.com/iu/?u=" + images[i].attributes.src.textContent;
          count++
        }
      }

      if (count > 0) {
        chrome.runtime.sendMessage({ method: "updateStats", add: count }, function (response) {
          console.log(response)
          return true;
        });
      }
    }
  }
})()`;