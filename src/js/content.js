chrome.runtime.sendMessage({ method: "getStatus" }, function (response) {
    if (response.status == "true" && !document.location.href.includes("https://proxy.duckduckgo.com")) {
        const images = document.querySelectorAll("img");

        if (images) {
            console.log("Imgur Please\nReplacing all imgur images on the document. Please give us a moment.");
            let count = 0;

            for (let i in images) {
                if (images[i] && images[i].attributes && images[i].attributes.src && images[i].attributes.src.textContent.includes("imgur.com/") && !images[i].attributes.src.textContent.includes("proxy.duckduckgo.com")) {
                    images[i].attributes.src.textContent = "https://proxy.duckduckgo.com/iu/?u=" + images[i].attributes.src.textContent;
                    count++
                }
            }

            chrome.runtime.sendMessage({ method: "updateStats", add: count }, function (response) {
                console.log(response)
            });
        }
    }
});