"""
Trailhead OBS Controller
========================
Listens for homesite selection events via Socket.IO and switches OBS scenes
accordingly so the correct video appears on the projector / LED wall (S3).

Requirements:
    pip install python-socketio[client] obs-websocket-py requests

OBS Setup:
    1. In OBS, enable the WebSocket server (Tools → obs-websocket settings)
       Default port: 4455 — set a password or leave blank for local use.
    2. Create one scene per homesite named exactly:
         "Homesite 1", "Homesite 2", ... "Amenity Center", "IDLE"
    3. Each scene contains a Media Source pointing to the homesite video file.

Usage:
    python obs_controller.py
    # or with env overrides:
    OBS_HOST=localhost OBS_PORT=4455 OBS_PASSWORD=secret SERVER_URL=http://localhost:3001 python obs_controller.py
"""

import os
import time
import logging
import threading

import socketio
import obsws_python as obs

# ── Configuration ──────────────────────────────────────────────────────────────
OBS_HOST       = os.getenv("OBS_HOST", "localhost")
OBS_PORT       = int(os.getenv("OBS_PORT", "4455"))
OBS_PASSWORD   = os.getenv("OBS_PASSWORD", "")
SERVER_URL     = os.getenv("SERVER_URL", "http://localhost:3001")
IDLE_SCENE     = "IDLE"

# Map homesite IDs → OBS scene names
SCENE_MAP: dict[str, str] = {
    "hs-1": "Homesite 1",
    "hs-2": "Homesite 2",
    "hs-3": "Homesite 3",
    "hs-4": "Homesite 4",
    "hs-5": "Homesite 5",
    "hs-6": "Homesite 6",
    "hs-7": "Amenity Center",
}

# ── Logging ────────────────────────────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("obs_controller")

# ── OBS client ─────────────────────────────────────────────────────────────────
obs_client: obs.ReqClient | None = None
obs_lock = threading.Lock()


def connect_obs() -> bool:
    global obs_client
    try:
        obs_client = obs.ReqClient(
            host=OBS_HOST,
            port=OBS_PORT,
            password=OBS_PASSWORD,
            timeout=5,
        )
        log.info("Connected to OBS WebSocket at %s:%s", OBS_HOST, OBS_PORT)
        return True
    except Exception as exc:
        log.warning("OBS connection failed: %s — will retry", exc)
        obs_client = None
        return False


def switch_scene(scene_name: str) -> None:
    """Switch OBS to the given program scene."""
    global obs_client
    with obs_lock:
        if obs_client is None:
            if not connect_obs():
                log.error("Cannot switch scene — OBS not connected")
                return
        try:
            obs_client.set_current_program_scene(scene_name)
            log.info("OBS scene → '%s'", scene_name)
        except Exception as exc:
            log.warning("Scene switch failed (%s): %s — reconnecting", scene_name, exc)
            obs_client = None
            # Retry once
            if connect_obs():
                try:
                    obs_client.set_current_program_scene(scene_name)
                    log.info("OBS scene → '%s' (retry)", scene_name)
                except Exception as exc2:
                    log.error("Scene switch retry failed: %s", exc2)


# ── Socket.IO client ───────────────────────────────────────────────────────────
sio = socketio.Client(reconnection=True, reconnection_attempts=0, logger=False)


@sio.event
def connect():
    log.info("Connected to Trailhead server at %s", SERVER_URL)


@sio.event
def disconnect():
    log.warning("Disconnected from Trailhead server — will auto-reconnect")


@sio.on("selection")
def on_selection(data: dict):
    homesite_id = data.get("homesiteId")
    source = data.get("source", "unknown")
    log.info("Selection event: %s from %s", homesite_id, source)

    if homesite_id and homesite_id in SCENE_MAP:
        scene = SCENE_MAP[homesite_id]
    else:
        scene = IDLE_SCENE

    # Switch in a background thread to not block Socket.IO event loop
    threading.Thread(target=switch_scene, args=(scene,), daemon=True).start()


# ── Main ───────────────────────────────────────────────────────────────────────
def main():
    log.info("Trailhead OBS Controller starting...")
    log.info("  OBS   : %s:%s", OBS_HOST, OBS_PORT)
    log.info("  Server: %s", SERVER_URL)

    # Attempt initial OBS connection (non-fatal if OBS isn't open yet)
    connect_obs()

    # Connect to the Trailhead WebSocket server with infinite retry
    while True:
        try:
            sio.connect(SERVER_URL, transports=["websocket", "polling"])
            sio.wait()
        except socketio.exceptions.ConnectionError as exc:
            log.warning("Cannot connect to server: %s — retrying in 5s", exc)
            time.sleep(5)
        except KeyboardInterrupt:
            log.info("Shutting down.")
            sio.disconnect()
            break


if __name__ == "__main__":
    main()
