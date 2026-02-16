"""API Client for fetching weather data."""
import urllib.request
import urllib.error
import json
from typing import Dict, Any, Optional
from .config import API_BASE_URL

def fetch_weather(city: str) -> Dict[str, Any]:
    """
    Fetch current weather for a city.
    
    Args:
        city: Name of the city (e.g., 'London', 'San_Francisco')
        
    Returns:
        Dict containing weather data
        
    Raises:
        urllib.error.URLError: If network request fails
    """
    # Use format=j1 for JSON output
    url = f"{API_BASE_URL}/{city}?format=j1"
    
    # User-Agent is good practice
    req = urllib.request.Request(
        url, 
        headers={'User-Agent': 'GSD-Lite-Eval-Fixture/1.0'}
    )
    
    with urllib.request.urlopen(req) as response:
        data = json.loads(response.read().decode('utf-8'))
        return data