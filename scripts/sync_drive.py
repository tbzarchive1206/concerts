#!/usr/bin/env python3
"""Synchronise direct video files from the public CONCERTS Google Drive folder."""

from __future__ import annotations

import json
import os
import re
import time
import urllib.parse
import urllib.request
from pathlib import Path

ROOT_FOLDER_ID = "1rO3U0kX8aeWhCjqiVLfeNrBjggvxPEB4"
PROJECT_DIR = Path(__file__).resolve().parents[1]


def request_json(url: str):
    for attempt in range(5):
        try:
            request = urllib.request.Request(url, headers={"User-Agent": "Concerts-Archive/1.0"})
            with urllib.request.urlopen(request, timeout=45) as response:
                return json.load(response)
        except Exception:
            if attempt == 4:
                raise
            time.sleep(2**attempt)


def list_files(api_key: str):
    files = []
    page_token = None
    while True:
        params = {
            "q": f"'{ROOT_FOLDER_ID}' in parents and trashed = false",
            "key": api_key,
            "pageSize": "1000",
            "fields": "nextPageToken,files(id,name,mimeType,modifiedTime)",
        }
        if page_token:
            params["pageToken"] = page_token
        payload = request_json("https://www.googleapis.com/drive/v3/files?" + urllib.parse.urlencode(params))
        files.extend(payload.get("files", []))
        page_token = payload.get("nextPageToken")
        if not page_token:
            return files


def order_and_title(name: str):
    match = re.match(r"^\s*(\d+)\s*[.\-_]\s*(.*?)\s*$", name)
    order = int(match.group(1)) if match else 999999
    title = match.group(2) if match else name.strip()
    title = re.sub(r"\.(?:mp4|mov|m4v|webm)$", "", title, flags=re.IGNORECASE).strip()
    return order, title


def main():
    api_key = os.environ.get("GOOGLE_DRIVE_API_KEY", "").strip()
    if not api_key:
        raise SystemExit("GOOGLE_DRIVE_API_KEY is required")
    items = []
    for file in list_files(api_key):
        if not file.get("mimeType", "").startswith("video/"):
            continue
        order, title = order_and_title(file.get("name", "Video"))
        items.append({"order": order, "id": file["id"], "title": title, "modifiedTime": file.get("modifiedTime", "")})
    items.sort(key=lambda item: (item["order"], item["title"].casefold()))
    payload = {
        "version": 1,
        "sourceFolderId": ROOT_FOLDER_ID,
        "updatedAt": max((item["modifiedTime"] for item in items), default=""),
        "items": items,
    }
    compact = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    (PROJECT_DIR / "data.js").write_text(f"window.CONCERTS_DATA={compact};\n", encoding="utf-8")
    print(f"Updated {len(items)} concert recordings; non-video files were skipped.")


if __name__ == "__main__":
    main()
