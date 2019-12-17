let loggedOnce = false,
    triesLeft = 10;

const interval = setInterval(updateImages, 1500);

function updateImages() {
    if (triesLeft >= 0) {
        chrome.runtime.sendMessage({ method: "getStatus" }, function (response) {
            if (response.status == "true" && !document.location.href.includes("proxy.duckduckgo.com")) {
                const images = document.querySelectorAll("img");

                if (images) {
                    let count = 0;

                    if (!loggedOnce) {
                        console.log("Imgur Please\nI'll be looking for imgur images for 15 seconds. Watch the magic!");
                        loggedOnce = true;
                    }

                    for (let i in images) {
                        if (images[i] && images[i].attributes && images[i].attributes.src && images[i].attributes.src.textContent.includes("imgur.com/") && !images[i].attributes.src.textContent.includes("proxy.duckduckgo.com")) {
                            images[i].attributes.src.textContent = "https://proxy.duckduckgo.com/iu/?u=" + images[i].attributes.src.textContent;
                            count++
                        }
                    }

                    if (count > 0) {
                        chrome.runtime.sendMessage({ method: "updateStats", add: count }, function (response) {
                            console.log(response)

                            // Set logged once to true so it won't spam to your console!
                            loggedOnce = true;
                            triesLeft--;
                        });
                    } else triesLeft--;
                }
            } else clearInterval(interval);
        });
    } else clearInterval(interval);
}