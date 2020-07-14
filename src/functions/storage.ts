export interface StorageValues {
  read: {
    update: boolean;
    projects: boolean;
  };
  options: {
    extensionEnabled: boolean;
  };
  stats: {
    unblocks: number;
    latestUnblock: Date;
  };
}

export function get(name: string): Promise<StorageValues> {
  return new Promise((resolve) => chrome.storage.local.get(name, resolve));
}
