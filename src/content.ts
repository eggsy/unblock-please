import { get } from "./functions/storage";
let triesLeft = 10;

updateImages();
const interval = setInterval(updateImages, 1500);

async function updateImages() {
  if (triesLeft >= 0) {
    let { options } = await get("options");
    let { stats } = await get("stats");

    if (options.extensionEnabled) {
      for (let i in document.querySelectorAll("img")) {
        let image: HTMLImageElement = document.querySelectorAll("img")[i];

        if (
          image?.src?.includes("i.imgur.com") &&
          new URL(image?.src).hostname == "i.imgur.com"
        ) {
          image.src = "https://proxy.duckduckgo.com/iu/?u=" + image.src;

          chrome.storage.local.set({
            stats: {
              unblocks: ++stats.unblocks,
              latestUnblock: Date.now(),
            },
          });
        }
      }

      triesLeft--;
    }
  } else clearInterval(interval);
}
