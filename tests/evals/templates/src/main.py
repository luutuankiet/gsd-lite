"""
CLI Application Entry Point.
Usage: python -m src.main [command] [args]
"""
import argparse
import sys
import json
from . import client, cache
from .config import DEFAULT_CITY, CACHE_DIR

def format_weather(data: dict) -> str:
    """Pretty print basic weather info."""
    try:
        current = data['current_condition'][0]
        desc = current['weatherDesc'][0]['value']
        temp_c = current['temp_C']
        feels_like = current['FeelsLikeC']
        return f"{desc}, {temp_c}°C (Feels like {feels_like}°C)"
    except (KeyError, IndexError):
        return "Could not parse weather data"

def command_weather(args):
    """Fetch and display weather."""
    city = args.city or DEFAULT_CITY
    print(f"Checking weather for {city}...")
    
    # Try cache first
    cached_data = cache.get(city)
    if cached_data:
        print("[CACHE HIT]")
        print(format_weather(cached_data))
        return

    # Fetch fresh
    try:
        data = client.fetch_weather(city)
        cache.set(city, data)
        print("[API FETCH]")
        print(format_weather(data))
    except Exception as e:
        print(f"Error fetching weather: {e}", file=sys.stderr)
        sys.exit(1)

def command_raw(args):
    """Dump raw JSON (good for debugging)."""
    city = args.city or DEFAULT_CITY
    try:
        data = client.fetch_weather(city)
        print(json.dumps(data, indent=2))
    except Exception as e:
        print(f"Error: {e}", file=sys.stderr)

def main():
    parser = argparse.ArgumentParser(description="GSD-Lite Evaluation Fixture App")
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # 'weather' command
    p_weather = subparsers.add_parser("weather", help="Get current weather")
    p_weather.add_argument("city", nargs="?", help="City name (e.g. London)")
    
    # 'raw' command
    p_raw = subparsers.add_parser("raw", help="Get raw JSON response")
    p_raw.add_argument("city", nargs="?", help="City name")
    
    # 'info' command
    subparsers.add_parser("info", help="Show configuration info")

    args = parser.parse_args()
    
    if args.command == "weather":
        command_weather(args)
    elif args.command == "raw":
        command_raw(args)
    elif args.command == "info":
        print(f"Cache Directory: {CACHE_DIR}")
        print(f"Default City: {DEFAULT_CITY}")
    else:
        parser.print_help()

if __name__ == "__main__":
    main()