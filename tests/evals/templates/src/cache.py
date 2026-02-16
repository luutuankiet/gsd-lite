"""Simple file-based cache."""
import json
import time
import hashlib
from typing import Optional, Dict, Any
from .config import CACHE_DIR, CACHE_TTL

def _get_cache_path(key: str) -> str:
    """Generate a safe filename for the cache key."""
    # Hash the key to avoid filesystem issues with special chars
    hashed_key = hashlib.md5(key.encode()).hexdigest()
    return str(CACHE_DIR / f"{hashed_key}.json")

def get(key: str) -> Optional[Dict[str, Any]]:
    """Retrieve data from cache if it exists and hasn't expired."""
    cache_path = _get_cache_path(key)
    try:
        with open(cache_path, 'r') as f:
            data = json.load(f)
            
        # Check expiry
        if time.time() - data['timestamp'] > CACHE_TTL:
            return None
            
        return data['value']
    except (FileNotFoundError, json.JSONDecodeError, KeyError):
        return None

def set(key: str, value: Dict[str, Any]) -> None:
    """Save data to cache with current timestamp."""
    cache_path = _get_cache_path(key)
    data = {
        'timestamp': time.time(),
        'value': value
    }
    with open(cache_path, 'w') as f:
        json.dump(data, f)