#!/usr/bin/env python3
"""Create the minimal GitHub Pages artifact in _site/."""

import shutil
from pathlib import Path

root = Path(__file__).resolve().parents[1]
site = root / "_site"
if site.exists():
    shutil.rmtree(site)
site.mkdir()
for filename in ("index.html", "styles.css", "app.js", "data.js"):
    shutil.copy2(root / filename, site / filename)
(site / ".nojekyll").write_text("", encoding="utf-8")
print("Prepared CONCERTS ARCHIVE GitHub Pages artifact.")
