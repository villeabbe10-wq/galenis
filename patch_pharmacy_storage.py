import os

filepath = 'src/services/pharmacyStorage.ts'
with open(filepath, 'r') as f:
    content = f.read()

# Add sync function at the bottom or near the top
sync_func = """
// ==========================================
// Offline Caching & Sync
// ==========================================

export async function syncPharmacyDirectory(): Promise<void> {
  if (!navigator.onLine) {
    console.warn('Offline mode: Using cached pharmacy directory.');
    return;
  }
  
  try {
    const response = await fetch('/api/v1/pharmacies');
    if (response.ok) {
      const result = await response.json();
      if (result.data) {
        localStorage.setItem(KEYS.PHARMACIES, JSON.stringify(result.data));
        localStorage.setItem(`${KEYS.PHARMACIES}_last_sync`, new Date().toISOString());
        window.dispatchEvent(new Event('pharmacy-directory-synced'));
      }
    }
  } catch (error) {
    console.warn('Could not sync pharmacy directory. Falling back to local cache.', error);
  }
}

export function getLastSyncTime(): string | null {
  try {
    return localStorage.getItem(`${KEYS.PHARMACIES}_last_sync`);
  } catch {
    return null;
  }
}
"""

if "syncPharmacyDirectory" not in content:
    with open(filepath, 'a') as f:
        f.write("\n" + sync_func)
    print("Added sync functions to pharmacyStorage.ts")
else:
    print("Already exists")
