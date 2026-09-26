"""
tools/test_supabase_connection.py
Handshake validation script for Supabase connection.
Reads credentials from .env and tests REST API reachability.
"""

import sys
import os
import json
import urllib.request
import urllib.error

# Ensure UTF-8 output encoding across Windows terminals
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

def parse_env_file(filepath: str) -> dict:
    env_vars = {}
    if not os.path.exists(filepath):
        return env_vars
    with open(filepath, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            if "=" in line:
                key, val = line.split("=", 1)
                env_vars[key.strip()] = val.strip().strip('"').strip("'")
    return env_vars

def check_connection():
    env = parse_env_file(".env")
    url = env.get("NEXT_PUBLIC_SUPABASE_URL", "")
    key = env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY", "")

    print("=== SUPABASE LINK VERIFICATION ===")
    print(f"Target URL: {url}")
    
    if not url or "your-project" in url or not key or "your-anon-key" in key:
        print("[NOTICE] Supabase credentials in .env are currently placeholder values.")
        print("[NOTICE] Running in 'Resilient Demo / Offline Mode' with built-in mock posters.")
        print("[ACTION] When your live Supabase project is created, insert NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY into .env.")
        return False

    # Perform handshake against Supabase PostgREST root
    test_endpoint = f"{url.rstrip('/')}/rest/v1/posters?select=id&limit=1"
    req = urllib.request.Request(
        test_endpoint,
        headers={
            "apikey": key,
            "Authorization": f"Bearer {key}"
        }
    )

    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            status_code = response.getcode()
            body = response.read().decode("utf-8")
            print(f"[SUCCESS] Supabase connection established (HTTP {status_code}).")
            print(f"Sample response: {body[:100]}...")
            return True
    except urllib.error.HTTPError as e:
        print(f"[WARNING] Supabase responded with HTTP {e.code}: {e.reason}")
        if e.code == 404 or "relation" in str(e.read()):
            print("[INFO] Connection succeeded, but 'posters' table may not exist yet. Run tools/schema.sql in Supabase SQL editor.")
        return False
    except Exception as e:
        print(f"[ERROR] Connection handshake failed: {e}")
        return False

if __name__ == "__main__":
    check_connection()
