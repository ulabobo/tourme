/**
 * IndexedDB Persistence Service for larger offline records:
 * - Uploaded E-Mehmon hotel registration slips (F5)
 * - Uploaded B2B merchant business licenses (H4)
 * - Offline cached wallet receipts
 */

const DB_NAME = 'uzbekistan_travel_companion_idb';
const DB_VERSION = 1;
const STORE_FILES = 'uploaded_files';

function openDatabase(): Promise<IDBDatabase | null> {
  if (typeof window === 'undefined' || !('indexedDB' in window)) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(STORE_FILES)) {
          db.createObjectStore(STORE_FILES, { keyPath: 'key' });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

export interface StoredFileRecord {
  key: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
  dataUrl: string;
  savedAt: string;
}

export const PersistenceService = {
  async saveFile(record: StoredFileRecord): Promise<boolean> {
    const db = await openDatabase();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_FILES, 'readwrite');
        const store = tx.objectStore(STORE_FILES);
        store.put(record);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  },

  async getFile(key: string): Promise<StoredFileRecord | null> {
    const db = await openDatabase();
    if (!db) return null;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_FILES, 'readonly');
        const store = tx.objectStore(STORE_FILES);
        const req = store.get(key);
        req.onsuccess = () => resolve((req.result as StoredFileRecord) || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  },

  async deleteFile(key: string): Promise<boolean> {
    const db = await openDatabase();
    if (!db) return false;

    return new Promise((resolve) => {
      try {
        const tx = db.transaction(STORE_FILES, 'readwrite');
        const store = tx.objectStore(STORE_FILES);
        store.delete(key);
        tx.oncomplete = () => resolve(true);
        tx.onerror = () => resolve(false);
      } catch {
        resolve(false);
      }
    });
  },
};
