"""Configuration settings for the API client."""
import os
from pathlib import Path

# Use a free public API (wttr.in weather)
# Returns JSON format when ?format=j1 is appended
API_BASE_URL = "https://wttr.in"
DEFAULT_CITY = "London"

# Cache settings
CACHE_TTL = 300  # 5 minutes
CACHE_DIR = Path.home() / ".cache" / "api-client-fixture"

# Ensure cache directory exists
os.makedirs(CACHE_DIR, exist_ok=True)