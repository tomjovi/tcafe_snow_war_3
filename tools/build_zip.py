"""표준 라이브러리로 게임 배포 ZIP을 만들며 index.html을 최상위에 둡니다."""
from pathlib import Path
from zipfile import ZIP_DEFLATED, ZipFile

ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "dist" / "noemdeulida-snow-war.zip"
INCLUDES = ("index.html", "css", "js", "config", "README.md")

with ZipFile(OUTPUT, "w", compression=ZIP_DEFLATED, compresslevel=9) as archive:
    for entry in INCLUDES:
        path = ROOT / entry
        paths = (path,) if path.is_file() else sorted(item for item in path.rglob("*") if item.is_file())
        for item in paths:
            archive.write(item, item.relative_to(ROOT).as_posix())

print(f"ZIP size: {OUTPUT.stat().st_size:,} bytes")
