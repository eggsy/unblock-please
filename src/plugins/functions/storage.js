export function get(name) {
  return new Promise(resolve =>
    chrome.storage.local.get(name, resolve)
  );
}