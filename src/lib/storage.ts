// Storage Provider Abstraction
export interface StorageProvider {
  upload(file: File, path: string): Promise<string>;
  delete(path: string): Promise<void>;
  getUrl(path: string): string;
}

// Mock Storage Provider (for development)
export class MockStorageProvider implements StorageProvider {
  async upload(file: File, path: string): Promise<string> {
    // In production, you would upload to S3, GCS, or similar
    console.log(`Mock: Uploading file to ${path}`);
    return `/uploads/${path}/${file.name}`;
  }

  async delete(path: string): Promise<void> {
    console.log(`Mock: Deleting file at ${path}`);
  }

  getUrl(path: string): string {
    return `${process.env.NEXT_PUBLIC_APP_URL}${path}`;
  }
}

let storageProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!storageProvider) {
    const provider = process.env.STORAGE_PROVIDER || 'mock';
    if (provider === 'mock') {
      storageProvider = new MockStorageProvider();
    } else {
      storageProvider = new MockStorageProvider();
    }
  }
  return storageProvider;
}
