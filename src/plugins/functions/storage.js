export function get(name) {
  return new Promise(resolve =>
    chrome.storage.sync.get(name, items => resolve(items))
  );
}