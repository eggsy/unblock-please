import { get } from "./plugins/functions/storage";
let triesLeft = 10;

updateImages();
const interval = setInterval(updateImages, 1500);

async function updateImages() {
  if (triesLeft >= 0) {
    let { options } = await get("options");

    if (options.extensionEnabled) {
      for (let i in document.querySelectorAll("img")) {
        let image = document.querySelectorAll("img")[i];

        if (
          image?.attributes?.src?.textContent.includes("i.imgur.com") &&
          new URL(image?.attributes?.src?.textContent).hostname == "i.imgur.com"
        ) {
          image.attributes.src.textContent =
            "https://proxy.duckduckgo.com/iu/?u=" +
            image.attributes.src.textContent;
        }
      }
      chrome.storage.sync.set({
        stats: {
          latestUnblock: Date.now()
        }
      });
      triesLeft--;
    }
  } else clearInterval(interval);
}
