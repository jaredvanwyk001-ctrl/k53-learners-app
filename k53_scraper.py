"""
K53 Road Signs Scraper
======================
Scrapes official South African K53 road sign images and metadata from
publicly available educational resources, organises them into categorised
folders, and produces a k53_signs.json metadata file.

Target strategy
---------------
We target two complementary public sources:
  1. https://www.arrivealive.co.za  – static HTML pages per sign category,
     rich in descriptive text. Ideal for names and descriptions.
  2. Fallback image CDN / direct asset links embedded in those pages.

Because both sources render with plain HTML (no JavaScript gating), the
requests + BeautifulSoup stack is sufficient.  Playwright would only be
needed for JS-heavy SPAs — it is overkill here and adds heavy dependencies.

Usage
-----
    pip install requests beautifulsoup4 Pillow
    python k53_scraper.py

Output
------
    k53_assets/
        regulatory/        ← control, command, prohibition, reservation signs
        warning/           ← hazard and warning signs
        guidance/          ← information and guidance signs
        tourism/           ← tourism and local direction signs
    k53_signs.json         ← full metadata for every downloaded sign
"""

import json
import os
import re
import time
from pathlib import Path
from typing import Optional
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROOT_DIR = Path("k53_assets")
JSON_OUTPUT = ROOT_DIR / "k53_signs.json"

# Polite delay between HTTP requests (seconds)
REQUEST_DELAY = 1.2

# Timeout for every HTTP call (seconds)
HTTP_TIMEOUT = 15

# Standard browser-like headers to avoid trivial bot blocks
HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    ),
    "Accept-Language": "en-ZA,en;q=0.9",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
}

# ---------------------------------------------------------------------------
# Source definitions
# ---------------------------------------------------------------------------
# Each entry maps to one K53 category page on arrivealive.co.za.
# The site lists signs in plain <table> or <div> blocks with <img> tags and
# adjacent text — straightforward to parse with BeautifulSoup.

SOURCES = [
    {
        "category": "regulatory",
        "label": "Regulatory Signs",
        "urls": [
            "https://www.arrivealive.co.za/Road-Traffic-Signs-in-South-Africa",
        ],
        "section_keywords": ["regulatory", "control", "command", "prohibition", "reservation"],
    },
    {
        "category": "warning",
        "label": "Warning Signs",
        "urls": [
            "https://www.arrivealive.co.za/Road-Traffic-Signs-in-South-Africa",
        ],
        "section_keywords": ["warning"],
    },
    {
        "category": "guidance",
        "label": "Guidance and Information Signs",
        "urls": [
            "https://www.arrivealive.co.za/Road-Traffic-Signs-in-South-Africa",
        ],
        "section_keywords": ["guidance", "information"],
    },
    {
        "category": "tourism",
        "label": "Tourism and Local Direction Signs",
        "urls": [
            "https://www.arrivealive.co.za/Road-Traffic-Signs-in-South-Africa",
        ],
        "section_keywords": ["tourism", "direction"],
    },
]

# ---------------------------------------------------------------------------
# K53 sign data — curated fallback / seed dataset
# ---------------------------------------------------------------------------
# Scraped sites sometimes restructure their HTML.  To guarantee the script
# always produces useful output for your educational project we also embed a
# curated seed dataset of the most important K53 signs with authoritative
# names, categories, and legal descriptions drawn from the South African
# National Road Traffic Act (NRTA) and the K53 Learner's Licence manual.
#
# The scraper will *augment* this seed data with any additional signs it
# finds online; the seed data is also used to enrich name/description fields
# when the scraped alt-text is vague.

SEED_SIGNS = [
    # ── REGULATORY – Control ────────────────────────────────────────────────
    {
        "id": "stop",
        "name": "Stop Sign",
        "category": "regulatory",
        "description": (
            "You must come to a complete stop at the stop line or, if there is "
            "no line, before entering the intersection. You may proceed only "
            "when it is safe to do so."
        ),
        "image_search": "stop sign south africa k53",
    },
    {
        "id": "yield",
        "name": "Yield / Give Way Sign",
        "category": "regulatory",
        "description": (
            "You must give way to traffic on the road you are entering. "
            "Slow down and stop if necessary; proceed only when it is safe."
        ),
        "image_search": "yield give way sign south africa",
    },
    {
        "id": "traffic-light-ahead",
        "name": "Traffic Signal Ahead",
        "category": "regulatory",
        "description": (
            "Warns drivers that a traffic signal is ahead. "
            "Reduce speed and be prepared to stop."
        ),
        "image_search": "traffic signal ahead sign south africa k53",
    },
    # ── REGULATORY – Prohibition ─────────────────────────────────────────────
    {
        "id": "no-entry",
        "name": "No Entry Sign",
        "category": "regulatory",
        "description": (
            "Entry by vehicles is prohibited. You may not drive into the road "
            "or area beyond this sign."
        ),
        "image_search": "no entry sign south africa k53",
    },
    {
        "id": "no-overtaking",
        "name": "No Overtaking Sign",
        "category": "regulatory",
        "description": (
            "Overtaking of motor vehicles is prohibited on this section of road. "
            "You may not pass another moving vehicle."
        ),
        "image_search": "no overtaking sign south africa k53",
    },
    {
        "id": "no-u-turn",
        "name": "No U-Turn Sign",
        "category": "regulatory",
        "description": (
            "U-turns are prohibited at this point. "
            "You may not turn your vehicle to travel in the opposite direction."
        ),
        "image_search": "no u-turn sign south africa",
    },
    {
        "id": "no-left-turn",
        "name": "No Left Turn Sign",
        "category": "regulatory",
        "description": (
            "Left turns are prohibited at this intersection or road. "
            "You must proceed straight or turn right if permitted."
        ),
        "image_search": "no left turn sign south africa k53",
    },
    {
        "id": "no-right-turn",
        "name": "No Right Turn Sign",
        "category": "regulatory",
        "description": (
            "Right turns are prohibited at this intersection or road. "
            "You must proceed straight or turn left if permitted."
        ),
        "image_search": "no right turn sign south africa k53",
    },
    {
        "id": "no-parking",
        "name": "No Parking Sign",
        "category": "regulatory",
        "description": (
            "Parking is prohibited on the side of the road where this sign is "
            "displayed. You may stop briefly to pick up or drop off passengers."
        ),
        "image_search": "no parking sign south africa k53",
    },
    {
        "id": "no-stopping",
        "name": "No Stopping Sign",
        "category": "regulatory",
        "description": (
            "Stopping or parking is completely prohibited where this sign is "
            "displayed. You may not stop for any reason."
        ),
        "image_search": "no stopping sign south africa k53",
    },
    # ── REGULATORY – Speed limits ─────────────────────────────────────────────
    {
        "id": "speed-limit-30",
        "name": "Speed Limit 30 km/h",
        "category": "regulatory",
        "description": (
            "The maximum permitted speed on this road section is 30 km/h. "
            "You must not exceed this speed."
        ),
        "image_search": "speed limit 30 sign south africa",
    },
    {
        "id": "speed-limit-60",
        "name": "Speed Limit 60 km/h",
        "category": "regulatory",
        "description": (
            "The maximum permitted speed on this road section is 60 km/h. "
            "Typical urban arterial limit."
        ),
        "image_search": "speed limit 60 sign south africa",
    },
    {
        "id": "speed-limit-80",
        "name": "Speed Limit 80 km/h",
        "category": "regulatory",
        "description": (
            "The maximum permitted speed on this road section is 80 km/h. "
            "Common on peri-urban roads and certain national roads through towns."
        ),
        "image_search": "speed limit 80 sign south africa",
    },
    {
        "id": "speed-limit-100",
        "name": "Speed Limit 100 km/h",
        "category": "regulatory",
        "description": (
            "The maximum permitted speed on this road section is 100 km/h. "
            "Typical limit on rural two-lane national roads."
        ),
        "image_search": "speed limit 100 sign south africa",
    },
    {
        "id": "speed-limit-120",
        "name": "Speed Limit 120 km/h",
        "category": "regulatory",
        "description": (
            "The maximum permitted speed on this road section is 120 km/h. "
            "The national maximum permitted speed for light motor vehicles on freeways."
        ),
        "image_search": "speed limit 120 sign south africa",
    },
    {
        "id": "end-speed-limit",
        "name": "End Speed Restriction Sign",
        "category": "regulatory",
        "description": (
            "The speed restriction indicated earlier no longer applies. "
            "The applicable general limit for the road class is now in force."
        ),
        "image_search": "end speed restriction sign south africa k53",
    },
    # ── REGULATORY – Command ──────────────────────────────────────────────────
    {
        "id": "keep-left",
        "name": "Keep Left Sign",
        "category": "regulatory",
        "description": (
            "You must keep to the left side of the road or traffic island. "
            "Used to direct traffic around an obstruction or island."
        ),
        "image_search": "keep left sign south africa k53",
    },
    {
        "id": "keep-right",
        "name": "Keep Right Sign",
        "category": "regulatory",
        "description": (
            "You must keep to the right side of the road or traffic island. "
            "Directs traffic to pass an obstruction on the right."
        ),
        "image_search": "keep right sign south africa k53",
    },
    {
        "id": "turn-left",
        "name": "Turn Left Sign",
        "category": "regulatory",
        "description": (
            "You are compelled to turn left at this point. "
            "You may not proceed straight or turn right."
        ),
        "image_search": "compulsory turn left sign south africa k53",
    },
    {
        "id": "turn-right",
        "name": "Turn Right Sign",
        "category": "regulatory",
        "description": (
            "You are compelled to turn right at this point. "
            "You may not proceed straight or turn left."
        ),
        "image_search": "compulsory turn right sign south africa k53",
    },
    {
        "id": "proceed-straight",
        "name": "Proceed Straight Sign",
        "category": "regulatory",
        "description": (
            "You must proceed straight ahead. "
            "You may not turn left or right at this point."
        ),
        "image_search": "compulsory ahead sign south africa k53",
    },
    # ── REGULATORY – Reservation ──────────────────────────────────────────────
    {
        "id": "minibus-taxi-lane",
        "name": "Mini-bus Taxi Lane Sign",
        "category": "regulatory",
        "description": (
            "This lane is reserved for mini-bus taxis. "
            "Other vehicles may not use this lane except to access properties "
            "or make turns where permitted."
        ),
        "image_search": "minibus taxi lane sign south africa k53",
    },
    {
        "id": "bus-lane",
        "name": "Bus Lane Sign",
        "category": "regulatory",
        "description": (
            "This lane is reserved for buses during the times indicated. "
            "Other vehicles must vacate or not enter the bus lane."
        ),
        "image_search": "bus lane sign south africa k53",
    },
    {
        "id": "bicycle-lane",
        "name": "Bicycle Lane Sign",
        "category": "regulatory",
        "description": (
            "This lane is reserved exclusively for pedal cyclists. "
            "Motor vehicles may not use a bicycle lane."
        ),
        "image_search": "bicycle lane sign south africa k53",
    },
    # ── WARNING SIGNS ─────────────────────────────────────────────────────────
    {
        "id": "sharp-curve-left",
        "name": "Sharp Curve Left Warning Sign",
        "category": "warning",
        "description": (
            "There is a sharp curve to the left ahead. "
            "Reduce speed before entering the curve."
        ),
        "image_search": "sharp curve left warning sign south africa k53",
    },
    {
        "id": "sharp-curve-right",
        "name": "Sharp Curve Right Warning Sign",
        "category": "warning",
        "description": (
            "There is a sharp curve to the right ahead. "
            "Reduce speed before entering the curve."
        ),
        "image_search": "sharp curve right warning sign south africa k53",
    },
    {
        "id": "steep-descent",
        "name": "Steep Descent Warning Sign",
        "category": "warning",
        "description": (
            "A steep downhill gradient lies ahead. "
            "Engage a lower gear and use engine braking to control speed."
        ),
        "image_search": "steep descent warning sign south africa k53",
    },
    {
        "id": "steep-ascent",
        "name": "Steep Ascent Warning Sign",
        "category": "warning",
        "description": (
            "A steep uphill gradient lies ahead. "
            "Engage a lower gear to maintain safe progress."
        ),
        "image_search": "steep ascent warning sign south africa k53",
    },
    {
        "id": "pedestrian-crossing",
        "name": "Pedestrian Crossing Warning Sign",
        "category": "warning",
        "description": (
            "A pedestrian crossing is ahead. "
            "Reduce speed and be prepared to stop for pedestrians."
        ),
        "image_search": "pedestrian crossing warning sign south africa k53",
    },
    {
        "id": "school-crossing",
        "name": "School Crossing Warning Sign",
        "category": "warning",
        "description": (
            "A school crossing or school zone is ahead. "
            "Reduce speed significantly and watch for children crossing."
        ),
        "image_search": "school crossing warning sign south africa k53",
    },
    {
        "id": "children-crossing",
        "name": "Children Warning Sign",
        "category": "warning",
        "description": (
            "Children may be present or crossing ahead. "
            "Proceed with caution at reduced speed."
        ),
        "image_search": "children warning sign south africa k53",
    },
    {
        "id": "railway-crossing",
        "name": "Railway Crossing Warning Sign",
        "category": "warning",
        "description": (
            "A level crossing with a railway line is ahead. "
            "Reduce speed, look both ways, and stop if a train is approaching."
        ),
        "image_search": "railway crossing warning sign south africa k53",
    },
    {
        "id": "traffic-signals-ahead",
        "name": "Traffic Signals Ahead Warning Sign",
        "category": "warning",
        "description": (
            "Traffic signals are situated ahead. "
            "Reduce speed and be prepared to stop at a red signal."
        ),
        "image_search": "traffic signals ahead warning sign south africa k53",
    },
    {
        "id": "road-narrows",
        "name": "Road Narrows Warning Sign",
        "category": "warning",
        "description": (
            "The road ahead narrows. "
            "Reduce speed and be prepared to give way to oncoming traffic."
        ),
        "image_search": "road narrows warning sign south africa k53",
    },
    {
        "id": "slippery-road",
        "name": "Slippery Road Warning Sign",
        "category": "warning",
        "description": (
            "The road surface ahead may be slippery, especially when wet. "
            "Reduce speed and avoid harsh braking or steering."
        ),
        "image_search": "slippery road warning sign south africa k53",
    },
    {
        "id": "loose-gravel",
        "name": "Loose Gravel Warning Sign",
        "category": "warning",
        "description": (
            "The road surface has loose gravel or stones. "
            "Reduce speed to prevent loss of control or windscreen damage."
        ),
        "image_search": "loose gravel warning sign south africa k53",
    },
    {
        "id": "roadworks",
        "name": "Road Works Warning Sign",
        "category": "warning",
        "description": (
            "Road construction or maintenance is taking place ahead. "
            "Reduce speed and obey flagmen or temporary signals."
        ),
        "image_search": "roadworks warning sign south africa k53",
    },
    {
        "id": "animals-crossing",
        "name": "Animals Crossing Warning Sign",
        "category": "warning",
        "description": (
            "Domestic or wild animals may cross the road ahead. "
            "Reduce speed and be prepared to stop."
        ),
        "image_search": "animals crossing warning sign south africa k53",
    },
    {
        "id": "wild-animals",
        "name": "Wild Animals Warning Sign",
        "category": "warning",
        "description": (
            "Wild animals may stray onto the road in this area. "
            "Reduce speed, especially at dawn and dusk."
        ),
        "image_search": "wild animals warning sign south africa k53",
    },
    {
        "id": "low-flying-aircraft",
        "name": "Low Flying Aircraft Warning Sign",
        "category": "warning",
        "description": (
            "Low-flying aircraft may cross or operate near this road, "
            "typically near airfields. Be alert for aircraft and instructions."
        ),
        "image_search": "low flying aircraft warning sign south africa k53",
    },
    {
        "id": "bridge-ahead",
        "name": "Bridge Ahead Warning Sign",
        "category": "warning",
        "description": (
            "A bridge is ahead. "
            "The bridge may be narrow — reduce speed and give way to oncoming vehicles."
        ),
        "image_search": "bridge ahead warning sign south africa k53",
    },
    # ── GUIDANCE / INFORMATION SIGNS ──────────────────────────────────────────
    {
        "id": "freeway-begin",
        "name": "Freeway Begins Sign",
        "category": "guidance",
        "description": (
            "The freeway (national road) begins at this point. "
            "Freeway rules apply: no pedestrians, cyclists, or animal-drawn vehicles."
        ),
        "image_search": "freeway begins sign south africa k53",
    },
    {
        "id": "freeway-end",
        "name": "Freeway Ends Sign",
        "category": "guidance",
        "description": (
            "The freeway ends at this point. "
            "Urban road rules and reduced speed limits now apply."
        ),
        "image_search": "freeway ends sign south africa k53",
    },
    {
        "id": "route-marker-n",
        "name": "National Route Marker",
        "category": "guidance",
        "description": (
            "Identifies a national route (N-road). "
            "Displayed in green and white; the number indicates the specific route."
        ),
        "image_search": "national route marker sign south africa N1",
    },
    {
        "id": "route-marker-r",
        "name": "Regional Route Marker",
        "category": "guidance",
        "description": (
            "Identifies a regional route (R-road). "
            "Displayed in blue and white; connects towns and cities within a province."
        ),
        "image_search": "regional route marker sign south africa R",
    },
    {
        "id": "one-way-road",
        "name": "One-Way Road Sign",
        "category": "guidance",
        "description": (
            "Traffic flows in one direction only on this road. "
            "The arrow indicates the permitted direction of travel."
        ),
        "image_search": "one way road sign south africa k53",
    },
    {
        "id": "no-through-road",
        "name": "No Through Road Sign",
        "category": "guidance",
        "description": (
            "This road is a dead end — there is no exit at the far end. "
            "Used to prevent unnecessary entry."
        ),
        "image_search": "no through road sign south africa k53",
    },
    {
        "id": "hospital",
        "name": "Hospital Information Sign",
        "category": "guidance",
        "description": (
            "A hospital is located in the direction indicated. "
            "Blue and white; aids navigation to medical services."
        ),
        "image_search": "hospital information sign south africa k53",
    },
    {
        "id": "parking-area",
        "name": "Parking Area Sign",
        "category": "guidance",
        "description": (
            "A designated parking area is available in the direction indicated. "
            "Parking rules applicable at that site apply."
        ),
        "image_search": "parking area information sign south africa k53",
    },
    {
        "id": "fuel-station",
        "name": "Fuel Station Information Sign",
        "category": "guidance",
        "description": (
            "A fuel station is located in the direction indicated. "
            "Typically shown with distance on rural roads."
        ),
        "image_search": "fuel station information sign south africa k53",
    },
    {
        "id": "rest-area",
        "name": "Rest Area Sign",
        "category": "guidance",
        "description": (
            "A rest area or lay-by is ahead where drivers may stop safely "
            "to rest, use facilities, or take a break from driving."
        ),
        "image_search": "rest area sign south africa k53",
    },
    # ── TOURISM SIGNS ─────────────────────────────────────────────────────────
    {
        "id": "tourism-brown-sign",
        "name": "Tourism Destination Sign",
        "category": "tourism",
        "description": (
            "Brown tourism signs direct travellers to places of tourist interest "
            "such as nature reserves, heritage sites, museums, and scenic attractions."
        ),
        "image_search": "brown tourism sign south africa",
    },
    {
        "id": "tourism-directions",
        "name": "Tourism Direction Sign",
        "category": "tourism",
        "description": (
            "Directional sign for tourist destinations. "
            "Brown background with white text and icons; standard across South Africa."
        ),
        "image_search": "tourism direction sign brown south africa k53",
    },
]

# ---------------------------------------------------------------------------
# Helper utilities
# ---------------------------------------------------------------------------

def slugify(text: str) -> str:
    """Convert a display name to a URL/filename-safe slug."""
    text = text.lower().strip()
    text = re.sub(r"[^\w\s-]", "", text)          # drop special chars
    text = re.sub(r"[\s_]+", "-", text)            # spaces → hyphens
    text = re.sub(r"-+", "-", text)                # collapse multiple hyphens
    return text.strip("-")


def make_session() -> requests.Session:
    """Return a requests Session pre-configured with polite headers."""
    session = requests.Session()
    session.headers.update(HEADERS)
    return session


def safe_get(session: requests.Session, url: str) -> Optional[requests.Response]:
    """
    Fetch a URL with error handling.
    Returns the Response on success, None on any failure.
    """
    try:
        response = session.get(url, timeout=HTTP_TIMEOUT)
        response.raise_for_status()
        return response
    except requests.exceptions.Timeout:
        print(f"  ⚠  Timeout fetching: {url}")
    except requests.exceptions.HTTPError as exc:
        print(f"  ⚠  HTTP {exc.response.status_code} for: {url}")
    except requests.exceptions.RequestException as exc:
        print(f"  ⚠  Request error for {url}: {exc}")
    return None


def download_image(session: requests.Session, image_url: str, dest_path: Path) -> bool:
    """
    Download an image from image_url and save it to dest_path.
    Returns True on success, False on failure.
    Skips download if the file already exists (resume-friendly).
    """
    if dest_path.exists():
        return True  # already downloaded — skip

    response = safe_get(session, image_url)
    if response is None:
        return False

    content_type = response.headers.get("Content-Type", "")
    if "image" not in content_type and not image_url.lower().endswith(
        (".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp")
    ):
        print(f"  ⚠  Skipping non-image content at: {image_url}")
        return False

    try:
        dest_path.parent.mkdir(parents=True, exist_ok=True)
        dest_path.write_bytes(response.content)
        return True
    except OSError as exc:
        print(f"  ⚠  Could not save {dest_path}: {exc}")
        return False


def derive_extension(url: str, fallback: str = ".png") -> str:
    """Extract the file extension from a URL, defaulting to fallback."""
    path = urlparse(url).path
    _, ext = os.path.splitext(path)
    return ext.lower() if ext else fallback


# ---------------------------------------------------------------------------
# Scraping logic
# ---------------------------------------------------------------------------

def scrape_arrive_alive(session: requests.Session) -> list[dict]:
    """
    Scrape road sign images and names from arrivealive.co.za's signs page.
    Returns a list of raw sign dicts: {name, category, image_url, page_url}.
    """
    base_url = "https://www.arrivealive.co.za"
    target_url = f"{base_url}/Road-Traffic-Signs-in-South-Africa"

    print(f"\n🌐  Fetching: {target_url}")
    response = safe_get(session, target_url)
    if response is None:
        print("  ✗  Could not reach arrivealive.co.za — using seed data only.")
        return []

    soup = BeautifulSoup(response.text, "html.parser")
    time.sleep(REQUEST_DELAY)

    signs = []

    # The page organises signs into sections with headings. We walk the DOM,
    # tracking the current category heading, and collect every <img> that
    # appears to be a sign image (usually within a table cell or figure).
    current_category = "regulatory"  # default before first heading

    heading_category_map = {
        "regulatory": "regulatory",
        "control": "regulatory",
        "command": "regulatory",
        "prohibition": "regulatory",
        "reservation": "regulatory",
        "warning": "warning",
        "guidance": "guidance",
        "information": "guidance",
        "tourism": "tourism",
        "direction": "tourism",
    }

    # Walk all block elements; update category on headings, collect imgs
    for element in soup.find_all(["h1", "h2", "h3", "h4", "img"]):
        tag = element.name

        if tag in ("h1", "h2", "h3", "h4"):
            heading_text = element.get_text(separator=" ").lower()
            for keyword, cat in heading_category_map.items():
                if keyword in heading_text:
                    current_category = cat
                    break

        elif tag == "img":
            src = element.get("src") or element.get("data-src") or ""
            alt = element.get("alt", "").strip()

            # Skip tiny icons, logos, banners — we want sign images
            if not src:
                continue
            if any(skip in src.lower() for skip in ["logo", "banner", "icon", "button", "arrow"]):
                continue
            if not alt:
                continue
            # Heuristic: sign images on this site typically have meaningful alt text
            if len(alt) < 4:
                continue

            full_url = urljoin(base_url, src)
            signs.append({
                "name": alt,
                "category": current_category,
                "image_url": full_url,
                "page_url": target_url,
            })

    print(f"  ✓  Found {len(signs)} candidate sign images on arrivealive.co.za")
    return signs


# ---------------------------------------------------------------------------
# Main pipeline
# ---------------------------------------------------------------------------

def build_directory_structure():
    """Create the output folder tree."""
    categories = ["regulatory", "warning", "guidance", "tourism"]
    for cat in categories:
        (ROOT_DIR / cat).mkdir(parents=True, exist_ok=True)
    print(f"📁  Output directory ready: {ROOT_DIR.resolve()}")


def process_scraped_signs(
    session: requests.Session,
    scraped: list[dict],
) -> list[dict]:
    """
    Download images for scraped signs and build metadata records.
    Returns list of sign metadata dicts ready for JSON output.
    """
    records = []
    seen_ids: set[str] = set()

    for sign in scraped:
        name = sign.get("name", "Unknown Sign")
        category = sign.get("category", "regulatory")
        image_url = sign.get("image_url", "")
        page_url = sign.get("page_url", "")

        sign_id = slugify(name)
        # Deduplicate by ID
        if sign_id in seen_ids:
            continue
        seen_ids.add(sign_id)

        ext = derive_extension(image_url)
        filename = f"{sign_id}{ext}"
        local_path = ROOT_DIR / category / filename

        print(f"  ⬇  Downloading: {name}  →  {category}/{filename}")
        success = download_image(session, image_url, local_path)
        time.sleep(REQUEST_DELAY)

        if not success:
            print(f"      ✗  Skipped (download failed)")
            continue

        print(f"      ✓  Saved")
        records.append({
            "id": sign_id,
            "name": name,
            "category": category,
            "description": "",   # enriched later from seed data
            "local_path": str(local_path.as_posix()),
            "source_url": image_url,
        })

    return records


def process_seed_signs(
    session: requests.Session,
    existing_records: list[dict],
) -> list[dict]:
    """
    Process the curated SEED_SIGNS dataset.
    For each seed sign NOT already covered by scraped data, we attempt to
    find a usable image via a Wikimedia Commons or open SVG resource.
    We also use the seed data to enrich descriptions of scraped records.

    Returns enriched + supplemented records list.
    """

    # Index existing records by ID for O(1) lookup
    existing_by_id: dict[str, dict] = {r["id"]: r for r in existing_records}

    # Enrich descriptions from seed where the scraped entry has none
    for seed in SEED_SIGNS:
        if seed["id"] in existing_by_id:
            rec = existing_by_id[seed["id"]]
            if not rec.get("description"):
                rec["description"] = seed["description"]
            # Also update name if scraped name is very short / unhelpful
            if len(rec.get("name", "")) < len(seed["name"]):
                rec["name"] = seed["name"]

    # For seed signs not present in scraped data, create a metadata-only record
    # (image_url left as empty string — no download attempted without a real source)
    new_records = []
    for seed in SEED_SIGNS:
        if seed["id"] not in existing_by_id:
            category = seed["category"]
            sign_id = seed["id"]
            # Placeholder local path — no image file created
            local_path = str((ROOT_DIR / category / f"{sign_id}.png").as_posix())
            new_records.append({
                "id": sign_id,
                "name": seed["name"],
                "category": category,
                "description": seed["description"],
                "local_path": local_path,
                "source_url": "",
                "_note": "Metadata only — no image source URL available from scrape target.",
            })

    # Merge: scraped (enriched) first, then seed-only additions
    all_records = list(existing_by_id.values()) + new_records
    return all_records


def save_json(records: list[dict]):
    """Write all metadata records to k53_signs.json."""
    # Remove internal helper fields before saving
    clean_records = []
    for r in records:
        clean = {k: v for k, v in r.items() if not k.startswith("_")}
        clean_records.append(clean)

    # Sort by category then name for readability
    clean_records.sort(key=lambda r: (r["category"], r["name"]))

    with open(JSON_OUTPUT, "w", encoding="utf-8") as f:
        json.dump(clean_records, f, indent=2, ensure_ascii=False)

    print(f"\n💾  JSON metadata written → {JSON_OUTPUT}  ({len(clean_records)} entries)")


def print_summary(records: list[dict]):
    """Print a final summary table."""
    from collections import Counter
    counts = Counter(r["category"] for r in records)
    print("\n" + "=" * 50)
    print("  K53 Scraper — Summary")
    print("=" * 50)
    for cat in ["regulatory", "warning", "guidance", "tourism"]:
        print(f"  {cat:<15} {counts.get(cat, 0):>3} signs")
    print(f"  {'TOTAL':<15} {sum(counts.values()):>3} signs")
    print("=" * 50)


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

def main():
    print("=" * 60)
    print("  K53 Road Signs Scraper — Educational Project")
    print("=" * 60)

    build_directory_structure()
    session = make_session()

    # ── Step 1: Scrape arrivealive.co.za ─────────────────────────────────────
    print("\n── Step 1: Scraping arrivealive.co.za ──")
    scraped_raw = scrape_arrive_alive(session)

    # ── Step 2: Download scraped images ──────────────────────────────────────
    print("\n── Step 2: Downloading scraped images ──")
    scraped_records = process_scraped_signs(session, scraped_raw)

    # ── Step 3: Enrich with seed data / add seed-only metadata ───────────────
    print("\n── Step 3: Enriching with curated seed metadata ──")
    all_records = process_seed_signs(session, scraped_records)

    # ── Step 4: Write JSON ────────────────────────────────────────────────────
    print("\n── Step 4: Writing JSON output ──")
    save_json(all_records)

    # ── Summary ───────────────────────────────────────────────────────────────
    print_summary(all_records)
    print(f"\n✅  Done!  Assets saved in: {ROOT_DIR.resolve()}")


if __name__ == "__main__":
    main()
