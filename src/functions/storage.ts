export interface StorageValues {
  read: {
    update: boolean;
    projects: boolean;
  };
  options: {
    unblock: {
      imgur: boolean;
      pastebin: boolean;
    };
  };
  stats: {
    unblocks: number;
    latestUnblock: Date;
  };
}

export interface OptionValues {
  unblock: { imgur: boolean; pastebin: boolean };
}

export function get(name: string): Promise<StorageValues> {
  return new Promise((resolve) => chrome.storage.local.get(name, resolve));
}
